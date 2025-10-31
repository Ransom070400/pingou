import { NameCardType } from "~/types/types";
import { SocialValues } from "~/src/components/SocialsCard";
import { ProfilePayload } from "~/types/types";



// Helper to concatenate all pieces into one payload
export const buildProfilePayload = (
  name?: NameCardType,
  socials?: SocialValues,
  imageUri?: string
): ProfilePayload => ({
  ...(name ?? {}),
  ...(socials ?? {}),
  ...(imageUri ? { imageUri } : {}),
});