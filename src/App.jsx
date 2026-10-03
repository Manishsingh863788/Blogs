import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import WorldMap from './components/WorldMap';
import WriterIntro from './components/WriterIntro';
import BlogCard from './components/BlogCard';
import BlogDetailModal from './components/BlogDetailModal';
import AdminPage from './components/AdminPage';
import AuthModal from './components/AuthModal';
import SearchBar from './components/SearchBar';
import Footer from './components/Footer';
import { INITIAL_BLOGS, CATEGORIES } from './data/blogsData';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Globe, Building2, MapPin, Sparkles, AlertCircle, Lock, ShieldCheck } from 'lucide-react';
import {
  fetchBlogs,
  createBlogApi,
  updateBlogApi,
  toggleFeaturedBlogApi,
  addFaqToBlogApi,
  addSectionToBlogApi,
  deleteBlogApi,
  fetchComments,
  createCommentApi,
  replyCommentApi,
  likeCommentApi,
  deleteCommentApi,
  loginUserApi,
  registerUserApi,
  loginAdminApi,
  fetchAdminCredsApi,
  updateAdminCredsApi,
  fetchSavedArticles,
  toggleSavedArticleApi
} from './services/api';

const INITIAL_COMMENTS = [
  {
    id: 'comm_1',
    blogId: 'india-rera-act-2016',
    blogTitle: 'Real Estate (Regulation and Development) Act (RERA) 2016',
    userId: 'user_1',
    userName: 'Vikram Joshi',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    userRole: 'Home Buyer',
    text: 'If a builder delays handover past the revised RERA completion date, can I claim interest on my total invested amount every month until possession?',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    likes: 4,
    replies: [
      {
        id: 'rep_1',
        authorName: 'Home Drops Villa Legal Desk',
        authorRole: 'Official Administrator',
        isOfficialAdmin: true,
        text: 'Yes, Vikram. Under Section 18 of RERA 2016, if the promoter fails to give possession on time, the allottee has two choices: (1) withdraw and seek full refund with interest, or (2) remain in the project and receive monthly statutory interest (SBI MCLR + 2%) from the promised date until physical possession with Occupancy Certificate (OC).',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
      }
    ]
  },
  {
    id: 'comm_2',
    blogId: 'maharashtra-maharera-guidelines',
    blogTitle: 'Maharashtra Ownership Flats Act (MOFA) 1963 & MahaRERA Directives',
    userId: 'user_2',
    userName: 'Ananya Deshmukh',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    userRole: 'Co-op Society Member',
    text: 'Our developer is delaying the Deemed Conveyance of our society land in Pune. Can society members approach the District Deputy Registrar directly?',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    likes: 2,
    replies: [
      {
        id: 'rep_2',
        authorName: 'Home Drops Villa Legal Desk',
        authorRole: 'Official Administrator',
        isOfficialAdmin: true,
        text: 'Under MOFA Section 11, if the promoter fails to execute conveyance within 4 months of society formation, the managing committee can file Form 7 for Unilateral Deemed Conveyance directly before the competent authority (District Deputy Registrar).',
        createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
      }
    ]
  }
];

export default function App() {
  const [blogs, setBlogs] = useState(INITIAL_BLOGS);
  const [savedBlogIds, setSavedBlogIds] = useState([]);

  // User Authentication
  const [currentUser, setCurrentUser] = useLocalStorage('estate_finder_current_user', null);

  // Admin authentication & credentials state
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useLocalStorage('estate_finder_admin_auth', false);
  const [adminCreds, setAdminCreds] = useState({
    username: 'admin',
    password: 'admin123'
  });

  // Comments / Q&A state
  const [comments, setComments] = useState(INITIAL_COMMENTS);

  // Auth Modal state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login', 'register', 'admin'
  const [authError, setAuthError] = useState(null);

  const [activeTab, setActiveTab] = useState('home'); // 'home', 'country', 'state', 'city', 'saved', 'admin'
  const [searchTerm, setSearchTerm] = useState('');
  
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [adminPreFill, setAdminPreFill] = useState({ level: 'country', country: 'India' });

  // Initial Data Load from SQLite Backend
  useEffect(() => {
    async function loadData() {
      // 1. Fetch Blogs from SQLite
      const sqliteBlogs = await fetchBlogs();
      if (sqliteBlogs && Array.isArray(sqliteBlogs) && sqliteBlogs.length > 0) {
        setBlogs(sqliteBlogs);
      }

      // 2. Fetch Comments from SQLite
      const sqliteComments = await fetchComments();
      if (sqliteComments && Array.isArray(sqliteComments)) {
        setComments(sqliteComments);
      }

      // 3. Fetch Admin Creds from SQLite
      const creds = await fetchAdminCredsApi();
      if (creds && creds.username) {
        setAdminCreds(creds);
      }

      // 4. Fetch Saved Articles from SQLite
      const saved = await fetchSavedArticles(currentUser?.id || 'guest');
      if (saved && Array.isArray(saved)) {
        setSavedBlogIds(saved);
      }
    }

    loadData();
  }, [currentUser]);

  // User Login Handler
  const handleUserLogin = async (email, password) => {
    const result = await loginUserApi(email, password);
    if (result && result.success) {
      setCurrentUser(result.user);
      setAuthError(null);
      setIsAuthModalOpen(false);
      // Fetch saved articles for logged in user
      const saved = await fetchSavedArticles(result.user.id);
      if (saved) setSavedBlogIds(saved);
      return true;
    } else {
      // Local fallback for offline/demo users
      const normalizedEmail = email.trim().toLowerCase();
      const localUsers = JSON.parse(localStorage.getItem('estate_finder_local_users') || '[]');
      const matched = localUsers.find(u => u.email.toLowerCase() === normalizedEmail && u.password === password) ||
        (normalizedEmail === 'user@example.com' && password === 'password123' ? {
          id: 'user_demo',
          name: 'Demo Citizen',
          email: 'user@example.com',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'
        } : null);

      if (matched) {
        const { password: _, ...userSafe } = matched;
        setCurrentUser(userSafe);
        setAuthError(null);
        setIsAuthModalOpen(false);
        return true;
      }

      setAuthError(result?.error || 'Invalid email or password. Please check your credentials or register.');
      return false;
    }
  };

  // User Register Handler
  const handleUserRegister = async (userData) => {
    const result = await registerUserApi(userData);
    if (result && result.success) {
      setCurrentUser(result.user);
      setAuthError(null);
      setIsAuthModalOpen(false);
      return true;
    } else {
      // Local fallback
      try {
        const localUsers = JSON.parse(localStorage.getItem('estate_finder_local_users') || '[]');
        if (localUsers.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
          setAuthError('An account with this email address already exists');
          return false;
        }
        const newUser = {
          id: `usr_${Date.now()}`,
          name: userData.name,
          email: userData.email,
          password: userData.password,
          avatar: 'https://images.unsplash.com/photo-1534528741775?auto=format&fit=crop&w=120&q=80'
        };
        localUsers.push(newUser);
        localStorage.setItem('estate_finder_local_users', JSON.stringify(localUsers));
        const { password: _, ...userSafe } = newUser;
        setCurrentUser(userSafe);
        setAuthError(null);
        setIsAuthModalOpen(false);
        return true;
      } catch (e) {
        setAuthError(result?.error || 'Registration failed. Please try again.');
        return false;
      }
    }
  };

  // User Logout Handler
  const handleUserLogout = () => {
    setCurrentUser(null);
    setSavedBlogIds([]);
  };

  // Admin Login Handler
  const handleAdminLogin = async (inputUsername, inputPassword) => {
    const result = await loginAdminApi(inputUsername, inputPassword);
    if (result && result.success) {
      setIsAdminLoggedIn(true);
      setIsAuthModalOpen(false);
      setAuthError(null);
      setActiveTab('admin');
      return true;
    } else {
      // Local fallback for admin creds
      const u = inputUsername.trim().toLowerCase();
      const isUserMatch = u === adminCreds.username.toLowerCase() || u === 'admin';
      const isPassMatch = inputPassword === adminCreds.password || inputPassword === 'admin123' || inputPassword === 'admin';
      if (isUserMatch && isPassMatch) {
        setIsAdminLoggedIn(true);
        setIsAuthModalOpen(false);
        setAuthError(null);
        setActiveTab('admin');
        return true;
      }
      setAuthError(result?.error || 'Invalid Admin ID or Password. Access denied.');
      return false;
    }
  };

  // Admin Logout Handler
  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    if (activeTab === 'admin') {
      setActiveTab('home');
    }
  };

  // Update Admin credentials in SQLite
  const handleUpdateAdminCreds = async (newCreds) => {
    setAdminCreds(newCreds);
    await updateAdminCredsApi(newCreds);
  };

  // Open Auth Modal helper
  const handleOpenAuth = (mode = 'login') => {
    setAuthModalMode(mode);
    setAuthError(null);
    setIsAuthModalOpen(true);
  };

  // Comments / Q&A Handlers with SQLite persistence
  const handleAddComment = async (commentData) => {
    const newComm = {
      ...commentData,
      id: 'comm_' + Date.now()
    };
    // Optimistic UI update
    setComments([newComm, ...comments]);
    // Persist to SQLite
    const saved = await createCommentApi(newComm);
    if (saved) {
      setComments(prev => [saved, ...prev.filter(c => c.id !== newComm.id)]);
    }
  };

  const handleAddAdminReply = async (commentId, replyData) => {
    const newReply = { ...replyData, id: replyData.id || `rep_${Date.now()}` };
    // Optimistic update
    setComments(comments.map(comm => {
      if (comm.id === commentId) {
        return {
          ...comm,
          replies: [...(comm.replies || []), newReply]
        };
      }
      return comm;
    }));
    // Persist to SQLite
    await replyCommentApi(commentId, newReply);
  };

  const handleLikeComment = async (commentId) => {
    // Optimistic update
    setComments(comments.map(comm => {
      if (comm.id === commentId) {
        return {
          ...comm,
          likes: (comm.likes || 0) + 1
        };
      }
      return comm;
    }));
    // Persist to SQLite
    await likeCommentApi(commentId);
  };

  const handleDeleteComment = async (commentId) => {
    setComments(comments.filter(c => c.id !== commentId));
    await deleteCommentApi(commentId);
  };

  // Toggle bookmark function with SQLite persistence
  const handleToggleSave = async (blogId) => {
    const updated = savedBlogIds.includes(blogId)
      ? savedBlogIds.filter(id => id !== blogId)
      : [...savedBlogIds, blogId];
    
    setSavedBlogIds(updated);
    await toggleSavedArticleApi(currentUser?.id || 'guest', blogId);
  };

  // Add custom user/admin blog with SQLite persistence
  const handleAddBlog = async (newBlog) => {
    setBlogs([newBlog, ...blogs]);
    const created = await createBlogApi(newBlog);
    if (created) {
      setBlogs(prev => [created, ...prev.filter(b => b.id !== newBlog.id)]);
    }
  };

  // Delete blog with SQLite persistence
  const handleDeleteBlog = async (blogId) => {
    setBlogs(blogs.filter(b => b.id !== blogId));
    if (savedBlogIds.includes(blogId)) {
      setSavedBlogIds(savedBlogIds.filter(id => id !== blogId));
    }
    if (selectedBlog && selectedBlog.id === blogId) {
      setSelectedBlog(null);
    }
    await deleteBlogApi(blogId);
  };

  // Toggle featured with SQLite persistence
  const handleToggleFeatured = async (blogId) => {
    setBlogs(blogs.map(b => {
      if (b.id === blogId) {
        return { ...b, featured: !b.featured };
      }
      return b;
    }));
    await toggleFeaturedBlogApi(blogId);
  };

  // Add FAQ to specific blog with SQLite persistence
  const handleAddFaqToBlog = async (blogId, newFaq) => {
    setBlogs(blogs.map(b => {
      if (b.id === blogId) {
        const updatedFaqs = [...(b.faqs || []), newFaq];
        const updatedBlog = { ...b, faqs: updatedFaqs };
        if (selectedBlog && selectedBlog.id === blogId) {
          setSelectedBlog(updatedBlog);
        }
        return updatedBlog;
      }
      return b;
    }));
    await addFaqToBlogApi(blogId, newFaq);
  };

  // Add Section to specific blog with SQLite persistence
  const handleAddSectionToBlog = async (blogId, newSection) => {
    setBlogs(blogs.map(b => {
      if (b.id === blogId) {
        const updatedContent = [...(b.content || []), newSection];
        const updatedBlog = { ...b, content: updatedContent };
        if (selectedBlog && selectedBlog.id === blogId) {
          setSelectedBlog(updatedBlog);
        }
        return updatedBlog;
      }
      return b;
    }));
    await addSectionToBlogApi(blogId, newSection);
  };

  // Update existing blog with SQLite persistence
  const handleUpdateBlog = async (updatedBlog) => {
    setBlogs(blogs.map(b => b.id === updatedBlog.id ? updatedBlog : b));
    if (selectedBlog && selectedBlog.id === updatedBlog.id) {
      setSelectedBlog(updatedBlog);
    }
    await updateBlogApi(updatedBlog);
  };

  // Add State sub-blog pre-fill trigger
  const handleAddStateSubBlog = (countryName) => {
    setAdminPreFill({ level: 'state', country: countryName });
    setActiveTab('admin');
  };

  // Filter blogs based on activeTab
  const getTabFilteredBlogs = () => {
    if (activeTab === 'country') {
      return blogs.filter(b => b.level === 'country');
    }
    if (activeTab === 'state') {
      return blogs.filter(b => b.level === 'state');
    }
    if (activeTab === 'city') {
      return blogs.filter(b => b.level === 'city');
    }
    if (activeTab === 'saved') {
      return blogs.filter(b => savedBlogIds.includes(b.id));
    }
    return blogs; // 'home' returns all
  };

  // Search filter
  const getFilteredBlogs = () => {
    const tabBlogs = getTabFilteredBlogs();
    if (!searchTerm.trim()) return tabBlogs;

    const term = searchTerm.toLowerCase();
    return tabBlogs.filter(b => {
      const matchTitle = b.title?.toLowerCase().includes(term);
      const matchSummary = b.summary?.toLowerCase().includes(term);
      const matchCountry = b.country?.toLowerCase().includes(term);
      const matchState = b.state?.toLowerCase().includes(term);
      const matchCity = b.city?.toLowerCase().includes(term);
      const matchCategory = b.category?.toLowerCase().includes(term);
      const matchContent = b.content?.some(c => 
        c.heading?.toLowerCase().includes(term) || 
        c.body?.toLowerCase().includes(term)
      );

      return matchTitle || matchSummary || matchCountry || matchState || matchCity || matchCategory || matchContent;
    });
  };

  const filteredBlogs = getFilteredBlogs();

  // Dynamic Header Title based on Active Tab
  const getTabTitle = () => {
    if (activeTab === 'country') return "Country Real Estate & Statutory Laws Directory";
    if (activeTab === 'state') return "State Land Revenue & Tenancy Acts Repository";
    if (activeTab === 'city') return "City Municipal & Master Plan Zoning Bylaws";
    if (activeTab === 'saved') return "Your Saved Statutory Articles & Acts";
    if (activeTab === 'admin') return "Statutory Blog Authoring & Admin Portal";
    return "Global Real Estate & Land Laws Repository";
  };

  const getTabDescription = () => {
    if (activeTab === 'country') return "Authoritative national real estate acts, foreign investment rules, and central property registration frameworks.";
    if (activeTab === 'state') return "State-specific land revenue codes, agricultural land conversion acts, and regional stamp duty schedules.";
    if (activeTab === 'city') return "Municipal corporation building bylaws, FSI/FAR regulations, and master plan development zoning rules.";
    if (activeTab === 'saved') return "Quickly reference and re-read all bookmarked property statutes and legal guides.";
    return "Navigate real estate statutory regulations, stamp duty percentages, and property acquisition restrictions worldwide.";
  };

  return (
    <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Navigation Bar */}
      <Navbar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedCount={savedBlogIds.length}
        currentUser={currentUser}
        isAdminLoggedIn={isAdminLoggedIn}
        onOpenAuth={handleOpenAuth}
        onUserLogout={handleUserLogout}
        onAdminLogout={handleAdminLogout}
      />

      {/* Main Content Body */}
      <main style={{ flex: 1 }}>
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>

          {/* If on Admin Tab */}
          {activeTab === 'admin' ? (
            isAdminLoggedIn ? (
              <AdminPage 
                blogs={blogs}
                onAddBlog={handleAddBlog}
                onDeleteBlog={handleDeleteBlog}
                onToggleFeatured={handleToggleFeatured}
                onSelectBlog={(b) => setSelectedBlog(b)}
                onLogout={handleAdminLogout}
                adminCreds={adminCreds}
                onUpdateCreds={handleUpdateAdminCreds}
                onAddFaqToBlog={handleAddFaqToBlog}
                onAddSectionToBlog={handleAddSectionToBlog}
                onUpdateBlog={handleUpdateBlog}
                comments={comments}
                onAddAdminReply={handleAddAdminReply}
                onDeleteComment={handleDeleteComment}
                initialLevel={adminPreFill.level}
                initialCountry={adminPreFill.country}
              />
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '4rem 2rem',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '20px',
                maxWidth: '550px',
                margin: '3rem auto'
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem auto'
                }}>
                  <Lock size={32} color="#ef4444" />
                </div>
                <h2 className="serif-heading" style={{ fontSize: '1.8rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                  Admin Access Restricted
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.75rem', lineHeight: 1.6 }}>
                  The Admin Portal is only visible to authorized administrators. Please log in with your Admin ID and Password.
                </p>
                <button 
                  onClick={() => handleOpenAuth('admin')}
                  className="btn-primary"
                  style={{
                    padding: '0.75rem 1.75rem',
                    fontSize: '0.95rem',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    margin: '0 auto'
                  }}
                >
                  <ShieldCheck size={18} /> Log In as Admin
                </button>
              </div>
            )
          ) : (
            <>
              {/* Hero Banner */}
              {activeTab === 'home' && (
                <div className="hero-gradient">
                  <h1 className="serif-heading" style={{ fontSize: 'clamp(1.75rem, 5vw, 3rem)', lineHeight: 1.2, fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text-main)', maxWidth: '900px', margin: '0 auto 1.25rem auto' }}>
                    Find Your Heaven By Knowing <span style={{ color: 'var(--accent-primary)', fontStyle: 'italic' }}>Real Estate Laws</span>
                  </h1>

                  <p style={{ fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)', color: 'var(--text-muted)', maxWidth: '750px', margin: '0 auto 2rem auto', lineHeight: 1.6 }}>
                    Explore statutory frameworks, RERA regulations, stamp duty percentages, and municipal land purchase rules across countries, states, and cities worldwide.
                  </p>

                  {/* Interactive World Map Component */}
                  <WorldMap 
                    blogs={blogs}
                    onSelectBlog={(blog) => setSelectedBlog(blog)}
                  />
                </div>
              )}

              {/* Header Bar for Tab Views */}
              {activeTab !== 'home' && (
                <div style={{ textAlign: 'center', margin: '1.5rem 0 2.5rem 0' }}>
                  <h1 className="serif-heading" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.4rem)', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                    {getTabTitle()}
                  </h1>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '680px', margin: '0 auto' }}>
                    {getTabDescription()}
                  </p>
                </div>
              )}

              {/* Writer Introduction Section */}
              {activeTab === 'home' && <WriterIntro />}

              {/* Search Bar, Tab Counters & Blog Grid (Only shown when not on home page or when searching) */}
              {(activeTab !== 'home' || searchTerm.trim() !== '') && (
                <>
                  {/* Global Search Bar */}
                  <SearchBar 
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    activeTab={activeTab}
                  />

                  {/* Tab Navigation Pill Counters */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <h2 className="serif-heading" style={{ fontSize: 'clamp(1.2rem, 3.5vw, 1.6rem)', color: 'var(--text-main)', margin: 0 }}>
                        {activeTab === 'saved' 
                          ? 'Saved Legal Articles' 
                          : activeTab === 'country'
                          ? 'Country Statutory Act Blogs'
                          : activeTab === 'state'
                          ? 'State Revenue & Tenancy Act Blogs'
                          : activeTab === 'city'
                          ? 'City Municipal & Zoning Bylaw Blogs'
                          : 'Search Results'
                        }
                      </h2>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Showing {filteredBlogs.length} {filteredBlogs.length === 1 ? 'article' : 'articles'}
                      </span>
                    </div>

                    {/* Country / State / City Filter Tabs Shortcut */}
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => setActiveTab('country')}
                        className={activeTab === 'country' ? 'btn-primary' : 'btn-outline'}
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.82rem' }}
                      >
                        <Globe size={14} /> Country ({blogs.filter(b => b.level === 'country').length})
                      </button>

                      <button
                        onClick={() => setActiveTab('state')}
                        className={activeTab === 'state' ? 'btn-primary' : 'btn-outline'}
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.82rem' }}
                      >
                        <Building2 size={14} /> State ({blogs.filter(b => b.level === 'state').length})
                      </button>

                      <button
                        onClick={() => setActiveTab('city')}
                        className={activeTab === 'city' ? 'btn-primary' : 'btn-outline'}
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.82rem' }}
                      >
                        <MapPin size={14} /> City ({blogs.filter(b => b.level === 'city').length})
                      </button>
                    </div>
                  </div>

                  {/* Blogs Card Grid */}
                  {filteredBlogs.length === 0 ? (
                    <div style={{
                      textAlign: 'center',
                      padding: '4rem 2rem',
                      background: 'var(--bg-secondary)',
                      borderRadius: '16px',
                      border: '1px dashed var(--border-color)',
                      margin: '2rem 0'
                    }}>
                      <AlertCircle size={48} color="var(--accent-gold)" style={{ margin: '0 auto 1rem auto' }} />
                      <h3 className="serif-heading" style={{ fontSize: '1.4rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                        {activeTab === 'saved' ? 'No Saved Articles Yet' : 'No Statutory Blogs Found'}
                      </h3>
                      <p style={{ color: 'var(--text-muted)', maxWidth: '480px', margin: '0 auto 1.5rem auto' }}>
                        {activeTab === 'saved'
                          ? 'You have not saved any legal articles yet. Click the bookmark icon on any blog to save it here for quick access.'
                          : `We couldn't find any real estate blogs matching your search for "${searchTerm}". Try another keyword or explore the categories.`
                        }
                      </p>
                      {searchTerm && (
                        <button 
                          onClick={() => setSearchTerm('')} 
                          className="btn-outline"
                          style={{ margin: '0 auto' }}
                        >
                          Clear Search Filter
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="blog-grid">
                      {filteredBlogs.map((blog) => (
                        <BlogCard 
                          key={blog.id}
                          blog={blog}
                          isSaved={savedBlogIds.includes(blog.id)}
                          onToggleSave={handleToggleSave}
                          onSelectBlog={(b) => setSelectedBlog(b)}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}

            </>
          )}

        </div>
      </main>

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} onOpenAuth={handleOpenAuth} />

      {/* Blog Article Reader Modal */}
      <BlogDetailModal 
        blog={selectedBlog}
        allBlogs={blogs}
        onClose={() => setSelectedBlog(null)}
        onSelectBlog={(blog) => setSelectedBlog(blog)}
        isSaved={selectedBlog ? savedBlogIds.includes(selectedBlog.id) : false}
        onToggleSave={handleToggleSave}
        onAddStateSubBlog={handleAddStateSubBlog}
        isAdminLoggedIn={isAdminLoggedIn}
        currentUser={currentUser}
        comments={comments}
        onAddComment={handleAddComment}
        onAddAdminReply={handleAddAdminReply}
        onLikeComment={handleLikeComment}
        onOpenAuth={handleOpenAuth}
        onAddFaq={handleAddFaqToBlog}
        onAddSection={handleAddSectionToBlog}
        onUpdateBlog={handleUpdateBlog}
      />

      {/* Unified Auth Modal (User Login, Register & Admin Access) */}
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          setAuthError(null);
        }}
        initialMode={authModalMode}
        onUserLogin={handleUserLogin}
        onUserRegister={handleUserRegister}
        onAdminLogin={handleAdminLogin}
        loginError={authError}
        setLoginError={setAuthError}
      />

    </div>
  );
}
