import DashboardLayout from '@/components/Layout/DashboardLayout';
import StatusBadge from '@/components/ui/StatusBadge';
import EmptyState from '@/components/ui/EmptyState';
import { useToast } from '@/context/ToastContext';
import { Tabs, Tab, Form, Row, Col, Button } from 'react-bootstrap';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { userContext } from './_app';
import { FiCreditCard } from 'react-icons/fi';
import { API_BASE } from '@/lib/apiBase';

export default function Banking() {
  const toast = useToast();
  const user = useContext(userContext);
  const regID = user?.regID;
  const [data, setData] = useState([]);

  const getdata = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/retailer/banking/${regID}`);
      setData(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (regID) getdata();
  }, [regID]);

  const [values, setValues] = useState({
    regno: '', bankaccountno: '', bankaccountname: '',
    ifsc: '', bankname: '', branch: '', upi: '',
  });

  const handleSubmit = async () => {
    if (!values.bankaccountno || !values.bankname || !values.ifsc) {
      toast.warning('Please fill required fields');
      return;
    }
    axios.post(`${API_BASE}/api/retailer/banking`, values)
      .then(() => { toast.success('Banking details added'); getdata(); })
      .catch(error => { console.error('Error:', error); toast.error('Failed to save'); });
  };

  const cardStyle = {
    background: '#fff', borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border)', boxShadow: 'var(--shadow-xs)', padding: 'clamp(14px, 3vw, 24px)'
  };

  return (
    <DashboardLayout pageTitle="Banking">
      <Tabs defaultActiveKey="view" id="banking-tabs" fill style={{ marginBottom: 20 }}>
        <Tab eventKey="view" title="View Details">
          {data.length === 0 ? (
            <div style={cardStyle}>
              <EmptyState title="No banking details" message="Add your banking details to receive payments." icon={FiCreditCard} />
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 16 }}>
              {data.map((item, index) => (
                <div key={index} style={cardStyle}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 8 }}>
                    <div>
                      <h5 style={{ fontWeight: 600, margin: 0 }}>{item.bankname || 'Bank Account'}</h5>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{item.branch || 'Branch'}</span>
                    </div>
                    <StatusBadge status={item.status || 'pending'} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: 16 }}>
                    <div>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.03em' }}>Account No</span>
                      <p style={{ fontWeight: 600, fontSize: '1rem', margin: '4px 0 0', fontFamily: 'monospace' }}>{item.bankaccountno}</p>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.03em' }}>Account Name</span>
                      <p style={{ fontWeight: 500, margin: '4px 0 0' }}>{item.bankaccountname}</p>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.03em' }}>IFSC Code</span>
                      <p style={{ fontWeight: 600, margin: '4px 0 0', fontFamily: 'monospace' }}>{item.ifsc}</p>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.03em' }}>UPI</span>
                      <p style={{ fontWeight: 500, margin: '4px 0 0' }}>{item.upi || '-'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Tab>

        <Tab eventKey="add" title="Add Banking Details">
          <div style={{ ...cardStyle, maxWidth: 700, padding: 'clamp(16px, 3vw, 24px)' }}>
            <h5 style={{ fontWeight: 600, marginBottom: 20, fontSize: '1rem' }}>Add Bank Account</h5>
            <Form>
              <Row className="mb-3">
                <Col md={6}><Form.Group><Form.Label>Registration No</Form.Label><Form.Control placeholder="Enter Reg No" onChange={e => setValues({ ...values, regno: e.target.value })} /></Form.Group></Col>
                <Col md={6}><Form.Group><Form.Label>Account Number *</Form.Label><Form.Control type="number" placeholder="Enter account number" onChange={e => setValues({ ...values, bankaccountno: e.target.value })} /></Form.Group></Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}><Form.Group><Form.Label>Account Holder Name</Form.Label><Form.Control placeholder="Enter account name" onChange={e => setValues({ ...values, bankaccountname: e.target.value })} /></Form.Group></Col>
                <Col md={6}><Form.Group><Form.Label>IFSC Code *</Form.Label><Form.Control placeholder="e.g. SBIN0001234" onChange={e => setValues({ ...values, ifsc: e.target.value })} /></Form.Group></Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}><Form.Group><Form.Label>Bank Name *</Form.Label><Form.Control placeholder="Enter bank name" onChange={e => setValues({ ...values, bankname: e.target.value })} /></Form.Group></Col>
                <Col md={6}><Form.Group><Form.Label>Branch</Form.Label><Form.Control placeholder="Enter branch" onChange={e => setValues({ ...values, branch: e.target.value })} /></Form.Group></Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}><Form.Group><Form.Label>UPI ID</Form.Label><Form.Control placeholder="yourname@upi" onChange={e => setValues({ ...values, upi: e.target.value })} /></Form.Group></Col>
              </Row>
              <Button className="btn-primary-modern" onClick={handleSubmit} style={{ marginTop: 8 }}>Save Banking Details</Button>
            </Form>
          </div>
        </Tab>
      </Tabs>
    </DashboardLayout>
  );
}
