import type { ReactNode } from 'react'
import type { BusinessSocial } from '../types/business'
import { isPlaceholderUrl } from '../data/placeholders'
import './SocialLinks.css'

interface SocialLinksProps {
  social: BusinessSocial
  instagramLabel: string
  facebookLabel: string
  linkedinLabel: string
  /** When true, all icons are shown without external links */
  linksDisabled?: boolean
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M14 8.5h2.5l-.5 3H14v9h-3.5v-9H9v-3h1.5V7.2C10.5 5.4 11.6 4 14.2 4H16v3h-1.4c-.9 0-1.1.4-1.1 1.1V8.5Z"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        d="M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
      />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect
        x="4"
        y="4"
        width="16"
        height="16"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        fill="currentColor"
        d="M8 10v7H6v-7h2Zm-1-2.2a1.1 1.1 0 1 1 0-2.2 1.1 1.1 0 0 1 0 2.2ZM18 17h-2v-3.4c0-.8-.3-1.4-1.1-1.4-.6 0-.9.4-1.1.8-.1.2-.1.5-.1.8V17h-2s0-5.6 0-7h2v1c.3-.4.8-1.1 1.9-1.1 1.4 0 2.4.9 2.4 2.9V17Z"
      />
    </svg>
  )
}

function SocialLinkItem({
  href,
  label,
  disabled,
  children,
}: {
  href: string
  label: string
  disabled: boolean
  children: ReactNode
}) {
  if (disabled) {
    return (
      <span className="social-links__item social-links__item--disabled" aria-label={label}>
        {children}
      </span>
    )
  }

  return (
    <a
      href={href}
      className="social-links__item"
      target="_blank"
      rel="noreferrer noopener"
      aria-label={label}
    >
      {children}
    </a>
  )
}

export default function SocialLinks({
  social,
  instagramLabel,
  facebookLabel,
  linkedinLabel,
  linksDisabled = false,
}: SocialLinksProps) {
  return (
    <div className="social-links">
      <SocialLinkItem
        href={social.instagram}
        label={instagramLabel}
        disabled={linksDisabled || isPlaceholderUrl(social.instagram)}
      >
        <InstagramIcon />
      </SocialLinkItem>
      <SocialLinkItem
        href={social.facebook}
        label={facebookLabel}
        disabled={linksDisabled || isPlaceholderUrl(social.facebook)}
      >
        <FacebookIcon />
      </SocialLinkItem>
      <SocialLinkItem
        href={social.linkedin}
        label={linkedinLabel}
        disabled={linksDisabled || isPlaceholderUrl(social.linkedin)}
      >
        <LinkedInIcon />
      </SocialLinkItem>
    </div>
  )
}
