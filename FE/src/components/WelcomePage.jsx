import React from 'react';
import { Wallet, DollarSign, Shield } from 'lucide-react';

export function WelcomePage({ onNavigate }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-green-700 p-2 rounded-lg">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-semibold">Money Smart</span>
          </div>

          <button
            onClick={() => onNavigate('signup')}
            className="bg-green-700 text-white px-6 py-2 rounded-lg"
          >
            Sign Up
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <h1 className="text-5xl font-bold mb-6">MoneySmart Website</h1>
          <p className="text-xl text-gray-600 mb-8">
            Track your income, expenses, and goals — all in one simple dashboard.
          </p>

          <div className="flex gap-4">
            <button
              onClick={() => onNavigate('signup')}
              className="bg-green-700 text-white px-8 py-3 rounded-lg"
            >
              Sign Up
            </button>
            <button onClick={() => onNavigate('login')} className="border px-8 py-3 rounded-lg">
              Login
            </button>
          </div>
        </div>

        <div className="flex justify-center items-center">
          <img src="/assets/sample.png" className="max-w-xl w-full" />
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <Feature icon={<Wallet />} title="Track Income & Expenses" />
        <Feature icon={<DollarSign />} title="Set Budget Goals" />
        <Feature icon={<Shield />} title="Stay Secure & Private" />
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-600">
        © 2024 Money Smart • Smart tracking, smarter decisions.
      </footer>
    </div>
  );
}

function Feature({ icon, title }) {
  return (
    <div className="bg-white p-8 rounded-xl shadow text-center">
      <div className="text-green-700 flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">Simple and secure financial management.</p>
    </div>
  );
}
