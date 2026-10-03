import React from 'react';
import { ShieldAlert, Heart, Globe, ArrowUpRight } from 'lucide-react';
import logoImg from '../assets/logo.jpg';
import SocialLinks from './SocialLinks';

export default function Footer({ setActiveTab, onOpenAuth }) {
  return (
    <footer style={{
      background: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border-color)',
      marginTop: '5rem',
      padding: '4rem 0 2rem 0'
    }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2.5rem', marginBottom: '3rem' }}>
          
          {/* Brand Col */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <img 
                src={logoImg} 
                alt="Home Drops Villa Logo" 
                style={{
                  height: '42px',
                  width: '42px',
                  borderRadius: '10px',
                  objectFit: 'cover',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  boxShadow: '0 0 12px rgba(59, 130, 246, 0.25)'
                }}
              />
              <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)' }}>
                Home Drops <span style={{ color: 'var(--accent-primary)' }}>Villa</span>
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1.2rem' }}>
              The authoritative global real estate and land revenue legal repository. Access verified statutory acts, RERA rules, stamp duty rates, and municipal building codes worldwide.
            </p>
            
            {/* Social Media Channels */}
            <div>
              <span style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Follow Our Channels
              </span>
              <SocialLinks variant="compact" size={18} />
            </div>
          </div>

          {/* Directory Hierarchy */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)' }}>
              Legal Hierarchy
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.88rem' }}>
              <li>
                <button onClick={() => setActiveTab('country')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  Country Real Estate Blogs <ArrowUpRight size={14} />
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('state')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  State Revenue & Tenancy Blogs <ArrowUpRight size={14} />
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('city')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  City Municipal & Zoning Blogs <ArrowUpRight size={14} />
                </button>
              </li>
            </ul>
          </div>


          {/* Disclaimer */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-gold)', fontWeight: 700, fontSize: '0.88rem', marginBottom: '0.75rem' }}>
              <ShieldAlert size={18} /> Statutory Disclaimer
            </div>
            <p style={{ color: 'var(--text-subtle)', fontSize: '0.8rem', lineHeight: 1.5, marginBottom: '1rem' }}>
              Articles published on Home Drops Villa provide general legal education. Property laws and circle rates are subject to regional amendments. Always verify titles with accredited legal counsel.
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid var(--border-color)',
          paddingTop: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.8rem',
          color: 'var(--text-subtle)'
        }}>
          <div>
            © {new Date().getFullYear()} Home Drops Villa - Global Property Laws. All Rights Reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            {onOpenAuth && (
              <button
                onClick={() => onOpenAuth('admin')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-subtle)',
                  cursor: 'pointer',
                  fontSize: '0.78rem',
                  textDecoration: 'underline'
                }}
              >
                Admin Desk Access
              </button>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              Built with <Heart size={14} color="#ef4444" fill="#ef4444" /> for global property transparency
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
