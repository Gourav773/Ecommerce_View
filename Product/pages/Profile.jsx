import DashboardLayout from '@/components/Layout/DashboardLayout';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { userContext } from './_app';
import {
  FiUser, FiMail, FiPhone, FiMapPin, FiGlobe, FiHash,
  FiShield, FiPackage, FiCalendar, FiEdit2, FiCopy, FiCheck
} from 'react-icons/fi';
import styles from '@/styles/Profile.module.css';
import { API_BASE } from '@/lib/apiBase';

export default function Profile() {
  const user = useContext(userContext);
  const regID = user?.regID;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState('');

  const getdata = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/retailer/viewshop/${regID}`);
      setData(Array.isArray(res.data) ? res.data : [res.data]);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (regID) getdata();
    else setLoading(false);
  }, [regID]);

  const profile = data[0] || {};

  const copyToClipboard = (text, field) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(''), 1500);
  };

  const InfoItem = ({ icon: Icon, label, value, copyable, fieldKey, accent }) => (
    <div className={styles.infoItem}>
      <div className={`${styles.infoIcon} ${accent ? styles[accent] : ''}`}>
        <Icon size={16} />
      </div>
      <div className={styles.infoContent}>
        <span className={styles.infoLabel}>{label}</span>
        <div className={styles.infoValueRow}>
          <span className={styles.infoValue}>{value || 'Not provided'}</span>
          {copyable && value && (
            <button
              className={styles.copyBtn}
              onClick={() => copyToClipboard(value, fieldKey)}
              title="Copy"
            >
              {copied === fieldKey ? <FiCheck size={13} /> : <FiCopy size={13} />}
            </button>
          )}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <DashboardLayout pageTitle="Profile">
        <div className={styles.wrapper}>
          <div className={styles.card} style={{ padding: 32 }}>
            <LoadingSkeleton height="120px" width="100%" />
            <div style={{ marginTop: 20 }}>
              <LoadingSkeleton height="20px" width="200px" />
              <LoadingSkeleton height="14px" width="300px" />
            </div>
            <div style={{ marginTop: 24 }}>
              <LoadingSkeleton height="50px" count={5} />
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const initials = profile.owner_name
    ? profile.owner_name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : 'R';

  return (
    <DashboardLayout pageTitle="Profile">
      <div className={styles.wrapper}>

        {/* Hero Banner + Avatar Card */}
        <div className={styles.heroCard}>
          <div className={styles.heroBanner}>
            <div className={styles.bannerPattern}></div>
          </div>
          <div className={styles.heroBody}>
            <div className={styles.avatarWrap}>
              <div className={styles.avatar}>{initials}</div>
              <span className={`${styles.statusDot} ${profile.status === 'active' ? styles.dotActive : styles.dotPending}`}></span>
            </div>
            <div className={styles.heroInfo}>
              <div className={styles.heroNameRow}>
                <h2 className={styles.heroName}>{profile.owner_name || 'Retailer'}</h2>
                <span className={`${styles.statusBadge} ${profile.status === 'active' ? styles.badgeActive : styles.badgePending}`}>
                  {profile.status === 'active' ? 'Active' : 'Pending'}
                </span>
              </div>
              <p className={styles.heroShop}>
                <FiPackage size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                {profile.shop_name || 'Shop Name'}
              </p>
              {profile.email && (
                <p className={styles.heroEmail}>
                  <FiMail size={13} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                  {profile.email}
                </p>
              )}
            </div>
          </div>

          {/* Quick Stats Row */}
          <div className={styles.quickStats}>
            <div className={styles.quickStat}>
              <span className={styles.quickStatValue}>{profile.regno || regID || '—'}</span>
              <span className={styles.quickStatLabel}>Reg. ID</span>
            </div>
            <div className={styles.quickStatDivider}></div>
            <div className={styles.quickStat}>
              <span className={styles.quickStatValue}>{profile.city || '—'}</span>
              <span className={styles.quickStatLabel}>City</span>
            </div>
            <div className={styles.quickStatDivider}></div>
            <div className={styles.quickStat}>
              <span className={styles.quickStatValue}>{profile.status === 'active' ? 'Verified' : 'Pending'}</span>
              <span className={styles.quickStatLabel}>Status</span>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className={styles.detailsGrid}>

          {/* Contact Info */}
          <div className={styles.card}>
            <div className={styles.sectionHeader}>
              <FiUser size={18} />
              <h3 className={styles.sectionTitle}>Contact Information</h3>
            </div>
            <div className={styles.infoList}>
              <InfoItem icon={FiUser} label="Owner Name" value={profile.owner_name} accent="primary" />
              <InfoItem icon={FiMail} label="Email Address" value={profile.email} copyable fieldKey="email" accent="info" />
              <InfoItem icon={FiPhone} label="Contact Number" value={profile.contact} copyable fieldKey="contact" accent="success" />
              <InfoItem icon={FiPhone} label="Mobile Number" value={profile.mobile} copyable fieldKey="mobile" accent="success" />
              <InfoItem icon={FiGlobe} label="Website" value={profile.web} copyable fieldKey="web" accent="warning" />
            </div>
          </div>

          {/* Address Info */}
          <div className={styles.card}>
            <div className={styles.sectionHeader}>
              <FiMapPin size={18} />
              <h3 className={styles.sectionTitle}>Address Details</h3>
            </div>
            <div className={styles.infoList}>
              <InfoItem icon={FiMapPin} label="Full Address" value={profile.address} accent="danger" />
              <InfoItem icon={FiMapPin} label="City" value={profile.city} accent="warning" />
              <InfoItem icon={FiHash} label="PIN Code" value={profile.pin} copyable fieldKey="pin" accent="info" />
            </div>
          </div>

          {/* Business Info */}
          <div className={styles.card}>
            <div className={styles.sectionHeader}>
              <FiShield size={18} />
              <h3 className={styles.sectionTitle}>Business & Legal</h3>
            </div>
            <div className={styles.infoList}>
              <InfoItem icon={FiHash} label="Registration No" value={profile.regno} copyable fieldKey="regno" accent="primary" />
              <InfoItem icon={FiHash} label="GST Number" value={profile.GST_no} copyable fieldKey="gst" accent="success" />
              <InfoItem icon={FiHash} label="TIN Number" value={profile.TIN_no} copyable fieldKey="tin" accent="info" />
              <InfoItem icon={FiShield} label="PAN Number" value={profile.PAN} copyable fieldKey="pan" accent="warning" />
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
