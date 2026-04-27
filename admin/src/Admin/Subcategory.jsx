import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { API_BASE } from '../apiBase'

function Subcategory() {
  const [data, setData] = useState([])
  const [categories, setCategories] = useState([])
  const [newSub, setNewSub] = useState({ Pcategoryid: '', Subcategoryid: '', Subcategoryname: '', photo: null })
  const [showEdit, setShowEdit] = useState(false)
  const [editValues, setEditValues] = useState({ Pcategoryid: '', Subcategoryid: '', Subcategoryname: '', photo: null, currentPhoto: '', originalSubcategoryid: '' })
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  useEffect(() => {
    fetchData()
    fetchCategories()
  }, [])

  const fetchData = () => {
    axios.get(`${API_BASE}/api/admin/subcategory/viewsubcat`)
      .then((res) => setData(res.data))
      .catch((err) => console.log(err))
  }

  const fetchCategories = () => {
    axios.get(`${API_BASE}/api/admin/category/viewcategory`)
      .then((res) => setCategories(res.data))
      .catch((err) => console.log(err))
  }

  const handleAdd = (e) => {
    e.preventDefault()
    var fd = new FormData()
    fd.append('Pcategoryid', newSub.Pcategoryid)
    fd.append('Subcategoryid', newSub.Subcategoryid)
    fd.append('Subcategoryname', newSub.Subcategoryname)
    if (newSub.photo) fd.append('photo', newSub.photo)
    axios.post(`${API_BASE}/api/admin/subcategory/addsubcat`, fd)
      .then(() => { setNewSub({ Pcategoryid: '', Subcategoryid: '', Subcategoryname: '', photo: null }); fetchData() })
      .catch((err) => console.log(err))
  }

  const handleUpdate = () => {
    const fd = new FormData()
    fd.append('Pcategoryid', editValues.Pcategoryid || '')
    fd.append('Subcategoryid', editValues.Subcategoryid || '')
    fd.append('Subcategoryname', editValues.Subcategoryname || '')
    if (editValues.photo instanceof File) {
      fd.append('photo', editValues.photo)
    }

    axios.put(`${API_BASE}/api/admin/subcategory/updatesubcat/${editValues.originalSubcategoryid || editValues.Subcategoryid}`, fd)
      .then(() => {
        setShowEdit(false)
        setEditValues({ Pcategoryid: '', Subcategoryid: '', Subcategoryname: '', photo: null, currentPhoto: '', originalSubcategoryid: '' })
        fetchData()
      })
      .catch((err) => {
        console.log(err)
        alert(err.response?.data?.error || 'Failed to update subcategory')
      })
  }

  var filtered = data.filter((s) => (s.Subcategoryname || '').toLowerCase().includes(searchTerm.toLowerCase()))
  var totalPages = Math.ceil(filtered.length / itemsPerPage)
  var currentItems = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div className='page-wrapper'>
      <div className='page-header'>
        <h3>Subcategories</h3>
      </div>
      <div className='split-layout'>
        <div className='admin-card'>
          <div className='card-title'>Add Subcategory</div>
          <form onSubmit={handleAdd}>
            <div className='form-stack'>
              <div>
                <label className='admin-label'>Category</label>
                <select className='admin-input' value={newSub.Pcategoryid} onChange={(e) => setNewSub({ ...newSub, Pcategoryid: e.target.value })}>
                  <option value=''>-- Select --</option>
                  {categories.map((c, i) => (
                    <option key={i} value={c.Pcategoryid}>{c.Categoryname} ({c.Pcategoryid})</option>
                  ))}
                </select>
              </div>
              <div><label className='admin-label'>Subcategory ID</label><input type='text' className='admin-input' value={newSub.Subcategoryid} onChange={(e) => setNewSub({ ...newSub, Subcategoryid: e.target.value })} /></div>
              <div><label className='admin-label'>Subcategory Name</label><input type='text' className='admin-input' value={newSub.Subcategoryname} onChange={(e) => setNewSub({ ...newSub, Subcategoryname: e.target.value })} /></div>
              <div><label className='admin-label'>Photo</label><input type='file' className='admin-input' onChange={(e) => setNewSub({ ...newSub, photo: e.target.files[0] })} /></div>
              <button type='submit' className='btn-teal form-submit-btn'>Add</button>
            </div>
          </form>
        </div>
        <div className='split-table-section'>
          <input type='text' className='admin-input search-input' placeholder='Search subcategories...' value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1) }} />
          <div className='admin-table-wrap'>
            <table className='admin-table'>
              <thead>
                <tr><th>#</th><th>Cat ID</th><th>Sub ID</th><th>Name</th><th>Photo</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {currentItems.map((s, i) => (
                  <tr key={i}>
                    <td>{(currentPage - 1) * itemsPerPage + i + 1}</td>
                    <td>{s.Pcategoryid}</td>
                    <td>{s.Subcategoryid}</td>
                    <td style={{ fontWeight: 500 }}>{s.Subcategoryname}</td>
                    <td>{s.photo ? <img src={s.photo} alt='' className='table-thumb' /> : '—'}</td>
                    <td>
                      <button className='btn-warning-custom' onClick={() => {
                        setEditValues({
                          Pcategoryid: s.Pcategoryid || '',
                          Subcategoryid: s.Subcategoryid || '',
                          Subcategoryname: s.Subcategoryname || '',
                          photo: null,
                          currentPhoto: s.photo || '',
                          originalSubcategoryid: s.Subcategoryid || ''
                        })
                        setShowEdit(true)
                      }}>Edit</button>
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
              <h4>Edit Subcategory</h4>
              <button onClick={() => setShowEdit(false)}>&times;</button>
            </div>
            <div className='modal-body'>
              <div>
                <label className='admin-label'>Category</label>
                <select className='admin-input' value={editValues.Pcategoryid || ''} onChange={(e) => setEditValues({ ...editValues, Pcategoryid: e.target.value })}>
                  <option value=''>-- Select --</option>
                  {categories.map((c, i) => (
                    <option key={i} value={c.Pcategoryid}>{c.Categoryname} ({c.Pcategoryid})</option>
                  ))}
                </select>
              </div>
              <div><label className='admin-label'>Sub ID</label><input className='admin-input' value={editValues.Subcategoryid || ''} onChange={(e) => setEditValues({ ...editValues, Subcategoryid: e.target.value })} /></div>
              <div><label className='admin-label'>Name</label><input className='admin-input' value={editValues.Subcategoryname || ''} onChange={(e) => setEditValues({ ...editValues, Subcategoryname: e.target.value })} /></div>
              {editValues.currentPhoto && (
                <div>
                  <label className='admin-label'>Current Photo</label>
                  <div><img src={editValues.currentPhoto} alt='' className='table-thumb' /></div>
                </div>
              )}
              <div>
                <label className='admin-label'>New Photo</label>
                <input type='file' className='admin-input' onChange={(e) => setEditValues({ ...editValues, photo: e.target.files?.[0] || null })} />
              </div>
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

export default Subcategory
