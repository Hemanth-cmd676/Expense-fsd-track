// EditProfile.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const EditProfile = () => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '', // optional
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/users/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setForm({ name: res.data.name, email: res.data.email, password: '' });
      } catch (err) {
        console.error('Failed to fetch user info', err);
      }
    };
    fetchUser();
  }, [token]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      // Only send password if filled
      const updateData = { name: form.name, email: form.email };
      if (form.password.trim()) updateData.password = form.password;

      await axios.put('http://localhost:5000/api/users/me', updateData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Profile updated successfully!');
      navigate('/profile');
    } catch (err) {
      console.error('Failed to update profile', err);
      alert('Failed to update profile');
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h2>Edit Profile</h2>
        <form onSubmit={handleSubmit} className="edit-profile-form">
          <div>
            <label>Name:</label><br />
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Email:</label><br />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>New Password (leave blank to keep current):</label><br />
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
            />
          </div>
          <button type="submit" style={{ marginTop: '1rem' }}>Save Changes</button>
        </form>
      </div>
    </>
  );
};

export default EditProfile;
