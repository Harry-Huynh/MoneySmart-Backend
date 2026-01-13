import React from 'react';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export function SignupPage({ onNavigate }) {
  const [form, setForm] = useState({
    id: uuidv4(),
    name: '',
    username: '',
    email: '',
    password: '',
    phoneNumber: '',
    region: '',
    currency: 'USD',
    dateFormat: 'YYYY-MM-DD',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Signup Data:', form);
    // send to backend
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>

        <input name="name" onChange={handleChange} placeholder="Full Name" className="input" />
        <input name="username" onChange={handleChange} placeholder="Username" className="input" />
        <input
          name="email"
          type="email"
          onChange={handleChange}
          placeholder="Email"
          className="input"
        />
        <input
          name="password"
          type="password"
          onChange={handleChange}
          placeholder="Password"
          className="input"
        />
        <input
          name="phoneNumber"
          onChange={handleChange}
          placeholder="Phone Number"
          className="input"
        />
        <input name="region" onChange={handleChange} placeholder="Region" className="input" />

        <select name="currency" onChange={handleChange} className="input">
          <option value="USD">USD</option>
          <option value="CAD">CAD</option>
          <option value="VND">VND</option>
        </select>

        <select name="dateFormat" onChange={handleChange} className="input">
          <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          <option value="DD/MM/YYYY">DD/MM/YYYY</option>
          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
        </select>

        <button className="w-full bg-green-700 text-white py-2 rounded-lg mt-4">Sign Up</button>

        <p className="text-center mt-4 text-sm">
          Already have an account?
          <button type="button" onClick={() => onNavigate('login')} className="text-green-700 ml-1">
            Login
          </button>
        </p>
      </form>
    </div>
  );
}
