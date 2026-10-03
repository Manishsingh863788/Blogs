const API_BASE = '/api';

// ==========================================
// 1. BLOGS API
// ==========================================

export async function fetchBlogs() {
  try {
    const res = await fetch(`${API_BASE}/blogs`);
    if (!res.ok) throw new Error('Failed to fetch blogs');
    return await res.json();
  } catch (err) {
    console.error('API fetchBlogs error:', err);
    return null;
  }
}

export async function createBlogApi(blogData) {
  try {
    const res = await fetch(`${API_BASE}/blogs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(blogData)
    });
    if (!res.ok) throw new Error('Failed to create blog');
    return await res.json();
  } catch (err) {
    console.error('API createBlogApi error:', err);
    return null;
  }
}

export async function updateBlogApi(blogData) {
  try {
    const res = await fetch(`${API_BASE}/blogs/${blogData.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(blogData)
    });
    if (!res.ok) throw new Error('Failed to update blog');
    return await res.json();
  } catch (err) {
    console.error('API updateBlogApi error:', err);
    return null;
  }
}

export async function toggleFeaturedBlogApi(blogId) {
  try {
    const res = await fetch(`${API_BASE}/blogs/${blogId}/featured`, {
      method: 'PATCH'
    });
    if (!res.ok) throw new Error('Failed to toggle featured');
    return await res.json();
  } catch (err) {
    console.error('API toggleFeaturedBlogApi error:', err);
    return null;
  }
}

export async function addFaqToBlogApi(blogId, faqData) {
  try {
    const res = await fetch(`${API_BASE}/blogs/${blogId}/faq`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(faqData)
    });
    if (!res.ok) throw new Error('Failed to add FAQ to blog');
    return await res.json();
  } catch (err) {
    console.error('API addFaqToBlogApi error:', err);
    return null;
  }
}

export async function addSectionToBlogApi(blogId, sectionData) {
  try {
    const res = await fetch(`${API_BASE}/blogs/${blogId}/section`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sectionData)
    });
    if (!res.ok) throw new Error('Failed to add section to blog');
    return await res.json();
  } catch (err) {
    console.error('API addSectionToBlogApi error:', err);
    return null;
  }
}

export async function deleteBlogApi(blogId) {
  try {
    const res = await fetch(`${API_BASE}/blogs/${blogId}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete blog');
    return await res.json();
  } catch (err) {
    console.error('API deleteBlogApi error:', err);
    return null;
  }
}

// ==========================================
// 2. COMMENTS & Q&A API
// ==========================================

export async function fetchComments() {
  try {
    const res = await fetch(`${API_BASE}/comments`);
    if (!res.ok) throw new Error('Failed to fetch comments');
    return await res.json();
  } catch (err) {
    console.error('API fetchComments error:', err);
    return null;
  }
}

export async function createCommentApi(commentData) {
  try {
    const res = await fetch(`${API_BASE}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(commentData)
    });
    if (!res.ok) throw new Error('Failed to post comment');
    return await res.json();
  } catch (err) {
    console.error('API createCommentApi error:', err);
    return null;
  }
}

export async function replyCommentApi(commentId, replyData) {
  try {
    const res = await fetch(`${API_BASE}/comments/${commentId}/reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(replyData)
    });
    if (!res.ok) throw new Error('Failed to reply to comment');
    return await res.json();
  } catch (err) {
    console.error('API replyCommentApi error:', err);
    return null;
  }
}

export async function likeCommentApi(commentId) {
  try {
    const res = await fetch(`${API_BASE}/comments/${commentId}/like`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to like comment');
    return await res.json();
  } catch (err) {
    console.error('API likeCommentApi error:', err);
    return null;
  }
}

export async function deleteCommentApi(commentId) {
  try {
    const res = await fetch(`${API_BASE}/comments/${commentId}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete comment');
    return await res.json();
  } catch (err) {
    console.error('API deleteCommentApi error:', err);
    return null;
  }
}

// ==========================================
// 3. AUTH & CREDENTIALS API
// ==========================================

export async function loginUserApi(email, password) {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    return { success: true, user: data };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function registerUserApi(userData) {
  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');
    return { success: true, user: data };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function loginAdminApi(username, password) {
  try {
    const res = await fetch(`${API_BASE}/auth/admin-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Invalid credentials');
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function fetchAdminCredsApi() {
  try {
    const res = await fetch(`${API_BASE}/auth/admin-creds`);
    if (!res.ok) throw new Error('Failed to fetch admin creds');
    return await res.json();
  } catch (err) {
    console.error('API fetchAdminCredsApi error:', err);
    return null;
  }
}

export async function updateAdminCredsApi(creds) {
  try {
    const res = await fetch(`${API_BASE}/auth/admin-creds`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(creds)
    });
    if (!res.ok) throw new Error('Failed to update admin creds');
    return await res.json();
  } catch (err) {
    console.error('API updateAdminCredsApi error:', err);
    return null;
  }
}

// ==========================================
// 4. SAVED ARTICLES / BOOKMARKS API
// ==========================================

export async function fetchSavedArticles(userId = 'guest') {
  try {
    const res = await fetch(`${API_BASE}/saved?userId=${encodeURIComponent(userId)}`);
    if (!res.ok) throw new Error('Failed to fetch saved articles');
    return await res.json();
  } catch (err) {
    console.error('API fetchSavedArticles error:', err);
    return null;
  }
}

export async function toggleSavedArticleApi(userId = 'guest', blogId) {
  try {
    const res = await fetch(`${API_BASE}/saved/toggle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, blogId })
    });
    if (!res.ok) throw new Error('Failed to toggle saved article');
    return await res.json();
  } catch (err) {
    console.error('API toggleSavedArticleApi error:', err);
    return null;
  }
}
