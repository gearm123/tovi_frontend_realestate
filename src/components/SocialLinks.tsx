import type { BusinessSocial } from '../types/business'
import './SocialLinks.css'

interface SocialLinksProps {
  social: BusinessSocial
  instagramLabel: string
  facebookLabel: string
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

export default function SocialLinks({
  social,
  instagramLabel,
  facebookLabel,
}: SocialLinksProps) {
  return (
    <div className="social-links">
      <a
        href={social.instagram}
        className="social-links__item"
        target="_blank"
        rel="noreferrer noopener"
        aria-label={instagramLabel}
      >
        <InstagramIcon />
      </a>
      <a
        href={social.facebook}
        className="social-links__item"
        target="_blank"
        rel="noreferrer noopener"
        aria-label={facebookLabel}
      >
        <FacebookIcon />
      </a>
    </div>
  )
}
