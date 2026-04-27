import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { API_BASE } from '../apiBase'

function Category() {
  const [data, setData] = useState([])
  const [newCat, setNewCat] = useState({ Pcategoryid: '', Categoryname: '' })
  const [showEdit, setShowEdit] = useState(false)
  const [editValues, setEditValues] = useState({ Pcategoryid: '', Categoryname: '' })
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  useEffect(() => { fetchData() }, [])

  const fetchData = () => {
    axios.get(`${API_BASE}/api/admin/category/viewcategory`)
      .then((res) => setData(res.data))
      .catch((err) => console.log(err))
  }

  const handleAdd = (e) => {
    e.preventDefault()
    axios.post(`${API_BASE}/api/admin/category/addcategory`, newCat)
      .then(() => { setNewCat({ Pcategoryid: '', Categoryname: '' }); fetchData() })
      .catch((err) => console.log(err))
  }

  const handleUpdate = () => {
    axios.patch(`${API_BASE}/api/admin/category/updatecategory/` + editValues.Pcategoryid, editValues)
      .then(() => { setShowEdit(false); fetchData() })
      .catch((err) => console.log(err))
  }

  var filtered = data.filter((c) => (c.Categoryname || '').toLowerCase().includes(searchTerm.toLowerCase()))
  var totalPages = Math.ceil(filtered.length / itemsPerPage)
  var currentItems = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div className='page-wrapper'>
      <div className='page-header'>
        <h3>Categories</h3>
      </div>
      <div className='split-layout'>
        <div className='admin-card'>
          <div className='card-title'>Add Category</div>
          <form onSubmit={handleAdd}>
            <div className='form-stack'>
              <div><label className='admin-label'>Category ID</label><input type='text' className='admin-input' value={newCat.Pcategoryid} onChange={(e) => setNewCat({ ...newCat, Pcategoryid: e.target.value })} /></div>
              <div><label className='admin-label'>Category Name</label><input type='text' className='admin-input' value={newCat.Categoryname} onChange={(e) => setNewCat({ ...newCat, Categoryname: e.target.value })} /></div>
              <button type='submit' className='btn-teal form-submit-btn'>Add</button>
            </div>
          </form>
        </div>
        <div className='split-table-section'>
          <input type='text' className='admin-input search-input' placeholder='Search categories...' value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1) }} />
          <div className='admin-table-wrap'>
            <table className='admin-table'>
              <thead>
                <tr><th>#</th><th>Category ID</th><th>Category Name</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {currentItems.map((c, i) => (
                  <tr key={i}>
                    <td>{(currentPage - 1) * itemsPerPage + i + 1}</td>
                    <td>{c.Pcategoryid}</td>
                    <td style={{ fontWeight: 500 }}>{c.Categoryname}</td>
                    <td>
                      <button className='btn-warning-custom' onClick={() => { setEditValues({ ...c }); setShowEdit(true) }}>Edit</button>
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
        </div>
      </div>

      {showEdit && (
        <div className='modal-overlay' onClick={() => setShowEdit(false)}>
          <div className='modal-box' onClick={(e) => e.stopPropagation()}>
            <div className='modal-head'>
              <h4>Edit Category</h4>
              <button onClick={() => setShowEdit(false)}>&times;</button>
            </div>
            <div className='modal-body'>
              <div><label className='admin-label'>Category ID</label><input className='admin-input' value={editValues.Pcategoryid} disabled /></div>
              <div><label className='admin-label'>Category Name</label><input className='admin-input' value={editValues.Categoryname} onChange={(e) => setEditValues({ ...editValues, Categoryname: e.target.value })} /></div>
            </div>
            <div className='modal-foot'>
              <button className='btn-outline' onClick={() => setShowEdit(false)}>Close</button>
              <button className='btn-teal' onClick={handleUpdate}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Category
