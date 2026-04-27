import DashboardLayout from '@/components/Layout/DashboardLayout';
import EmptyState from '@/components/ui/EmptyState';
import { useToast } from '@/context/ToastContext';
import { Tabs, Tab, Table, Form, Row, Col, Button, Modal } from 'react-bootstrap';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { FiEdit2, FiEye, FiPlus, FiImage, FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { userContext } from './_app';
import { API_BASE } from '@/lib/apiBase';

export default function Product() {
  const toast = useToast();
  const user = useContext(userContext);
  const regID = user?.regID;

  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [datas, setDatas] = useState([]);
  const [datass, setDatass] = useState([]);

  const [price, setPrice] = useState('');
  const [id, setid] = useState('');
  const [discount, setDiscount] = useState('');
  const [ids, setids] = useState('');
  const [quantity, setQuantity] = useState('');
  const [idss, setidss] = useState('');
  const [dupdate, setDupdate] = useState('');
  const [iupdate, setIupdate] = useState('');

  // GET Products
  const getdata = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/retailer/product/productlist/${regID}`);
      setData(res.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (regID) getdata();
  }, [regID]);

  // POST Product
  const [values, setValues] = useState({
    regno: '', pid: '', pname: '', Subcategoryid: '',
    price: '', discount: '', brand_name: '', quantity: '', photo: null,
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    axios.post(`${API_BASE}/api/retailer/product/addnew`, {
      ...values,
      // product images are handled via /api/retailer/productimage/* endpoints
      photo: undefined
    })
      .then(() => { toast.success('Product added successfully'); getdata(); })
      .catch(error => { console.error('Error:', error); toast.error('Failed to add product'); });
  };

  // Update Price
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = (id) => { setid(id); setShow(true); };

  const UpdatePrice = (pid, newPrice) => {
    axios.patch(`${API_BASE}/api/retailer/product/updateprice/${pid}`, { price: newPrice })
      .then(res => {
        toast.success('Price updated successfully'); handleClose(); getdata();
      })
      .catch(err => { console.log(err); toast.error('Update failed'); });
  };

  // Update Discount
  const [show1, setShow1] = useState(false);
  const handleClose1 = () => setShow1(false);
  const handleShow1 = (ids) => { setids(ids); setShow1(true); };

  const UpdateDiscount = (pid, newDiscount) => {
    axios.patch(`${API_BASE}/api/retailer/product/updatediscount/${pid}`, { discount: newDiscount })
      .then(res => {
        toast.success('Discount updated successfully'); handleClose1(); getdata();
      })
      .catch(err => { console.log(err); toast.error('Update failed'); });
  };

  // Update Quantity
  const [show2, setShow2] = useState(false);
  const handleClose2 = () => setShow2(false);
  const handleShow2 = (idss) => { setidss(idss); setShow2(true); };

  const UpdateQuantity = (pid, newQuantity) => {
    axios.patch(`${API_BASE}/api/retailer/product/updatequantity/${pid}`, { quantity: newQuantity })
      .then(res => {
        toast.success('Quantity updated successfully'); handleClose2(); getdata();
      })
      .catch(err => { console.log(err); toast.error('Update failed'); });
  };

  // View Description
  const [show3, setShow3] = useState(false);
  const handleClose3 = () => setShow3(false);
  const handleShow3 = (pid) => {
    axios.get(`${API_BASE}/api/retailer/productdescription/viewdescription/${pid}`)
      .then(res => setDatas(Array.isArray(res.data) ? res.data : []))
      .catch(err => console.log(err));
    setShow3(true);
  };

  // Add Description
  const [show4, setShow4] = useState(false);
  const handleClose4 = () => setShow4(false);
  const handleShow4 = (id) => { setid(id); setShow4(true); };

  const [values1, setValues1] = useState({
    pid: '', size: '', weight: '', ram: '', screen: '',
    rom: '', processor: '', mfg_date: '', material: '',
    country_of_origin: '', description: ''
  });

  const handleSubmit1 = async () => {
    axios.post(`${API_BASE}/api/retailer/productdescription/adddescription`, values1)
      .then(() => { toast.success('Description added'); handleClose4(); })
      .catch(error => { console.error('Error:', error); toast.error('Failed to add description'); });
  };

  // Update Description
  const [show5, setShow5] = useState(false);
  const handleClose5 = () => setShow5(false);
  const handleShow5 = (pid) => { setDupdate(pid); setShow5(true); };

  const [description, setDescription] = useState({
    size: '', weight: '', ram: '', screen: '', rom: '',
    processor: '', mfg_date: '', material: '', country_of_origin: '', description: ''
  });

  const UpdateDescription = (pid) => {
    axios.patch(`${API_BASE}/api/retailer/productdescription/updatedesc/${pid}`, description)
      .then(res => { toast.success('Description updated'); handleClose5(); })
      .catch(err => { console.log(err); toast.error('Update failed'); });
  };

  // View Images
  const [show6, setShow6] = useState(false);
  const handleClose6 = () => setShow6(false);
  const handleShow6 = (pid) => {
    axios.get(`${API_BASE}/api/retailer/productimage/viewimages/${pid}`)
      .then(res => setDatass(Array.isArray(res.data) ? res.data : []))
      .catch(err => console.log(err));
    setShow6(true);
  };

  // Add Image
  const [show7, setShow7] = useState(false);
  const handleClose7 = () => setShow7(false);
  const handleShow7 = () => setShow7(true);

  const [image1, setImage1] = useState('');
  const [image2, setImage2] = useState('');
  const [image3, setImage3] = useState('');
  const [image4, setImage4] = useState('');

  const [values2, setValues2] = useState({
    pid: '', imgid: '', description: '', colour: ''
  });

  const handleSubmit2 = async () => {
    const formdata = new FormData();
    formdata.append("pid", values2.pid);
    formdata.append("imgid", values2.imgid);
    formdata.append("image", image1);
    formdata.append("description", values2.description);
    formdata.append("colour", values2.colour);

    axios.post(`${API_BASE}/api/retailer/productimage/addnew`, formdata)
      .then(() => { toast.success('Image added'); handleClose7(); })
      .catch(error => { console.error('Error:', error); toast.error('Failed to upload'); });
  };

  // Update Image
  const [show8, setShow8] = useState(false);
  const handleClose8 = () => setShow8(false);
  const handleShow8 = (pid) => { setIupdate(pid); setShow8(true); };

  const [image, setImage] = useState({ imgid: '', description: '', colour: '' });

  const UpdateImage = (imgid) => {
    const formdata = new FormData();
    if (image1) formdata.append("image", image1);
    formdata.append("description", image.description);
    formdata.append("colour", image.colour);

    axios.patch(`${API_BASE}/api/retailer/productimage/update/${imgid}`, formdata)
      .then(res => { toast.success('Image updated'); handleClose8(); })
      .catch(err => { console.log(err); toast.error('Update failed'); });
  };

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const filteredData = Array.isArray(data) ? data.filter(item =>
    (item.pname || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.brand_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.pid || '').toString().includes(searchTerm)
  ) : [];
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const itemsToDisplay = filteredData.slice(startIndex, startIndex + itemsPerPage);

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

  const cardStyle = {
    background: '#fff', borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border)', boxShadow: 'var(--shadow-xs)', padding: 0,
    overflow: 'hidden',
  };
  const headerStyle = {
    padding: '16px 16px', borderBottom: '1px solid var(--border-light)',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10,
  };

  return (
    <DashboardLayout pageTitle="Products">
      <Tabs defaultActiveKey="view" id="product-tabs" fill style={{ marginBottom: 20 }}>

        {/* VIEW PRODUCTS TAB */}
        <Tab eventKey="view" title="View Products">
          <div style={cardStyle}>
            <div style={headerStyle}>
              <h5 style={{ fontWeight: 600, margin: 0, fontSize: '1rem' }}>Product Inventory</h5>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '7px 12px', flex: '1 1 200px', maxWidth: 300, minWidth: 0 }}>
                <FiSearch size={16} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                <input type="text" placeholder="Search products..." value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }} style={{ border: 'none', background: 'none', outline: 'none', fontSize: '0.85rem', width: '100%', minWidth: 0 }} />
              </div>
            </div>

            {filteredData.length === 0 ? (
              <EmptyState title="No products found" message="Add your first product to get started" />
            ) : (
              <>
                {/* Desktop Table */}
                <div className="product-desktop-table">
                  <div className="table-responsive-custom">
                    <table className="modern-table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>PID</th>
                          <th>Image</th>
                          <th>Product Name</th>
                          <th>Category</th>
                          <th>Price</th>
                          <th>Discount</th>
                          <th>Brand</th>
                          <th>Stock</th>
                          <th>Description</th>
                          <th>Images</th>
                        </tr>
                      </thead>
                      <tbody>
                        {itemsToDisplay.map((item, index) => (
                          <tr key={index}>
                            <td>{startIndex + index + 1}</td>
                            <td><span style={{ fontFamily: 'monospace', fontSize: '0.82rem', background: 'var(--border-light)', padding: '2px 8px', borderRadius: 4 }}>{item.pid}</span></td>
                            <td>
                              {item.photo ? (
                                <img style={{ height: 40, width: 40, borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} src={item.photo} alt="" />
                              ) : (
                                <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-sm)', background: 'var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FiImage size={16} color="var(--text-light)" /></div>
                              )}
                            </td>
                            <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{item.pname}</td>
                            <td>{item.Subcategoryid}</td>
                            <td>
                              <span style={{ fontWeight: 600 }}>Rs {item.price}</span>
                              <button onClick={() => handleShow(item.pid)} style={{ background: 'none', border: 'none', color: 'var(--primary)', marginLeft: 6, padding: 2 }}><FiEdit2 size={14} /></button>
                            </td>
                            <td>
                              {item.discount || '-'}
                              <button onClick={() => handleShow1(item.pid)} style={{ background: 'none', border: 'none', color: 'var(--primary)', marginLeft: 6, padding: 2 }}><FiEdit2 size={14} /></button>
                            </td>
                            <td>{item.brand_name}</td>
                            <td>
                              {item.quantity}
                              <button onClick={() => handleShow2(item.pid)} style={{ background: 'none', border: 'none', color: 'var(--primary)', marginLeft: 6, padding: 2 }}><FiEdit2 size={14} /></button>
                            </td>
                            <td>
                              <button onClick={() => handleShow3(item.pid)} className="btn-outline-modern" style={{ padding: '4px 10px', fontSize: '0.78rem', marginRight: 4 }}><FiEye size={12} /> View</button>
                              <button onClick={() => handleShow4(item.pid)} className="btn-primary-modern" style={{ padding: '4px 10px', fontSize: '0.78rem', marginRight: 4 }}><FiPlus size={12} /> Add</button>
                              <button onClick={() => handleShow5(item.pid)} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '4px 10px', fontSize: '0.78rem', cursor: 'pointer' }}><FiEdit2 size={12} /> Edit</button>
                            </td>
                            <td>
                              <button onClick={() => handleShow6(item.pid)} className="btn-outline-modern" style={{ padding: '4px 10px', fontSize: '0.78rem', marginRight: 4 }}><FiEye size={12} /></button>
                              <button onClick={handleShow7} className="btn-primary-modern" style={{ padding: '4px 10px', fontSize: '0.78rem', marginRight: 4 }}><FiPlus size={12} /></button>
                              <button onClick={() => handleShow8(item.pid)} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '4px 10px', fontSize: '0.78rem', cursor: 'pointer' }}><FiEdit2 size={12} /></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Mobile Cards */}
                <div className="product-mobile-cards">
                  {itemsToDisplay.map((item, index) => (
                    <div key={index} className="product-mobile-card">
                      <div className="product-mobile-card-header">
                        {item.photo ? (
                          <img className="product-mobile-card-img" src={item.photo} alt="" />
                        ) : (
                          <div className="product-mobile-card-img"><FiImage size={20} color="var(--text-light)" /></div>
                        )}
                        <div className="product-mobile-card-info">
                          <div className="product-mobile-card-name">{item.pname}</div>
                          <div className="product-mobile-card-meta">PID: {item.pid} &middot; {item.brand_name} &middot; {item.Subcategoryid}</div>
                        </div>
                      </div>
                      <div className="product-mobile-card-details">
                        <div className="product-mobile-card-detail">
                          <div className="product-mobile-card-detail-label">Price</div>
                          <div className="product-mobile-card-detail-value">
                            Rs {item.price}
                            <button onClick={() => handleShow(item.pid)} style={{ background: 'none', border: 'none', color: 'var(--primary)', padding: '0 2px', verticalAlign: 'middle' }}><FiEdit2 size={12} /></button>
                          </div>
                        </div>
                        <div className="product-mobile-card-detail">
                          <div className="product-mobile-card-detail-label">Discount</div>
                          <div className="product-mobile-card-detail-value">
                            {item.discount || '-'}
                            <button onClick={() => handleShow1(item.pid)} style={{ background: 'none', border: 'none', color: 'var(--primary)', padding: '0 2px', verticalAlign: 'middle' }}><FiEdit2 size={12} /></button>
                          </div>
                        </div>
                        <div className="product-mobile-card-detail">
                          <div className="product-mobile-card-detail-label">Stock</div>
                          <div className="product-mobile-card-detail-value">
                            {item.quantity}
                            <button onClick={() => handleShow2(item.pid)} style={{ background: 'none', border: 'none', color: 'var(--primary)', padding: '0 2px', verticalAlign: 'middle' }}><FiEdit2 size={12} /></button>
                          </div>
                        </div>
                      </div>
                      <div className="product-mobile-card-actions">
                        <button onClick={() => handleShow3(item.pid)} className="btn-outline-modern" style={{ padding: '6px 8px', fontSize: '0.75rem' }}><FiEye size={12} /> Desc</button>
                        <button onClick={() => handleShow4(item.pid)} className="btn-primary-modern" style={{ padding: '6px 8px', fontSize: '0.75rem' }}><FiPlus size={12} /> Desc</button>
                        <button onClick={() => handleShow6(item.pid)} className="btn-outline-modern" style={{ padding: '6px 8px', fontSize: '0.75rem' }}><FiEye size={12} /> Img</button>
                        <button onClick={handleShow7} className="btn-primary-modern" style={{ padding: '6px 8px', fontSize: '0.75rem' }}><FiPlus size={12} /> Img</button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="table-pagination">
                  <span className="table-pagination-info">
                    Showing {startIndex + 1}–{Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length} products
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
              </>
            )}
          </div>
        </Tab>

        {/* ADD PRODUCT TAB */}
        <Tab eventKey="add" title="Add Product">
          <div style={{ ...cardStyle, padding: '20px 16px', maxWidth: 800 }}>
            <h5 style={{ fontWeight: 600, marginBottom: 20, fontSize: '1rem' }}>Add New Product</h5>
            <Form>
              <Row className="mb-3">
                <Col md={6}><Form.Group><Form.Label>Registration No</Form.Label><Form.Control placeholder="Enter Reg No" onChange={e => setValues({ ...values, regno: e.target.value })} /></Form.Group></Col>
                <Col md={6}><Form.Group><Form.Label>Product ID</Form.Label><Form.Control placeholder="Enter Product ID" onChange={e => setValues({ ...values, pid: e.target.value })} /></Form.Group></Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}><Form.Group><Form.Label>Product Name</Form.Label><Form.Control placeholder="Enter product name" onChange={e => setValues({ ...values, pname: e.target.value })} /></Form.Group></Col>
                <Col md={6}><Form.Group><Form.Label>Subcategory ID</Form.Label><Form.Control placeholder="Enter subcategory" onChange={e => setValues({ ...values, Subcategoryid: e.target.value })} /></Form.Group></Col>
              </Row>
              <Row className="mb-3">
                <Col md={4}><Form.Group><Form.Label>Price</Form.Label><Form.Control type="number" placeholder="0.00" onChange={e => setValues({ ...values, price: e.target.value })} /></Form.Group></Col>
                <Col md={4}><Form.Group><Form.Label>Discount</Form.Label><Form.Control placeholder="e.g. 10%" onChange={e => setValues({ ...values, discount: e.target.value })} /></Form.Group></Col>
                <Col md={4}><Form.Group><Form.Label>Quantity</Form.Label><Form.Control type="number" placeholder="0" onChange={e => setValues({ ...values, quantity: e.target.value })} /></Form.Group></Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}><Form.Group><Form.Label>Brand Name</Form.Label><Form.Control placeholder="Enter brand" onChange={e => setValues({ ...values, brand_name: e.target.value })} /></Form.Group></Col>
              </Row>
              <Button className="btn-primary-modern" onClick={handleSubmit} style={{ marginTop: 8 }}>Save Product</Button>
            </Form>
          </div>
        </Tab>
      </Tabs>

      {/* MODALS */}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton><Modal.Title>Update Price</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Label>New Price</Form.Label>
          <Form.Control type="number" placeholder="Enter new price" value={price} onChange={e => setPrice(e.target.value)} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={handleClose}>Cancel</Button>
          <Button className="btn-primary-modern" onClick={() => UpdatePrice(id, price)}>Save</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={show1} onHide={handleClose1} centered>
        <Modal.Header closeButton><Modal.Title>Update Discount</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Label>New Discount</Form.Label>
          <Form.Control type="text" placeholder="Enter discount" value={discount} onChange={e => setDiscount(e.target.value)} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={handleClose1}>Cancel</Button>
          <Button className="btn-primary-modern" onClick={() => UpdateDiscount(ids, discount)}>Save</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={show2} onHide={handleClose2} centered>
        <Modal.Header closeButton><Modal.Title>Update Quantity</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Label>New Quantity</Form.Label>
          <Form.Control type="number" placeholder="Enter quantity" value={quantity} onChange={e => setQuantity(e.target.value)} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={handleClose2}>Cancel</Button>
          <Button className="btn-primary-modern" onClick={() => UpdateQuantity(idss, quantity)}>Save</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={show3} onHide={handleClose3} centered size="lg">
        <Modal.Header closeButton><Modal.Title>Product Description</Modal.Title></Modal.Header>
        <Modal.Body>
          {datas.length === 0 ? <EmptyState title="No description" message="No description added for this product." /> : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: 12 }}>
              {datas.map((item, i) => (
                <div key={i} style={{ padding: 12, background: 'var(--bg)', borderRadius: 'var(--radius)', fontSize: '0.88rem' }}>
                  {item.description && <div><strong>Description:</strong> {item.description}</div>}
                  {item.size && <div><strong>Size:</strong> {item.size}</div>}
                  {item.weight && <div><strong>Weight:</strong> {item.weight}</div>}
                  {item.ram && <div><strong>RAM:</strong> {item.ram}</div>}
                  {item.rom && <div><strong>ROM:</strong> {item.rom}</div>}
                  {item.screen && <div><strong>Screen:</strong> {item.screen}</div>}
                  {item.processor && <div><strong>Processor:</strong> {item.processor}</div>}
                  {item.material && <div><strong>Material:</strong> {item.material}</div>}
                  {item.country_of_origin && <div><strong>Origin:</strong> {item.country_of_origin}</div>}
                </div>
              ))}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer><Button className="btn-primary-modern" onClick={handleClose3}>Close</Button></Modal.Footer>
      </Modal>

      <Modal show={show4} onHide={handleClose4} centered size="lg">
        <Modal.Header closeButton><Modal.Title>Add Description</Modal.Title></Modal.Header>
        <Modal.Body>
          <Row className="mb-2"><Col md={4}><Form.Label>Product ID</Form.Label><Form.Control onChange={e => setValues1({ ...values1, pid: e.target.value })} /></Col><Col md={4}><Form.Label>Size</Form.Label><Form.Control onChange={e => setValues1({ ...values1, size: e.target.value })} /></Col><Col md={4}><Form.Label>Weight</Form.Label><Form.Control onChange={e => setValues1({ ...values1, weight: e.target.value })} /></Col></Row>
          <Row className="mb-2"><Col md={4}><Form.Label>RAM</Form.Label><Form.Control onChange={e => setValues1({ ...values1, ram: e.target.value })} /></Col><Col md={4}><Form.Label>Screen</Form.Label><Form.Control onChange={e => setValues1({ ...values1, screen: e.target.value })} /></Col><Col md={4}><Form.Label>ROM</Form.Label><Form.Control onChange={e => setValues1({ ...values1, rom: e.target.value })} /></Col></Row>
          <Row className="mb-2"><Col md={4}><Form.Label>Processor</Form.Label><Form.Control onChange={e => setValues1({ ...values1, processor: e.target.value })} /></Col><Col md={4}><Form.Label>MFG Date</Form.Label><Form.Control type="date" onChange={e => setValues1({ ...values1, mfg_date: e.target.value })} /></Col><Col md={4}><Form.Label>Material</Form.Label><Form.Control onChange={e => setValues1({ ...values1, material: e.target.value })} /></Col></Row>
          <Row className="mb-2"><Col md={6}><Form.Label>Country of Origin</Form.Label><Form.Control onChange={e => setValues1({ ...values1, country_of_origin: e.target.value })} /></Col><Col md={6}><Form.Label>Description</Form.Label><Form.Control as="textarea" rows={2} onChange={e => setValues1({ ...values1, description: e.target.value })} /></Col></Row>
        </Modal.Body>
        <Modal.Footer><Button className="btn-primary-modern" onClick={handleSubmit1}>Save Description</Button></Modal.Footer>
      </Modal>

      <Modal show={show5} onHide={handleClose5} centered size="lg">
        <Modal.Header closeButton><Modal.Title>Update Description</Modal.Title></Modal.Header>
        <Modal.Body>
          <Row className="mb-2"><Col md={4}><Form.Label>Product ID</Form.Label><Form.Control value={dupdate} disabled /></Col><Col md={4}><Form.Label>Size</Form.Label><Form.Control onChange={e => setDescription({ ...description, size: e.target.value })} /></Col><Col md={4}><Form.Label>Weight</Form.Label><Form.Control onChange={e => setDescription({ ...description, weight: e.target.value })} /></Col></Row>
          <Row className="mb-2"><Col md={4}><Form.Label>RAM</Form.Label><Form.Control onChange={e => setDescription({ ...description, ram: e.target.value })} /></Col><Col md={4}><Form.Label>Screen</Form.Label><Form.Control onChange={e => setDescription({ ...description, screen: e.target.value })} /></Col><Col md={4}><Form.Label>ROM</Form.Label><Form.Control onChange={e => setDescription({ ...description, rom: e.target.value })} /></Col></Row>
          <Row className="mb-2"><Col md={4}><Form.Label>Processor</Form.Label><Form.Control onChange={e => setDescription({ ...description, processor: e.target.value })} /></Col><Col md={4}><Form.Label>MFG Date</Form.Label><Form.Control type="date" onChange={e => setDescription({ ...description, mfg_date: e.target.value })} /></Col><Col md={4}><Form.Label>Material</Form.Label><Form.Control onChange={e => setDescription({ ...description, material: e.target.value })} /></Col></Row>
          <Row className="mb-2"><Col md={6}><Form.Label>Country of Origin</Form.Label><Form.Control onChange={e => setDescription({ ...description, country_of_origin: e.target.value })} /></Col><Col md={6}><Form.Label>Description</Form.Label><Form.Control as="textarea" rows={2} onChange={e => setDescription({ ...description, description: e.target.value })} /></Col></Row>
        </Modal.Body>
        <Modal.Footer><Button className="btn-primary-modern" onClick={() => UpdateDescription(dupdate)}>Save Changes</Button></Modal.Footer>
      </Modal>

      <Modal show={show6} onHide={handleClose6} centered>
        <Modal.Header closeButton><Modal.Title>Product Images</Modal.Title></Modal.Header>
        <Modal.Body>
          {datass.length === 0 ? <EmptyState title="No images" message="No images uploaded for this product." /> : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: 10 }}>
              {datass.map((img, i) => (
                <div key={i} style={{ borderRadius: 'var(--radius)', overflow: 'hidden', border: '1px solid var(--border-light)' }}>
                  {typeof img === 'string' ? (
                    <img src={img} alt="" style={{ width: '100%', height: 140, objectFit: 'cover' }} />
                  ) : (
                    <div style={{ padding: 10, fontSize: '0.85rem' }}>
                      <div><strong>Image:</strong> {img.image}</div>
                      {img.colour && <div><strong>Colour:</strong> {img.colour}</div>}
                      {img.description && <div><strong>Description:</strong> {img.description}</div>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer><Button className="btn-primary-modern" onClick={handleClose6}>Close</Button></Modal.Footer>
      </Modal>

      <Modal show={show7} onHide={handleClose7} centered>
        <Modal.Header closeButton><Modal.Title>Add Product Image</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3"><Form.Label>Product ID</Form.Label><Form.Control onChange={e => setValues2({ ...values2, pid: e.target.value })} /></Form.Group>
          <Form.Group className="mb-3"><Form.Label>Image ID</Form.Label><Form.Control onChange={e => setValues2({ ...values2, imgid: e.target.value })} /></Form.Group>
          <Form.Group className="mb-3"><Form.Label>Image</Form.Label><Form.Control type="file" onChange={e => setImage1(e.target.files[0])} /></Form.Group>
          <Form.Group className="mb-3"><Form.Label>Description</Form.Label><Form.Control onChange={e => setValues2({ ...values2, description: e.target.value })} /></Form.Group>
          <Form.Group className="mb-3"><Form.Label>Colour</Form.Label><Form.Control onChange={e => setValues2({ ...values2, colour: e.target.value })} /></Form.Group>
        </Modal.Body>
        <Modal.Footer><Button className="btn-primary-modern" onClick={handleSubmit2}>Upload</Button></Modal.Footer>
      </Modal>

      <Modal show={show8} onHide={handleClose8} centered>
        <Modal.Header closeButton><Modal.Title>Update Image</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3"><Form.Label>Image ID</Form.Label><Form.Control onChange={e => setImage({ ...image, imgid: e.target.value })} /></Form.Group>
          <Form.Group className="mb-3"><Form.Label>New Image</Form.Label><Form.Control type="file" onChange={e => setImage1(e.target.files[0])} /></Form.Group>
          <Form.Group className="mb-3"><Form.Label>Description</Form.Label><Form.Control as="textarea" rows={2} onChange={e => setImage({ ...image, description: e.target.value })} /></Form.Group>
          <Form.Group className="mb-3"><Form.Label>Colour</Form.Label><Form.Control onChange={e => setImage({ ...image, colour: e.target.value })} /></Form.Group>
        </Modal.Body>
        <Modal.Footer><Button className="btn-primary-modern" onClick={() => UpdateImage(image.imgid)}>Save Changes</Button></Modal.Footer>
      </Modal>
    </DashboardLayout>
  );
}
