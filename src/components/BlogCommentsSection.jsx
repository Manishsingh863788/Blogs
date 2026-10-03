import React, { useState } from 'react';
import { MessageSquare, Send, ShieldCheck, Heart, Reply, User, CheckCircle2, CornerDownRight, Sparkles, LogIn, Clock } from 'lucide-react';

export default function BlogCommentsSection({
  blogId,
  blogTitle,
  comments = [],
  currentUser,
  isAdminLoggedIn,
  onAddComment,
  onAddAdminReply,
  onLikeComment,
  onOpenAuth
}) {
  const [questionText, setQuestionText] = useState('');
  const [replyingToId, setReplyingToId] = useState(null);
  const [replyText, setReplyText] = useState('');

  // Filter comments for this blog
  const blogComments = comments.filter(c => c.blogId === blogId);

  const handlePostQuestion = (e) => {
    e.preventDefault();
    if (!questionText.trim()) return;

    if (!currentUser && !isAdminLoggedIn) {
      if (onOpenAuth) onOpenAuth('login');
      return;
    }

    onAddComment({
      blogId,
      blogTitle,
      userId: currentUser?.id || (isAdminLoggedIn ? 'admin' : 'guest'),
      userName: currentUser?.name || (isAdminLoggedIn ? 'Admin Legal Team' : 'Anonymous Citizen'),
      userAvatar: currentUser?.avatar || (isAdminLoggedIn ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80' : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'),
      userRole: isAdminLoggedIn ? 'Site Administrator' : 'Community Member',
      text: questionText.trim(),
      createdAt: new Date().toISOString(),
      likes: 0,
      replies: []
    });

    setQuestionText('');
  };

  const handlePostReply = (commentId) => {
    if (!replyText.trim()) return;

    onAddAdminReply(commentId, {
      id: 'rep_' + Date.now(),
      authorName: isAdminLoggedIn ? 'Home Drops Villa Legal Desk' : (currentUser?.name || 'Community Member'),
      authorRole: isAdminLoggedIn ? 'Official Administrator' : 'Member',
      isOfficialAdmin: !!isAdminLoggedIn,
      text: replyText.trim(),
      createdAt: new Date().toISOString()
    });

    setReplyText('');
    setReplyingToId(null);
  };

  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Recently';
    }
  };

  return (
    <div style={{
      marginTop: '3rem',
      paddingTop: '2.5rem',
      borderTop: '2px solid var(--border-color)'
    }}>
      
      {/* Section Heading */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
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
              Community Q&A & Legal Discussion
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Ask questions directly to our legal team & community ({blogComments.length} {blogComments.length === 1 ? 'question' : 'questions'})
            </span>
          </div>
        </div>

        {isAdminLoggedIn && (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: '#10b981',
            padding: '4px 10px',
            borderRadius: '9999px',
            fontSize: '0.78rem',
            fontWeight: 700
          }}>
            <ShieldCheck size={14} /> Admin Mode (Official Replies Enabled)
          </span>
        )}
      </div>

      {/* Question Composer Form */}
      <div style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: '14px',
        padding: '1.25rem',
        marginBottom: '2rem'
      }}>
        {currentUser || isAdminLoggedIn ? (
          <form onSubmit={handlePostQuestion}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
              <img 
                src={currentUser?.avatar || (isAdminLoggedIn ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80' : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80')} 
                alt="Avatar" 
                style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border-color)' }}
              />
              <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)' }}>
                Posting question as <strong style={{ color: 'var(--accent-primary)' }}>{currentUser?.name || (isAdminLoggedIn ? 'Administrator' : 'User')}</strong>
              </span>
            </div>

            <div style={{ position: 'relative', marginBottom: '0.85rem' }}>
              <textarea
                required
                rows={3}
                placeholder="Ask a question about this statute, deed process, circle rates, or RERA implications..."
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-main)',
                  borderRadius: '10px',
                  fontSize: '0.92rem',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.75rem' }}>
              <button
                type="submit"
                className="btn-primary"
                style={{
                  padding: '0.55rem 1.25rem',
                  fontSize: '0.88rem',
                  fontWeight: 700
                }}
              >
                <Send size={15} /> Post Legal Question
              </button>
            </div>
          </form>
        ) : (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            padding: '0.5rem 0'
          }}>
            <div>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem', color: 'var(--text-main)', fontWeight: 700 }}>
                Have questions or need legal clarity on this act?
              </h4>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Sign in or register a free account to ask questions and receive official answers from our legal desk.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => onOpenAuth && onOpenAuth('login')}
                className="btn-outline"
                style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
              >
                <LogIn size={15} /> Sign In
              </button>
              <button
                type="button"
                onClick={() => onOpenAuth && onOpenAuth('register')}
                className="btn-primary"
                style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
              >
                Create Account
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Questions & Comments Feed */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {blogComments.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '2.5rem 1rem',
            background: 'var(--bg-primary)',
            border: '1px dashed var(--border-color)',
            borderRadius: '12px',
            color: 'var(--text-muted)'
          }}>
            <MessageSquare size={32} style={{ opacity: 0.4, margin: '0 auto 0.75rem auto' }} />
            <p style={{ fontSize: '0.95rem', fontWeight: 600, margin: '0 0 4px 0', color: 'var(--text-main)' }}>
              No questions asked yet for this article.
            </p>
            <p style={{ fontSize: '0.82rem', margin: 0 }}>
              Be the first to ask a statutory query or request procedural clarifications!
            </p>
          </div>
        ) : (
          blogComments.map((comment) => (
            <div 
              key={comment.id}
              style={{
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-color)',
                borderRadius: '14px',
                padding: '1.25rem',
                boxShadow: 'var(--card-shadow)',
                transition: 'var(--transition)'
              }}
            >
              {/* Question Author Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <img 
                    src={comment.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'} 
                    alt={comment.userName} 
                    style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid var(--border-color)' }}
                  />
                  <div>
                    <span style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)', display: 'block' }}>
                      {comment.userName}
                    </span>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={11} /> {formatDate(comment.createdAt)}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button
                    onClick={() => onLikeComment && onLikeComment(comment.id)}
                    style={{
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      padding: '4px 10px',
                      color: (comment.likes || 0) > 0 ? '#ef4444' : 'var(--text-muted)',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      cursor: 'pointer'
                    }}
                    title="Mark helpful"
                  >
                    <Heart size={13} fill={(comment.likes || 0) > 0 ? '#ef4444' : 'none'} />
                    <span>{comment.likes || 0}</span>
                  </button>

                  {isAdminLoggedIn && (
                    <button
                      onClick={() => setReplyingToId(replyingToId === comment.id ? null : comment.id)}
                      style={{
                        background: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        borderRadius: '8px',
                        padding: '4px 10px',
                        color: '#10b981',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      <Reply size={13} /> Reply as Admin
                    </button>
                  )}
                </div>
              </div>

              {/* Question Text */}
              <p style={{
                fontSize: '0.95rem',
                lineHeight: 1.6,
                color: 'var(--text-main)',
                margin: '0 0 1rem 0',
                whiteSpace: 'pre-wrap'
              }}>
                {comment.text}
              </p>

              {/* Replies Thread */}
              {comment.replies && comment.replies.length > 0 && (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  paddingLeft: '1.25rem',
                  borderLeft: '2px solid rgba(16, 185, 129, 0.4)',
                  marginTop: '1rem',
                  marginBottom: '0.5rem'
                }}>
                  {comment.replies.map((rep) => (
                    <div 
                      key={rep.id}
                      style={{
                        background: rep.isOfficialAdmin ? 'rgba(16, 185, 129, 0.05)' : 'var(--bg-secondary)',
                        border: rep.isOfficialAdmin ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid var(--border-color)',
                        borderRadius: '10px',
                        padding: '0.85rem 1rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <CornerDownRight size={14} color={rep.isOfficialAdmin ? '#10b981' : 'var(--text-muted)'} />
                          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
                            {rep.authorName}
                          </span>
                          {rep.isOfficialAdmin && (
                            <span style={{
                              background: '#10b981',
                              color: '#ffffff',
                              padding: '1px 6px',
                              borderRadius: '4px',
                              fontSize: '0.65rem',
                              fontWeight: 800,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '2px'
                            }}>
                              <ShieldCheck size={10} /> Verified Legal Admin
                            </span>
                          )}
                        </div>

                        <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>
                          {formatDate(rep.createdAt)}
                        </span>
                      </div>

                      <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                        {rep.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Inline Reply Composer for Admin */}
              {replyingToId === comment.id && (
                <div style={{
                  marginTop: '1rem',
                  background: 'rgba(16, 185, 129, 0.05)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '10px',
                  padding: '0.85rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px', fontSize: '0.82rem', fontWeight: 700, color: '#10b981' }}>
                    <ShieldCheck size={15} /> Write Official Response to {comment.userName}:
                  </div>
                  <textarea
                    rows={2}
                    autoFocus
                    placeholder="Provide authoritative statutory clarification or legal guidance..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.8rem',
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-main)',
                      borderRadius: '8px',
                      fontSize: '0.88rem',
                      marginBottom: '0.6rem'
                    }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={() => {
                        setReplyingToId(null);
                        setReplyText('');
                      }}
                      className="btn-outline"
                      style={{ fontSize: '0.78rem', padding: '4px 10px' }}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePostReply(comment.id)}
                      className="btn-primary"
                      style={{
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        fontSize: '0.78rem',
                        padding: '4px 12px'
                      }}
                    >
                      <Send size={13} /> Submit Official Reply
                    </button>
                  </div>
                </div>
              )}

            </div>
          ))
        )}
      </div>

    </div>
  );
}
