# Pingou → Sui Migration Plan

> **Status:** Draft / discussion. Decisions in §3 must be locked before Phase 1.
> **Goal:** Re-platform Pingou onto the Sui stack (Enoki, Walrus, Seal, a Move-based
> Ping Token) while keeping a thin backend for indexing/reads. Decentralize where it
> matters; centralize plumbing.
>
> ⚠️ The Sui ecosystem moves fast and parts of this doc are written from knowledge that
> may lag. Treat every version, SDK capability, and price as **"verify before building"**
> (see §11).

---

## 1. Why we're doing this

- **Auth pain today:** social login (Google/Apple) on Expo + Supabase has been a slog
  (redirect schemes, Apple's $99 gate, Expo Go limitations). Enoki **zkLogin** gives
  seedless social login that derives a Sui address, and **sponsored transactions** mean
  users never hold SUI or pay gas.
- **Tokens that mean something:** today "Ping Tokens" are a derived integer
  (`connections × 10`). On-chain they become a real, ownable, verifiable asset.
- **User-owned data:** private notes via **Seal** (encrypted, on-chain access policy),
  profile media via **Walrus** (decentralized blobs), social graph as Sui objects.

**Non-goals (for now):** full read-path decentralization (we keep an indexer), removing
all backends, on-chain messaging.

---

## 2. Current architecture (what we're migrating from)

**Client:** Expo (`expo-router`), React Native 0.81, NativeWind, Reanimated/Skia.

**Backend:** Supabase (Postgres + Auth + Storage).

| Concern | Today | Key files |
|---|---|---|
| Auth/session | Supabase Auth (email/pw, Apple native, Google OAuth WIP) | `src/lib/supabase.ts`, `src/context/AuthProvider.tsx`, `src/utils/signInUtils.ts` |
| Profiles | `profiles` table | `src/types/ProfileTypes.ts`, `supabase-migrations.sql` |
| Connections | `connections` table (`owner_id`, `connected_to`, `folder`, `note`) | `src/app/(tabs)/scanner.tsx`, `src/app/(tabs)/(connections)/index.tsx`, `src/app/connectionDetail.tsx` |
| Ping Tokens | derived `connections × 10` (UI only) | `src/app/(tabs)/index.tsx`, `src/components/profile/StatsRow.tsx` |
| Folders / events | `folders`, `event_participants` tables | `src/utils/events.ts`, `sql/event_folders.sql` |
| Media | Supabase Storage bucket `pfp` | profile edit flow |
| Feedback | haptics + ping sound | `src/utils/Feedback.ts`, `assets/sounds/ping.wav` |

---

## 3. Decisions to LOCK before Phase 1

These cascade through everything. Don't start coding until they're answered.

1. **Ping Token model — transferable economy vs. soulbound reputation?**
   - *Soulbound (recommended default):* earned, on-chain, verifiable, **non-transferable**.
     Few sybil/legal headaches. Implement with Sui **Closed-Loop Token** (`sui::token`)
     and a `TokenPolicy` that disallows `transfer`/`spend` (or allows only app-defined
     actions). Reads as "reputation."
   - *Transferable:* real economy, but inherits sybil farming + token economics + possible
     regulatory questions. Only choose if a tradable token is explicitly the product.
2. **Network target:** Testnet first (default), then mainnet. All addresses/package IDs
   are per-network — keep them in env config from day one.
3. **Mint authority:** who can mint Ping Tokens?
   - *App-gated (recommended):* backend holds a `MinterCap`; mints only after off-chain
     sybil checks pass. On-chain ownership, off-chain anti-fraud. Pragmatic.
   - *Fully on-chain:* mutual-attestation contract mints with no backend. Purer, but sybil
     resistance must live entirely in Move — much harder.
4. **Identity mapping:** a user = one zkLogin-derived Sui address. Do we keep an
   email↔address record for recovery/support, and where (backend vs none)?
5. **How decentralized, how fast?** Solo vs. team and timeline decide how aggressive each
   phase is.

---

## 4. Target architecture

```
┌──────────────────────────── Expo app (client) ─────────────────────────────┐
│  Enoki SDK (zkLogin + sponsored tx)   Sui TS SDK   Seal SDK   Walrus client │
└───────┬───────────────────┬────────────────┬───────────────────┬───────────┘
        │ login/proof        │ build tx        │ encrypt/decrypt    │ blobs
        ▼                    ▼                 ▼                    ▼
   ┌─────────┐         ┌───────────┐     ┌───────────┐       ┌───────────┐
   │  Enoki  │         │  Sui L1   │     │   Seal    │       │  Walrus   │
   │ (OAuth, │         │  (Move:   │     │ key servs │       │ (blob     │
   │  gas    │◄────────│ ping_token│     │ + on-chain│       │  storage) │
   │ station)│ sponsor │ connection│     │ policies) │       │           │
   └─────────┘         └─────┬─────┘     └───────────┘       └───────────┘
                             │ events
                             ▼
                  ┌──────────────────────┐
                  │ Indexer + thin API    │  ← keeps fast reads, sybil checks,
                  │ (Postgres cache)      │     mint authority (MinterCap)
                  └──────────────────────┘
```

**Component mapping (current → target):**

| Today | Target |
|---|---|
| Supabase Auth | **Enoki zkLogin** → Sui address; ephemeral key + ZK proof |
| `supabase.auth` session | Sui keypair/session via Enoki; `AuthProvider` exposes `address` |
| `connections` table (source of truth) | **`Connection` Move objects** on Sui; Postgres becomes a read cache (indexer) |
| Ping Tokens (derived int) | **`ping_token` Move module** (Closed-Loop Token) |
| `profiles` table | Public profile fields on-chain or in indexer; media on **Walrus** |
| `connections.note` (private) | **Seal-encrypted** blob, access policy = owner only |
| Storage bucket `pfp` | **Walrus** blob; URL/blob-id referenced on-chain or in indexer |
| Gas | **Enoki sponsored transactions** (app pays) |

---

## 5. Smart contracts (illustrative — not yet compile-checked)

A Move package `pingou` with two modules. **These are sketches to anchor the design.**

### 5.1 `ping_token` — Closed-Loop Token (soulbound-capable)

```move
module pingou::ping_token {
    use sui::coin::{Self, TreasuryCap};
    use sui::token::{Self, TokenPolicy, TokenPolicyCap};

    /// One-time witness.
    public struct PING_TOKEN has drop {}

    /// Held by the app/backend; gates minting (sybil enforcement off-chain).
    public struct MinterCap has key, store { id: UID }

    fun init(witness: PING_TOKEN, ctx: &mut TxContext) {
        let (treasury, metadata) = coin::create_currency(
            witness, 0, b"PING", b"Ping Token",
            b"Earned by making real connections on Pingou",
            option::none(), ctx,
        );
        // Closed-loop policy: by default NO transfer/spend => effectively soulbound.
        let (policy, policy_cap) = token::new_policy(&treasury, ctx);
        token::share_policy(policy);

        transfer::public_freeze_object(metadata);
        transfer::public_transfer(treasury, ctx.sender());       // TreasuryCap → admin
        transfer::public_transfer(policy_cap, ctx.sender());     // PolicyCap   → admin
        transfer::transfer(MinterCap { id: object::new(ctx) }, ctx.sender());
    }

    /// Mint `amount` PING to `recipient`. App-gated via MinterCap.
    public fun mint(
        _cap: &MinterCap,
        treasury: &mut TreasuryCap<PING_TOKEN>,
        amount: u64,
        recipient: address,
        ctx: &mut TxContext,
    ) {
        let token = token::mint(treasury, amount, ctx);
        let req = token::transfer(token, recipient, ctx);
        token::confirm_with_treasury_cap(treasury, req, ctx);
    }
}
```

> If you go **transferable**, add a `TokenPolicy` rule allowing `transfer`/`spend`. If
> **soulbound**, leave those actions disallowed (default above).

### 5.2 `connection` — records a connection + triggers reward

```move
module pingou::connection {
    use sui::event;
    use pingou::ping_token::{MinterCap, mint};
    use sui::coin::TreasuryCap;

    const TOKENS_PER_CONNECTION: u64 = 10;

    /// Owned by the initiator; portable, user-owned edge in the social graph.
    public struct Connection has key, store {
        id: UID,
        owner: address,
        peer: address,
        created_at_ms: u64,
    }

    public struct Connected has copy, drop {
        owner: address, peer: address,
    }

    /// Called in a sponsored tx after the backend verifies the scan is legit.
    public fun connect(
        minter: &MinterCap,
        treasury: &mut TreasuryCap<...>,
        peer: address,
        clock: &sui::clock::Clock,
        ctx: &mut TxContext,
    ) {
        let owner = ctx.sender();
        let c = Connection { id: object::new(ctx), owner, peer, created_at_ms: clock.timestamp_ms() };
        transfer::transfer(c, owner);
        mint(minter, treasury, TOKENS_PER_CONNECTION, owner, ctx);
        event::emit(Connected { owner, peer });
    }
}
```

**Sybil note:** because `connect` mints, it must be **gated** — either by `MinterCap`
co-signed by the backend after off-chain checks (recommended), or by an on-chain
mutual-attestation scheme (both parties submit signed intents). See §7.

---

## 6. Phased migration plan

### Phase 0 — Foundations (no user-visible change)
- [ ] Lock §3 decisions.
- [ ] Stand up Sui package skeleton (`pingou` Move package) + `sui move test`.
- [ ] Create Enoki app + API key; wire env config (`EXPO_PUBLIC_*`, network id, package id).
- [ ] Add a `sui/` workspace and a `services/` (indexer + thin API) workspace.
- [ ] Decide identity mapping + recovery story.

### Phase 1 — Auth + Ping Token (headline value)
- [ ] Deploy `ping_token` + `connection` to **testnet**.
- [ ] Integrate **Enoki zkLogin** in the client; `AuthProvider` exposes `{ address, ... }`
      instead of `{ session }`.
- [ ] Replace `signInUtils.ts` flows with zkLogin; keep email fallback only if needed.
- [ ] Connection flow (`scanner.tsx`): on successful scan → backend verifies → sponsored
      `connection::connect` tx → mints 10 PING. Keep the existing ping sound + toast UX.
- [ ] `StatsRow` reads **on-chain PING balance** (via indexer) instead of `connections × 10`.
- [ ] Backend: gas-sponsorship endpoint, `MinterCap` custody, sybil checks, event indexer
      → Postgres cache for fast reads.
- **Affected files:** `src/lib/supabase.ts` (→ `sui.ts`), `AuthProvider.tsx`,
  `signInUtils.ts`, `scanner.tsx`, `index.tsx`, `StatsRow.tsx`.

### Phase 2 — Storage (Walrus + Seal)
- [ ] Profile media (`pfp`) → **Walrus**; store blob id in indexer/on-chain.
- [ ] Private `note` → **Seal**-encrypted; access policy = connection owner only.
- [ ] Migrate existing media/notes (see §9).
- **Affected files:** profile edit flow, `connectionDetail.tsx` (note save/load).

### Phase 3 — Social graph on-chain + reduce backend
- [ ] `Connection` objects become source of truth; Postgres is pure cache.
- [ ] Folders/events model decision (on-chain vs indexer-only).
- [ ] Harden indexer; consider a managed Sui indexing service.

---

## 7. Sybil resistance (the hard part)

If tokens have *any* value, "scan to mint" is a money printer. Layers to combine:

- **App-gated minting:** only the backend `MinterCap` mints; it enforces rules first.
- **Rate limits / diminishing returns:** N connections/day; decreasing reward after a cap.
- **Mutual confirmation:** reward only when *both* parties act (scan + accept), not a
  one-sided scan of a public ID.
- **Uniqueness signals:** zkLogin ties an account to a real OAuth identity (raises cost of
  fakes); optionally proof-of-personhood later.
- **Anomaly detection:** cluster/graph analysis on the indexer (rings of mutual scans).

> Decide this **before** tokens are live. Retrofitting anti-fraud after a token has value
> is painful.

---

## 8. Cost / economics model (estimate before building)

"Decentralized" ≠ free — the cost model just shifts. Model these:

- **Sponsored gas:** you pay gas for every connection/mint. At scale this is a real line
  item and an abuse vector — rate-limit and budget it.
- **Walrus storage:** pay (in WAL) per blob + storage epochs. Profile images add up.
- **Seal:** key-server usage / threshold decryption costs.
- **Enoki:** tiered pricing for zkLogin + gas station.
- **Indexer/API hosting:** unchanged-ish from today.

Build a simple spreadsheet: cost-per-active-user/month across the four above.

---

## 9. Data migration (existing Supabase users)

- **Accounts:** there is no automatic Supabase→Sui address mapping. Options:
  (a) on first zkLogin, match by the same OAuth email → link old data to the new address;
  (b) clean break (new users only). Decide in §3.4.
- **Profiles/connections:** export from Postgres; re-create connections as `Connection`
  objects (sponsored batch) or seed the indexer cache and lazily mint.
- **Media:** re-upload `pfp` blobs to Walrus; rewrite references.
- **Notes:** re-encrypt with Seal under the owner's policy.
- Keep Supabase **read-only in parallel** during migration; cut over per-feature.

---

## 10. Security considerations

- **Key custody:** `TreasuryCap`/`MinterCap`/`PolicyCap` are bearer authority. Store in a
  KMS/HSM, never in client or repo. Rotate plan.
- **zkLogin ephemeral keys & nonces:** handle the OAuth nonce/ephemeral-key lifecycle
  correctly on React Native (this is the fiddly bit — see §11).
- **Sponsorship endpoint:** authenticate it; it can spend your gas. Rate-limit + validate
  the exact tx shape it will sponsor.
- **Seal policies:** get the access policy right — a wrong policy leaks private notes.
- **Replay/abuse:** idempotency on the mint path; one reward per unique connection pair.

---

## 11. Verify before building (fast-moving / RN gotchas)

- [ ] **Enoki React Native / Expo support** — zkLogin flow on mobile (OAuth redirect +
      ephemeral keys + proving). Confirm current SDK story; we may proxy via backend.
      (Note: this overlaps the Expo redirect-scheme work we already did — dev client, not
      Expo Go, custom scheme registration.)
- [ ] **Walrus** mainnet status, client SDK, blob lifetime/pricing.
- [ ] **Seal** maturity (beta?), key-server options, mobile client support.
- [ ] **Sui Closed-Loop Token (`sui::token`)** API specifics for soulbound policies.
- [ ] **Indexer** options (custom vs managed) + current GraphQL/RPC capabilities.
- [ ] Move `connect` mint pattern — confirm `TreasuryCap` + closed-loop `confirm` flow.

> I can pull the current state of each of these on request and update this doc.

---

## 12. Rough effort (very approximate, solo dev)

| Phase | Scope | Ballpark |
|---|---|---|
| 0 | Foundations, decisions, skeletons | ~1 week |
| 1 | Enoki auth + token + sponsored connect + indexer | ~3–5 weeks |
| 2 | Walrus media + Seal notes | ~2–3 weeks |
| 3 | On-chain graph + backend reduction | ~2–4 weeks |

Biggest unknowns/risk: RN zkLogin integration, sybil design, Walrus/Seal maturity.

---

## 13. Open questions

1. Ping Token: **soulbound or transferable?**
2. Testnet → mainnet timeline?
3. App-gated mint or fully on-chain attestation?
4. Migrate existing users (email-link) or clean break?
5. Solo or team, and what's the target ship date?

---

*Next step: answer §3, then I can scaffold the `pingou` Move package and the Enoki auth
integration behind a feature flag so the current Supabase app keeps working during migration.*
