import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import StatsCard from '@/components/ui/StatsCard';
import EmptyState from '@/components/ui/EmptyState';
import { userContext } from './_app';
import { FiPackage, FiShoppingBag, FiDollarSign, FiClock, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { API_BASE } from '@/lib/apiBase';

const chartData = [
  { month: 'Jan', sales: 4000, orders: 24 },
  { month: 'Feb', sales: 3000, orders: 18 },
  { month: 'Mar', sales: 5000, orders: 32 },
  { month: 'Apr', sales: 4500, orders: 28 },
  { month: 'May', sales: 6000, orders: 38 },
  { month: 'Jun', sales: 5500, orders: 35 },
];

const revenueData = [
  { month: 'Jan', revenue: 12000 },
  { month: 'Feb', revenue: 15000 },
  { month: 'Mar', revenue: 18000 },
  { month: 'Apr', revenue: 14000 },
  { month: 'May', revenue: 22000 },
  { month: 'Jun', revenue: 20000 },
];

export default function Dashboard() {
  const user = useContext(userContext);
  const regID = user?.regID;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [orderStats, setOrderStats] = useState({});

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (regID) {
      axios.get(`${API_BASE}/api/retailer/product/productlist/${regID}`)
        .then(res => { setProducts(res.data); setLoading(false); })
        .catch(() => setLoading(false));
      axios.get(`${API_BASE}/api/retailer/order/stats/${regID}`)
        .then(res => setOrderStats(res.data || {}))
        .catch(() => {});
    } else {
      setLoading(false);
    }
  }, [regID]);

  const totalProducts = Array.isArray(products) ? products.length : 0;
  const totalRevenue = Array.isArray(products)
    ? products.reduce((sum, p) => sum + (Number(p.price) || 0), 0)
    : 0;
  const totalStock = Array.isArray(products)
    ? products.reduce((sum, p) => sum + (Number(p.quantity) || 0), 0)
    : 0;

  // Pagination for recent products
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(totalProducts / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const productsToShow = Array.isArray(products) ? products.slice(startIndex, startIndex + itemsPerPage) : [];

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  const chartHeight = isMobile ? 200 : 250;

  return (
    <DashboardLayout pageTitle="Dashboard">
      <div style={{ marginBottom: 8 }}>
        <h2 style={{ fontSize: 'clamp(1.1rem, 3vw, 1.4rem)', fontWeight: 700, color: 'var(--text-primary)' }}>
          Welcome back, {user?.owner_name || 'Retailer'}!
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 'clamp(0.8rem, 2vw, 0.9rem)' }}>
          Here is what is happening with your store today.
        </p>
      </div>

      {/* Stats Cards - 2 cols on mobile, 4 on desktop */}
      <div className="dashboard-stats-grid">
        <StatsCard title="Total Products" value={totalProducts} icon={FiPackage} color="primary" trend="+12%" trendUp />
        <StatsCard title="Total Orders" value={orderStats.total_orders || 0} icon={FiShoppingBag} color="success" />
        <StatsCard title="Revenue" value={`Rs ${totalRevenue.toLocaleString()}`} icon={FiDollarSign} color="warning" trend="+8.2%" trendUp />
        <StatsCard title="Total Stock" value={totalStock} icon={FiClock} color="info" />
      </div>

      {/* Charts - stack on mobile */}
      <div className="dashboard-charts-grid">
        <div className="dashboard-card" style={{ overflow: 'hidden', padding: isMobile ? 10 : 24 }}>
          <div className="dashboard-card-header">
            <span className="dashboard-card-title">Sales Overview</span>
          </div>
          <div style={{ width: '100%', minWidth: 0 }}>
            <ResponsiveContainer width="100%" height={chartHeight}>
              <BarChart data={chartData} margin={isMobile ? { left: -20, right: 4, top: 4, bottom: 0 } : { left: 0, right: 0, top: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: isMobile ? 10 : 12 }} />
                <YAxis tick={{ fontSize: isMobile ? 10 : 12 }} width={isMobile ? 35 : 60} />
                <Tooltip />
                <Bar dataKey="sales" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                <Bar dataKey="orders" fill="#a5b4fc" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="dashboard-card" style={{ overflow: 'hidden', padding: isMobile ? 10 : 24 }}>
          <div className="dashboard-card-header">
            <span className="dashboard-card-title">Revenue Trend</span>
          </div>
          <div style={{ width: '100%', minWidth: 0 }}>
            <ResponsiveContainer width="100%" height={chartHeight}>
              <AreaChart data={revenueData} margin={isMobile ? { left: -20, right: 4, top: 4, bottom: 0 } : { left: 0, right: 0, top: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: isMobile ? 10 : 12 }} />
                <YAxis tick={{ fontSize: isMobile ? 10 : 12 }} width={isMobile ? 35 : 60} />
                <Tooltip />
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="revenue" stroke="#4f46e5" fill="url(#colorRevenue)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Products */}
      <div className="dashboard-card">
        <div className="dashboard-card-header">
          <span className="dashboard-card-title">Recent Products</span>
        </div>
        {totalProducts === 0 ? (
          <EmptyState title="No products yet" message="Add your first product to get started." />
        ) : (
          <>
            {/* Desktop table */}
            <div className="product-desktop-table">
              <div className="table-responsive-custom">
                <table className="modern-table" style={{ minWidth: 500 }}>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Product Name</th>
                      <th>Brand</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Discount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productsToShow.map((item, i) => (
                      <tr key={i}>
                        <td>{startIndex + i + 1}</td>
                        <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{item.pname}</td>
                        <td>{item.brand_name}</td>
                        <td style={{ fontWeight: 600 }}>Rs {item.price}</td>
                        <td>{item.quantity}</td>
                        <td>{item.discount || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile cards */}
            <div className="product-mobile-cards">
              {productsToShow.map((item, i) => (
                <div key={i} className="product-mobile-card">
                  <div className="product-mobile-card-header">
                    <div style={{ width: 40, height: 40, borderRadius: 'var(--radius)', background: 'var(--primary-50)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0 }}>
                      {startIndex + i + 1}
                    </div>
                    <div className="product-mobile-card-info">
                      <div className="product-mobile-card-name">{item.pname}</div>
                      <div className="product-mobile-card-meta">{item.brand_name}</div>
                    </div>
                  </div>
                  <div className="product-mobile-card-details">
                    <div className="product-mobile-card-detail">
                      <div className="product-mobile-card-detail-label">Price</div>
                      <div className="product-mobile-card-detail-value">Rs {item.price}</div>
                    </div>
                    <div className="product-mobile-card-detail">
                      <div className="product-mobile-card-detail-label">Stock</div>
                      <div className="product-mobile-card-detail-value">{item.quantity}</div>
                    </div>
                    <div className="product-mobile-card-detail">
                      <div className="product-mobile-card-detail-label">Discount</div>
                      <div className="product-mobile-card-detail-value">{item.discount || '-'}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="table-pagination">
                <span className="table-pagination-info">
                  Showing {startIndex + 1}–{Math.min(startIndex + itemsPerPage, totalProducts)} of {totalProducts} products
                </span>
                <div className="table-pagination-controls">
                  <button className="table-pagination-btn" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
                    <FiChevronLeft size={16} />
                  </button>
                  {getPageNumbers().map((page, i) =>
                    page === '...' ? (
                      <span key={`e${i}`} className="table-pagination-ellipsis">…</span>
                    ) : (
                      <button key={page} className={`table-pagination-btn ${currentPage === page ? 'table-pagination-active' : ''}`} onClick={() => setCurrentPage(page)}>
                        {page}
                      </button>
                    )
                  )}
                  <button className="table-pagination-btn" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>
                    <FiChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
