import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { API_BASE } from '../apiBase'

function Roles() {
  const [data, setData] = useState([])
  const [newRole, setNewRole] = useState({ roleid: '', rolename: '' })
  const [showEdit, setShowEdit] = useState(false)
  const [editValues, setEditValues] = useState({ roleid: '', rolename: '' })
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  useEffect(() => { fetchRoles() }, [])

  const fetchRoles = () => {
    axios.get(`${API_BASE}/api/admin/roles/viewroles`)
      .then((res) => setData(res.data))
      .catch((err) => console.log(err))
  }

  const handleInputChange = (e) => {
    setNewRole({ ...newRole, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    axios.post(`${API_BASE}/api/admin/roles/newrole`, newRole)
      .then(() => { setNewRole({ roleid: '', rolename: '' }); fetchRoles() })
      .catch((err) => console.log(err))
  }

  const handleUpdate = () => {
    axios.patch(`${API_BASE}/api/admin/roles/updaterole/` + editValues.roleid, editValues)
      .then(() => { setShowEdit(false); fetchRoles() })
      .catch((err) => console.log(err))
  }

  var totalPages = Math.ceil(data.length / itemsPerPage)
  var currentItems = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div className='page-wrapper'>
      <div className='page-header'>
        <h3>Roles</h3>
      </div>
      <div className='split-layout'>
        <div className='admin-card'>
          <div className='card-title'>Add Role</div>
          <form onSubmit={handleSubmit}>
            <div className='form-stack'>
              <div><label className='admin-label'>Role ID</label><input type='text' className='admin-input' name='roleid' value={newRole.roleid} onChange={handleInputChange} /></div>
              <div><label className='admin-label'>Role Name</label><input type='text' className='admin-input' name='rolename' value={newRole.rolename} onChange={handleInputChange} /></div>
              <button type='submit' className='btn-teal form-submit-btn'>Add Role</button>
            </div>
          </form>
        </div>
        <div className='split-table-section'>
          <div className='admin-table-wrap'>
            <table className='admin-table'>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Role ID</th>
                  <th>Role Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((r, i) => (
                  <tr key={i}>
                    <td>{(currentPage - 1) * itemsPerPage + i + 1}</td>
                    <td>{r.roleid}</td>
                    <td style={{ fontWeight: 500 }}>{r.rolename}</td>
                    <td>
                      <button className='btn-warning-custom' onClick={() => { setEditValues({ ...r }); setShowEdit(true) }}>Edit</button>
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
              <h4>Edit Role</h4>
              <button onClick={() => setShowEdit(false)}>&times;</button>
            </div>
            <div className='modal-body'>
              <div><label className='admin-label'>Role ID</label><input className='admin-input' value={editValues.roleid} disabled /></div>
              <div><label className='admin-label'>Role Name</label><input className='admin-input' value={editValues.rolename} onChange={(e) => setEditValues({ ...editValues, rolename: e.target.value })} /></div>
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

export default Roles
