import React from 'react';
import { Award, BookOpen, ShieldCheck, ExternalLink } from 'lucide-react';
import { WRITER_PROFILE } from '../data/blogsData';
import SocialLinks from './SocialLinks';

export default function WriterIntro() {
  return (
    <div className="writer-intro-card">
      <div style={{
        position: 'absolute',
        top: '-40px',
        right: '-40px',
        width: '180px',
        height: '180px',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, rgba(0,0,0,0) 70%)',
        borderRadius: '50%',
        pointerEvents: 'none'
      }} />

      <div className="writer-intro-grid">
        
        {/* Writer Image & Credentials */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <img 
              src={WRITER_PROFILE.avatar} 
              alt={WRITER_PROFILE.name}
              style={{
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                objectFit: 'cover',
                objectPosition: 'center 15%',
                border: '3px solid var(--accent-primary)',
                boxShadow: '0 0 25px rgba(59, 130, 246, 0.35)'
              }}
            />
            <div style={{
              position: 'absolute',
              bottom: '6px',
              right: '6px',
              background: 'var(--accent-gold)',
              padding: '6px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
            }}>
              <ShieldCheck size={18} color="#000000" />
            </div>
          </div>

          <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginTop: '0.9rem', color: 'var(--text-main)', marginBottom: '0.2rem' }}>
            {WRITER_PROFILE.name}
          </h4>
          <span style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: 600, marginBottom: '1rem', display: 'block' }}>
            {WRITER_PROFILE.title}
          </span>

          {/* Social Media Links under author */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <SocialLinks variant="compact" size={17} />
          </div>
        </div>

        {/* Writer Bio & Stats */}
        <div>
          <h2 className="serif-heading" style={{ fontSize: 'clamp(1.4rem, 3.5vw, 1.8rem)', marginBottom: '1rem', color: 'var(--text-main)' }}>
            Demystifying Global Property Laws & Statutory Acts
          </h2>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.98rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
            {WRITER_PROFILE.bio}
          </p>

          {/* Stats Bar and Social Connect */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '0.5rem', borderRadius: '8px' }}>
                  <Award size={20} color="var(--accent-primary)" />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <span style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {WRITER_PROFILE.experience}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Land Revenue & Advisory</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '0.5rem', borderRadius: '8px' }}>
                  <BookOpen size={20} color="var(--accent-emerald)" />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <span style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {WRITER_PROFILE.publications}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Verified Statutory Analyses</span>
                </div>
              </div>
            </div>

            {/* Social Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Follow Channels:
              </span>
              <SocialLinks variant="buttons" size={16} />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
