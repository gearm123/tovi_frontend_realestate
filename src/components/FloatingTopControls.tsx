import FloatingHomeButton from './FloatingHomeButton'
import FloatingNavMenu from './FloatingNavMenu'
import LanguageToggle from './LanguageToggle'
import './FloatingTopControls.css'

export default function FloatingTopControls() {
  return (
    <div className="floating-top-controls">
      <FloatingHomeButton />
      <FloatingNavMenu />
      <div className="floating-top-controls__langs">
        <LanguageToggle />
      </div>
    </div>
  )
}
