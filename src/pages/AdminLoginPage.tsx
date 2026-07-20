import { FormEvent, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import {
  isAdminAuthenticated,
  setAdminSession,
  validateAdminCredentials,
} from '../lib/adminAuth'
import './AdminLoginPage.css'

function EyeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46A11.804 11.804 0 0 0 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78 3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" />
    </svg>
  )
}

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  if (isAdminAuthenticated()) {
    return <Navigate to="/admin/dashboard" replace />
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    if (!validateAdminCredentials(username.trim(), password)) {
      setError('Invalid username or password.')
      return
    }

    setAdminSession(rememberMe)
    navigate('/admin/dashboard', { replace: true })
  }

  return (
    <div className="admin-login">
      <div className="admin-login__wrap">
        <h1 className="admin-login__brand">
          <span>ProperTLV</span>
        </h1>

        {error ? (
          <div className="admin-login__error" role="alert">
            {error}
          </div>
        ) : null}

        <form className="admin-login__form" onSubmit={handleSubmit}>
          <p className="admin-login__field">
            <label className="admin-login__label" htmlFor="admin-username">
              Username or Email Address
            </label>
            <input
              id="admin-username"
              name="username"
              type="text"
              className="admin-login__input"
              value={username}
              onChange={(event) => {
                setUsername(event.target.value)
                if (error) setError('')
              }}
              required
              autoComplete="username"
              spellCheck={false}
            />
          </p>

          <p className="admin-login__field">
            <label className="admin-login__label" htmlFor="admin-password">
              Password
            </label>
            <span className="admin-login__password-wrap">
              <input
                id="admin-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                className="admin-login__input"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value)
                  if (error) setError('')
                }}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="admin-login__toggle-password"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </span>
          </p>

          <p className="admin-login__submit-row">
            <span className="admin-login__remember">
              <input
                id="admin-remember"
                type="checkbox"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
              />
              <label htmlFor="admin-remember">Remember Me</label>
            </span>
            <input type="submit" className="admin-login__submit" value="Log In" />
          </p>
        </form>

        <p className="admin-login__nav">
          <a href="#">Lost your password?</a>
          <Link to="/">← Go to ProperTLV</Link>
        </p>
      </div>
    </div>
  )
}
