import React from 'react'
import { useNavigate } from 'react-router-dom'

function Settings() {
  const navigate = useNavigate()
  const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}')

  const name = adminUser.name || 'Admin'
  const email = adminUser.email || '—'
  const mobile = adminUser.mobile || '—'

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  return (
    <div className='page-wrapper'>
      <div className='page-header'>
        <h3>Settings</h3>
      </div>

      <div className='split-layout'>
        <div className='admin-card'>
          <div className='card-title'>Profile</div>
          <div className='form-stack'>
            <div>
              <label className='admin-label'>Name</label>
              <input className='admin-input' value={name} disabled />
            </div>
            <div>
              <label className='admin-label'>Email</label>
              <input className='admin-input' value={email} disabled />
            </div>
            <div>
              <label className='admin-label'>Mobile</label>
              <input className='admin-input' value={mobile} disabled />
            </div>
          </div>
        </div>

        <div className='admin-card'>
          <div className='card-title'>Account</div>
          <div className='form-stack'>
            <button className='btn-danger btn-block' onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
