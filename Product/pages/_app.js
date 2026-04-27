import '@/styles/globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { createContext, useEffect, useState, useCallback } from 'react';
import { ToastProvider } from '@/context/ToastContext';
import { useRouter } from 'next/router';
import { API_BASE } from '@/lib/apiBase';

axios.defaults.withCredentials = true;

export const userContext = createContext(null);

export default function App({ Component, pageProps }) {
  const [user, setUser] = useState({});
  const router = useRouter();

  const fetchUser = useCallback(() => {
    axios.get(`${API_BASE}/api/retailer/getdata`)
      .then(res => setUser(res.data))
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    fetchUser();
  }, [router.pathname]);

  return (
    <ToastProvider>
      <userContext.Provider value={user}>
        <Component {...pageProps} />
      </userContext.Provider>
    </ToastProvider>
  );
}
