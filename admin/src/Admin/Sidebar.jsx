import React, { useState, useEffect, useCallback, useRef } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  BsGrid, BsPeople, BsShieldCheck, BsFolder, BsFolderSymlink,
  BsGift, BsBox, BsGraphUp, BsGear, BsList, BsX,
  BsSearch, BsBell, BsPerson, BsBoxArrowRight, BsChevronDown
} from 'react-icons/bs'
import './Sidebar.css'

const links = [
  { to: '/dashboard', icon: <BsGrid />, label: 'Dashboard' },
  { to: '/user', icon: <BsPeople />, label: 'Users' },
  { to: '/role', icon: <BsShieldCheck />, label: 'Roles' },
  { to: '/category', icon: <BsFolder />, label: 'Category' },
  { to: '/addSubCategory', icon: <BsFolderSymlink />, label: 'Subcategory' },
  { to: '/offers', icon: <BsGift />, label: 'Offers' },
  { to: '/shops', icon: <BsBox />, label: 'Shops' },
  { to: '/charts', icon: <BsGraphUp />, label: 'Charts' },
  { to: '/settings', icon: <BsGear />, label: 'Settings' },
]

function Sidebar() {
  const [open, setOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const profileRef = useRef(null)

  const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}')
  const userName = adminUser.name || 'Admin'
  const userEmail = adminUser.email || ''
  const initials = userName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setOpen(false)
    setProfileOpen(false)
  }, [location.pathname])

  // Close sidebar on Escape key
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        setProfileOpen(false)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  // Close profile dropdown on click outside
  useEffect(() => {
    const onClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  // Lock body scroll when sidebar is open on mobile
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  const closeSidebar = useCallback(() => setOpen(false), [])

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  return (
    <div className='layout'>
      {/* Overlay — always rendered, visibility controlled by class */}
      <div
        className={`sidebar-overlay ${open ? 'visible' : ''}`}
        onClick={closeSidebar}
        aria-hidden='true'
      />

      {/* Sidebar */}
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className='sidebar-brand'>
          <div className='brand-logo'>
            <div className='brand-icon'>B</div>
            <span className='brand-text'>BAZAR</span>
          </div>
          <button className='close-btn' onClick={closeSidebar} aria-label='Close sidebar'>
            <BsX />
          </button>
        </div>

        <div className='nav-section'>Menu</div>

        <nav className='sidebar-nav'>
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <span className='nav-icon'>{l.icon}</span>
              <span className='nav-label'>{l.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className='sidebar-footer'>
          <div className='user-badge'>
            <div className='user-avatar'>{initials}</div>
            <div className='user-info'>
              <span className='user-name'>{userName}</span>
              <span className='user-role'>Admin</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main area */}
      <div className='main-wrap'>
        <header className='topbar'>
          <button className='hamburger' onClick={() => setOpen(true)} aria-label='Open menu'>
            <BsList />
          </button>
          <h4 className='topbar-title'>Admin Panel</h4>

          <div className='topbar-search'>
            <span className='topbar-search-icon'><BsSearch /></span>
            <input type='text' placeholder='Search…' />
          </div>

          <div className='topbar-right'>
            <button className='topbar-icon-btn' aria-label='Notifications'>
              <BsBell />
              <span className='topbar-badge' />
            </button>

            <span className='topbar-divider' />

            <div className='topbar-user' ref={profileRef} onClick={() => setProfileOpen(p => !p)}>
              <div className='topbar-avatar'>{initials}</div>
              <div className='topbar-user-info'>
                <span className='topbar-user-name'>{userName.split(' ')[0]}</span>
                <span className='topbar-user-role'>Admin</span>
              </div>
              <BsChevronDown className={`topbar-user-chevron ${profileOpen ? 'rotated' : ''}`} />

              {profileOpen && (
                <div className='profile-dropdown'>
                  <div className='profile-dropdown-header'>
                    <div className='topbar-avatar'>{initials}</div>
                    <div>
                      <div className='profile-dropdown-name'>{userName}</div>
                      <div className='profile-dropdown-email'>{userEmail}</div>
                    </div>
                  </div>
                  <div className='profile-dropdown-divider' />
                  <button className='profile-dropdown-item' onClick={() => navigate('/settings')}>
                    <BsPerson /> My Profile
                  </button>
                  <button className='profile-dropdown-item' onClick={() => navigate('/settings')}>
                    <BsGear /> Settings
                  </button>
                  <div className='profile-dropdown-divider' />
                  <button className='profile-dropdown-item profile-dropdown-logout' onClick={handleLogout}>
                    <BsBoxArrowRight /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className='content-area'>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Sidebar
