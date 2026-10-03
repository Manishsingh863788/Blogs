import React from 'react';
import { MapPin, Clock, Calendar, Bookmark, ArrowRight, Building2 } from 'lucide-react';

export default function BlogCard({ blog, onSelect, onSelectBlog, isSaved, onToggleSave }) {
  const handleSelect = () => {
    if (onSelect) onSelect(blog);
    if (onSelectBlog) onSelectBlog(blog);
  };

  const getBadgeClass = (level) => {
    if (level === 'country') return 'badge-country';
    if (level === 'state') return 'badge-state';
    return 'badge-city';
  };

  const getLocationText = () => {
    if (blog.level === 'city') return `${blog.city}, ${blog.state || blog.country}`;
    if (blog.level === 'state') return `${blog.state}, ${blog.country}`;
    return blog.country;
  };

  return (
    <div className="blog-card" onClick={handleSelect} style={{ cursor: 'pointer' }}>
      
      {/* Blog Image Container */}
      <div style={{ position: 'relative', overflow: 'hidden', height: '210px' }}>
        <img 
          src={blog.image} 
          alt={blog.title} 
          className="blog-card-img" 
        />
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          display: 'flex',
          gap: '6px',
          flexWrap: 'wrap'
        }}>
          <span className={`badge ${getBadgeClass(blog.level)}`}>
            {blog.level}
          </span>
          <span className="badge" style={{ background: 'rgba(0, 0, 0, 0.65)', color: '#ffffff', backdropFilter: 'blur(4px)' }}>
            {blog.category}
          </span>
        </div>

        {/* Bookmark Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave(blog.id);
          }}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: isSaved ? 'var(--accent-gold)' : 'rgba(0, 0, 0, 0.6)',
            color: isSaved ? '#000000' : '#ffffff',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            backdropFilter: 'blur(4px)',
            transition: 'var(--transition)'
          }}
          title={isSaved ? 'Remove from Saved' : 'Save Blog'}
        >
          <Bookmark size={18} fill={isSaved ? '#000000' : 'none'} />
        </button>
      </div>

      {/* Card Content */}
      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        
        {/* Location & Metadata */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--accent-primary)', fontWeight: 600 }}>
            <MapPin size={14} /> {getLocationText()}
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Calendar size={14} /> {blog.date}
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={14} /> {blog.readTime}
          </span>
        </div>

        {/* Title */}
        <h3 
          className="serif-heading"
          onClick={handleSelect}
          style={{ 
            fontSize: '1.25rem', 
            fontWeight: 700, 
            lineHeight: 1.4, 
            marginBottom: '0.75rem',
            color: 'var(--text-main)',
            cursor: 'pointer',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {blog.title}
        </h3>

        {/* Summary Snippet */}
        <p style={{ 
          fontSize: '0.88rem', 
          color: 'var(--text-muted)', 
          lineHeight: 1.6, 
          marginBottom: '1rem',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          flexGrow: 1
        }}>
          {blog.summary}
        </p>

        {/* Footer Action */}
        <div style={{ 
          paddingTop: '1rem', 
          borderTop: '1px solid var(--border-color)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <img 
              src={blog.author?.avatar || "/writer.jpg"} 
              alt={blog.author?.name} 
              style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover', objectPosition: 'center 15%' }}
            />
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-subtle)' }}>
              {blog.author?.name ? blog.author.name.split('&')[0] : 'Legal Research'}
            </span>
          </div>

          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleSelect();
            }}
            className="btn-primary" 
            style={{ padding: '0.45rem 0.9rem', fontSize: '0.82rem', gap: '0.35rem' }}
          >
            Read Blog <ArrowRight size={14} />
          </button>
        </div>

      </div>

    </div>
  );
}
