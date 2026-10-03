import React, { useState } from 'react';
import { X, Lock, User, KeyRound, Eye, EyeOff, ShieldCheck, AlertCircle } from 'lucide-react';

export default function AdminLoginModal({ 
  isOpen, 
  onClose, 
  onLogin, 
  loginError, 
  setLoginError 
}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setLoginError('Please enter both Admin ID and Password');
      return;
    }
    const success = await onLogin(username.trim(), password);
    if (success) {
      setUsername('');
      setPassword('');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ maxWidth: '440px', padding: 0, overflow: 'hidden' }} 
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div style={{
          padding: '1.5rem 1.75rem 1.25rem 1.75rem',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%)',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              padding: '0.5rem',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 12px rgba(16, 185, 129, 0.3)'
            }}>
              <ShieldCheck size={20} color="#ffffff" />
            </div>
            <div>
              <h3 className="serif-heading" style={{ fontSize: '1.25rem', margin: 0, color: 'var(--text-main)' }}>
                Admin Authentication
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Restricted access area
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

        {/* Form Content */}
        <form onSubmit={handleSubmit} style={{ padding: '1.75rem' }}>
          
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

          {/* Admin ID / Username Field */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
              Admin ID / Username
            </label>
            <div style={{ position: 'relative' }}>
              <User 
                size={18} 
                color="var(--text-muted)" 
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} 
              />
              <input 
                type="text"
                required
                autoFocus
                placeholder="Enter Admin ID"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (loginError) setLoginError(null);
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

          {/* Password Field */}
          <div style={{ marginBottom: '1.75rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
              Admin Password
            </label>
            <div style={{ position: 'relative' }}>
              <KeyRound 
                size={18} 
                color="var(--text-muted)" 
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} 
              />
              <input 
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Enter Admin Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (loginError) setLoginError(null);
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
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="btn-primary"
            style={{
              width: '100%',
              padding: '0.8rem',
              fontSize: '0.95rem',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              fontWeight: 700
            }}
          >
            <Lock size={16} /> Log In to Admin Portal
          </button>

        </form>
      </div>
    </div>
  );
}
