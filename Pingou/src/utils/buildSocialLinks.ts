// Small helper to convert a ProfileType to a list usable by SocialLinks component.

import { ProfileType } from '~/src/types/ProfileTypes'

interface SocialLinkItem {
  id: string
  label: string
  url: string
}

// Ensure URL has protocol; if user typed "example.com" prepend https://
const normalizeUrl = (raw: string) => {
  if (!raw) return ''
  return /^(https?:)?\/\//i.test(raw) ? raw : `https://${raw}`
}

export const buildSocialLinks = (p: ProfileType): SocialLinkItem[] => {
  const list: SocialLinkItem[] = []

  if (p.instagram)
    list.push({ id: 'instagram', label: 'Instagram', url: normalizeUrl(p.instagram) })
  if (p.twitter)
    list.push({ id: 'twitter', label: 'X / Twitter', url: normalizeUrl(p.twitter) })
  if (p.linkedin)
    list.push({ id: 'linkedin', label: 'LinkedIn', url: normalizeUrl(p.linkedin) })
  if (p.website)
    list.push({ id: 'website', label: 'Website', url: normalizeUrl(p.website) })
  // Extras (already sanitized) – enumerate with index for stable ids
  if (p.extras?.length) {
    p.extras.forEach((u, i) => {
      list.push({ id: `extra-${i}`, label: `Link ${i + 1}`, url: normalizeUrl(u) })
    })
  }
  return list
}