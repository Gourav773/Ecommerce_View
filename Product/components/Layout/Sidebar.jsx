import { useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  FiHome, FiPackage, FiShoppingBag,
  FiCreditCard, FiUser, FiLogOut, FiX
} from 'react-icons/fi';
import { userContext } from '@/pages/_app';
import axios from 'axios';
import styles from './Sidebar.module.css';

const navItems = [
  { name: 'Dashboard', href: '/Dashbord', icon: FiHome },
  { name: 'Products', href: '/Product', icon: FiPackage },
  { name: 'Orders', href: '/Orders', icon: FiShoppingBag },
  { name: 'Banking', href: '/Banking', icon: FiCreditCard },
  { name: 'Profile', href: '/Profile', icon: FiUser },
];

export default function Sidebar({ collapsed, mobileOpen, onMobileClose }) {
  const router = useRouter();
  const user = useContext(userContext);

  const handleLogout = () => {
    axios.get('http://localhost:5001/api/retailer/logout')
      .then(res => {
        if (res.data === 'Success') router.push('/');
      })
      .catch(err => console.log(err));
  };

  const isActive = (href) => router.pathname === href;

  return (
    <>
      {mobileOpen && <div className={styles.overlay} onClick={onMobileClose} />}
      <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''} ${mobileOpen ? styles.mobileOpen : ''}`}>
        <div className={styles.logoSection}>
          <div className={styles.logoIcon}>
            <FiPackage size={22} />
          </div>
          {!collapsed && <span className={styles.logoText}>RetailHub</span>}
          <button className={styles.mobileClose} onClick={onMobileClose}>
            <FiX size={20} />
          </button>
        </div>

        <nav className={styles.nav}>
          {navItems.map(item => (
            <Link
              key={item.name}
              href={item.href}
              className={`${styles.navItem} ${isActive(item.href) ? styles.navActive : ''}`}
              onClick={() => { if (mobileOpen) onMobileClose(); }}
            >
              <item.icon size={20} />
              {!collapsed && <span className={styles.navLabel}>{item.name}</span>}
            </Link>
          ))}
        </nav>

        <div className={styles.bottomSection}>
          {!collapsed && (
            <div className={styles.userInfo}>
              <div className={styles.avatar}>
                {user?.owner_name ? user.owner_name[0].toUpperCase() : 'R'}
              </div>
              <div className={styles.userDetails}>
                <span className={styles.userName}>{user?.owner_name || 'Retailer'}</span>
                <span className={styles.userEmail}>{user?.email || ''}</span>
              </div>
            </div>
          )}
          <button className={styles.navItem} onClick={handleLogout}>
            <FiLogOut size={20} />
            {!collapsed && <span className={styles.navLabel}>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
