import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { API_BASE } from '../apiBase'

const API = `${API_BASE}/api/admin`

function User() {
  const [data, setData] = useState([])
  const [roledata, setroledata] = useState([])
  const [showEdit, setShowEdit] = useState(false)
  const [values, setValues] = useState({})
  const [showDelete, setShowDelete] = useState(false)
  const [deleteUid, setDeleteUid] = useState(null)
  const [showRole, setShowRole] = useState(false)
  const [roleUid, setRoleUid] = useState(null)
  const [selectedRole, setSelectedRole] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  useEffect(() => {
    fetchUsers()
    fetchRoles()
  }, [])

  const fetchUsers = () => {
    axios.get(`${API}/viewuser`)
      .then((res) => setData(res.data))
      .catch((err) => console.log(err))
  }

  const fetchRoles = () => {
    axios.get(`${API}/roles/viewroles`)
      .then((res) => setroledata(res.data))
      .catch((err) => console.log(err))
  }

  const getRoleLabel = (user) => {
    const roleName = String(user?.rolename || '').trim()
    return roleName || 'No Role'
  }

  const isUserActive = (user) => String(user?.status || '').toLowerCase() === 'active'

  const handleUpdate = () => {
    const { uid, name, email, mobile, address, city, state, pin, country } = values
    axios.put(`${API}/userupdate/${uid}`, { name, email, mobile, address, city, state, pin, country })
      .then(() => { setShowEdit(false); fetchUsers(); alert('User updated') })
      .catch((err) => { console.log(err); alert('Update failed') })
  }

  const handleDelete = () => {
    axios.delete(`${API}/deleteuser/${deleteUid}`)
      .then(() => { setShowDelete(false); setDeleteUid(null); fetchUsers(); alert('User deleted') })
      .catch((err) => { console.log(err); alert('Delete failed') })
  }

  const activateUser = (uid) => {
    axios.put(`${API}/activestatus/${uid}`)
      .then(() => fetchUsers())
      .catch((err) => console.log(err))
  }

  const deactivateUser = (uid) => {
    axios.put(`${API}/deactivestatus/${uid}`)
      .then(() => fetchUsers())
      .catch((err) => console.log(err))
  }

  const handleAssignRole = () => {
    if (!selectedRole) { alert('Please select a role'); return }
    axios.post(`${API}/roleassign/grantrole`, { uid: roleUid, rolename: selectedRole })
      .then(() => { setShowRole(false); setSelectedRole(''); fetchUsers(); alert('Role assigned') })
      .catch((err) => { console.log(err); alert(err.response?.data?.error || 'Failed to assign role') })
  }

  const handleRevokeRole = (uid, roleid) => {
    if (!roleid) { alert('No role assigned to revoke'); return }
    if (!window.confirm('Revoke this user\'s role?')) return
    axios.delete(`${API}/roleassign/revokerole/${uid}/${roleid}`)
      .then(() => { fetchUsers(); alert('Role revoked') })
      .catch((err) => { console.log(err); alert(err.response?.data?.error || 'Failed to revoke role') })
  }

  var filtered = data.filter((u) => {
    var term = searchTerm.toLowerCase()
    return (u.name || '').toLowerCase().includes(term) || (u.email || '').toLowerCase().includes(term) || (u.mobile || '').toLowerCase().includes(term) || (u.city || '').toLowerCase().includes(term)
  })
  var totalPages = Math.ceil(filtered.length / itemsPerPage)
  var currentItems = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div className='page-wrapper'>
      <div className='page-header'>
        <h3>Users</h3>
        <div className='page-header-actions'>
          <Link to='/adduser'><button className='btn-teal'>+ Add User</button></Link>
          <input type='text' className='admin-input search-input' placeholder='Search users...' value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1) }} />
        </div>
      </div>
      <div className='admin-table-wrap'>
        <table className='admin-table'>
          <thead>
            <tr>
              <th>UID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>City</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length === 0 ? (
              <tr><td colSpan='8' style={{ textAlign: 'center', padding: '24px', color: 'var(--text3)' }}>No users found</td></tr>
            ) : currentItems.map((u) => (
              <tr key={u.uid}>
                <td>{u.uid}</td>
                <td style={{ fontWeight: 500 }}>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.mobile}</td>
                <td>{u.city || '—'}</td>
                <td>
                  {String(u.rolename || '').trim() ? (
                    <span className='badge badge-role'>{getRoleLabel(u)}</span>
                  ) : (
                    <span className='badge badge-no-role'>{getRoleLabel(u)}</span>
                  )}
                </td>
                <td>
                  {isUserActive(u) ? (
                    <button type='button' className='badge badge-status badge-active clickable-badge' onClick={() => deactivateUser(u.uid)}>
                      Active
                    </button>
                  ) : (
                    <button type='button' className='badge badge-status badge-inactive clickable-badge' onClick={() => activateUser(u.uid)}>
                      Inactive
                    </button>
                  )
                  }
                </td>
                <td>
                  <div className='action-btns'>
                    <button className='btn-warning-custom' onClick={() => { setValues({ ...u }); setShowEdit(true) }}>Edit</button>
                    <button className='btn-danger btn-sm' onClick={() => { setDeleteUid(u.uid); setShowDelete(true) }}>Delete</button>
                    <button className='btn-info-custom' onClick={() => { setRoleUid(u.uid); setSelectedRole(''); setShowRole(true) }}>Role</button>
                    {u.roleid && String(u.rolename || '').trim() && (
                      <button className='btn-secondary-custom' onClick={() => handleRevokeRole(u.uid, u.roleid)}>Revoke</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className='admin-pagination'>
          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i + 1} className={currentPage === i + 1 ? 'active' : ''} onClick={() => setCurrentPage(i + 1)}>
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {showEdit && (
        <div className='modal-overlay' onClick={() => setShowEdit(false)}>
          <div className='modal-box' onClick={(e) => e.stopPropagation()}>
            <div className='modal-head'>
              <h4>Edit User</h4>
              <button onClick={() => setShowEdit(false)}>&times;</button>
            </div>
            <div className='modal-body'>
              <div className='form-grid'>
                <div><label className='admin-label'>Name</label><input className='admin-input' value={values.name || ''} onChange={(e) => setValues({ ...values, name: e.target.value })} /></div>
                <div><label className='admin-label'>Email</label><input className='admin-input' value={values.email || ''} onChange={(e) => setValues({ ...values, email: e.target.value })} /></div>
                <div><label className='admin-label'>Mobile</label><input className='admin-input' value={values.mobile || ''} onChange={(e) => setValues({ ...values, mobile: e.target.value })} /></div>
                <div><label className='admin-label'>City</label><input className='admin-input' value={values.city || ''} onChange={(e) => setValues({ ...values, city: e.target.value })} /></div>
                <div><label className='admin-label'>State</label><input className='admin-input' value={values.state || ''} onChange={(e) => setValues({ ...values, state: e.target.value })} /></div>
                <div><label className='admin-label'>Country</label><input className='admin-input' value={values.country || ''} onChange={(e) => setValues({ ...values, country: e.target.value })} /></div>
                <div><label className='admin-label'>Pin</label><input className='admin-input' value={values.pin || ''} onChange={(e) => setValues({ ...values, pin: e.target.value })} /></div>
                <div><label className='admin-label'>Address</label><input className='admin-input' value={values.address || ''} onChange={(e) => setValues({ ...values, address: e.target.value })} /></div>
              </div>
            </div>
            <div className='modal-foot'>
              <button className='btn-outline' onClick={() => setShowEdit(false)}>Cancel</button>
              <button className='btn-teal' onClick={handleUpdate}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDelete && (
        <div className='modal-overlay' onClick={() => setShowDelete(false)}>
          <div className='modal-box' onClick={(e) => e.stopPropagation()}>
            <div className='modal-head'>
              <h4>Delete User</h4>
              <button onClick={() => setShowDelete(false)}>&times;</button>
            </div>
            <div className='modal-body'>
              <p>Are you sure you want to delete this user? This action cannot be undone.</p>
            </div>
            <div className='modal-foot'>
              <button className='btn-outline' onClick={() => setShowDelete(false)}>Cancel</button>
              <button className='btn-danger' onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Role Modal */}
      {showRole && (
        <div className='modal-overlay' onClick={() => setShowRole(false)}>
          <div className='modal-box' onClick={(e) => e.stopPropagation()}>
            <div className='modal-head'>
              <h4>Assign Role</h4>
              <button onClick={() => setShowRole(false)}>&times;</button>
            </div>
            <div className='modal-body'>
              <div>
                <label className='admin-label'>Select Role</label>
                <select className='admin-input' value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
                  <option value=''>-- Select Role --</option>
                  {roledata.map((r, i) => (
                    <option key={i} value={r.rolename}>{r.rolename}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className='modal-foot'>
              <button className='btn-outline' onClick={() => setShowRole(false)}>Cancel</button>
              <button className='btn-teal' onClick={handleAssignRole}>Assign Role</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default User
