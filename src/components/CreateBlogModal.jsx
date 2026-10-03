import React, { useState } from 'react';
import { X, Plus, Sparkles, CheckCircle2, Trash2, HelpCircle } from 'lucide-react';
import { CATEGORIES } from '../data/blogsData';

export default function CreateBlogModal({ isOpen, onClose, onAddBlog }) {
  const [formData, setFormData] = useState({
    title: '',
    level: 'country',
    country: 'India',
    state: '',
    city: '',
    latitude: '20.5937',
    longitude: '78.9629',
    category: 'RERA & Protection',
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b2?auto=format&fit=crop&w=1200&q=80',
    summary: '',
    sectionHeading: '1. Legislative Overview',
    sectionBody: '',
    faqs: [{ question: '', answer: '' }]
  });

  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleAddFaqItem = () => {
    setFormData(prev => ({
      ...prev,
      faqs: [...prev.faqs, { question: '', answer: '' }]
    }));
  };

  const handleFaqChange = (index, field, value) => {
    setFormData(prev => {
      const updated = [...prev.faqs];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, faqs: updated };
    });
  };

  const handleRemoveFaqItem = (index) => {
    setFormData(prev => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.summary || !formData.sectionBody) {
      alert('Please fill in required fields (Title, Summary, and Body content)');
      return;
    }

    const validFaqs = formData.faqs
      .filter(f => f.question.trim() !== '')
      .map(f => ({ question: f.question.trim(), answer: f.answer.trim() }));

    const newBlog = {
      id: `custom-${Date.now()}`,
      title: formData.title,
      slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      level: formData.level,
      country: formData.country,
      state: formData.state || 'General',
      city: formData.city || formData.state || formData.country,
      coordinates: [parseFloat(formData.latitude) || 20.5937, parseFloat(formData.longitude) || 78.9629],
      category: formData.category,
      date: 'Just Now',
      readTime: '5 min read',
      featured: true,
      image: formData.image,
      summary: formData.summary,
      author: {
        name: "User Legal Contributor",
        title: "Verified Real Estate Legal Author",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
      },
      content: [
        {
          heading: formData.sectionHeading || "1. Statutory Framework",
          body: formData.sectionBody
        }
      ],
      faqs: validFaqs
    };

    onAddBlog(newBlog);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '750px' }} onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-glass)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={20} color="var(--accent-primary)" />
            <h3 className="serif-heading" style={{ fontSize: '1.3rem', margin: 0, color: 'var(--text-main)' }}>
              Publish New Land Law & Property Blog
            </h3>
          </div>

          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={22} />
          </button>
        </div>

        {submitted ? (
          <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
            <CheckCircle2 size={56} color="var(--accent-emerald)" style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.5rem', color: 'var(--text-main)' }}>Blog Published Successfully!</h3>
            <p style={{ color: 'var(--text-muted)' }}>Your article is now live on the interactive World Map and Directory.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
            
            {/* Title & Level */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Blog Title *
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Haryana Land Revenue Code & RERA Rules"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.8rem',
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-main)',
                    borderRadius: '8px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Jurisdiction Level *
                </label>
                <select 
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.8rem',
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-main)',
                    borderRadius: '8px'
                  }}
                >
                  <option value="country">Country Law</option>
                  <option value="state">State Law</option>
                  <option value="city">City Law</option>
                </select>
              </div>
            </div>

            {/* Geography & Category */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>Country</label>
                <input 
                  type="text" 
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.8rem', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: '8px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>State / Province</label>
                <input 
                  type="text" 
                  placeholder="e.g. Haryana / Texas"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.8rem', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: '8px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>City Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Gurugram / Austin"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.8rem', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: '8px' }}
                />
              </div>
            </div>

            {/* Category & Image */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>Legal Category</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.8rem', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: '8px' }}
                >
                  {CATEGORIES.filter(c => c !== "All Categories").map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>Featured Image URL</label>
                <input 
                  type="url" 
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.8rem', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: '8px' }}
                />
              </div>
            </div>

            {/* Summary */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>Executive Summary *</label>
              <textarea 
                required
                rows={2}
                placeholder="Brief summary of the statutory act, buyer impact, or circle rates..."
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                style={{ width: '100%', padding: '0.6rem 0.8rem', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: '8px' }}
              />
            </div>

            {/* Main Section */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>Section 1 Body Content *</label>
              <textarea 
                required
                rows={4}
                placeholder="Detailed legal clauses, provisions, section details, or developer requirements..."
                value={formData.sectionBody}
                onChange={(e) => setFormData({ ...formData, sectionBody: e.target.value })}
                style={{ width: '100%', padding: '0.6rem 0.8rem', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: '8px' }}
              />
            </div>

            {/* Dynamic Statutory FAQs Section */}
            <div style={{ background: 'rgba(59, 130, 246, 0.04)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(59, 130, 246, 0.15)', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <HelpCircle size={16} color="var(--accent-primary)" />
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
                    Statutory FAQs ({formData.faqs.length})
                  </span>
                </div>
                <button 
                  type="button" 
                  onClick={handleAddFaqItem}
                  className="btn-outline"
                  style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem', gap: '4px' }}
                >
                  <Plus size={13} /> Add FAQ
                </button>
              </div>

              {formData.faqs.map((faqItem, index) => (
                <div 
                  key={index} 
                  style={{ 
                    background: 'var(--bg-primary)', 
                    border: '1px solid var(--border-color)', 
                    borderRadius: '8px', 
                    padding: '0.85rem', 
                    marginBottom: index === formData.faqs.length - 1 ? 0 : '0.75rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                      FAQ #{index + 1}
                    </span>
                    {formData.faqs.length > 1 && (
                      <button 
                        type="button"
                        onClick={() => handleRemoveFaqItem(index)}
                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '2px' }}
                        title="Remove FAQ"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>

                  <input 
                    type="text" 
                    placeholder="Question e.g. Is stamp duty refundable if contract is canceled?"
                    value={faqItem.question}
                    onChange={(e) => handleFaqChange(index, 'question', e.target.value)}
                    style={{ width: '100%', padding: '0.5rem 0.8rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: '6px', marginBottom: '0.4rem', fontSize: '0.85rem' }}
                  />
                  <input 
                    type="text" 
                    placeholder="Answer e.g. Yes, under Section 48, up to 98% duty is refundable within 6 months."
                    value={faqItem.answer}
                    onChange={(e) => handleFaqChange(index, 'answer', e.target.value)}
                    style={{ width: '100%', padding: '0.5rem 0.8rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: '6px', fontSize: '0.85rem' }}
                  />
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button type="button" onClick={onClose} className="btn-outline">Cancel</button>
              <button type="submit" className="btn-primary">
                <Plus size={16} /> Publish Blog
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
