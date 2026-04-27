import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { API_BASE } from '../apiBase'

function AddUser() {
  const navigate = useNavigate()
  const [data, setData] = useState({
    uid: '', name: '', email: '', password: '', mobile: '', photo: '',
    aadhaar: '', doj: '', qualification: '', dob: '', address: '',
    state: '', city: '', pin: '', status: 'active', country: ''
  })

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    var formdata = new FormData()
    Object.keys(data).forEach(key => {
      if (key !== 'photo') formdata.append(key, data[key])
    })
    if (data.photo) formdata.append('photo', data.photo)
    axios.post(`${API_BASE}/api/admin/adduser`, formdata)
      .then((res) => {
        console.log(res)
        alert('User added successfully')
        navigate('/user')
      })
      .catch((err) => {
        console.log(err)
        alert(err.response?.data?.error || 'Failed to add user')
      })
  }

  return (
    <div className='page-wrapper'>
      <div className='page-header'>
        <h3>Add User</h3>
      </div>
      <div className='admin-card'>
        <form onSubmit={handleSubmit}>
          <div className='form-grid'>
            <div><label className='admin-label'>UID</label><input type='text' className='admin-input' name='uid' value={data.uid} onChange={handleChange} /></div>
            <div><label className='admin-label'>Name</label><input type='text' className='admin-input' name='name' value={data.name} onChange={handleChange} /></div>
            <div><label className='admin-label'>Email</label><input type='email' className='admin-input' name='email' value={data.email} onChange={handleChange} /></div>
            <div><label className='admin-label'>Password</label><input type='password' className='admin-input' name='password' value={data.password} onChange={handleChange} /></div>
          </div>
          <div className='form-grid' style={{ marginTop: 16 }}>
            <div><label className='admin-label'>Mobile</label><input type='text' className='admin-input' name='mobile' value={data.mobile} onChange={handleChange} /></div>
            <div><label className='admin-label'>Photo</label><input type='file' className='admin-input' name='photo' onChange={(e) => setData({ ...data, photo: e.target.files[0] })} /></div>
            <div><label className='admin-label'>Aadhaar</label><input type='text' className='admin-input' name='aadhaar' value={data.aadhaar} onChange={handleChange} /></div>
            <div><label className='admin-label'>Date of Joining</label><input type='date' className='admin-input' name='doj' value={data.doj} onChange={handleChange} /></div>
          </div>
          <div className='form-grid' style={{ marginTop: 16 }}>
            <div><label className='admin-label'>Qualification</label><input type='text' className='admin-input' name='qualification' value={data.qualification} onChange={handleChange} /></div>
            <div><label className='admin-label'>Date of Birth</label><input type='date' className='admin-input' name='dob' value={data.dob} onChange={handleChange} /></div>
            <div><label className='admin-label'>Address</label><input type='text' className='admin-input' name='address' value={data.address} onChange={handleChange} /></div>
            <div><label className='admin-label'>State</label><input type='text' className='admin-input' name='state' value={data.state} onChange={handleChange} /></div>
          </div>
          <div className='form-grid' style={{ marginTop: 16 }}>
            <div><label className='admin-label'>City</label><input type='text' className='admin-input' name='city' value={data.city} onChange={handleChange} /></div>
            <div><label className='admin-label'>PIN</label><input type='text' className='admin-input' name='pin' value={data.pin} onChange={handleChange} /></div>
            <div>
              <label className='admin-label'>Status</label>
              <select className='admin-input' name='status' value={data.status} onChange={handleChange}>
                <option value='active'>Active</option>
                <option value='inactive'>Inactive</option>
              </select>
            </div>
            <div><label className='admin-label'>Country</label><input type='text' className='admin-input' name='country' value={data.country} onChange={handleChange} /></div>
          </div>
          <div style={{ marginTop: 24 }}>
            <button type='submit' className='btn-teal'>Submit</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddUser
