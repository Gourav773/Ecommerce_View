import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/router";
import { State, City } from "country-state-city";
import { FiPackage, FiShield, FiTruck, FiGlobe } from "react-icons/fi";
import { useToast } from "@/context/ToastContext";
import styles from "@/styles/auth.module.css";
import { API_BASE } from '@/lib/apiBase';

export default function Register() {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    regno: "", GST_no: "", TIN_no: "", PAN: "",
    shop_name: "", owner_name: "", contact: "", mobile: "",
    web: "", email: "", address: "", country: "",
    state: "", city: "", pin: "",
    terms_and_conditions: "", status: "deactive", password: ""
  });

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    const s = State.getStatesOfCountry("IN");
    setStates(s);
  }, []);

  const handleStateChange = (e) => {
    const sel = e.target.value;
    setData({ ...data, state: sel });
    if (sel) {
      setCities(City.getCitiesOfState("IN", sel));
    } else {
      setCities([]);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!data.email || !data.password || !data.shop_name || !data.owner_name) {
      toast.warning("Please fill in all required fields");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API_BASE}/api/retailer/newshopregister`, data);
      toast.success("Registration successful!");
      router.push("/Login");
    } catch (err) {
      toast.error(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ label, type = "text", field, placeholder, required }) => (
    <div className={styles.formGroup}>
      <label className={styles.formLabel}>{label} {required && <span style={{color:'var(--danger)'}}>*</span>}</label>
      <input
        type={type}
        className={styles.formInput}
        placeholder={placeholder || `Enter ${label.toLowerCase()}`}
        value={data[field]}
        onChange={e => setData({ ...data, [field]: e.target.value })}
      />
    </div>
  );

  return (
    <div className={styles.authPage}>
      <div className={`${styles.authCard} ${styles.registerCard}`}>
        <div className={`${styles.authBanner} ${styles.registerBanner}`}>
          <div className={styles.bannerIcon}>
            <FiPackage size={32} />
          </div>
          <h2 className={styles.bannerTitle}>Start Selling</h2>
          <p className={styles.bannerText}>
            Join thousands of retailers growing their business with RetailHub
          </p>
          <ul className={styles.bannerFeatures}>
            <li><FiShield size={16} /> Secure & verified platform</li>
            <li><FiTruck size={16} /> Nationwide delivery support</li>
            <li><FiGlobe size={16} /> Reach millions of buyers</li>
          </ul>
        </div>

        <div className={`${styles.authForm} ${styles.registerForm}`}>
          <h2 className={styles.formTitle}>Create Account</h2>
          <p className={styles.formSubtitle}>Register your shop to start selling</p>

          <form onSubmit={handleSubmit}>
            <div className={styles.sectionTitle}>Business Information</div>
            <div className={styles.formRow3}>
              <Field label="Register No" field="regno" />
              <Field label="GST No" field="GST_no" />
              <Field label="TIN No" field="TIN_no" />
            </div>
            <div className={styles.formRow}>
              <Field label="PAN" field="PAN" />
              <Field label="Shop Name" field="shop_name" required />
            </div>

            <div className={styles.sectionTitle}>Owner Details</div>
            <div className={styles.formRow}>
              <Field label="Owner Name" field="owner_name" required />
              <Field label="Contact" field="contact" />
            </div>
            <div className={styles.formRow}>
              <Field label="Mobile" field="mobile" type="tel" />
              <Field label="Website" field="web" placeholder="www.example.com" />
            </div>

            <div className={styles.sectionTitle}>Address & Contact</div>
            <div className={styles.formRow}>
              <Field label="Email" field="email" type="email" required />
              <Field label="Address" field="address" />
            </div>
            <div className={styles.formRow3}>
              <Field label="Country" field="country" placeholder="India" />
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>State</label>
                <select className={styles.formSelect} value={data.state} onChange={handleStateChange}>
                  <option value="">Select State</option>
                  {states.map((item, i) => (
                    <option key={i} value={item.isoCode}>{item.name}</option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>City</label>
                <select className={styles.formSelect} value={data.city} onChange={e => setData({ ...data, city: e.target.value })}>
                  <option value="">Select City</option>
                  {cities.map((item, i) => (
                    <option key={i} value={item.name}>{item.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <Field label="PIN Code" field="pin" />

            <div className={styles.sectionTitle}>Security</div>
            <div className={styles.formRow}>
              <Field label="Password" field="password" type="password" required />
              <Field label="Terms & Conditions" field="terms_and_conditions" placeholder="I agree" />
            </div>

            <div style={{marginTop: 24}}>
              <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </div>
          </form>

          <p className={styles.switchText}>
            Already have an account?{" "}
            <Link href="/Login" className={styles.switchLink}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
