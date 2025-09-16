// Group social + contact channels together for reuse.
export interface Socials {
  // Instagram handle or full URL.
  instagram?: string
  // Twitter/X handle or URL (decide on format app‑wide later).
  twitter?: string
  // LinkedIn profile URL.
  linkedin?: string
  // Phone number (string so we preserve leading zeros).
  phone?: string
  // Personal website (optional).
  website?: string
  // Extra arbitrary links the user adds (filtered list of URLs).
  extras?: string[]
}

// Flat profile record matching DB columns (no runtime mapping needed).
export interface ProfileType extends Socials {
  user_id: string
  email: string
  nickname: string
  fullname: string
  profile_url?: string
  created_at: string
  updated_at: string
}
