import FloatingNavMenu from './FloatingNavMenu'
import LanguageToggle from './LanguageToggle'
import './FloatingTopControls.css'

export default function FloatingTopControls() {
  return (
    <div className="floating-top-controls">
      <FloatingNavMenu />
      <LanguageToggle />
    </div>
  )
}
