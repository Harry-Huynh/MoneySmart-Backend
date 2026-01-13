import React from 'react';
import { useState } from 'react';

export function LoginPage({ onNavigate }) {
  const [form, setForm] = useState({ username: '', password: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login:', form);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <input name="username" onChange={handleChange} placeholder="Username" className="input" />
        <input
          name="password"
          type="password"
          onChange={handleChange}
          placeholder="Password"
          className="input"
        />

        <button className="w-full bg-green-700 text-white py-2 rounded-lg mt-4">Login</button>

        <p className="text-center mt-4 text-sm">
          No account?
          <button
            type="button"
            onClick={() => onNavigate('signup')}
            className="text-green-700 ml-1"
          >
            Sign Up
          </button>
        </p>
      </form>
    </div>
  );
}
