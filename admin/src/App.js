import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Admin/Login';
import Sidebar from './Admin/Sidebar';
import Dashboard from './Admin/Dashbord';
import User from './Admin/Users';
import Adduser from './Admin/AddUser';
import Roles from './Admin/Roles';
import Category from './Admin/Category';
import Subcategory from './Admin/Subcategory';
import Shops from './Admin/Shops';
import Offers from './Admin/Offers';
import Charts from './Admin/Charts';
import './App.css';

function PrivateRoute({ children }) {
  const user = localStorage.getItem('adminUser');
  return user ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<PrivateRoute><Sidebar /></PrivateRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="charts" element={<Charts />} />
          <Route path="user" element={<User />} />
          <Route path="adduser" element={<Adduser />} />
          <Route path="role" element={<Roles />} />
          <Route path="category" element={<Category />} />
          <Route path="addSubCategory" element={<Subcategory />} />
          <Route path="offers" element={<Offers />} />
          <Route path="shops" element={<Shops />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
