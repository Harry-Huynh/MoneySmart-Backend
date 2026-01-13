import React from 'react';
import { useState } from 'react';
import { WelcomePage } from './components/WelcomePage';
import { SignupPage } from './components/SignUpPage';
import { LoginPage } from './components/LoginPage';

export default function App() {
  const [page, setPage] = useState('welcome');

  return (
    <>
      {page === 'welcome' && <WelcomePage onNavigate={setPage} />}
      {page === 'signup' && <SignupPage onNavigate={setPage} />}
      {page === 'login' && <LoginPage onNavigate={setPage} />}
    </>
  );
}
