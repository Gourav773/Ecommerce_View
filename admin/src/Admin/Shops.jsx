import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { API_BASE } from '../apiBase'

function Shops() {
  const [data, setData] = useState([])

  useEffect(() => {
    axios.get(`${API_BASE}/api/admin/viewshops`)
      .then((res) => setData(res.data.result || res.data))
      .catch((err) => console.log(err))
  }, [])

  return (
    <div className='page-wrapper'>
      <div className='page-header'>
        <h3>Products / Shops</h3>
      </div>
      <div className='admin-table-wrap'>
        <table className='admin-table'>
          <thead>
            <tr>
              <th>#</th><th>Reg No</th><th>Shop Name</th><th>Owner</th>
              <th>Contact</th><th>Email</th><th>City</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan='8' style={{ textAlign: 'center', padding: '24px', color: 'var(--text3)' }}>No shops found</td>
              </tr>
            ) : data.map((shop, i) => (
              <tr key={shop.regno || i}>
                <td>{i + 1}</td>
                <td>{shop.regno || '—'}</td>
                <td style={{ fontWeight: 500 }}>{shop.shop_name || '—'}</td>
                <td>{shop.owner_name || '—'}</td>
                <td>{shop.contact || shop.mobile || '—'}</td>
                <td>{shop.email || '—'}</td>
                <td>{shop.city || '—'}</td>
                <td>
                  <span className={`badge ${String(shop.status || '').toLowerCase() === 'active' ? 'badge-active' : 'badge-inactive'}`}>
                    {shop.status || 'N/A'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Shops
