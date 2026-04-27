import React, { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiPackage, FiCheck } from 'react-icons/fi';
import { useToast } from '@/context/ToastContext';
import styles from '@/styles/auth.module.css';
import { API_BASE } from '@/lib/apiBase';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.warning('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE}/api/retailer/login`,
        { email, password },
        {
          withCredentials: true // ✅ MOST IMPORTANT FIX
        }
      );

      console.log("Login Response:", response.data);

      toast.success('Login successful!');

      // 👉 redirect after login
      router.push('/Dashbord');

    } catch (error) {
      console.log("Login Error:", error);

      toast.error(
        error.response?.data?.error ||
        error.response?.data ||
        'Login failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.authCard}>
        <div className={styles.authBanner}>
          <div className={styles.bannerIcon}>
            <FiPackage size={32} />
          </div>
          <h2 className={styles.bannerTitle}>RetailHub</h2>
          <p className={styles.bannerText}>
            Manage your store, track orders, and grow your business — all in one place.
          </p>
          <ul className={styles.bannerFeatures}>
            <li><FiCheck size={16} /> Real-time inventory tracking</li>
            <li><FiCheck size={16} /> Detailed sales analytics</li>
            <li><FiCheck size={16} /> Secure banking integration</li>
            <li><FiCheck size={16} /> Multi-product management</li>
          </ul>
        </div>

        <div className={styles.authForm}>
          <h2 className={styles.formTitle}>Welcome back</h2>
          <p className={styles.formSubtitle}>Sign in to your seller account</p>

          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Email Address</label>
              <input
                type="email"
                className={styles.formInput}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Password</label>
              <input
                type="password"
                className={styles.formInput}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className={styles.rememberRow}>
              <label className={styles.checkLabel}>
                <input type="checkbox" /> Remember me
              </label>
              <button type="button" className={styles.forgotLink}>Forgot password?</button>
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className={styles.switchText}>
            Don&apos;t have an account?{' '}
            <Link href="/Register" className={styles.switchLink}>Create account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
