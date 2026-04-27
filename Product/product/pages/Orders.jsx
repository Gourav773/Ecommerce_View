import DashboardLayout from '@/components/Layout/DashboardLayout';
import EmptyState from '@/components/ui/EmptyState';
import StatsCard from '@/components/ui/StatsCard';
import { useToast } from '@/context/ToastContext';
import { Tabs, Tab, Form, Row, Col, Button, Modal } from 'react-bootstrap';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import {
  FiShoppingBag, FiClock, FiTruck, FiCheckCircle, FiXCircle,
  FiSearch, FiChevronLeft, FiChevronRight, FiEye, FiEdit2,
  FiPlus, FiDollarSign, FiPackage, FiFilter, FiUser
} from 'react-icons/fi';
import { userContext } from './_app';
import { API_BASE } from '@/lib/apiBase';

const STATUS_CONFIG = {
  pending: { label: 'Pending', color: '#f59e0b', bg: '#fef3c7', icon: FiClock },
  confirmed: { label: 'Confirmed', color: '#3b82f6', bg: '#dbeafe', icon: FiPackage },
  shipped: { label: 'Shipped', color: '#8b5cf6', bg: '#ede9fe', icon: FiTruck },
  delivered: { label: 'Delivered', color: '#10b981', bg: '#d1fae5', icon: FiCheckCircle },
  cancelled: { label: 'Cancelled', color: '#ef4444', bg: '#fee2e2', icon: FiXCircle },
};

const PAYMENT_CONFIG = {
  paid: { label: 'Paid', color: '#10b981', bg: '#d1fae5' },
  unpaid: { label: 'Unpaid', color: '#ef4444', bg: '#fee2e2' },
  partial: { label: 'Partial', color: '#f59e0b', bg: '#fef3c7' },
};

export default function Orders() {
  const toast = useToast();
  const user = useContext(userContext);
  const regID = user?.regID;

  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isMobile, setIsMobile] = useState(false);

  // Modal states
  const [showAdd, setShowAdd] = useState(false);
  const [showView, setShowView] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showDelivery, setShowDelivery] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [newPaymentStatus, setNewPaymentStatus] = useState('');
  const [newDeliveryDate, setNewDeliveryDate] = useState('');

  // New order form
  const [newOrder, setNewOrder] = useState({
    orderid: '', regno: '', pid: '', pname: '',
    customer_name: '', customer_email: '', customer_phone: '',
    customer_address: '', quantity: '', unit_price: '',
    total_price: '', payment_method: 'cod', notes: ''
  });

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/retailer/order/orderlist/${regID}`);
      setOrders(Array.isArray(res.data) ? res.data : []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/retailer/order/stats/${regID}`);
      setStats(res.data || {});
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    if (regID) {
      fetchOrders();
      fetchStats();
    } else {
      setLoading(false);
    }
  }, [regID]);

  // Auto-calculate total price
  useEffect(() => {
    const qty = parseFloat(newOrder.quantity) || 0;
    const price = parseFloat(newOrder.unit_price) || 0;
    setNewOrder(prev => ({ ...prev, total_price: (qty * price).toFixed(2) }));
  }, [newOrder.quantity, newOrder.unit_price]);

  // Add order
  const handleAddOrder = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/api/retailer/order/addnew`, {
        ...newOrder,
        regno: regID
      });
      toast.success('Order added successfully');
      setShowAdd(false);
      setNewOrder({
        orderid: '', regno: '', pid: '', pname: '',
        customer_name: '', customer_email: '', customer_phone: '',
        customer_address: '', quantity: '', unit_price: '',
        total_price: '', payment_method: 'cod', notes: ''
      });
      fetchOrders();
      fetchStats();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to add order');
    }
  };

  // Update status
  const handleUpdateStatus = async () => {
    try {
      await axios.patch(`${API_BASE}/api/retailer/order/updatestatus/${selectedOrder.orderid}`, {
        status: newStatus
      });
      toast.success('Status updated');
      setShowStatus(false);
      fetchOrders();
      fetchStats();
    } catch (error) {
      toast.error('Update failed');
    }
  };

  // Update payment
  const handleUpdatePayment = async () => {
    try {
      await axios.patch(`${API_BASE}/api/retailer/order/updatepayment/${selectedOrder.orderid}`, {
        payment_status: newPaymentStatus
      });
      toast.success('Payment status updated');
      setShowPayment(false);
      fetchOrders();
      fetchStats();
    } catch (error) {
      toast.error('Update failed');
    }
  };

  // Update delivery date
  const handleUpdateDelivery = async () => {
    try {
      await axios.patch(`${API_BASE}/api/retailer/order/updatedelivery/${selectedOrder.orderid}`, {
        delivery_date: newDeliveryDate
      });
      toast.success('Delivery date updated');
      setShowDelivery(false);
      fetchOrders();
    } catch (error) {
      toast.error('Update failed');
    }
  };

  // Filter & Search
  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      (order.orderid || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.pname || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.customer_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.customer_phone || '').includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const ordersToShow = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => { setCurrentPage(1); }, [searchTerm, statusFilter]);

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

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  };

  const StatusBadge = ({ status }) => {
    const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        padding: '3px 10px', borderRadius: 20, fontSize: '0.76rem',
        fontWeight: 600, color: cfg.color, background: cfg.bg,
      }}>
        <cfg.icon size={12} />
        {cfg.label}
      </span>
    );
  };

  const PaymentBadge = ({ status }) => {
    const cfg = PAYMENT_CONFIG[status] || PAYMENT_CONFIG.unpaid;
    return (
      <span style={{
        display: 'inline-block', padding: '3px 10px', borderRadius: 20,
        fontSize: '0.76rem', fontWeight: 600, color: cfg.color, background: cfg.bg,
      }}>
        {cfg.label}
      </span>
    );
  };

  const cardStyle = {
    background: '#fff', borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border)', boxShadow: 'var(--shadow-xs)',
    padding: 0, overflow: 'hidden',
  };

  const headerStyle = {
    padding: '16px', borderBottom: '1px solid var(--border-light)',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    flexWrap: 'wrap', gap: 10,
  };

  return (
    <DashboardLayout pageTitle="Orders">
      {/* Order Stats */}
      <div className="dashboard-stats-grid">
        <StatsCard title="Total Orders" value={stats.total_orders || 0} icon={FiShoppingBag} color="primary" />
        <StatsCard title="Pending" value={stats.pending_orders || 0} icon={FiClock} color="warning" />
        <StatsCard title="Delivered" value={stats.delivered_orders || 0} icon={FiCheckCircle} color="success" />
        <StatsCard title="Revenue" value={`Rs ${Number(stats.total_revenue || 0).toLocaleString()}`} icon={FiDollarSign} color="info" />
      </div>

      <Tabs defaultActiveKey="view" id="order-tabs" fill style={{ marginBottom: 20 }}>
        {/* ======================== VIEW ORDERS TAB ======================== */}
        <Tab eventKey="view" title="View Orders">
          <div style={cardStyle}>
            <div style={headerStyle}>
              <h5 style={{ fontWeight: 600, margin: 0, fontSize: '1rem' }}>Order Management</h5>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', flex: '1 1 auto', justifyContent: 'flex-end' }}>
                {/* Status Filter */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 6, background: 'var(--bg)',
                  border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '7px 12px',
                }}>
                  <FiFilter size={14} color="var(--text-muted)" />
                  <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    style={{ border: 'none', background: 'none', outline: 'none', fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer' }}
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                {/* Search */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg)',
                  border: '1px solid var(--border)', borderRadius: 'var(--radius)',
                  padding: '7px 12px', flex: '1 1 180px', maxWidth: 280, minWidth: 0,
                }}>
                  <FiSearch size={16} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                  <input
                    type="text" placeholder="Search orders..."
                    value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                    style={{ border: 'none', background: 'none', outline: 'none', fontSize: '0.85rem', width: '100%', minWidth: 0 }}
                  />
                </div>
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <EmptyState
                title="No orders found"
                message={orders.length === 0 ? "Add your first order to get started." : "No orders match your search criteria."}
                icon={FiShoppingBag}
              />
            ) : (
              <>
                {/* ========== Desktop Table ========== */}
                <div className="product-desktop-table">
                  <div className="table-responsive-custom">
                    <table className="modern-table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Order ID</th>
                          <th>Product</th>
                          <th>Customer</th>
                          <th>Qty</th>
                          <th>Total</th>
                          <th>Status</th>
                          <th>Payment</th>
                          <th>Date</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ordersToShow.map((order, index) => (
                          <tr key={order.orderid || index}>
                            <td>{startIndex + index + 1}</td>
                            <td>
                              <span style={{
                                fontFamily: 'monospace', fontSize: '0.82rem',
                                background: 'var(--border-light)', padding: '2px 8px', borderRadius: 4,
                              }}>
                                {order.orderid}
                              </span>
                            </td>
                            <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{order.pname}</td>
                            <td>
                              <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>{order.customer_name}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{order.customer_phone}</div>
                            </td>
                            <td>{order.quantity}</td>
                            <td style={{ fontWeight: 600 }}>Rs {Number(order.total_price || 0).toLocaleString()}</td>
                            <td><StatusBadge status={order.status} /></td>
                            <td><PaymentBadge status={order.payment_status} /></td>
                            <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{formatDate(order.order_date)}</td>
                            <td>
                              <div style={{ display: 'flex', gap: 4 }}>
                                <button
                                  onClick={() => { setSelectedOrder(order); setShowView(true); }}
                                  className="btn-outline-modern"
                                  style={{ padding: '4px 8px', fontSize: '0.76rem' }}
                                >
                                  <FiEye size={12} />
                                </button>
                                <button
                                  onClick={() => { setSelectedOrder(order); setNewStatus(order.status); setShowStatus(true); }}
                                  style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '4px 8px', fontSize: '0.76rem', cursor: 'pointer' }}
                                >
                                  <FiEdit2 size={12} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* ========== Mobile Cards ========== */}
                <div className="product-mobile-cards">
                  {ordersToShow.map((order, index) => (
                    <div key={order.orderid || index} className="product-mobile-card">
                      <div className="product-mobile-card-header">
                        <div style={{
                          width: 44, height: 44, borderRadius: 'var(--radius)',
                          background: (STATUS_CONFIG[order.status] || STATUS_CONFIG.pending).bg,
                          color: (STATUS_CONFIG[order.status] || STATUS_CONFIG.pending).color,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}>
                          <FiShoppingBag size={18} />
                        </div>
                        <div className="product-mobile-card-info">
                          <div className="product-mobile-card-name">{order.pname}</div>
                          <div className="product-mobile-card-meta">
                            #{order.orderid} &middot; {order.customer_name}
                          </div>
                        </div>
                      </div>

                      <div className="product-mobile-card-details" style={{ gridTemplateColumns: '1fr 1fr' }}>
                        <div className="product-mobile-card-detail">
                          <div className="product-mobile-card-detail-label">Total</div>
                          <div className="product-mobile-card-detail-value">Rs {Number(order.total_price || 0).toLocaleString()}</div>
                        </div>
                        <div className="product-mobile-card-detail">
                          <div className="product-mobile-card-detail-label">Qty</div>
                          <div className="product-mobile-card-detail-value">{order.quantity}</div>
                        </div>
                        <div className="product-mobile-card-detail">
                          <div className="product-mobile-card-detail-label">Status</div>
                          <div className="product-mobile-card-detail-value"><StatusBadge status={order.status} /></div>
                        </div>
                        <div className="product-mobile-card-detail">
                          <div className="product-mobile-card-detail-label">Payment</div>
                          <div className="product-mobile-card-detail-value"><PaymentBadge status={order.payment_status} /></div>
                        </div>
                      </div>

                      <div className="product-mobile-card-actions">
                        <button
                          onClick={() => { setSelectedOrder(order); setShowView(true); }}
                          className="btn-outline-modern"
                          style={{ padding: '6px 8px', fontSize: '0.75rem' }}
                        >
                          <FiEye size={12} /> View
                        </button>
                        <button
                          onClick={() => { setSelectedOrder(order); setNewStatus(order.status); setShowStatus(true); }}
                          className="btn-primary-modern"
                          style={{ padding: '6px 8px', fontSize: '0.75rem' }}
                        >
                          <FiEdit2 size={12} /> Status
                        </button>
                        <button
                          onClick={() => { setSelectedOrder(order); setNewPaymentStatus(order.payment_status); setShowPayment(true); }}
                          style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '6px 8px', fontSize: '0.75rem', cursor: 'pointer' }}
                        >
                          <FiDollarSign size={12} /> Pay
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="table-pagination">
                    <span className="table-pagination-info">
                      Showing {startIndex + 1}–{Math.min(startIndex + itemsPerPage, filteredOrders.length)} of {filteredOrders.length} orders
                    </span>
                    <div className="table-pagination-controls">
                      <button className="table-pagination-btn" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
                        <FiChevronLeft size={16} />
                      </button>
                      {getPageNumbers().map((page, i) =>
                        page === '...' ? (
                          <span key={`e${i}`} className="table-pagination-ellipsis">…</span>
                        ) : (
                          <button
                            key={page}
                            className={`table-pagination-btn ${currentPage === page ? 'table-pagination-active' : ''}`}
                            onClick={() => setCurrentPage(page)}
                          >
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
        </Tab>

        {/* ======================== ADD ORDER TAB ======================== */}
        <Tab eventKey="add" title="Add Order">
          <div style={{ ...cardStyle, padding: '20px 16px', maxWidth: 900 }}>
            <h5 style={{ fontWeight: 600, marginBottom: 20, fontSize: '1rem' }}>Create New Order</h5>
            <Form onSubmit={handleAddOrder}>
              <div style={{
                padding: '12px 16px', background: 'var(--primary-50)', borderRadius: 'var(--radius)',
                marginBottom: 20, fontSize: '0.85rem', color: 'var(--primary-dark)', fontWeight: 500,
              }}>
                <FiPackage size={14} style={{ marginRight: 6 }} />
                Product Information
              </div>
              <Row className="mb-3">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Order ID</Form.Label>
                    <Form.Control
                      placeholder="e.g. ORD-001"
                      value={newOrder.orderid}
                      onChange={e => setNewOrder({ ...newOrder, orderid: e.target.value })}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Product ID</Form.Label>
                    <Form.Control
                      placeholder="Enter product ID"
                      value={newOrder.pid}
                      onChange={e => setNewOrder({ ...newOrder, pid: e.target.value })}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Product Name</Form.Label>
                    <Form.Control
                      placeholder="Enter product name"
                      value={newOrder.pname}
                      onChange={e => setNewOrder({ ...newOrder, pname: e.target.value })}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control
                      type="number" placeholder="0" min="1"
                      value={newOrder.quantity}
                      onChange={e => setNewOrder({ ...newOrder, quantity: e.target.value })}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Unit Price (Rs)</Form.Label>
                    <Form.Control
                      type="number" placeholder="0.00" step="0.01"
                      value={newOrder.unit_price}
                      onChange={e => setNewOrder({ ...newOrder, unit_price: e.target.value })}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Total Price (Rs)</Form.Label>
                    <Form.Control
                      type="text" value={newOrder.total_price} disabled
                      style={{ background: 'var(--bg)', fontWeight: 600 }}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <div style={{
                padding: '12px 16px', background: 'var(--success-light)', borderRadius: 'var(--radius)',
                marginBottom: 20, marginTop: 24, fontSize: '0.85rem', color: '#065f46', fontWeight: 500,
              }}>
                <FiUser size={14} style={{ marginRight: 6 }} />
                Customer Details
              </div>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Customer Name</Form.Label>
                    <Form.Control
                      placeholder="Enter customer name"
                      value={newOrder.customer_name}
                      onChange={e => setNewOrder({ ...newOrder, customer_name: e.target.value })}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Customer Email</Form.Label>
                    <Form.Control
                      type="email" placeholder="customer@example.com"
                      value={newOrder.customer_email}
                      onChange={e => setNewOrder({ ...newOrder, customer_email: e.target.value })}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Customer Phone</Form.Label>
                    <Form.Control
                      placeholder="Enter phone number"
                      value={newOrder.customer_phone}
                      onChange={e => setNewOrder({ ...newOrder, customer_phone: e.target.value })}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Payment Method</Form.Label>
                    <Form.Select
                      value={newOrder.payment_method}
                      onChange={e => setNewOrder({ ...newOrder, payment_method: e.target.value })}
                    >
                      <option value="cod">Cash on Delivery</option>
                      <option value="upi">UPI</option>
                      <option value="card">Card</option>
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="other">Other</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={12}>
                  <Form.Group>
                    <Form.Label>Delivery Address</Form.Label>
                    <Form.Control
                      as="textarea" rows={2}
                      placeholder="Enter full delivery address"
                      value={newOrder.customer_address}
                      onChange={e => setNewOrder({ ...newOrder, customer_address: e.target.value })}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={12}>
                  <Form.Group>
                    <Form.Label>Notes (Optional)</Form.Label>
                    <Form.Control
                      as="textarea" rows={2}
                      placeholder="Any special instructions..."
                      value={newOrder.notes}
                      onChange={e => setNewOrder({ ...newOrder, notes: e.target.value })}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Button type="submit" className="btn-primary-modern" style={{ marginTop: 8 }}>
                <FiPlus size={14} style={{ marginRight: 6 }} />
                Create Order
              </Button>
            </Form>
          </div>
        </Tab>
      </Tabs>

      {/* ======================== MODALS ======================== */}

      {/* View Order Detail Modal */}
      <Modal show={showView} onHide={() => setShowView(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Order Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Order header */}
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                flexWrap: 'wrap', gap: 10, padding: '12px 16px',
                background: 'var(--bg)', borderRadius: 'var(--radius)',
              }}>
                <div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Order ID</div>
                  <div style={{ fontFamily: 'monospace', fontSize: '1rem', fontWeight: 600 }}>{selectedOrder.orderid}</div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <StatusBadge status={selectedOrder.status} />
                  <PaymentBadge status={selectedOrder.payment_status} />
                </div>
              </div>

              {/* Info grid */}
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
                gap: 16,
              }}>
                {/* Product Info */}
                <div style={{ padding: 16, background: 'var(--bg)', borderRadius: 'var(--radius)' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 8 }}>Product</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>{selectedOrder.pname}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>PID: {selectedOrder.pid}</div>
                  <div style={{ marginTop: 8, display: 'flex', gap: 16 }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Qty: </span>
                      <span style={{ fontWeight: 600 }}>{selectedOrder.quantity}</span>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Unit: </span>
                      <span style={{ fontWeight: 600 }}>Rs {selectedOrder.unit_price}</span>
                    </div>
                  </div>
                  <div style={{ marginTop: 8, fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)' }}>
                    Rs {Number(selectedOrder.total_price || 0).toLocaleString()}
                  </div>
                </div>

                {/* Customer Info */}
                <div style={{ padding: 16, background: 'var(--bg)', borderRadius: 'var(--radius)' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 8 }}>Customer</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>{selectedOrder.customer_name}</div>
                  {selectedOrder.customer_email && (
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{selectedOrder.customer_email}</div>
                  )}
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{selectedOrder.customer_phone}</div>
                  {selectedOrder.customer_address && (
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: 8 }}>
                      {selectedOrder.customer_address}
                    </div>
                  )}
                </div>
              </div>

              {/* Dates & payment */}
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 160px), 1fr))',
                gap: 12,
              }}>
                <div style={{ padding: 12, background: 'var(--bg)', borderRadius: 'var(--radius)', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Order Date</div>
                  <div style={{ fontWeight: 600, marginTop: 4 }}>{formatDate(selectedOrder.order_date)}</div>
                </div>
                <div style={{ padding: 12, background: 'var(--bg)', borderRadius: 'var(--radius)', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Delivery Date</div>
                  <div style={{ fontWeight: 600, marginTop: 4 }}>{formatDate(selectedOrder.delivery_date)}</div>
                </div>
                <div style={{ padding: 12, background: 'var(--bg)', borderRadius: 'var(--radius)', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Payment Method</div>
                  <div style={{ fontWeight: 600, marginTop: 4, textTransform: 'uppercase' }}>{selectedOrder.payment_method}</div>
                </div>
              </div>

              {selectedOrder.notes && (
                <div style={{ padding: 12, background: 'var(--warning-light)', borderRadius: 'var(--radius)', fontSize: '0.85rem' }}>
                  <strong>Notes:</strong> {selectedOrder.notes}
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={() => setShowView(false)}>Close</Button>
          <Button
            className="btn-primary-modern"
            onClick={() => {
              setShowView(false);
              setNewStatus(selectedOrder.status);
              setShowStatus(true);
            }}
          >
            Update Status
          </Button>
          <Button
            className="btn-outline-modern"
            onClick={() => {
              setShowView(false);
              setNewPaymentStatus(selectedOrder.payment_status);
              setShowPayment(true);
            }}
          >
            Update Payment
          </Button>
          <Button
            variant="light"
            onClick={() => {
              setShowView(false);
              setNewDeliveryDate(selectedOrder.delivery_date || '');
              setShowDelivery(true);
            }}
          >
            Set Delivery Date
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Update Status Modal */}
      <Modal show={showStatus} onHide={() => setShowStatus(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Update Order Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ marginBottom: 16, padding: 12, background: 'var(--bg)', borderRadius: 'var(--radius)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Order: <strong>{selectedOrder?.orderid}</strong></div>
            <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>{selectedOrder?.pname}</div>
          </div>
          <Form.Label>New Status</Form.Label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
              <label
                key={key}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
                  borderRadius: 'var(--radius)', border: `2px solid ${newStatus === key ? cfg.color : 'var(--border)'}`,
                  background: newStatus === key ? cfg.bg : '#fff', cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <input
                  type="radio" name="status" value={key}
                  checked={newStatus === key}
                  onChange={e => setNewStatus(e.target.value)}
                  style={{ accentColor: cfg.color }}
                />
                <cfg.icon size={16} color={cfg.color} />
                <span style={{ fontWeight: 500, fontSize: '0.88rem' }}>{cfg.label}</span>
              </label>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={() => setShowStatus(false)}>Cancel</Button>
          <Button className="btn-primary-modern" onClick={handleUpdateStatus}>Save Status</Button>
        </Modal.Footer>
      </Modal>

      {/* Update Payment Modal */}
      <Modal show={showPayment} onHide={() => setShowPayment(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Update Payment Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ marginBottom: 16, padding: 12, background: 'var(--bg)', borderRadius: 'var(--radius)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Order: <strong>{selectedOrder?.orderid}</strong></div>
            <div style={{ fontSize: '0.85rem' }}>Total: <strong>Rs {Number(selectedOrder?.total_price || 0).toLocaleString()}</strong></div>
          </div>
          <Form.Label>Payment Status</Form.Label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {Object.entries(PAYMENT_CONFIG).map(([key, cfg]) => (
              <label
                key={key}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
                  borderRadius: 'var(--radius)', border: `2px solid ${newPaymentStatus === key ? cfg.color : 'var(--border)'}`,
                  background: newPaymentStatus === key ? cfg.bg : '#fff', cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <input
                  type="radio" name="payment" value={key}
                  checked={newPaymentStatus === key}
                  onChange={e => setNewPaymentStatus(e.target.value)}
                  style={{ accentColor: cfg.color }}
                />
                <span style={{ fontWeight: 500, fontSize: '0.88rem' }}>{cfg.label}</span>
              </label>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={() => setShowPayment(false)}>Cancel</Button>
          <Button className="btn-primary-modern" onClick={handleUpdatePayment}>Save Payment</Button>
        </Modal.Footer>
      </Modal>

      {/* Update Delivery Date Modal */}
      <Modal show={showDelivery} onHide={() => setShowDelivery(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Set Delivery Date</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ marginBottom: 16, padding: 12, background: 'var(--bg)', borderRadius: 'var(--radius)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Order: <strong>{selectedOrder?.orderid}</strong></div>
          </div>
          <Form.Label>Delivery Date</Form.Label>
          <Form.Control
            type="date"
            value={newDeliveryDate}
            onChange={e => setNewDeliveryDate(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={() => setShowDelivery(false)}>Cancel</Button>
          <Button className="btn-primary-modern" onClick={handleUpdateDelivery}>Save Date</Button>
        </Modal.Footer>
      </Modal>
    </DashboardLayout>
  );
}
