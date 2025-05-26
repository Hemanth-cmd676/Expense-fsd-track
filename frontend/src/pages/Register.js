import React, { useState } from 'react';
import axios from 'axios';

const styles = {
  container: {
    maxWidth: '400px',
    margin: '3rem auto',
    padding: '2rem',
    backgroundColor: '#f9f5f0',  // cream
    borderRadius: '12px',
    boxShadow: '0 8px 20px rgba(91, 58, 41, 0.15)', // soft brown shadow
    fontFamily: "'Georgia', serif",
    color: '#5b3a29', // deep brown text
    letterSpacing: '0.03em',
  },
  heading: {
    textAlign: 'center',
    fontSize: '2.2rem',
    marginBottom: '1.5rem',
    fontWeight: '600',
    borderBottom: '2px solid #5b3a29',
    paddingBottom: '0.5rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem',
  },
  input: {
    padding: '0.8rem 1rem',
    fontSize: '1rem',
    borderRadius: '8px',
    border: '2px solid #5b3a29',
    backgroundColor: '#fcf9f7',
    color: '#5b3a29',
    fontFamily: "'Georgia', serif",
    transition: 'border-color 0.3s ease',
  },
  inputFocus: {
    borderColor: '#a1745f',
    outline: 'none',
    boxShadow: '0 0 8px rgba(161, 116, 95, 0.4)',
  },
  button: {
    marginTop: '1rem',
    padding: '0.9rem 0',
    backgroundColor: '#5b3a29',
    color: '#f9f5f0',
    fontSize: '1.1rem',
    fontWeight: '600',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    fontFamily: "'Georgia', serif",
  },
  buttonHover: {
    backgroundColor: '#a1745f',
  },
};

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [focusedInput, setFocusedInput] = useState(null);
  const [btnHover, setBtnHover] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', form);
      localStorage.setItem('token', res.data.token);
      alert('Registered successfully!');
      window.location.href = '/home';
      console.log(res.data);
    } catch (err) {
      alert('Registration failed');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Register</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
          style={{
            ...styles.input,
            ...(focusedInput === 'name' ? styles.inputFocus : {}),
          }}
          onFocus={() => setFocusedInput('name')}
          onBlur={() => setFocusedInput(null)}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          style={{
            ...styles.input,
            ...(focusedInput === 'email' ? styles.inputFocus : {}),
          }}
          onFocus={() => setFocusedInput('email')}
          onBlur={() => setFocusedInput(null)}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          style={{
            ...styles.input,
            ...(focusedInput === 'password' ? styles.inputFocus : {}),
          }}
          onFocus={() => setFocusedInput('password')}
          onBlur={() => setFocusedInput(null)}
        />
        <button
          type="submit"
          style={{ ...styles.button, ...(btnHover ? styles.buttonHover : {}) }}
          onMouseEnter={() => setBtnHover(true)}
          onMouseLeave={() => setBtnHover(false)}
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
