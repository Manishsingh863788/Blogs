import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  PenTool, 
  Plus, 
  Trash2, 
  Eye, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  Globe, 
  Building2, 
  MapPin, 
  Star,
  Search,
  Upload,
  Image as ImageIcon,
  X,
  LogOut,
  KeyRound,
  Lock,
  HelpCircle,
  Pencil,
  MessageSquare,
  Send,
  CornerDownRight,
  Clock,
  Heart
} from 'lucide-react';
import { CATEGORIES } from '../data/blogsData';

export default function AdminPage({ 
  blogs, 
  onAddBlog, 
  onDeleteBlog, 
  onToggleFeatured, 
  onSelectBlog,
  onLogout,
  adminCreds = { username: 'admin', password: 'adminpassword' },
  onUpdateCreds,
  onAddFaqToBlog,
  onAddSectionToBlog,
  onUpdateBlog,
  comments = [],
  onAddAdminReply,
  onDeleteComment,
  initialLevel = 'country',
  initialCountry = 'India'
}) {
  const [activeAdminTab, setActiveAdminTab] = useState('write'); // 'write', 'manage', 'qa', 'security'
  const [adminSearch, setAdminSearch] = useState('');
  const [manageFilter, setManageFilter] = useState('all'); // 'all', 'country', 'state', 'city'
  const [qaFilter, setQaFilter] = useState('all'); // 'all', 'pending', 'answered'
  const [inlineReplyState, setInlineReplyState] = useState({});

  // Security credentials change state
  const [newUsername, setNewUsername] = useState(adminCreds.username || 'admin');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securitySuccess, setSecuritySuccess] = useState('');
  const [securityError, setSecurityError] = useState('');

  // Add FAQ to existing published blog modal state
  const [selectedBlogForFaq, setSelectedBlogForFaq] = useState(null);
  const [newFaqQuestion, setNewFaqQuestion] = useState('');
  const [newFaqAnswer, setNewFaqAnswer] = useState('');

  // Add Section to existing published blog modal state
  const [selectedBlogForSection, setSelectedBlogForSection] = useState(null);
  const [newSectionHeading, setNewSectionHeading] = useState('');
  const [newSectionBody, setNewSectionBody] = useState('');

  // Custom Country input state
  const [isCustomCountry, setIsCustomCountry] = useState(false);
  const [customCountryInput, setCustomCountryInput] = useState('');

  const handleCountrySelectChange = (e) => {
    const selectedVal = e.target.value;
    if (selectedVal === 'Custom') {
      setIsCustomCountry(true);
      setFormData(prev => ({ ...prev, country: customCountryInput.trim() || '' }));
    } else {
      setIsCustomCountry(false);
      setFormData(prev => ({ ...prev, country: selectedVal }));
    }
  };

  const handleCustomCountryChange = (e) => {
    const val = e.target.value;
    setCustomCountryInput(val);
    setFormData(prev => ({ ...prev, country: val }));
  };

  // Full Article Edit Modal state
  const [editingBlog, setEditingBlog] = useState(null);
  const [editFormData, setEditFormData] = useState(null);

  const handleStartEditBlog = (blogToEdit) => {
    setEditingBlog(blogToEdit);
    setEditFormData({
      id: blogToEdit.id,
      title: blogToEdit.title || '',
      level: blogToEdit.level || 'country',
      country: blogToEdit.country || 'India',
      state: blogToEdit.state || '',
      city: blogToEdit.city || '',
      category: blogToEdit.category || 'RERA & Protection',
      image: blogToEdit.image || '',
      summary: blogToEdit.summary || '',
      sections: blogToEdit.content && blogToEdit.content.length > 0
        ? blogToEdit.content.map(s => ({ heading: s.heading || '', body: s.body || '' }))
        : [{ heading: '1. Statutory Overview', body: '' }],
      faqs: blogToEdit.faqs && blogToEdit.faqs.length > 0
        ? blogToEdit.faqs.map(f => ({ question: f.question || '', answer: f.answer || '' }))
        : [{ question: '', answer: '' }]
    });
  };

  const handleEditSectionAdd = () => {
    setEditFormData(prev => ({
      ...prev,
      sections: [...prev.sections, { heading: `${prev.sections.length + 1}. Statutory Provisions`, body: '' }]
    }));
  };

  const handleEditSectionChange = (index, field, value) => {
    setEditFormData(prev => {
      const updated = [...prev.sections];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, sections: updated };
    });
  };

  const handleEditSectionRemove = (index) => {
    setEditFormData(prev => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index)
    }));
  };

  const handleEditFaqAdd = () => {
    setEditFormData(prev => ({
      ...prev,
      faqs: [...prev.faqs, { question: '', answer: '' }]
    }));
  };

  const handleEditFaqChange = (index, field, value) => {
    setEditFormData(prev => {
      const updated = [...prev.faqs];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, faqs: updated };
    });
  };

  const handleEditFaqRemove = (index) => {
    setEditFormData(prev => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index)
    }));
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editFormData.title || !editFormData.summary) {
      alert('Please fill in Title and Executive Summary');
      return;
    }

    const validSections = editFormData.sections
      .filter(s => s.heading.trim() !== '' || s.body.trim() !== '')
      .map(s => ({ heading: s.heading.trim(), body: s.body.trim() }));

    const validFaqs = editFormData.faqs
      .filter(f => f.question.trim() !== '')
      .map(f => ({ question: f.question.trim(), answer: f.answer.trim() }));

    const updatedBlog = {
      ...editingBlog,
      title: editFormData.title,
      level: editFormData.level,
      country: editFormData.country,
      state: editFormData.state || (editFormData.level === 'country' ? 'National' : 'General'),
      city: editFormData.city || editFormData.state || editFormData.country,
      category: editFormData.category,
      image: editFormData.image,
      summary: editFormData.summary,
      content: validSections,
      faqs: validFaqs
    };

    if (onUpdateBlog) {
      onUpdateBlog(updatedBlog);
    }

    setEditingBlog(null);
    setEditFormData(null);
  };

  const [formData, setFormData] = useState({
    title: '',
    level: initialLevel,
    country: initialCountry,
    state: '',
    city: '',
    latitude: '20.5937',
    longitude: '78.9629',
    category: 'RERA & Protection',
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b2?auto=format&fit=crop&w=1200&q=80',
    summary: '',
    sections: [{ heading: '1. Statutory Framework & Legislative Directives', body: '' }],
    faqs: [{ question: '', answer: '' }]
  });

  const [submitted, setSubmitted] = useState(false);

  // Dynamic Section handlers for creation form
  const handleAddSectionItem = () => {
    setFormData(prev => ({
      ...prev,
      sections: [...prev.sections, { heading: `${prev.sections.length + 1}. Statutory Framework & Provisions`, body: '' }]
    }));
  };

  const handleSectionChange = (index, field, value) => {
    setFormData(prev => {
      const updated = [...prev.sections];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, sections: updated };
    });
  };

  const handleRemoveSectionItem = (index) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index)
    }));
  };

  // Dynamic FAQ handlers for creation form
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

  // Handle local image file upload and convert to base64 Data URL
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image file size should be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Sync initial props if navigated directly from country subblog button
  useEffect(() => {
    if (initialLevel) {
      setFormData(prev => ({ ...prev, level: initialLevel }));
    }
    if (initialCountry) {
      setFormData(prev => ({ ...prev, country: initialCountry }));
    }
  }, [initialLevel, initialCountry]);

  // Extract unique country list from existing blogs
  const existingCountries = Array.from(new Set(blogs.map(b => b.country))).filter(Boolean);

  const handleSubmit = (e) => {
    e.preventDefault();
    const validSections = formData.sections
      .filter(s => s.heading.trim() !== '' || s.body.trim() !== '')
      .map(s => ({ heading: s.heading.trim(), body: s.body.trim() }));

    if (!formData.title || !formData.summary || validSections.length === 0) {
      alert('Please complete all required fields (Title, Summary, and at least one Section)');
      return;
    }

    const validFaqs = formData.faqs
      .filter(f => f.question.trim() !== '')
      .map(f => ({ question: f.question.trim(), answer: f.answer.trim() }));

    const newBlog = {
      id: `${formData.level}-${Date.now()}`,
      title: formData.title,
      slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      level: formData.level,
      country: formData.country,
      state: formData.state || (formData.level === 'country' ? 'National' : 'General'),
      city: formData.city || formData.state || formData.country,
      coordinates: [parseFloat(formData.latitude) || 20.5937, parseFloat(formData.longitude) || 78.9629],
      category: formData.category,
      date: 'Just Now',
      readTime: '6 min read',
      featured: true,
      image: formData.image,
      summary: formData.summary,
      author: {
        name: "Jaideep Singh & Legal Council",
        title: "Senior Real Estate Legal Registrar",
        avatar: "/writer.jpg"
      },
      content: validSections,
      faqs: validFaqs
    };

    onAddBlog(newBlog);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setIsCustomCountry(false);
      setCustomCountryInput('');
      // Reset form
      setFormData({
        title: '',
        level: 'state',
        country: 'India',
        state: '',
        city: '',
        latitude: '20.5937',
        longitude: '78.9629',
        category: 'RERA & Protection',
        image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b2?auto=format&fit=crop&w=1200&q=80',
        summary: '',
        sections: [{ heading: '1. Statutory Framework & Legislative Directives', body: '' }],
        faqs: [{ question: '', answer: '' }]
      });
      setActiveAdminTab('manage');
    }, 1500);
  };

  const handleSaveFaqToExistingBlog = (e) => {
    e.preventDefault();
    if (!newFaqQuestion.trim() || !newFaqAnswer.trim()) {
      alert('Please fill in both Question and Answer');
      return;
    }

    if (onAddFaqToBlog && selectedBlogForFaq) {
      onAddFaqToBlog(selectedBlogForFaq.id, {
        question: newFaqQuestion.trim(),
        answer: newFaqAnswer.trim()
      });
    }

    setSelectedBlogForFaq(null);
    setNewFaqQuestion('');
    setNewFaqAnswer('');
  };

  const handleSaveSectionToExistingBlog = (e) => {
    e.preventDefault();
    if (!newSectionHeading.trim() || !newSectionBody.trim()) {
      alert('Please fill in both Section Heading and Body');
      return;
    }

    if (onAddSectionToBlog && selectedBlogForSection) {
      onAddSectionToBlog(selectedBlogForSection.id, {
        heading: newSectionHeading.trim(),
        body: newSectionBody.trim()
      });
    }

    setSelectedBlogForSection(null);
    setNewSectionHeading('');
    setNewSectionBody('');
  };

  const handleUpdateSecurity = (e) => {
    e.preventDefault();
    setSecurityError('');
    setSecuritySuccess('');

    if (!newUsername.trim()) {
      setSecurityError('Admin ID cannot be empty');
      return;
    }
    if (newPassword && newPassword !== confirmPassword) {
      setSecurityError('Passwords do not match');
      return;
    }

    const updated = {
      username: newUsername.trim(),
      password: newPassword ? newPassword : adminCreds.password
    };

    if (onUpdateCreds) {
      onUpdateCreds(updated);
    }
    setSecuritySuccess('Admin credentials updated successfully!');
    setNewPassword('');
    setConfirmPassword('');
  };

  // Filter manage blogs
  const filteredManageBlogs = blogs.filter(b => {
    if (manageFilter === 'country' && b.level !== 'country') return false;
    if (manageFilter === 'state' && b.level !== 'state') return false;
    if (manageFilter === 'city' && b.level !== 'city') return false;

    if (adminSearch.trim() !== '') {
      const q = adminSearch.toLowerCase();
      return (
        b.title.toLowerCase().includes(q) ||
        b.country.toLowerCase().includes(q) ||
        (b.state && b.state.toLowerCase().includes(q)) ||
        b.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const countCountry = blogs.filter(b => b.level === 'country').length;
  const countState = blogs.filter(b => b.level === 'state').length;
  const countCity = blogs.filter(b => b.level === 'city').length;

  return (
    <div style={{ paddingBottom: '4rem' }}>
      
      {/* Admin Portal Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(59, 130, 246, 0.12) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.25)',
        borderRadius: '20px',
        padding: 'clamp(1.5rem, 4vw, 2.5rem) clamp(1rem, 3vw, 2rem)',
        marginBottom: '2.5rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Top Right Logout Button */}
        {onLogout && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Logged in as <strong style={{ color: 'var(--accent-emerald)' }}>{adminCreds?.username || 'Admin'}</strong>
            </span>
            <button
              onClick={onLogout}
              className="btn-outline"
              style={{
                padding: '0.35rem 0.75rem',
                fontSize: '0.8rem',
                background: 'rgba(239, 68, 68, 0.1)',
                borderColor: 'rgba(239, 68, 68, 0.3)',
                color: '#ef4444'
              }}
              title="Log Out of Admin Portal"
            >
              <LogOut size={14} /> Log Out
            </button>
          </div>
        )}

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(16, 185, 129, 0.2)', color: 'var(--accent-emerald)', padding: '0.4rem 1rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '1rem' }}>
          <ShieldCheck size={16} /> Admin Control Center
        </div>

        <h1 className="serif-heading" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', color: 'var(--text-main)', marginBottom: '0.75rem' }}>
          Statutory Blog Authoring & Admin Portal
        </h1>

        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '700px', margin: '0 auto 2rem auto', lineHeight: 1.6 }}>
          Publish new country laws, state revenue acts, and city municipal codes. Manage published statutory content and organize regional legal frameworks.
        </p>

        {/* Analytics Counter Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(135px, 1fr))',
          gap: '1rem',
          maxWidth: '850px',
          margin: '0 auto'
        }}>
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '1.25rem', textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
              Total Published
            </span>
            <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)' }}>{blogs.length}</span>
          </div>

          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '1.25rem', textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-primary)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
              Country Laws
            </span>
            <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-primary)' }}>{countCountry}</span>
          </div>

          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '1.25rem', textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--badge-state)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
              State Laws
            </span>
            <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--badge-state)' }}>{countState}</span>
          </div>

          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '1.25rem', textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--badge-city)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
              City Municipal
            </span>
            <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--badge-city)' }}>{countCity}</span>
          </div>
        </div>
      </div>

      {/* Admin Action Tabs Switcher */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveAdminTab('write')}
          className={activeAdminTab === 'write' ? 'btn-primary' : 'btn-outline'}
          style={{
            padding: '0.65rem 1.4rem',
            fontSize: '0.95rem',
            background: activeAdminTab === 'write' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : undefined
          }}
        >
          <PenTool size={18} /> Write & Publish New Blog
        </button>

        <button
          onClick={() => setActiveAdminTab('manage')}
          className={activeAdminTab === 'manage' ? 'btn-primary' : 'btn-outline'}
          style={{ padding: '0.65rem 1.4rem', fontSize: '0.95rem' }}
        >
          <Layers size={18} /> Manage Published Articles ({blogs.length})
        </button>

        <button
          onClick={() => setActiveAdminTab('qa')}
          className={activeAdminTab === 'qa' ? 'btn-primary' : 'btn-outline'}
          style={{
            padding: '0.65rem 1.4rem',
            fontSize: '0.95rem',
            background: activeAdminTab === 'qa' ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' : undefined,
            borderColor: activeAdminTab === 'qa' ? '#3b82f6' : undefined
          }}
        >
          <MessageSquare size={18} /> User Inquiries & Q&A ({comments.length})
        </button>

        <button
          onClick={() => setActiveAdminTab('security')}
          className={activeAdminTab === 'security' ? 'btn-primary' : 'btn-outline'}
          style={{ padding: '0.65rem 1.4rem', fontSize: '0.95rem' }}
        >
          <KeyRound size={18} /> Admin Security
        </button>
      </div>

      {/* TAB 1: WRITE & PUBLISH NEW BLOG */}
      {activeAdminTab === 'write' && (
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          padding: '2rem',
          maxWidth: '900px',
          margin: '0 auto',
          boxShadow: 'var(--shadow-lg)'
        }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingBottom: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
            <Sparkles size={24} color="var(--accent-emerald)" />
            <div>
              <h2 className="serif-heading" style={{ fontSize: '1.5rem', color: 'var(--text-main)', margin: 0 }}>
                Publish New Real Estate & Statutory Law Blog
              </h2>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Create country statutory acts, state revenue acts, or city zoning frameworks.
              </span>
            </div>
          </div>

          {submitted ? (
            <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
              <CheckCircle2 size={60} color="var(--accent-emerald)" style={{ margin: '0 auto 1rem auto' }} />
              <h3 style={{ fontSize: '1.6rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                Blog Published Successfully!
              </h3>
              <p style={{ color: 'var(--text-muted)' }}>
                Your article is now live under country/state directories and indexed on the interactive map. Redirecting to management matrix...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              
              {/* Row 1: Jurisdiction Level & Country */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                    Jurisdiction Level *
                  </label>
                  <select 
                    value={formData.level}
                    onChange={(e) => {
                      const newLevel = e.target.value;
                      setFormData({ 
                        ...formData, 
                        level: newLevel,
                        sectionHeading: newLevel === 'state' 
                          ? '1. State Statutory Provisions & Revenue Directives' 
                          : '1. Statutory Framework & Legislative Overview'
                      });
                    }}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-main)',
                      borderRadius: '10px',
                      fontSize: '0.95rem'
                    }}
                  >
                    <option value="country">Country Statutory Act</option>
                    <option value="state">State Law (Revenue / Regional)</option>
                    <option value="city">City Municipal & Zoning Bylaws</option>
                  </select>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
                    {formData.level === 'state' 
                      ? 'State laws detail regional land revenue and property directives.'
                      : formData.level === 'country'
                      ? 'Country acts detail national legislation and statutory codes.'
                      : 'City bylaws detail FAR, master plans, and local setbacks.'}
                  </span>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                    Parent / Target Country *
                  </label>
                  <select
                    value={isCustomCountry ? 'Custom' : (existingCountries.includes(formData.country) ? formData.country : 'Custom')}
                    onChange={handleCountrySelectChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-main)',
                      borderRadius: '10px',
                      fontSize: '0.95rem'
                    }}
                  >
                    {existingCountries.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                    <option value="Custom">Custom Country (Type below)</option>
                  </select>

                  {(isCustomCountry || (formData.country && !existingCountries.includes(formData.country))) && (
                    <input 
                      type="text" 
                      required
                      placeholder="Type country name e.g. Singapore, Australia, Canada"
                      value={customCountryInput || (existingCountries.includes(formData.country) ? '' : formData.country)}
                      onChange={handleCustomCountryChange}
                      style={{ 
                        width: '100%', 
                        marginTop: '0.5rem', 
                        padding: '0.6rem 0.8rem', 
                        background: 'var(--bg-primary)', 
                        border: '1px solid var(--accent-emerald)', 
                        color: 'var(--text-main)', 
                        borderRadius: '8px',
                        fontSize: '0.9rem'
                      }}
                    />
                  )}
                </div>
              </div>

              {/* Row 2: Title */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                  Blog Title *
                </label>
                <input 
                  type="text" 
                  required
                  placeholder={formData.level === 'state' ? "e.g. Karnataka Land Revenue Act & RERA Directives" : "e.g. France National Real Estate & Tax Code 2026"}
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-main)',
                    borderRadius: '10px',
                    fontSize: '0.95rem'
                  }}
                />
              </div>

              {/* Row 3: State & City */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                    State / Province Name {formData.level === 'state' ? '*' : '(Optional)'}
                  </label>
                  <input 
                    type="text" 
                    required={formData.level === 'state'}
                    placeholder="e.g. Maharashtra, California, Texas, Ontario"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: '10px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                    City / Metro Region
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. Bengaluru, San Jose, Houston"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: '10px' }}
                  />
                </div>
              </div>

              {/* Row 5: Banner Picture Upload & URL */}
              <div style={{ 
                background: 'rgba(255, 255, 255, 0.02)', 
                border: '1px solid var(--border-color)', 
                borderRadius: '12px', 
                padding: '1.25rem', 
                marginBottom: '1.25rem' 
              }}>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: 'var(--accent-emerald)', marginBottom: '8px' }}>
                  Blog Feature Picture *
                </label>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', alignItems: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    
                    {/* Option 1: File Upload */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <input 
                        type="file" 
                        id="blog-image-file-input" 
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                      />
                      <label 
                        htmlFor="blog-image-file-input"
                        className="btn-primary"
                        style={{
                          cursor: 'pointer',
                          padding: '0.55rem 1.1rem',
                          fontSize: '0.85rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                        }}
                      >
                        <Upload size={16} /> Choose Picture File from Device
                      </label>

                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>OR paste web image URL:</span>
                    </div>

                    {/* Option 2: Image URL input */}
                    <input 
                      type="url" 
                      placeholder="https://images.unsplash.com/... or Base64 image data"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      style={{ 
                        width: '100%', 
                        padding: '0.65rem 0.9rem', 
                        background: 'var(--bg-primary)', 
                        border: '1px solid var(--border-color)', 
                        color: 'var(--text-main)', 
                        borderRadius: '8px',
                        fontSize: '0.88rem'
                      }}
                    />
                  </div>

                  {/* Live Thumbnail Preview */}
                  {formData.image && (
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ 
                        width: '120px', 
                        height: '80px', 
                        borderRadius: '10px', 
                        overflow: 'hidden', 
                        border: '2px solid var(--accent-emerald)',
                        position: 'relative',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                      }}>
                        <img 
                          src={formData.image} 
                          alt="Picture Preview" 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b2?auto=format&fit=crop&w=1200&q=80";
                          }}
                        />
                      </div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--accent-emerald)', fontWeight: 700, display: 'block', marginTop: '4px' }}>
                        Picture Preview
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Executive Summary */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                  Executive Summary *
                </label>
                <textarea 
                  required
                  rows={3}
                  placeholder="Key provisions, stamp duty updates, carpet area rules, or buyer rights summary..."
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: '10px' }}
                />
              </div>

              {/* Dynamic Blog Content Sections */}
              <div style={{ background: 'rgba(16, 185, 129, 0.04)', border: '1px solid rgba(16, 185, 129, 0.18)', borderRadius: '14px', padding: '1.25rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Layers size={18} color="var(--accent-emerald)" />
                    <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-emerald)' }}>
                      Blog Content Sections ({formData.sections.length})
                    </span>
                  </div>
                  <button 
                    type="button" 
                    onClick={handleAddSectionItem}
                    className="btn-outline"
                    style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem', gap: '4px', borderColor: 'var(--accent-emerald)', color: 'var(--accent-emerald)' }}
                  >
                    <Plus size={14} /> Add Another Section
                  </button>
                </div>

                {formData.sections.map((secItem, index) => (
                  <div 
                    key={index} 
                    style={{ 
                      background: 'var(--bg-primary)', 
                      border: '1px solid var(--border-color)', 
                      borderRadius: '10px', 
                      padding: '1rem', 
                      marginBottom: index === formData.sections.length - 1 ? 0 : '1rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                        Section #{index + 1}
                      </span>
                      {formData.sections.length > 1 && (
                        <button 
                          type="button"
                          onClick={() => handleRemoveSectionItem(index)}
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '2px' }}
                          title="Remove Section"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>

                    <input 
                      type="text" 
                      placeholder="Section Heading e.g. 1. Statutory Provisions & Developer Directives"
                      value={secItem.heading}
                      onChange={(e) => handleSectionChange(index, 'heading', e.target.value)}
                      style={{ width: '100%', padding: '0.6rem 0.8rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: '8px', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}
                    />
                    <textarea 
                      rows={4}
                      placeholder="Elaborate statutory clauses, legal provisions, developer rules, land revenue procedures..."
                      value={secItem.body}
                      onChange={(e) => handleSectionChange(index, 'body', e.target.value)}
                      style={{ width: '100%', padding: '0.6rem 0.8rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: '8px', fontSize: '0.9rem' }}
                    />
                  </div>
                ))}
              </div>

              {/* Dynamic Statutory FAQs Section */}
              <div style={{ background: 'rgba(59, 130, 246, 0.04)', border: '1px solid rgba(59, 130, 246, 0.15)', borderRadius: '14px', padding: '1.25rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <HelpCircle size={18} color="var(--accent-primary)" />
                    <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
                      Statutory FAQs ({formData.faqs.length})
                    </span>
                  </div>
                  <button 
                    type="button" 
                    onClick={handleAddFaqItem}
                    className="btn-outline"
                    style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem', gap: '4px' }}
                  >
                    <Plus size={14} /> Add Another FAQ
                  </button>
                </div>

                {formData.faqs.map((faqItem, index) => (
                  <div 
                    key={index} 
                    style={{ 
                      background: 'var(--bg-primary)', 
                      border: '1px solid var(--border-color)', 
                      borderRadius: '10px', 
                      padding: '1rem', 
                      marginBottom: index === formData.faqs.length - 1 ? 0 : '1rem',
                      position: 'relative'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                        FAQ Item #{index + 1}
                      </span>
                      {formData.faqs.length > 1 && (
                        <button 
                          type="button"
                          onClick={() => handleRemoveFaqItem(index)}
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '2px' }}
                          title="Remove FAQ"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>

                    <input 
                      type="text" 
                      placeholder="Question e.g. What is the penalty for non-registration under this act?"
                      value={faqItem.question}
                      onChange={(e) => handleFaqChange(index, 'question', e.target.value)}
                      style={{ width: '100%', padding: '0.6rem 0.8rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: '8px', marginBottom: '0.5rem', fontSize: '0.88rem' }}
                    />
                    <input 
                      type="text" 
                      placeholder="Answer e.g. Penalties up to 10% of estimated project cost under Section 59."
                      value={faqItem.answer}
                      onChange={(e) => handleFaqChange(index, 'answer', e.target.value)}
                      style={{ width: '100%', padding: '0.6rem 0.8rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: '8px', fontSize: '0.88rem' }}
                    />
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button 
                  type="submit" 
                  className="btn-primary"
                  style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    padding: '0.75rem 2rem',
                    fontSize: '1rem'
                  }}
                >
                  <Plus size={18} /> Publish Statutory Blog
                </button>
              </div>

            </form>
          )}

        </div>
      )}

      {/* TAB 2: MANAGE PUBLISHED BLOGS */}
      {activeAdminTab === 'manage' && (
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          padding: '1.75rem'
        }}>
          
          {/* Controls bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            
            {/* Filter Pills */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                onClick={() => setManageFilter('all')}
                className={`btn-outline ${manageFilter === 'all' ? 'active' : ''}`}
                style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem', background: manageFilter === 'all' ? 'var(--accent-primary)' : undefined, color: manageFilter === 'all' ? '#fff' : undefined }}
              >
                All ({blogs.length})
              </button>
              <button 
                onClick={() => setManageFilter('country')}
                className={`btn-outline ${manageFilter === 'country' ? 'active' : ''}`}
                style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem', background: manageFilter === 'country' ? 'var(--badge-country)' : undefined, color: manageFilter === 'country' ? '#fff' : undefined }}
              >
                <Globe size={14} /> Country ({countCountry})
              </button>
              <button 
                onClick={() => setManageFilter('state')}
                className={`btn-outline ${manageFilter === 'state' ? 'active' : ''}`}
                style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem', background: manageFilter === 'state' ? 'var(--badge-state)' : undefined, color: manageFilter === 'state' ? '#fff' : undefined }}
              >
                <Building2 size={14} /> State Laws ({countState})
              </button>
              <button 
                onClick={() => setManageFilter('city')}
                className={`btn-outline ${manageFilter === 'city' ? 'active' : ''}`}
                style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem', background: manageFilter === 'city' ? 'var(--badge-city)' : undefined, color: manageFilter === 'city' ? '#fff' : undefined }}
              >
                <MapPin size={14} /> City ({countCity})
              </button>
            </div>

            {/* Search Box */}
            <div style={{ position: 'relative', width: '280px' }}>
              <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="text" 
                placeholder="Search published blogs..."
                value={adminSearch}
                onChange={(e) => setAdminSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem 0.5rem 2.4rem',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  color: 'var(--text-main)',
                  fontSize: '0.85rem'
                }}
              />
            </div>

          </div>

          {/* Blogs Management Matrix / Table */}
          <div className="admin-table-container" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Article Title</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Jurisdiction</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Location</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Category</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Featured</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredManageBlogs.map((b) => (
                  <tr 
                    key={b.id} 
                    style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    {/* Title & Image */}
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img 
                          src={b.image} 
                          alt={b.title} 
                          style={{ width: '48px', height: '36px', borderRadius: '6px', objectFit: 'cover' }}
                        />
                        <div>
                          <span style={{ fontWeight: 700, color: 'var(--text-main)', display: 'block', lineHeight: 1.3 }}>
                            {b.title}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            ID: {b.id}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Jurisdiction Level Badge */}
                    <td style={{ padding: '1rem' }}>
                      <span className={`badge badge-${b.level}`}>
                        {b.level === 'state' ? 'State Law' : b.level}
                      </span>
                    </td>

                    {/* Location */}
                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>
                      {b.level === 'city' ? `${b.city}, ${b.state}` : b.level === 'state' ? `${b.state}, ${b.country}` : b.country}
                    </td>

                    {/* Category */}
                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>
                      {b.category}
                    </td>

                    {/* Featured Toggle */}
                    <td style={{ padding: '1rem' }}>
                      <button
                        onClick={() => onToggleFeatured && onToggleFeatured(b.id)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          color: b.featured ? 'var(--accent-gold)' : 'var(--text-subtle)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '0.8rem'
                        }}
                        title="Toggle Featured"
                      >
                        <Star size={16} fill={b.featured ? 'var(--accent-gold)' : 'none'} />
                        {b.featured ? 'Featured' : 'Standard'}
                      </button>
                    </td>

                    {/* Action buttons */}
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.4rem', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => setSelectedBlogForSection(b)}
                          className="btn-outline"
                          style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem', gap: '4px', background: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.3)', color: 'var(--accent-emerald)' }}
                          title="Add Section to this Blog"
                        >
                          <Plus size={14} /> Section ({b.content ? b.content.length : 0})
                        </button>

                        <button
                          onClick={() => setSelectedBlogForFaq(b)}
                          className="btn-outline"
                          style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem', gap: '4px', background: 'rgba(59, 130, 246, 0.1)', borderColor: 'rgba(59, 130, 246, 0.3)', color: 'var(--accent-primary)' }}
                          title="Add Statutory FAQ to this Blog"
                        >
                          <Plus size={14} /> FAQ ({b.faqs ? b.faqs.length : 0})
                        </button>

                        <button
                          onClick={() => handleStartEditBlog(b)}
                          className="btn-outline"
                          style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem', gap: '4px', background: 'rgba(245, 158, 11, 0.1)', borderColor: 'rgba(245, 158, 11, 0.3)', color: '#f59e0b' }}
                          title="Edit Article & Content"
                        >
                          <Pencil size={14} /> Edit
                        </button>

                        <button
                          onClick={() => onSelectBlog(b)}
                          className="btn-outline"
                          style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem', gap: '4px' }}
                          title="View Article"
                        >
                          <Eye size={14} /> View
                        </button>

                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete "${b.title}"?`)) {
                              onDeleteBlog(b.id);
                            }
                          }}
                          style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            color: '#ef4444',
                            borderRadius: '6px',
                            padding: '0.35rem 0.65rem',
                            fontSize: '0.78rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                          title="Delete Blog"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredManageBlogs.length === 0 && (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                No published blogs match the selected search filter.
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 3: ADMIN SECURITY & CREDENTIALS SETTINGS */}
      {activeAdminTab === 'security' && (
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          padding: '2rem',
          maxWidth: '560px',
          margin: '0 auto',
          boxShadow: 'var(--shadow-lg)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingBottom: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
            <KeyRound size={24} color="var(--accent-emerald)" />
            <div>
              <h2 className="serif-heading" style={{ fontSize: '1.5rem', color: 'var(--text-main)', margin: 0 }}>
                Admin Security Settings
              </h2>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Update your login credentials (Admin ID & Password)
              </span>
            </div>
          </div>

          {securitySuccess && (
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', color: 'var(--accent-emerald)', padding: '0.75rem 1rem', borderRadius: '10px', marginBottom: '1.25rem', fontSize: '0.88rem' }}>
              {securitySuccess}
            </div>
          )}

          {securityError && (
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', padding: '0.75rem 1rem', borderRadius: '10px', marginBottom: '1.25rem', fontSize: '0.88rem' }}>
              {securityError}
            </div>
          )}

          <form onSubmit={handleUpdateSecurity}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                Admin ID / Username
              </label>
              <input 
                type="text"
                required
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: '10px' }}
              />
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                New Password (leave empty to keep existing)
              </label>
              <input 
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: '10px' }}
              />
            </div>

            {newPassword && (
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                  Confirm New Password
                </label>
                <input 
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: '10px' }}
                />
              </div>
            )}

            <button 
              type="submit"
              className="btn-primary"
              style={{
                width: '100%',
                padding: '0.8rem',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                fontSize: '0.95rem'
              }}
            >
              Update Admin Credentials
            </button>
          </form>
        </div>
      )}

      {/* TAB 4: USER INQUIRIES & BLOG Q&A MODERATION */}
      {activeAdminTab === 'qa' && (
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          padding: '2rem',
          maxWidth: '1000px',
          margin: '0 auto',
          boxShadow: 'var(--shadow-lg)'
        }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                padding: '0.5rem',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 12px rgba(59, 130, 246, 0.3)'
              }}>
                <MessageSquare size={20} color="#ffffff" />
              </div>
              <div>
                <h3 className="serif-heading" style={{ fontSize: '1.4rem', margin: 0, color: 'var(--text-main)' }}>
                  User Inquiries & Statutory Q&A
                </h3>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Review user questions asked across statutory acts and provide official legal replies
                </span>
              </div>
            </div>

            {/* Filter Pills */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setQaFilter('all')}
                className={qaFilter === 'all' ? 'btn-primary' : 'btn-outline'}
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
              >
                All ({comments.length})
              </button>
              <button
                type="button"
                onClick={() => setQaFilter('pending')}
                className={qaFilter === 'pending' ? 'btn-primary' : 'btn-outline'}
                style={{
                  padding: '0.4rem 0.8rem',
                  fontSize: '0.8rem',
                  background: qaFilter === 'pending' ? '#ef4444' : undefined,
                  borderColor: qaFilter === 'pending' ? '#ef4444' : undefined
                }}
              >
                Pending ({comments.filter(c => !c.replies || c.replies.length === 0).length})
              </button>
              <button
                type="button"
                onClick={() => setQaFilter('answered')}
                className={qaFilter === 'answered' ? 'btn-primary' : 'btn-outline'}
                style={{
                  padding: '0.4rem 0.8rem',
                  fontSize: '0.8rem',
                  background: qaFilter === 'answered' ? '#10b981' : undefined,
                  borderColor: qaFilter === 'answered' ? '#10b981' : undefined
                }}
              >
                Answered ({comments.filter(c => c.replies && c.replies.length > 0).length})
              </button>
            </div>
          </div>

          {/* Comments / Questions List */}
          {comments.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '3rem 1rem',
              background: 'var(--bg-primary)',
              borderRadius: '12px',
              border: '1px dashed var(--border-color)',
              color: 'var(--text-muted)'
            }}>
              <MessageSquare size={36} style={{ opacity: 0.35, margin: '0 auto 0.75rem auto' }} />
              <h4 style={{ margin: '0 0 4px 0', fontSize: '1.05rem', color: 'var(--text-main)' }}>No User Questions Yet</h4>
              <p style={{ margin: 0, fontSize: '0.85rem' }}>When users post legal queries on articles, they will appear here for administrator response.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {comments
                .filter(c => {
                  if (qaFilter === 'pending') return !c.replies || c.replies.length === 0;
                  if (qaFilter === 'answered') return c.replies && c.replies.length > 0;
                  return true;
                })
                .map((comm) => {
                  const hasAnswer = comm.replies && comm.replies.length > 0;
                  const replyText = inlineReplyState[comm.id] || '';

                  return (
                    <div 
                      key={comm.id}
                      style={{
                        background: 'var(--bg-primary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '12px',
                        padding: '1.25rem',
                        boxShadow: 'var(--card-shadow)'
                      }}
                    >
                      {/* Top Bar: Blog Title & Status Badge */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent-primary)', background: 'rgba(59, 130, 246, 0.08)', padding: '3px 8px', borderRadius: '6px' }}>
                          Article: {comm.blogTitle || 'Statutory Act'}
                        </span>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {hasAnswer ? (
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 8px', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                              <CheckCircle2 size={12} /> Answered ({comm.replies.length})
                            </span>
                          ) : (
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '2px 8px', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                              Pending Reply
                            </span>
                          )}

                          {onDeleteComment && (
                            <button
                              onClick={() => onDeleteComment(comm.id)}
                              style={{ background: 'none', border: 'none', color: 'var(--text-subtle)', cursor: 'pointer', padding: '2px' }}
                              title="Delete inquiry"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Question Content */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                        <img 
                          src={comm.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'} 
                          alt={comm.userName} 
                          style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                          <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)', display: 'block' }}>{comm.userName}</span>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{new Date(comm.createdAt).toLocaleString()}</span>
                        </div>
                      </div>

                      <p style={{ margin: '0 0 1rem 0', fontSize: '0.92rem', color: 'var(--text-main)', lineHeight: 1.5, background: 'var(--bg-secondary)', padding: '0.75rem 1rem', borderRadius: '8px' }}>
                        {comm.text}
                      </p>

                      {/* Existing Replies */}
                      {hasAnswer && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem', paddingLeft: '1rem', borderLeft: '2px solid #10b981' }}>
                          {comm.replies.map(rep => (
                            <div key={rep.id} style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '0.6rem 0.8rem', borderRadius: '8px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
                                <span style={{ fontWeight: 700, color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <ShieldCheck size={12} /> {rep.authorName}
                                </span>
                                <span style={{ color: 'var(--text-muted)' }}>{new Date(rep.createdAt).toLocaleDateString()}</span>
                              </div>
                              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-main)' }}>{rep.text}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Admin Inline Reply Box */}
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <input 
                          type="text"
                          placeholder="Type official legal guidance or response..."
                          value={replyText}
                          onChange={(e) => setInlineReplyState({ ...inlineReplyState, [comm.id]: e.target.value })}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && replyText.trim()) {
                              onAddAdminReply(comm.id, {
                                id: 'rep_' + Date.now(),
                                authorName: 'Home Drops Villa Legal Desk',
                                authorRole: 'Official Administrator',
                                isOfficialAdmin: true,
                                text: replyText.trim(),
                                createdAt: new Date().toISOString()
                              });
                              setInlineReplyState({ ...inlineReplyState, [comm.id]: '' });
                            }
                          }}
                          style={{
                            flex: 1,
                            padding: '0.6rem 0.85rem',
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--border-color)',
                            color: 'var(--text-main)',
                            borderRadius: '8px',
                            fontSize: '0.88rem'
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (!replyText.trim()) return;
                            onAddAdminReply(comm.id, {
                              id: 'rep_' + Date.now(),
                              authorName: 'Home Drops Villa Legal Desk',
                              authorRole: 'Official Administrator',
                              isOfficialAdmin: true,
                              text: replyText.trim(),
                              createdAt: new Date().toISOString()
                            });
                            setInlineReplyState({ ...inlineReplyState, [comm.id]: '' });
                          }}
                          className="btn-primary"
                          style={{
                            padding: '0.6rem 1rem',
                            fontSize: '0.85rem',
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            gap: '4px'
                          }}
                        >
                          <Send size={14} /> Send Reply
                        </button>
                      </div>

                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}

      {/* Add FAQ Modal for Existing Published Blog */}
      {selectedBlogForFaq && (
        <div className="modal-overlay" onClick={() => setSelectedBlogForFaq(null)}>
          <div 
            className="modal-content" 
            style={{ maxWidth: '520px', padding: 0, overflow: 'hidden' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              padding: '1.25rem 1.5rem',
              background: 'var(--bg-glass)',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <HelpCircle size={20} color="var(--accent-primary)" />
                <h3 className="serif-heading" style={{ fontSize: '1.2rem', margin: 0, color: 'var(--text-main)' }}>
                  Add FAQ to Published Blog
                </h3>
              </div>
              <button 
                onClick={() => setSelectedBlogForFaq(null)} 
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveFaqToExistingBlog} style={{ padding: '1.5rem' }}>
              <div style={{ marginBottom: '1rem', background: 'rgba(255, 255, 255, 0.02)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>Target Article:</span>
                <span style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--accent-primary)' }}>{selectedBlogForFaq.title}</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>Existing FAQs: {selectedBlogForFaq.faqs ? selectedBlogForFaq.faqs.length : 0} items</span>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                  FAQ Question *
                </label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. What is the penalty for non-registration under this act?"
                  value={newFaqQuestion}
                  onChange={(e) => setNewFaqQuestion(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: '8px', fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                  FAQ Answer *
                </label>
                <textarea 
                  required
                  rows={3}
                  placeholder="e.g. Penalties up to 10% of estimated project cost under Section 59."
                  value={newFaqAnswer}
                  onChange={(e) => setNewFaqAnswer(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: '8px', fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setSelectedBlogForFaq(null)} className="btn-outline">Cancel</button>
                <button type="submit" className="btn-primary">
                  <Plus size={16} /> Save FAQ to Blog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Section Modal for Existing Published Blog */}
      {selectedBlogForSection && (
        <div className="modal-overlay" onClick={() => setSelectedBlogForSection(null)}>
          <div 
            className="modal-content" 
            style={{ maxWidth: '580px', padding: 0, overflow: 'hidden' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              padding: '1.25rem 1.5rem',
              background: 'var(--bg-glass)',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Layers size={20} color="var(--accent-emerald)" />
                <h3 className="serif-heading" style={{ fontSize: '1.2rem', margin: 0, color: 'var(--text-main)' }}>
                  Add Content Section to Published Blog
                </h3>
              </div>
              <button 
                onClick={() => setSelectedBlogForSection(null)} 
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveSectionToExistingBlog} style={{ padding: '1.5rem' }}>
              <div style={{ marginBottom: '1rem', background: 'rgba(255, 255, 255, 0.02)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>Target Article:</span>
                <span style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--accent-emerald)' }}>{selectedBlogForSection.title}</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>Existing Sections: {selectedBlogForSection.content ? selectedBlogForSection.content.length : 0} sections</span>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                  Section Heading *
                </label>
                <input 
                  type="text"
                  required
                  placeholder={`e.g. ${(selectedBlogForSection.content?.length || 0) + 1}. Regulatory Compliance & Penalties`}
                  value={newSectionHeading}
                  onChange={(e) => setNewSectionHeading(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600 }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                  Section Detailed Body *
                </label>
                <textarea 
                  required
                  rows={5}
                  placeholder="Elaborate statutory clauses, legal provisions, developer rules, land revenue procedures..."
                  value={newSectionBody}
                  onChange={(e) => setNewSectionBody(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: '8px', fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setSelectedBlogForSection(null)} className="btn-outline">Cancel</button>
                <button type="submit" className="btn-primary" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                  <Plus size={16} /> Save Section to Blog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Full Article Edit Modal */}
      {editingBlog && editFormData && (
        <div className="modal-overlay" onClick={() => setEditingBlog(null)}>
          <div 
            className="modal-content" 
            style={{ maxWidth: '850px', maxHeight: '90vh', overflowY: 'auto', padding: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              padding: '1.25rem 1.5rem',
              background: 'var(--bg-glass)',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'sticky',
              top: 0,
              zIndex: 10
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Pencil size={20} color="#f59e0b" />
                <h3 className="serif-heading" style={{ fontSize: '1.3rem', margin: 0, color: 'var(--text-main)' }}>
                  Edit Article: {editingBlog.title}
                </h3>
              </div>
              <button 
                onClick={() => setEditingBlog(null)} 
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} style={{ padding: '1.75rem' }}>
              
              {/* Row 1: Jurisdiction & Country */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                    Jurisdiction Level *
                  </label>
                  <select 
                    value={editFormData.level}
                    onChange={(e) => setEditFormData({ ...editFormData, level: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: '8px', fontSize: '0.9rem' }}
                  >
                    <option value="country">Country Statutory Act</option>
                    <option value="state">State Law (Revenue / Regional)</option>
                    <option value="city">City Municipal & Zoning Bylaws</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                    Country *
                  </label>
                  <input 
                    type="text" 
                    required
                    value={editFormData.country}
                    onChange={(e) => setEditFormData({ ...editFormData, country: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: '8px', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              {/* Row 2: Title */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                  Article Title *
                </label>
                <input 
                  type="text" 
                  required
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: '8px', fontSize: '0.95rem', fontWeight: 600 }}
                />
              </div>

              {/* Row 3: State & City */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                    State / Province
                  </label>
                  <input 
                    type="text"
                    value={editFormData.state}
                    onChange={(e) => setEditFormData({ ...editFormData, state: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.8rem', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: '8px', fontSize: '0.88rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                    City / Metro
                  </label>
                  <input 
                    type="text"
                    value={editFormData.city}
                    onChange={(e) => setEditFormData({ ...editFormData, city: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.8rem', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: '8px', fontSize: '0.88rem' }}
                  />
                </div>
              </div>

              {/* Row 4: Image URL */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                  Feature Image URL *
                </label>
                <input 
                  type="text" 
                  value={editFormData.image}
                  onChange={(e) => setEditFormData({ ...editFormData, image: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.8rem', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: '8px', fontSize: '0.88rem' }}
                />
              </div>

              {/* Row 5: Executive Summary */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                  Executive Summary *
                </label>
                <textarea 
                  required
                  rows={3}
                  value={editFormData.summary}
                  onChange={(e) => setEditFormData({ ...editFormData, summary: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: '8px', fontSize: '0.9rem' }}
                />
              </div>

              {/* Row 6: Edit Content Sections */}
              <div style={{ background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Layers size={18} color="#f59e0b" />
                    <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f59e0b' }}>
                      Article Sections ({editFormData.sections.length})
                    </span>
                  </div>
                  <button 
                    type="button" 
                    onClick={handleEditSectionAdd}
                    className="btn-outline"
                    style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem', gap: '4px', borderColor: '#f59e0b', color: '#f59e0b' }}
                  >
                    <Plus size={14} /> Add Another Section
                  </button>
                </div>

                {editFormData.sections.map((sec, idx) => (
                  <div key={idx} style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Section #{idx + 1}</span>
                      {editFormData.sections.length > 1 && (
                        <button type="button" onClick={() => handleEditSectionRemove(idx)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                    <input 
                      type="text"
                      placeholder="Section Heading e.g. 1. Key Provisions"
                      value={sec.heading}
                      onChange={(e) => handleEditSectionChange(idx, 'heading', e.target.value)}
                      style={{ width: '100%', padding: '0.6rem 0.8rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: '6px', marginBottom: '0.5rem', fontWeight: 600 }}
                    />
                    <textarea 
                      rows={4}
                      placeholder="Section Body text..."
                      value={sec.body}
                      onChange={(e) => handleEditSectionChange(idx, 'body', e.target.value)}
                      style={{ width: '100%', padding: '0.6rem 0.8rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: '6px' }}
                    />
                  </div>
                ))}
              </div>

              {/* Row 7: Edit FAQs */}
              <div style={{ background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <HelpCircle size={18} color="var(--accent-primary)" />
                    <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
                      Article FAQs ({editFormData.faqs.length})
                    </span>
                  </div>
                  <button 
                    type="button" 
                    onClick={handleEditFaqAdd}
                    className="btn-outline"
                    style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem', gap: '4px' }}
                  >
                    <Plus size={14} /> Add Another FAQ
                  </button>
                </div>

                {editFormData.faqs.map((faq, idx) => (
                  <div key={idx} style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.85rem', marginBottom: '0.85rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>FAQ #{idx + 1}</span>
                      {editFormData.faqs.length > 1 && (
                        <button type="button" onClick={() => handleEditFaqRemove(idx)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                    <input 
                      type="text"
                      placeholder="Question..."
                      value={faq.question}
                      onChange={(e) => handleEditFaqChange(idx, 'question', e.target.value)}
                      style={{ width: '100%', padding: '0.55rem 0.75rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: '6px', marginBottom: '0.4rem', fontSize: '0.88rem' }}
                    />
                    <input 
                      type="text"
                      placeholder="Answer..."
                      value={faq.answer}
                      onChange={(e) => handleEditFaqChange(idx, 'answer', e.target.value)}
                      style={{ width: '100%', padding: '0.55rem 0.75rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: '6px', fontSize: '0.88rem' }}
                    />
                  </div>
                ))}
              </div>

              {/* Submit / Cancel Footer */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setEditingBlog(null)} className="btn-outline">Cancel</button>
                <button type="submit" className="btn-primary" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
                  <Pencil size={16} /> Save Article Changes
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
