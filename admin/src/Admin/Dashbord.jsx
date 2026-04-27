import React, { useEffect, useState } from 'react'
import { BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill } from 'react-icons/bs'
import CountUp from 'react-countup'
import { Chart } from 'react-google-charts'
import axios from 'axios'
import { API_BASE } from '../apiBase'
import './Dashbord.css'

function Dashboard() {
  const [userdata, setUserdata] = useState([])
  const [chartHeight, setChartHeight] = useState('400px')

  useEffect(() => {
    axios.get(`${API_BASE}/api/admin/viewuser`)
      .then((res) => setUserdata(res.data))
      .catch((err) => console.log(err))
  }, [])

  useEffect(() => {
    const handleResize = () => {
      setChartHeight(window.innerWidth <= 576 ? '250px' : window.innerWidth <= 768 ? '300px' : '400px')
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const data = [
    ["Task", "Hours per Day"],
    ["Espresso", 11],
    ["Americano", 2],
    ["Latte", 2],
    ["Cappuccino", 2],
    ["Mocha", 7],
  ]

  const options = {
    title: "My Daily Activities",
    is3D: true,
    backgroundColor: 'transparent',
    chartArea: { width: '90%', height: '80%' },
    legend: { textStyle: { fontName: 'DM Sans', fontSize: 13 } },
    titleTextStyle: { fontName: 'Playfair Display', fontSize: 16 },
  }

  return (
    <main className='dash-wrap'>
      <div className='dash-title'>
        <h3>Dashboard</h3>
      </div>
      <div className='stat-cards'>
        <div className='stat-card'>
          <div className='stat-header'>
            <span className='stat-label'>Salary</span>
            <div className='stat-icon'><BsFillArchiveFill /></div>
          </div>
          <span className='stat-value'><CountUp end={87} duration={2} /></span>
        </div>
        <div className='stat-card'>
          <div className='stat-header'>
            <span className='stat-label'>Products</span>
            <div className='stat-icon'><BsFillGrid3X3GapFill /></div>
          </div>
          <span className='stat-value'><CountUp end={125} duration={2} /></span>
        </div>
        <div className='stat-card'>
          <div className='stat-header'>
            <span className='stat-label'>Revenue</span>
            <div className='stat-icon'><BsPeopleFill /></div>
          </div>
          <span className='stat-value'><CountUp end={3600000} duration={2} separator="," prefix="₹" /></span>
        </div>
        <div className='stat-card'>
          <div className='stat-header'>
            <span className='stat-label'>Alerts</span>
            <div className='stat-icon'><BsFillBellFill /></div>
          </div>
          <span className='stat-value'><CountUp end={42} duration={2} /></span>
        </div>
      </div>
      <div className='dash-chart'>
        <Chart
          chartType="PieChart"
          data={data}
          options={options}
          width={"100%"}
          height={chartHeight}
        />
      </div>
      <div className='dash-table-section'>
        <h3>Recent Users</h3>
        <div className='admin-table-wrap' style={{ border: 'none', borderRadius: 0 }}>
          <table className='admin-table'>
            <thead>
              <tr>
                <th>UID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {userdata.map((u, i) => (
                <tr key={i}>
                  <td>{u.uid}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.mobile}</td>
                  <td>
                    <span className={`badge ${u.status === 'active' ? 'badge-active' : 'badge-inactive'}`}>
                      {u.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}

export default Dashboard
