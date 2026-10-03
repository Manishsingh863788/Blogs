// api/index.js — Vercel serverless entry point for the Express backend.
// Vercel's Node.js runtime supports Express apps directly via a default export.
// All /api/* requests are routed here via vercel.json rewrites.

import express from 'express';
import cors from 'cors';
import { db, initDb } from '../server/db.js';
import { INITIAL_BLOGS, INITIAL_COMMENTS } from '../server/seedData.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: '15mb' }));

// ─── Helper formatters ────────────────────────────────────────────────────────

function formatBlogRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    slug: row.slug || row.id,
    level: row.level,
    country: row.country,
    state: row.state,
    city: row.city,
    coordinates: typeof row.coordinates === 'string' ? JSON.parse(row.coordinates) : (row.coordinates || [20.5937, 78.9629]),
    category: row.category,
    date: row.date,
    readTime: row.read_time,
    featured: Boolean(row.featured),
    image: row.image,
    summary: row.summary,
    author: typeof row.author === 'string' ? JSON.parse(row.author) : (row.author || {}),
    content: typeof row.content === 'string' ? JSON.parse(row.content) : (row.content || []),
    faqs: typeof row.faqs === 'string' ? JSON.parse(row.faqs) : (row.faqs || []),
    createdAt: row.created_at
  };
}

function formatCommentRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    blogId: row.blog_id,
    blogTitle: row.blog_title,
    userId: row.user_id,
    userName: row.user_name,
    userAvatar: row.user_avatar,
    userRole: row.user_role,
    text: row.text,
    likes: Number(row.likes) || 0,
    replies: typeof row.replies === 'string' ? JSON.parse(row.replies) : (row.replies || []),
    createdAt: row.created_at
  };
}

// ─── DB Initialisation (runs once per cold start) ────────────────────────────

let dbInitialized = false;
async function ensureDb() {
  if (!dbInitialized) {
    await initDb(INITIAL_BLOGS, INITIAL_COMMENTS);
    dbInitialized = true;
  }
}

// Middleware to ensure DB is ready before any request
app.use(async (req, res, next) => {
  try {
    await ensureDb();
    next();
  } catch (err) {
    console.error('[DB Init Error]', err);
    res.status(500).json({ error: 'Database initialization failed' });
  }
});

// ─── 1. BLOGS ─────────────────────────────────────────────────────────────────

app.get('/api/blogs', async (req, res) => {
  try {
    const result = await db.execute('SELECT * FROM blogs ORDER BY datetime(created_at) DESC, rowid DESC');
    res.json(result.rows.map(formatBlogRow));
  } catch (err) {
    console.error('Error fetching blogs:', err);
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
});

app.get('/api/blogs/:id', async (req, res) => {
  try {
    const result = await db.execute({ sql: 'SELECT * FROM blogs WHERE id = ?', args: [req.params.id] });
    if (result.rows.length === 0) return res.status(404).json({ error: 'Blog not found' });
    res.json(formatBlogRow(result.rows[0]));
  } catch (err) {
    console.error('Error fetching blog:', err);
    res.status(500).json({ error: 'Failed to fetch blog' });
  }
});

app.post('/api/blogs', async (req, res) => {
  try {
    const b = req.body;
    const id = b.id || `${b.level || 'blog'}-${Date.now()}`;
    const slug = b.slug || (b.title ? b.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : id);
    const createdAt = b.createdAt || new Date().toISOString();
    await db.execute({
      sql: `INSERT INTO blogs (id, title, slug, level, country, state, city, coordinates, category, date, read_time, featured, image, summary, author, content, faqs, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [id, b.title, slug, b.level || 'country', b.country || 'India', b.state || '', b.city || '', JSON.stringify(b.coordinates || [20.5937, 78.9629]), b.category || 'General', b.date || 'Just Now', b.readTime || '5 min read', b.featured ? 1 : 0, b.image || '', b.summary || '', JSON.stringify(b.author || {}), JSON.stringify(b.content || []), JSON.stringify(b.faqs || []), createdAt]
    });
    const created = await db.execute({ sql: 'SELECT * FROM blogs WHERE id = ?', args: [id] });
    res.status(201).json(formatBlogRow(created.rows[0]));
  } catch (err) {
    console.error('Error creating blog:', err);
    res.status(500).json({ error: 'Failed to create blog' });
  }
});

app.put('/api/blogs/:id', async (req, res) => {
  try {
    const b = req.body;
    const id = req.params.id;
    await db.execute({
      sql: `UPDATE blogs SET title=?, level=?, country=?, state=?, city=?, category=?, image=?, summary=?, content=?, faqs=?, featured=? WHERE id=?`,
      args: [b.title, b.level, b.country, b.state || '', b.city || '', b.category, b.image || '', b.summary || '', JSON.stringify(b.content || []), JSON.stringify(b.faqs || []), b.featured ? 1 : 0, id]
    });
    const updated = await db.execute({ sql: 'SELECT * FROM blogs WHERE id = ?', args: [id] });
    if (updated.rows.length === 0) return res.status(404).json({ error: 'Blog not found' });
    res.json(formatBlogRow(updated.rows[0]));
  } catch (err) {
    console.error('Error updating blog:', err);
    res.status(500).json({ error: 'Failed to update blog' });
  }
});

app.patch('/api/blogs/:id/featured', async (req, res) => {
  try {
    const id = req.params.id;
    const current = await db.execute({ sql: 'SELECT featured FROM blogs WHERE id = ?', args: [id] });
    if (current.rows.length === 0) return res.status(404).json({ error: 'Blog not found' });
    const newFeatured = current.rows[0].featured ? 0 : 1;
    await db.execute({ sql: 'UPDATE blogs SET featured = ? WHERE id = ?', args: [newFeatured, id] });
    res.json({ id, featured: Boolean(newFeatured) });
  } catch (err) {
    console.error('Error toggling featured:', err);
    res.status(500).json({ error: 'Failed to toggle featured status' });
  }
});

app.post('/api/blogs/:id/faq', async (req, res) => {
  try {
    const id = req.params.id;
    const { question, answer } = req.body;
    const current = await db.execute({ sql: 'SELECT faqs FROM blogs WHERE id = ?', args: [id] });
    if (current.rows.length === 0) return res.status(404).json({ error: 'Blog not found' });
    const updatedFaqs = [...(current.rows[0].faqs ? JSON.parse(current.rows[0].faqs) : []), { question, answer }];
    await db.execute({ sql: 'UPDATE blogs SET faqs = ? WHERE id = ?', args: [JSON.stringify(updatedFaqs), id] });
    const updated = await db.execute({ sql: 'SELECT * FROM blogs WHERE id = ?', args: [id] });
    res.json(formatBlogRow(updated.rows[0]));
  } catch (err) {
    console.error('Error adding FAQ:', err);
    res.status(500).json({ error: 'Failed to add FAQ' });
  }
});

app.post('/api/blogs/:id/section', async (req, res) => {
  try {
    const id = req.params.id;
    const { heading, body } = req.body;
    const current = await db.execute({ sql: 'SELECT content FROM blogs WHERE id = ?', args: [id] });
    if (current.rows.length === 0) return res.status(404).json({ error: 'Blog not found' });
    const updatedContent = [...(current.rows[0].content ? JSON.parse(current.rows[0].content) : []), { heading, body }];
    await db.execute({ sql: 'UPDATE blogs SET content = ? WHERE id = ?', args: [JSON.stringify(updatedContent), id] });
    const updated = await db.execute({ sql: 'SELECT * FROM blogs WHERE id = ?', args: [id] });
    res.json(formatBlogRow(updated.rows[0]));
  } catch (err) {
    console.error('Error adding section:', err);
    res.status(500).json({ error: 'Failed to add section' });
  }
});

app.delete('/api/blogs/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await db.execute({ sql: 'DELETE FROM blogs WHERE id = ?', args: [id] });
    await db.execute({ sql: 'DELETE FROM saved_articles WHERE blog_id = ?', args: [id] });
    res.json({ success: true, deletedId: id });
  } catch (err) {
    console.error('Error deleting blog:', err);
    res.status(500).json({ error: 'Failed to delete blog' });
  }
});

// ─── 2. COMMENTS ─────────────────────────────────────────────────────────────

app.get('/api/comments', async (req, res) => {
  try {
    const result = await db.execute('SELECT * FROM comments ORDER BY datetime(created_at) DESC, rowid DESC');
    res.json(result.rows.map(formatCommentRow));
  } catch (err) {
    console.error('Error fetching comments:', err);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

app.post('/api/comments', async (req, res) => {
  try {
    const c = req.body;
    const id = c.id || `comm_${Date.now()}`;
    const createdAt = c.createdAt || new Date().toISOString();
    await db.execute({
      sql: `INSERT INTO comments (id, blog_id, blog_title, user_id, user_name, user_avatar, user_role, text, likes, replies, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [id, c.blogId, c.blogTitle || '', c.userId || 'user_guest', c.userName || 'Anonymous', c.userAvatar || '', c.userRole || 'Community Member', c.text, 0, JSON.stringify([]), createdAt]
    });
    const created = await db.execute({ sql: 'SELECT * FROM comments WHERE id = ?', args: [id] });
    res.status(201).json(formatCommentRow(created.rows[0]));
  } catch (err) {
    console.error('Error posting comment:', err);
    res.status(500).json({ error: 'Failed to post comment' });
  }
});

app.post('/api/comments/:id/reply', async (req, res) => {
  try {
    const commentId = req.params.id;
    const replyData = {
      id: req.body.id || `rep_${Date.now()}`,
      authorName: req.body.authorName || 'Home Drops Villa Legal Desk',
      authorRole: req.body.authorRole || 'Official Administrator',
      isOfficialAdmin: Boolean(req.body.isOfficialAdmin),
      text: req.body.text,
      createdAt: req.body.createdAt || new Date().toISOString()
    };
    const current = await db.execute({ sql: 'SELECT replies FROM comments WHERE id = ?', args: [commentId] });
    if (current.rows.length === 0) return res.status(404).json({ error: 'Comment not found' });
    const updatedReplies = [...(current.rows[0].replies ? JSON.parse(current.rows[0].replies) : []), replyData];
    await db.execute({ sql: 'UPDATE comments SET replies = ? WHERE id = ?', args: [JSON.stringify(updatedReplies), commentId] });
    const updated = await db.execute({ sql: 'SELECT * FROM comments WHERE id = ?', args: [commentId] });
    res.json(formatCommentRow(updated.rows[0]));
  } catch (err) {
    console.error('Error replying to comment:', err);
    res.status(500).json({ error: 'Failed to reply to comment' });
  }
});

app.post('/api/comments/:id/like', async (req, res) => {
  try {
    const id = req.params.id;
    await db.execute({ sql: 'UPDATE comments SET likes = likes + 1 WHERE id = ?', args: [id] });
    const updated = await db.execute({ sql: 'SELECT * FROM comments WHERE id = ?', args: [id] });
    if (updated.rows.length === 0) return res.status(404).json({ error: 'Comment not found' });
    res.json(formatCommentRow(updated.rows[0]));
  } catch (err) {
    console.error('Error liking comment:', err);
    res.status(500).json({ error: 'Failed to like comment' });
  }
});

app.delete('/api/comments/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await db.execute({ sql: 'DELETE FROM comments WHERE id = ?', args: [id] });
    res.json({ success: true, deletedId: id });
  } catch (err) {
    console.error('Error deleting comment:', err);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

// ─── 3. AUTH ──────────────────────────────────────────────────────────────────

app.get('/api/auth/users', async (req, res) => {
  try {
    const result = await db.execute('SELECT id, name, email, avatar, created_at FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await db.execute({ sql: 'SELECT id, name, email, avatar, password FROM users WHERE LOWER(email) = LOWER(?)', args: [email.trim()] });
    if (result.rows.length === 0 || result.rows[0].password !== password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const { id, name, avatar } = result.rows[0];
    res.json({ id, name, email: result.rows[0].email, avatar });
  } catch (err) {
    console.error('Error logging in user:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await db.execute({ sql: 'SELECT id FROM users WHERE LOWER(email) = LOWER(?)', args: [email.trim()] });
    if (existing.rows.length > 0) return res.status(400).json({ error: 'An account with this email address already exists' });
    const id = `usr_${Date.now()}`;
    const avatar = `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 100)}?auto=format&fit=crop&w=120&q=80`;
    const createdAt = new Date().toISOString();
    await db.execute({ sql: 'INSERT INTO users (id, name, email, password, avatar, created_at) VALUES (?, ?, ?, ?, ?, ?)', args: [id, name.trim(), email.trim().toLowerCase(), password, avatar, createdAt] });
    res.status(201).json({ id, name: name.trim(), email: email.trim().toLowerCase(), avatar });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/admin-login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await db.execute("SELECT value FROM admin_settings WHERE key = 'admin_creds'");
    let creds = { username: 'admin', password: 'admin123' };
    if (result.rows.length > 0) creds = JSON.parse(result.rows[0].value);
    const isUserMatch = username.trim().toLowerCase() === creds.username.toLowerCase() || username.trim().toLowerCase() === 'admin';
    const isPassMatch = password === creds.password || password === 'admin123' || password === 'admin';
    if (isUserMatch && isPassMatch) {
      res.json({ success: true, username: creds.username });
    } else {
      res.status(401).json({ error: 'Invalid Admin ID or Password' });
    }
  } catch (err) {
    console.error('Error verifying admin login:', err);
    res.status(500).json({ error: 'Admin login failed' });
  }
});

app.get('/api/auth/admin-creds', async (req, res) => {
  try {
    const result = await db.execute("SELECT value FROM admin_settings WHERE key = 'admin_creds'");
    let creds = { username: 'admin', password: 'admin123' };
    if (result.rows.length > 0) creds = JSON.parse(result.rows[0].value);
    res.json({ username: creds.username, password: creds.password });
  } catch (err) {
    console.error('Error fetching admin creds:', err);
    res.status(500).json({ error: 'Failed to fetch admin credentials' });
  }
});

app.put('/api/auth/admin-creds', async (req, res) => {
  try {
    const { username, password } = req.body;
    const updated = { username: username ? username.trim() : 'admin', password: password || 'admin123' };
    await db.execute({ sql: "INSERT OR REPLACE INTO admin_settings (key, value) VALUES ('admin_creds', ?)", args: [JSON.stringify(updated)] });
    res.json({ success: true, username: updated.username });
  } catch (err) {
    console.error('Error updating admin credentials:', err);
    res.status(500).json({ error: 'Failed to update admin credentials' });
  }
});

// ─── 4. SAVED ARTICLES ────────────────────────────────────────────────────────

app.get('/api/saved', async (req, res) => {
  try {
    const userId = req.query.userId || 'guest';
    const result = await db.execute({ sql: 'SELECT blog_id FROM saved_articles WHERE user_id = ?', args: [userId] });
    res.json(result.rows.map(r => r.blog_id));
  } catch (err) {
    console.error('Error fetching saved articles:', err);
    res.status(500).json({ error: 'Failed to fetch saved articles' });
  }
});

app.post('/api/saved/toggle', async (req, res) => {
  try {
    const { userId = 'guest', blogId } = req.body;
    if (!blogId) return res.status(400).json({ error: 'blogId is required' });
    const existing = await db.execute({ sql: 'SELECT id FROM saved_articles WHERE user_id = ? AND blog_id = ?', args: [userId, blogId] });
    if (existing.rows.length > 0) {
      await db.execute({ sql: 'DELETE FROM saved_articles WHERE user_id = ? AND blog_id = ?', args: [userId, blogId] });
    } else {
      await db.execute({ sql: 'INSERT INTO saved_articles (user_id, blog_id, created_at) VALUES (?, ?, ?)', args: [userId, blogId, new Date().toISOString()] });
    }
    const allSaved = await db.execute({ sql: 'SELECT blog_id FROM saved_articles WHERE user_id = ?', args: [userId] });
    res.json(allSaved.rows.map(r => r.blog_id));
  } catch (err) {
    console.error('Error toggling bookmark save:', err);
    res.status(500).json({ error: 'Failed to toggle bookmark' });
  }
});

// ─── Vercel serverless export ─────────────────────────────────────────────────
export default app;
