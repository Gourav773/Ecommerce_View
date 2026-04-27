import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BsEnvelope, BsLock, BsEye, BsEyeSlash, BsBoxArrowInRight } from 'react-icons/bs'
import axios from 'axios'
import { API_BASE } from '../apiBase'
import './Login.css'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email.trim() || !password.trim()) {
      setError('Please enter email and password')
      return
    }

    setLoading(true)
    try {
      const res = await axios.post(`${API_BASE}/api/admin/login`, { email, password })
      localStorage.setItem('adminUser', JSON.stringify(res.data.user))
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='login-page'>
      {/* Left decorative panel */}
      <div className='login-left'>
        <div className='login-left-content'>
          <div className='login-brand'>
            <div className='login-brand-icon'>B</div>
            <span className='login-brand-text'>BAZAR</span>
          </div>
          <h1 className='login-left-title'>Welcome to<br />Admin Panel</h1>
          <p className='login-left-desc'>
            Manage your e-commerce platform with powerful tools, analytics, and seamless control.
          </p>
          <div className='login-left-shapes'>
            <div className='login-shape login-shape-1' />
            <div className='login-shape login-shape-2' />
            <div className='login-shape login-shape-3' />
          </div>
        </div>
      </div>

      {/* Right login form */}
      <div className='login-right'>
        <div className='login-form-wrap'>
          <div className='login-mobile-brand'>
            <div className='login-brand-icon'>B</div>
            <span className='login-brand-text'>BAZAR</span>
          </div>

          <h2 className='login-title'>Sign In</h2>
          <p className='login-subtitle'>Enter your credentials to access the dashboard</p>

          {error && <div className='login-error'>{error}</div>}

          <form onSubmit={handleSubmit} className='login-form'>
            <div className='login-field'>
              <label className='login-label'>Email Address</label>
              <div className='login-input-wrap'>
                <BsEnvelope className='login-input-icon' />
                <input
                  type='email'
                  className='login-input'
                  placeholder='admin@bazar.com'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete='email'
                  autoFocus
                />
              </div>
            </div>

            <div className='login-field'>
              <label className='login-label'>Password</label>
              <div className='login-input-wrap'>
                <BsLock className='login-input-icon' />
                <input
                  type={showPass ? 'text' : 'password'}
                  className='login-input'
                  placeholder='Enter your password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete='current-password'
                />
                <button
                  type='button'
                  className='login-toggle-pass'
                  onClick={() => setShowPass(p => !p)}
                  aria-label='Toggle password visibility'
                >
                  {showPass ? <BsEyeSlash /> : <BsEye />}
                </button>
              </div>
            </div>

            <div className='login-options'>
              <label className='login-remember'>
                <input type='checkbox' />
                <span>Remember me</span>
              </label>
            </div>

            <button type='submit' className='login-btn' disabled={loading}>
              {loading ? (
                <span className='login-spinner' />
              ) : (
                <>
                  <BsBoxArrowInRight />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          <p className='login-footer-text'>
            &copy; 2026 Bazar Admin &middot; All rights reserved
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
