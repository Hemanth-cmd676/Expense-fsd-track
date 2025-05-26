import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Group from './pages/Group';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
// import Dashboard from './pages/Dashboard'; // to be added

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home/>}/>
        <Route path="/group" element={<Group/>}/>
        <Route path="/profile" element={<Profile />} />
<Route path="/edit-profile" element={<EditProfile />} />

      </Routes>
    </Router>
  );
}

export default App;
