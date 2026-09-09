import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import Field, { inputClass } from '../components/common/Field.jsx';
import Button from '../components/common/Button.jsx';
import AuthShell from '../components/layout/AuthShell.jsx';
import {
  MOCK_LOGIN_CREDENTIALS,
  ROLE_LABELS,
  ROLE_OPTIONS,
  ROLES,
} from '../lib/roles.js';

export default function LoginPage() {
  const { login } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState(ROLES.USER);
  const [email, setEmail] = useState(MOCK_LOGIN_CREDENTIALS[ROLES.USER].email);
  const [password, setPassword] = useState(
    MOCK_LOGIN_CREDENTIALS[ROLES.USER].password
  );
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Enter an email and password to continue.');
      return;
    }
    // No backend yet - any well-formed credentials succeed.
    login(email, role);
    navigate(location.state?.from?.pathname || '/orders', { replace: true });
  };

  const selectRole = (nextRole) => {
    const credentials = MOCK_LOGIN_CREDENTIALS[nextRole];
    setRole(nextRole);
    setEmail(credentials.email);
    setPassword(credentials.password);
    setError('');
  };

  return (
    <AuthShell
      heading="Sign in"
      subheading="Access order creation and packing visibility."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Work email">
          <input
            type="email"
            className={inputClass()}
            placeholder="you@thomax.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </Field>
        <Field label="Password">
          <input
            type="password"
            className={inputClass()}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </Field>
        <Field label="Development role">
          <select
            className={inputClass()}
            value={role}
            onChange={(e) => selectRole(e.target.value)}
          >
            {ROLE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {ROLE_LABELS[option]}
              </option>
            ))}
          </select>
        </Field>
        <p className="rounded-sm border border-brand-100 bg-brand-50 p-3 text-xs text-brand-700">
          Temporary mock authentication: choosing a role prefills editable development credentials.
        </p>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" className="w-full">
          Sign in
        </Button>
      </form>
    </AuthShell>
  );
}
