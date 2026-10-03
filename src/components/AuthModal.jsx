import React, { useState } from 'react';
import { X, Lock, User, Mail, KeyRound, Eye, EyeOff, ShieldCheck, AlertCircle, UserPlus, LogIn } from 'lucide-react';

export default function AuthModal({
  isOpen,
  onClose,
  initialMode = 'login', // 'login', 'register', 'admin'
  onUserLogin,
  onUserRegister,
  onAdminLogin,
  loginError,
  setLoginError
}) {
  const [authMode, setAuthMode] = useState(initialMode); // 'login', 'register', 'admin'
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  if (!isOpen) return null;

  const handleModeChange = (mode) => {
    setAuthMode(mode);
    if (setLoginError) setLoginError(null);
  };

  const handleFillDemoUser = () => {
    setEmail('user@example.com');
    setPassword('password123');
    if (setLoginError) setLoginError(null);
  };

  const handleFillDemoAdmin = () => {
    setAdminUsername('admin');
    setAdminPassword('admin123');
    if (setLoginError) setLoginError(null);
  };

  const handleUserLoginSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      if (setLoginError) setLoginError('Please enter both Email and Password');
      return;
    }
    setIsSubmitting(true);
    try {
      const success = await onUserLogin(email.trim(), password);
      if (success) {
        setEmail('');
        setPassword('');
        onClose();
      }
    } catch (err) {
      if (setLoginError) setLoginError(err.message || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUserRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      if (setLoginError) setLoginError('Please fill in all required fields');
      return;
    }
    if (password.length < 4) {
      if (setLoginError) setLoginError('Password should be at least 4 characters long');
      return;
    }
    setIsSubmitting(true);
    try {
      const success = await onUserRegister({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password
      });
      if (success) {
        setName('');
        setEmail('');
        setPassword('');
        onClose();
      }
    } catch (err) {
      if (setLoginError) setLoginError(err.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdminLoginSubmit = async (e) => {
    e.preventDefault();
    if (!adminUsername.trim() || !adminPassword.trim()) {
      if (setLoginError) setLoginError('Please enter both Admin ID and Password');
      return;
    }
    setIsSubmitting(true);
    try {
      const success = await onAdminLogin(adminUsername.trim(), adminPassword);
      if (success) {
        setAdminUsername('');
        setAdminPassword('');
        onClose();
      }
    } catch (err) {
      if (setLoginError) setLoginError(err.message || 'Admin login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1100 }}>
      <div 
        className="modal-content" 
        style={{ maxWidth: '440px', padding: 0, overflow: 'hidden', borderRadius: '16px' }} 
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header with Mode Tabs */}
        <div style={{
          padding: '1.25rem 1.5rem',
          background: authMode === 'admin' 
            ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(59, 130, 246, 0.1) 100%)'
            : 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(139, 92, 246, 0.1) 100%)',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              background: authMode === 'admin'
                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              padding: '0.5rem',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: authMode === 'admin' ? '0 0 12px rgba(16, 185, 129, 0.3)' : '0 0 12px rgba(59, 130, 246, 0.3)'
            }}>
              {authMode === 'admin' ? (
                <ShieldCheck size={20} color="#ffffff" />
              ) : authMode === 'register' ? (
                <UserPlus size={20} color="#ffffff" />
              ) : (
                <LogIn size={20} color="#ffffff" />
              )}
            </div>
            <div>
              <h3 className="serif-heading" style={{ fontSize: '1.2rem', margin: 0, color: 'var(--text-main)' }}>
                {authMode === 'admin' ? 'Admin Portal Access' : authMode === 'register' ? 'Join Community' : 'User Sign In'}
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {authMode === 'admin' ? 'Restricted Legal Author Portal' : 'Ask questions & discuss legal property acts'}
              </span>
            </div>
          </div>

          <button 
            onClick={onClose} 
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
            title="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Switch Mode Pills */}
        <div style={{
          display: 'flex',
          padding: '0.75rem 1.5rem 0 1.5rem',
          gap: '0.5rem',
          borderBottom: '1px solid var(--border-color)',
          background: 'var(--bg-secondary)'
        }}>
          <button
            type="button"
            onClick={() => handleModeChange('login')}
            style={{
              flex: 1,
              padding: '0.6rem 0.5rem',
              fontSize: '0.85rem',
              fontWeight: authMode === 'login' ? 700 : 500,
              background: 'transparent',
              border: 'none',
              borderBottom: authMode === 'login' ? '2px solid var(--accent-primary)' : '2px solid transparent',
              color: authMode === 'login' ? 'var(--accent-primary)' : 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <LogIn size={15} /> Sign In
          </button>

          <button
            type="button"
            onClick={() => handleModeChange('register')}
            style={{
              flex: 1,
              padding: '0.6rem 0.5rem',
              fontSize: '0.85rem',
              fontWeight: authMode === 'register' ? 700 : 500,
              background: 'transparent',
              border: 'none',
              borderBottom: authMode === 'register' ? '2px solid var(--accent-primary)' : '2px solid transparent',
              color: authMode === 'register' ? 'var(--accent-primary)' : 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <UserPlus size={15} /> Register
          </button>

          <button
            type="button"
            onClick={() => handleModeChange('admin')}
            style={{
              padding: '0.6rem 0.75rem',
              fontSize: '0.82rem',
              fontWeight: authMode === 'admin' ? 700 : 500,
              background: 'transparent',
              border: 'none',
              borderBottom: authMode === 'admin' ? '2px solid #10b981' : '2px solid transparent',
              color: authMode === 'admin' ? '#10b981' : 'var(--text-subtle)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px'
            }}
            title="Administrator Portal Login"
          >
            <ShieldCheck size={14} /> Admin
          </button>
        </div>

        {/* Modal Form Body */}
        <div style={{ padding: '1.5rem' }}>
          
          {/* Error Banner */}
          {loginError && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '10px',
              padding: '0.75rem 1rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              color: '#ef4444',
              fontSize: '0.85rem'
            }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{loginError}</span>
            </div>
          )}

          {/* 1. USER LOGIN FORM */}
          {authMode === 'login' && (
            <form onSubmit={handleUserLoginSubmit}>
              <div style={{ marginBottom: '1.2rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="email"
                    required
                    autoFocus
                    placeholder="e.g. user@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (loginError && setLoginError) setLoginError(null);
                    }}
                    style={{
                      width: '100%',
                      padding: '0.7rem 0.9rem 0.7rem 2.5rem',
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-main)',
                      borderRadius: '10px',
                      fontSize: '0.92rem'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <KeyRound size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (loginError && setLoginError) setLoginError(null);
                    }}
                    style={{
                      width: '100%',
                      padding: '0.7rem 2.5rem 0.7rem 2.5rem',
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-main)',
                      borderRadius: '10px',
                      fontSize: '0.92rem'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                <button
                  type="button"
                  onClick={handleFillDemoUser}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--accent-primary)',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  Quick Fill Demo Account (user@example.com)
                </button>
              </div>

              <button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  fontSize: '0.95rem',
                  justifyContent: 'center',
                  fontWeight: 700,
                  marginBottom: '1rem',
                  opacity: isSubmitting ? 0.7 : 1,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer'
                }}
              >
                {isSubmitting ? 'Signing In...' : <><LogIn size={16} /> Sign In to Ask Questions</>}
              </button>

              <p style={{ textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => handleModeChange('register')}
                  style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Create one free
                </button>
              </p>
            </form>
          )}

          {/* 2. USER REGISTER FORM */}
          {authMode === 'register' && (
            <form onSubmit={handleUserRegisterSubmit}>
              <div style={{ marginBottom: '1.1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                  Full Name
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    required
                    autoFocus
                    placeholder="e.g. Rahul Sharma / Sarah Miller"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (loginError && setLoginError) setLoginError(null);
                    }}
                    style={{
                      width: '100%',
                      padding: '0.7rem 0.9rem 0.7rem 2.5rem',
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-main)',
                      borderRadius: '10px',
                      fontSize: '0.92rem'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="email"
                    required
                    placeholder="e.g. rahul@gmail.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (loginError && setLoginError) setLoginError(null);
                    }}
                    style={{
                      width: '100%',
                      padding: '0.7rem 0.9rem 0.7rem 2.5rem',
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-main)',
                      borderRadius: '10px',
                      fontSize: '0.92rem'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                  Create Password
                </label>
                <div style={{ position: 'relative' }}>
                  <KeyRound size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Choose a password (min 4 characters)"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (loginError && setLoginError) setLoginError(null);
                    }}
                    style={{
                      width: '100%',
                      padding: '0.7rem 2.5rem 0.7rem 2.5rem',
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-main)',
                      borderRadius: '10px',
                      fontSize: '0.92rem'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  fontSize: '0.95rem',
                  justifyContent: 'center',
                  fontWeight: 700,
                  marginBottom: '1rem',
                  opacity: isSubmitting ? 0.7 : 1,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer'
                }}
              >
                {isSubmitting ? 'Creating Account...' : <><UserPlus size={16} /> Create Free Account</>}
              </button>

              <p style={{ textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => handleModeChange('login')}
                  style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Sign In
                </button>
              </p>
            </form>
          )}

          {/* 3. ADMIN PORTAL LOGIN FORM */}
          {authMode === 'admin' && (
            <form onSubmit={handleAdminLoginSubmit}>
              <div style={{
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                borderRadius: '8px',
                padding: '0.6rem 0.8rem',
                marginBottom: '1.2rem',
                fontSize: '0.78rem',
                color: 'var(--text-muted)'
              }}>
                <ShieldCheck size={14} color="#10b981" style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                Access restricted to authorized legal editors & administrators.
              </div>

              <div style={{ marginBottom: '1.1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                  Admin ID
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    required
                    autoFocus
                    placeholder="Enter Admin ID"
                    value={adminUsername}
                    onChange={(e) => {
                      setAdminUsername(e.target.value);
                      if (loginError && setLoginError) setLoginError(null);
                    }}
                    style={{
                      width: '100%',
                      padding: '0.7rem 0.9rem 0.7rem 2.5rem',
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-main)',
                      borderRadius: '10px',
                      fontSize: '0.92rem'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                  Admin Password
                </label>
                <div style={{ position: 'relative' }}>
                  <KeyRound size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter Admin Password"
                    value={adminPassword}
                    onChange={(e) => {
                      setAdminPassword(e.target.value);
                      if (loginError && setLoginError) setLoginError(null);
                    }}
                    style={{
                      width: '100%',
                      padding: '0.7rem 2.5rem 0.7rem 2.5rem',
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-main)',
                      borderRadius: '10px',
                      fontSize: '0.92rem'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                <button
                  type="button"
                  onClick={handleFillDemoAdmin}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#10b981',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  Quick Fill Admin Credentials (admin / admin123)
                </button>
              </div>

              <button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  fontSize: '0.95rem',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  fontWeight: 700,
                  marginBottom: '1rem',
                  opacity: isSubmitting ? 0.7 : 1,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer'
                }}
              >
                {isSubmitting ? 'Verifying Admin...' : <><Lock size={16} /> Enter Admin Control Portal</>}
              </button>

              <p style={{ textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
                Looking for user login?{' '}
                <button
                  type="button"
                  onClick={() => handleModeChange('login')}
                  style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Switch to User Sign In
                </button>
              </p>
            </form>
          )}

        </div>

      </div>
    </div>
  );
}
