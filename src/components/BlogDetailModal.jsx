import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, Bookmark, Share2, ArrowRight, BookOpen, Building2, Plus, CheckCircle2, Pencil, Trash2, Layers, HelpCircle } from 'lucide-react';
import FAQSection from './FAQSection';
import BlogCommentsSection from './BlogCommentsSection';
import { CATEGORIES } from '../data/blogsData';

export default function BlogDetailModal({ 
  blog, 
  allBlogs, 
  onClose, 
  onSelectBlog, 
  isSaved, 
  onToggleSave,
  isAdminLoggedIn,
  currentUser,
  comments = [],
  onAddComment,
  onAddAdminReply,
  onLikeComment,
  onOpenAuth,
  onAddFaq,
  onAddSection,
  onUpdateBlog
}) {
  const [showAddFaqForm, setShowAddFaqForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');

  const [showAddSectionForm, setShowAddSectionForm] = useState(false);
  const [newSectionHeading, setNewSectionHeading] = useState('');
  const [newSectionBody, setNewSectionBody] = useState('');

  // Full Article Edit Mode State inside Reader Modal
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [editFormData, setEditFormData] = useState(null);

  if (!blog) return null;

  const handleStartEdit = () => {
    setEditFormData({
      title: blog.title || '',
      level: blog.level || 'country',
      country: blog.country || 'India',
      state: blog.state || '',
      city: blog.city || '',
      category: blog.category || 'RERA & Protection',
      image: blog.image || '',
      summary: blog.summary || '',
      sections: blog.content && blog.content.length > 0
        ? blog.content.map(s => ({ heading: s.heading || '', body: s.body || '' }))
        : [{ heading: '1. Statutory Overview', body: '' }],
      faqs: blog.faqs && blog.faqs.length > 0
        ? blog.faqs.map(f => ({ question: f.question || '', answer: f.answer || '' }))
        : [{ question: '', answer: '' }]
    });
    setIsEditingMode(true);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editFormData.title || !editFormData.summary) {
      alert('Please complete Title and Summary');
      return;
    }

    const validSections = editFormData.sections
      .filter(s => s.heading.trim() !== '' || s.body.trim() !== '')
      .map(s => ({ heading: s.heading.trim(), body: s.body.trim() }));

    const validFaqs = editFormData.faqs
      .filter(f => f.question.trim() !== '')
      .map(f => ({ question: f.question.trim(), answer: f.answer.trim() }));

    const updated = {
      ...blog,
      title: editFormData.title,
      level: editFormData.level,
      country: editFormData.country,
      state: editFormData.state,
      city: editFormData.city,
      category: editFormData.category,
      image: editFormData.image,
      summary: editFormData.summary,
      content: validSections,
      faqs: validFaqs
    };

    if (onUpdateBlog) {
      onUpdateBlog(updated);
    }

    setIsEditingMode(false);
  };

  const handleAddFaqSubmit = (e) => {
    e.preventDefault();
    if (!newQuestion.trim() || !newAnswer.trim()) return;
    if (onAddFaq) {
      onAddFaq(blog.id, {
        question: newQuestion.trim(),
        answer: newAnswer.trim()
      });
    }
    setNewQuestion('');
    setNewAnswer('');
    setShowAddFaqForm(false);
  };

  const handleAddSectionSubmit = (e) => {
    e.preventDefault();
    if (!newSectionHeading.trim() || !newSectionBody.trim()) return;
    if (onAddSection) {
      onAddSection(blog.id, {
        heading: newSectionHeading.trim(),
        body: newSectionBody.trim()
      });
    }
    setNewSectionHeading('');
    setNewSectionBody('');
    setShowAddSectionForm(false);
  };

  // Find State Sub-blogs for country level blogs
  const stateSubBlogs = blog.level === 'country'
    ? allBlogs.filter(b => b.level === 'state' && b.country === blog.country)
    : [];

  // Find related blogs
  const relatedBlogs = allBlogs.filter(b => 
    b.id !== blog.id && (
      (blog.relatedBlogIds && blog.relatedBlogIds.includes(b.id)) ||
      b.country === blog.country ||
      b.level === blog.level
    )
  ).slice(0, 3);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blog.title,
        text: blog.summary,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        {/* Modal Top Bar */}
        <div style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'var(--bg-glass)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border-color)',
          padding: '0.85rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className={`badge badge-${blog.level}`}>
              {blog.level} • {blog.country}
            </span>
            {blog.city && (
              <span className="badge badge-city">
                {blog.city}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {isAdminLoggedIn && (
              <button
                onClick={handleStartEdit}
                className="btn-outline"
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.3rem', borderColor: '#f59e0b', color: '#f59e0b', background: 'rgba(245, 158, 11, 0.08)' }}
                title="Edit Full Article & Add Content"
              >
                <Pencil size={16} /> Edit Article
              </button>
            )}

            <button
              onClick={() => onToggleSave(blog.id)}
              className="btn-outline"
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.3rem' }}
            >
              <Bookmark size={16} fill={isSaved ? 'var(--accent-gold)' : 'none'} color={isSaved ? 'var(--accent-gold)' : 'currentColor'} />
              {isSaved ? 'Saved' : 'Bookmark'}
            </button>

            <button
              onClick={handleShare}
              className="btn-outline"
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.3rem' }}
            >
              <Share2 size={16} /> Share
            </button>

            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '0.4rem',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Modal Content Body */}
        <div style={{ padding: 'clamp(1rem, 3vw, 2rem)' }}>

          {isEditingMode && editFormData ? (
            <form onSubmit={handleSaveEdit} style={{ background: 'rgba(245, 158, 11, 0.04)', border: '1px solid rgba(245, 158, 11, 0.25)', padding: '1.25rem', borderRadius: '16px', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Pencil size={20} color="#f59e0b" />
                  <h3 className="serif-heading" style={{ fontSize: '1.3rem', margin: 0, color: 'var(--text-main)' }}>
                    Edit Article & Content
                  </h3>
                </div>
                <button type="button" onClick={() => setIsEditingMode(false)} className="btn-outline" style={{ fontSize: '0.8rem' }}>Cancel</button>
              </div>

              {/* Title */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>Article Title *</label>
                <input 
                  type="text" 
                  required
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.8rem', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: '8px', fontSize: '0.92rem', fontWeight: 600 }}
                />
              </div>

              {/* Location */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.8rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>Country</label>
                  <input 
                    type="text"
                    value={editFormData.country}
                    onChange={(e) => setEditFormData({ ...editFormData, country: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem 0.7rem', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: '6px', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>State / City</label>
                  <input 
                    type="text"
                    value={editFormData.state || editFormData.city}
                    onChange={(e) => setEditFormData({ ...editFormData, state: e.target.value, city: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem 0.7rem', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: '6px', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              {/* Executive Summary */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>Executive Summary *</label>
                <textarea 
                  required
                  rows={3}
                  value={editFormData.summary}
                  onChange={(e) => setEditFormData({ ...editFormData, summary: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.8rem', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: '8px', fontSize: '0.9rem' }}
                />
              </div>

              {/* Dynamic Content Sections */}
              <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Layers size={16} /> Article Content Sections ({editFormData.sections.length})
                  </span>
                  <button 
                    type="button" 
                    onClick={() => setEditFormData(prev => ({ ...prev, sections: [...prev.sections, { heading: `${prev.sections.length + 1}. Statutory Framework`, body: '' }] }))}
                    className="btn-outline"
                    style={{ fontSize: '0.78rem', padding: '0.3rem 0.6rem', gap: '4px', borderColor: '#f59e0b', color: '#f59e0b' }}
                  >
                    <Plus size={14} /> Add Section
                  </button>
                </div>

                {editFormData.sections.map((sec, idx) => (
                  <div key={idx} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.85rem', marginBottom: '0.85rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>Section #{idx + 1}</span>
                      {editFormData.sections.length > 1 && (
                        <button type="button" onClick={() => setEditFormData(prev => ({ ...prev, sections: prev.sections.filter((_, i) => i !== idx) }))} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                    <input 
                      type="text"
                      placeholder="Heading e.g. 1. Statutory Provisions"
                      value={sec.heading}
                      onChange={(e) => {
                        const updated = [...editFormData.sections];
                        updated[idx].heading = e.target.value;
                        setEditFormData({ ...editFormData, sections: updated });
                      }}
                      style={{ width: '100%', padding: '0.5rem 0.75rem', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: '6px', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.88rem' }}
                    />
                    <textarea 
                      rows={4}
                      placeholder="Body text..."
                      value={sec.body}
                      onChange={(e) => {
                        const updated = [...editFormData.sections];
                        updated[idx].body = e.target.value;
                        setEditFormData({ ...editFormData, sections: updated });
                      }}
                      style={{ width: '100%', padding: '0.5rem 0.75rem', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: '6px', fontSize: '0.88rem' }}
                    />
                  </div>
                ))}
              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button type="button" onClick={() => setIsEditingMode(false)} className="btn-outline">Cancel</button>
                <button type="submit" className="btn-primary" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
                  <Pencil size={16} /> Save Article Changes
                </button>
              </div>
            </form>
          ) : (
            <>
          <h1 className="serif-heading" style={{ fontSize: 'clamp(1.4rem, 4vw, 2.2rem)', lineHeight: 1.3, marginBottom: '1rem', color: 'var(--text-main)' }}>
            {blog.title}
          </h1>

          {/* Author & Meta bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: '1.5rem',
            marginBottom: '1.5rem',
            borderBottom: '1px solid var(--border-color)',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <img 
                src={blog.author?.avatar || "/writer.jpg"} 
                alt={blog.author?.name} 
                style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', objectPosition: 'center 15%', border: '2px solid var(--accent-primary)' }}
              />
              <div>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  {blog.author?.name} <CheckCircle2 size={14} color="var(--accent-primary)" />
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {blog.author?.title}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={15} /> {blog.date}
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={15} /> {blog.readTime}
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--accent-primary)', fontWeight: 600 }}>
                <MapPin size={15} /> {blog.city || blog.state || blog.country}
              </span>
            </div>
          </div>

          {/* Featured Image (Per Wireframe #3) */}
          <div style={{ marginBottom: '2rem', borderRadius: '12px', overflow: 'hidden', maxHeight: '420px' }}>
            <img 
              src={blog.image} 
              alt={blog.title} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* Executive Summary Callout */}
          <div style={{
            background: 'rgba(59, 130, 246, 0.08)',
            borderLeft: '4px solid var(--accent-primary)',
            padding: '1.25rem 1.5rem',
            borderRadius: '0 12px 12px 0',
            marginBottom: '2rem',
            fontSize: '1.05rem',
            lineHeight: 1.7,
            color: 'var(--text-main)'
          }}>
            <strong>Statutory Summary:</strong> {blog.summary}
          </div>

          {/* Detailed Paragraph Content (Per Wireframe #3) */}
          <div style={{ color: 'var(--text-main)', fontSize: '1.02rem', lineHeight: 1.8 }}>
            {blog.content && blog.content.map((sec, idx) => (
              <div key={idx} style={{ marginBottom: '2rem' }}>
                <h3 className="serif-heading" style={{ fontSize: '1.4rem', color: 'var(--accent-primary)', marginBottom: '0.75rem' }}>
                  {sec.heading}
                </h3>
                <p style={{ whiteSpace: 'pre-line', color: 'var(--text-muted)' }}>
                  {sec.body}
                </p>
              </div>
            ))}
          </div>

          {/* Admin Add Section Trigger & Form */}
          {isAdminLoggedIn && (
            <div style={{ marginBottom: '2.5rem' }}>
              {!showAddSectionForm ? (
                <button
                  type="button"
                  onClick={() => setShowAddSectionForm(true)}
                  className="btn-outline"
                  style={{
                    fontSize: '0.85rem',
                    padding: '0.45rem 1rem',
                    gap: '6px',
                    borderColor: 'var(--accent-emerald)',
                    color: 'var(--accent-emerald)',
                    background: 'rgba(16, 185, 129, 0.05)'
                  }}
                >
                  <Plus size={16} /> Add New Section to Blog
                </button>
              ) : (
                <form onSubmit={handleAddSectionSubmit} style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.25)', padding: '1.25rem', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <Plus size={18} color="var(--accent-emerald)" />
                    <h4 style={{ margin: 0, color: 'var(--accent-emerald)', fontSize: '1.05rem', fontWeight: 700 }}>
                      Add New Content Section
                    </h4>
                  </div>

                  <div style={{ marginBottom: '0.85rem' }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
                      Section Heading *
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder={`e.g. ${(blog.content?.length || 0) + 1}. Additional Statutory Directives`}
                      value={newSectionHeading}
                      onChange={(e) => setNewSectionHeading(e.target.value)}
                      style={{ width: '100%', padding: '0.6rem 0.8rem', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600 }}
                    />
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
                      Section Detailed Body *
                    </label>
                    <textarea 
                      required
                      rows={4}
                      placeholder="Enter detailed statutory provisions, clauses, or updates..."
                      value={newSectionBody}
                      onChange={(e) => setNewSectionBody(e.target.value)}
                      style={{ width: '100%', padding: '0.6rem 0.8rem', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: '8px', fontSize: '0.9rem' }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                    <button type="button" onClick={() => setShowAddSectionForm(false)} className="btn-outline" style={{ fontSize: '0.82rem' }}>Cancel</button>
                    <button type="submit" className="btn-primary" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', fontSize: '0.85rem' }}>
                      <Plus size={16} /> Save Section
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Statutory FAQ Section */}
          <FAQSection 
            faqs={blog.faqs} 
            isAdminLoggedIn={isAdminLoggedIn}
            onAddFaqClick={() => setShowAddFaqForm(!showAddFaqForm)}
          />

          {/* Inline Add FAQ Form for Admin */}
          {showAddFaqForm && (
            <form onSubmit={handleAddFaqSubmit} style={{ background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.25)', padding: '1.25rem', borderRadius: '12px', marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Plus size={18} color="var(--accent-primary)" />
                <h4 style={{ margin: 0, color: 'var(--accent-primary)', fontSize: '1.05rem', fontWeight: 700 }}>
                  Add New Statutory FAQ Item
                </h4>
              </div>

              <div style={{ marginBottom: '0.85rem' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
                  Question *
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Is title insurance mandatory under this state act?"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.8rem', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: '8px', fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
                  Answer *
                </label>
                <textarea 
                  required
                  rows={3}
                  placeholder="e.g. Yes, under Section 14, title insurance policy is required prior to deed registration."
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.8rem', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: '8px', fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem' }}>
                <button type="button" onClick={() => setShowAddFaqForm(false)} className="btn-outline" style={{ fontSize: '0.82rem' }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ fontSize: '0.82rem' }}>
                  <Plus size={15} /> Save FAQ
                </button>
              </div>
            </form>
          )}

          {/* Interactive Community Q&A & Legal Discussion */}
          <BlogCommentsSection 
            blogId={blog.id}
            blogTitle={blog.title}
            comments={comments}
            currentUser={currentUser}
            isAdminLoggedIn={isAdminLoggedIn}
            onAddComment={onAddComment}
            onAddAdminReply={onAddAdminReply}
            onLikeComment={onLikeComment}
            onOpenAuth={onOpenAuth}
          />

          {/* Next Blog / Related Articles Section (Per Wireframe #3) */}
          {relatedBlogs.length > 0 && (
            <div style={{
              marginTop: '3rem',
              paddingTop: '2rem',
              borderTop: '2px dashed var(--border-color)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
                <BookOpen size={22} color="var(--accent-primary)" />
                <h3 className="serif-heading" style={{ fontSize: '1.4rem', margin: 0, color: 'var(--text-main)' }}>
                  Next Related Blogs & Acts
                </h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                {relatedBlogs.map((rel) => (
                  <div 
                    key={rel.id} 
                    onClick={() => {
                      onSelectBlog(rel);
                    }}
                    style={{
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '10px',
                      padding: '1rem',
                      cursor: 'pointer',
                      transition: 'var(--transition)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
                  >
                    <span className={`badge badge-${rel.level}`} style={{ fontSize: '0.68rem', marginBottom: '4px' }}>
                      {rel.level} • {rel.country}
                    </span>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: 700, margin: '6px 0', color: 'var(--text-main)', lineHeight: 1.3 }}>
                      {rel.title}
                    </h4>
                    <span style={{ fontSize: '0.78rem', color: 'var(--accent-primary)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      Read Blog <ArrowRight size={12} />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          </>
          )}

        </div>

      </div>
    </div>
  );
}
