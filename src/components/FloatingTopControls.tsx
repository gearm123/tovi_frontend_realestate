import FloatingNavMenu from './FloatingNavMenu'
import LanguageToggle from './LanguageToggle'
import './FloatingTopControls.css'

export default function FloatingTopControls() {
  return (
    <div className="floating-top-controls">
      <FloatingNavMenu />
      <div className="floating-top-controls__langs">
        <LanguageToggle />
      </div>
    </div>
  )
}
