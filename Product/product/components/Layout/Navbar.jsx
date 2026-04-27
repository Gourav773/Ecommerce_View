import { useContext, useState } from 'react';
import { FiMenu, FiBell, FiSearch, FiX } from 'react-icons/fi';
import { userContext } from '@/pages/_app';
import styles from './Navbar.module.css';

export default function Navbar({ onMenuClick, pageTitle }) {
  const user = useContext(userContext);
  const [mobileSearch, setMobileSearch] = useState(false);

  return (
    <header className={styles.navbar}>
      {mobileSearch ? (
        <div className={styles.mobileSearchBar}>
          <FiSearch size={16} />
          <input type="text" placeholder="Search anything..." className={styles.searchInput} autoFocus />
          <button className={styles.mobileSearchClose} onClick={() => setMobileSearch(false)}>
            <FiX size={18} />
          </button>
        </div>
      ) : (
        <>
          <div className={styles.left}>
            <button className={styles.menuBtn} onClick={onMenuClick} aria-label="Toggle menu">
              <FiMenu size={20} />
            </button>
            {pageTitle && <h1 className={styles.pageTitle}>{pageTitle}</h1>}
          </div>

          <div className={styles.searchBar}>
            <FiSearch size={16} />
            <input type="text" placeholder="Search anything..." className={styles.searchInput} />
          </div>

          <div className={styles.right}>
            <button className={styles.mobileSearchBtn} onClick={() => setMobileSearch(true)} aria-label="Search">
              <FiSearch size={18} />
            </button>
            <button className={styles.iconBtn} aria-label="Notifications">
              <FiBell size={18} />
              <span className={styles.notifDot}></span>
            </button>
            <div className={styles.userPill}>
              <div className={styles.userAvatar}>
                {user?.owner_name ? user.owner_name[0].toUpperCase() : 'R'}
              </div>
              <div className={styles.userMeta}>
                <span className={styles.userName}>{user?.owner_name || 'Retailer'}</span>
                <span className={styles.userRole}>Seller Account</span>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
