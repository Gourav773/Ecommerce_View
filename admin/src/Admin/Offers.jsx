import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { API_BASE } from '../apiBase'

function Offers() {
  const [data, setData] = useState([])
  const [activeTab, setActiveTab] = useState('view')
  const [updatingOfferId, setUpdatingOfferId] = useState(null)
  const [newOffer, setNewOffer] = useState({
    offerid: '', offername: '', percentage_discount: '', flat_discount: '',
    upto_discount: '', valid_from: '', valid_to: '', terms_and_condition: '', status: 'active'
  })
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  useEffect(() => { fetchData() }, [])

  const fetchData = () => {
    axios.get(`${API_BASE}/api/admin/offer/viewoffer`)
      .then((res) => setData(res.data))
      .catch((err) => console.log(err))
  }

  const handleAdd = (e) => {
    e.preventDefault()
    axios.post(`${API_BASE}/api/admin/offer/createoffer`, newOffer)
      .then(() => {
        setNewOffer({ offerid: '', offername: '', percentage_discount: '', flat_discount: '', upto_discount: '', valid_from: '', valid_to: '', terms_and_condition: '', status: 'active' })
        fetchData()
        setActiveTab('view')
      })
      .catch((err) => console.log(err))
  }

  const handleToggleStatus = async (offer) => {
    const nextStatus = String(offer.status || '').toLowerCase() === 'active' ? 'inactive' : 'active'
    setUpdatingOfferId(offer.offerid)

    try {
      await axios.put(`${API_BASE}/api/admin/offer/updatestatus/${offer.offerid}`, { status: nextStatus })
      fetchData()
    } catch (err) {
      console.log(err)
      alert(err.response?.data?.error || 'Failed to update offer status')
    } finally {
      setUpdatingOfferId(null)
    }
  }

  var totalPages = Math.ceil(data.length / itemsPerPage)
  var currentItems = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div className='page-wrapper'>
      <div className='page-header'>
        <h3>Offers</h3>
      </div>
      <div className='admin-tabs'>
        <button className={activeTab === 'view' ? 'active' : ''} onClick={() => setActiveTab('view')}>View Offers</button>
        <button className={activeTab === 'add' ? 'active' : ''} onClick={() => setActiveTab('add')}>Add Offer</button>
      </div>

      {activeTab === 'view' && (
        <>
          <div className='admin-table-wrap'>
            <table className='admin-table'>
              <thead>
                <tr>
                  <th>ID</th><th>Name</th><th>% Off</th><th>Flat</th><th>Upto</th>
                  <th>From</th><th>To</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((o) => (
                  <tr key={o.offerid}>
                    <td>{o.offerid}</td>
                    <td style={{ fontWeight: 500 }}>{o.offername}</td>
                    <td>{o.percentage_discount}%</td>
                    <td>{o.flat_discount}</td>
                    <td>{o.upto_discount}</td>
                    <td>{o.valid_from}</td>
                    <td>{o.valid_to}</td>
                    <td>
                      <button
                        type='button'
                        className={`badge badge-status ${String(o.status || '').toLowerCase() === 'active' ? 'badge-active' : 'badge-inactive'} clickable-badge`}
                        onClick={() => handleToggleStatus(o)}
                        disabled={updatingOfferId === o.offerid}
                      >
                        {updatingOfferId === o.offerid ? 'Updating...' : (o.status || 'inactive')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className='admin-pagination'>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i + 1} className={currentPage === i + 1 ? 'active' : ''} onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
            ))}
          </div>
        </>
      )}

      {activeTab === 'add' && (
        <div className='admin-card'>
          <form onSubmit={handleAdd}>
            <div className='form-grid'>
              <div><label className='admin-label'>Offer ID</label><input type='text' className='admin-input' value={newOffer.offerid} onChange={(e) => setNewOffer({ ...newOffer, offerid: e.target.value })} /></div>
              <div><label className='admin-label'>Offer Name</label><input type='text' className='admin-input' value={newOffer.offername} onChange={(e) => setNewOffer({ ...newOffer, offername: e.target.value })} /></div>
              <div><label className='admin-label'>% Discount</label><input type='number' className='admin-input' value={newOffer.percentage_discount} onChange={(e) => setNewOffer({ ...newOffer, percentage_discount: e.target.value })} /></div>
              <div><label className='admin-label'>Flat Discount</label><input type='number' className='admin-input' value={newOffer.flat_discount} onChange={(e) => setNewOffer({ ...newOffer, flat_discount: e.target.value })} /></div>
            </div>
            <div className='form-grid' style={{ marginTop: 16 }}>
              <div><label className='admin-label'>Upto Discount</label><input type='number' className='admin-input' value={newOffer.upto_discount} onChange={(e) => setNewOffer({ ...newOffer, upto_discount: e.target.value })} /></div>
              <div>
                <label className='admin-label'>Status</label>
                <select className='admin-input' value={newOffer.status} onChange={(e) => setNewOffer({ ...newOffer, status: e.target.value })}>
                  <option value='active'>Active</option>
                  <option value='inactive'>Inactive</option>
                </select>
              </div>
              <div><label className='admin-label'>Valid From</label><input type='date' className='admin-input' value={newOffer.valid_from} onChange={(e) => setNewOffer({ ...newOffer, valid_from: e.target.value })} /></div>
              <div><label className='admin-label'>Valid To</label><input type='date' className='admin-input' value={newOffer.valid_to} onChange={(e) => setNewOffer({ ...newOffer, valid_to: e.target.value })} /></div>
            </div>
            <div style={{ marginTop: 16 }}>
              <label className='admin-label'>Terms & Conditions</label>
              <textarea className='admin-input' rows='3' style={{ resize: 'vertical' }} value={newOffer.terms_and_condition} onChange={(e) => setNewOffer({ ...newOffer, terms_and_condition: e.target.value })} />
            </div>
            <div style={{ marginTop: 20 }}>
              <button type='submit' className='btn-teal'>Create Offer</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default Offers
