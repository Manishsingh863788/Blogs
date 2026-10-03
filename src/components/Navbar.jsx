import React, { useState, useRef, useEffect } from 'react';
import { Compass, BookOpen, MapPin, Globe, Bookmark, ShieldCheck, LogIn, LogOut, ChevronDown, X, MoreHorizontal, Check } from 'lucide-react';
import logoImg from '../assets/logo.jpg';
import SocialLinks from './SocialLinks';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  savedCount,
  currentUser,
  isAdminLoggedIn,
  onOpenAuth,
  onUserLogout,
  onAdminLogout
}) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isNavDropdownOpen, setIsNavDropdownOpen] = useState(false);
  const navDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navDropdownRef.current && !navDropdownRef.current.contains(event.target)) {
        setIsNavDropdownOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsNavDropdownOpen(false);
      }
    };

    if (isNavDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isNavDropdownOpen]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setIsNavDropdownOpen(false);
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: Compass, badge: null },
    { id: 'country', label: 'Country Laws', icon: Globe, badge: null },
    { id: 'state', label: 'State Laws', icon: BookOpen, badge: null },
    { id: 'city', label: 'City Laws', icon: MapPin, badge: null },
    { id: 'saved', label: 'Saved', icon: Bookmark, badge: savedCount > 0 ? savedCount : null }
  ];

  return (
    <nav className="navbar-sticky">
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: '76px', padding: '0.5rem 1rem' }}>
        
        {/* Brand Logo */}
        <div 
          onClick={() => handleTabClick('home')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', flexShrink: 0 }}
        >
          <img 
            src={logoImg} 
            alt="Home Drops Villa Logo" 
            style={{
              height: '42px',
              width: '42px',
              borderRadius: '10px',
              objectFit: 'cover',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: '0 0 15px rgba(59, 130, 246, 0.3)'
            }}
          />
          <div>
            <span style={{ fontSize: 'clamp(1.1rem, 3.5vw, 1.35rem)', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '4px', lineHeight: 1.2 }}>
              Home Drops <span style={{ color: 'var(--accent-primary)' }}>Villa</span>
            </span>
            <span className="navbar-brand-subtitle" style={{ display: 'block', fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Global Land Laws & Property Acts
            </span>
          </div>
        </div>

        {/* Desktop Navigation Menu (Visible on Laptop, Hidden on Phone) */}
        <div className="navbar-desktop-menu">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleTabClick(item.id)}
                className={`navbar-nav-item ${isActive ? 'active' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '0.45rem 0.85rem',
                  borderRadius: '10px',
                  border: isActive ? '1px solid var(--accent-primary)' : '1px solid transparent',
                  background: isActive ? 'rgba(59, 130, 246, 0.12)' : 'transparent',
                  color: isActive ? 'var(--accent-primary)' : 'var(--text-main)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap'
                }}
              >
                <IconComponent size={16} color={isActive ? 'var(--accent-primary)' : 'currentColor'} />
                <span>{item.label}</span>
                {item.badge != null && (
                  <span style={{
                    background: 'var(--accent-gold)',
                    color: '#000000',
                    borderRadius: '9999px',
                    padding: '1px 6px',
                    fontSize: '0.68rem',
                    fontWeight: 800
                  }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Action Controls & Authentication */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          {/* Social Channel Links (Desktop) */}
          <div className="navbar-socials" style={{ display: 'flex', alignItems: 'center' }}>
            <SocialLinks variant="compact" size={16} />
          </div>

          <div className="navbar-socials" style={{ width: '1px', height: '24px', background: 'var(--border-color)' }} />

          {/* Admin Logged-in Control */}
          {isAdminLoggedIn ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <button
                onClick={() => handleTabClick(activeTab === 'admin' ? 'home' : 'admin')}
                className="btn-primary"
                style={{
                  padding: '0.45rem 0.75rem',
                  fontSize: '0.8rem',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  gap: '5px'
                }}
                title="Open Admin Control Portal"
              >
                <ShieldCheck size={15} /> {activeTab === 'admin' ? 'Exit Portal' : 'Admin Portal'}
              </button>

              <button
                onClick={onAdminLogout}
                className="btn-outline"
                style={{
                  padding: '0.45rem 0.6rem',
                  fontSize: '0.8rem',
                  color: '#ef4444',
                  borderColor: 'rgba(239, 68, 68, 0.3)'
                }}
                title="Log out from Admin"
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : currentUser ? (
            /* Logged in User Profile */
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="btn-outline"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 8px 4px 5px',
                  borderRadius: '24px',
                  background: 'var(--bg-secondary)',
                  borderColor: 'var(--border-color)'
                }}
              >
                <img 
                  src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'} 
                  alt={currentUser.name} 
                  style={{ width: '26px', height: '26px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', maxWidth: '90px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {currentUser.name}
                </span>
                <ChevronDown size={13} color="var(--text-muted)" />
              </button>

              {showUserMenu && (
                <div 
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 'calc(100% + 8px)',
                    width: '200px',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px',
                    boxShadow: 'var(--card-shadow)',
                    padding: '0.5rem',
                    zIndex: 100,
                    animation: 'fadeIn 0.15s ease'
                  }}
                  onMouseLeave={() => setShowUserMenu(false)}
                >
                  <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border-color)', marginBottom: '0.4rem' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>{currentUser.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentUser.email}</div>
                  </div>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      handleTabClick('saved');
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '0.5rem 0.75rem',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-main)',
                      fontSize: '0.82rem',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <Bookmark size={14} /> My Saved Articles ({savedCount})
                  </button>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onUserLogout();
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '0.5rem 0.75rem',
                      background: 'none',
                      border: 'none',
                      color: '#ef4444',
                      fontSize: '0.82rem',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Guest Sign In Button */
            <button
              onClick={() => onOpenAuth('login')}
              className="btn-primary"
              style={{ padding: '0.45rem 0.85rem', fontSize: '0.82rem', gap: '5px' }}
            >
              <LogIn size={14} /> Sign In
            </button>
          )}

          {/* 3-Dotted Navigation Menu Button (Visible in phone, Hidden in laptop) */}
          <div className="navbar-dots-wrapper" ref={navDropdownRef} style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setIsNavDropdownOpen(!isNavDropdownOpen)}
              className="navbar-dots-trigger"
              aria-label="Navigation options menu (Home, Country Laws, State Laws, City Laws, Saved)"
              aria-expanded={isNavDropdownOpen}
              title="Menu: Home, Country Laws, State Laws, City Laws, Saved"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '0.45rem 0.75rem',
                borderRadius: '10px',
                background: isNavDropdownOpen ? 'rgba(59, 130, 246, 0.15)' : 'var(--bg-secondary)',
                border: isNavDropdownOpen ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
                color: isNavDropdownOpen ? 'var(--accent-primary)' : 'var(--text-main)',
                cursor: 'pointer',
                boxShadow: isNavDropdownOpen ? '0 0 14px rgba(59, 130, 246, 0.3)' : 'none',
                transition: 'all 0.2s ease',
                minHeight: '38px'
              }}
            >
              {isNavDropdownOpen ? <X size={20} /> : <MoreHorizontal size={22} strokeWidth={2.6} />}
              {savedCount > 0 && !isNavDropdownOpen && (
                <span style={{
                  background: 'var(--accent-gold)',
                  color: '#000000',
                  borderRadius: '9999px',
                  padding: '1px 6px',
                  fontSize: '0.68rem',
                  fontWeight: 800
                }}>
                  {savedCount}
                </span>
              )}
            </button>

            {/* 3-Dot Dropdown Menu Card for Mobile */}
            {isNavDropdownOpen && (
              <div 
                className="navbar-dots-dropdown"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 10px)',
                  right: 0,
                  minWidth: '230px',
                  maxWidth: 'calc(100vw - 1.5rem)',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '14px',
                  boxShadow: '0 15px 35px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.05)',
                  padding: '0.5rem',
                  zIndex: 1200,
                  backdropFilter: 'blur(12px)',
                  animation: 'slideDown 0.15s ease-out'
                }}
              >
                <div style={{
                  padding: '0.35rem 0.65rem 0.5rem 0.65rem',
                  borderBottom: '1px solid var(--border-color)',
                  marginBottom: '0.35rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
                    Menu
                  </span>
                  <span style={{ fontSize: '0.68rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
                    {activeTab === 'home' ? 'Home' : activeTab === 'country' ? 'Country Laws' : activeTab === 'state' ? 'State Laws' : activeTab === 'city' ? 'City Laws' : activeTab === 'saved' ? 'Saved' : activeTab}
                  </span>
                </div>

                {navItems.map((item) => {
                  const IconComponent = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTabClick(item.id)}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.65rem',
                        padding: '0.65rem 0.75rem',
                        borderRadius: '8px',
                        border: 'none',
                        background: isActive ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                        color: isActive ? 'var(--accent-primary)' : 'var(--text-main)',
                        fontWeight: isActive ? 700 : 500,
                        fontSize: '0.88rem',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'background 0.15s ease, color 0.15s ease',
                        marginBottom: '2px'
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) e.currentTarget.style.background = 'var(--bg-hover)';
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <div style={{
                          color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)',
                          display: 'flex',
                          alignItems: 'center'
                        }}>
                          <IconComponent size={17} />
                        </div>
                        <span>{item.label}</span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {item.badge != null && (
                          <span style={{
                            background: 'var(--accent-gold)',
                            color: '#000000',
                            borderRadius: '9999px',
                            padding: '1px 6px',
                            fontSize: '0.7rem',
                            fontWeight: 800
                          }}>
                            {item.badge}
                          </span>
                        )}
                        {isActive && <Check size={14} color="var(--accent-primary)" strokeWidth={2.5} />}
                      </div>
                    </button>
                  );
                })}

                {/* Social Links inside Mobile 3-Dot Dropdown */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingTop: '0.6rem',
                  marginTop: '0.4rem',
                  borderTop: '1px solid var(--border-color)'
                }}>
                  <SocialLinks variant="compact" size={16} />
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </nav>
  );
}
