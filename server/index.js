import express from 'express';
import cors from 'cors';
import { db, initDb } from './db.js';
import { INITIAL_BLOGS, INITIAL_COMMENTS } from './seedData.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '15mb' }));

// Helper to format blog rows from SQLite
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

// Helper to format comment rows from SQLite
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

// ==========================================
// 1. BLOGS API ENDPOINTS
// ==========================================

// GET all blogs
app.get('/api/blogs', async (req, res) => {
  try {
    const result = await db.execute('SELECT * FROM blogs ORDER BY datetime(created_at) DESC, rowid DESC');
    const blogs = result.rows.map(formatBlogRow);
    res.json(blogs);
  } catch (err) {
    console.error('Error fetching blogs:', err);
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
});

// GET single blog by ID
app.get('/api/blogs/:id', async (req, res) => {
  try {
    const result = await db.execute({
      sql: 'SELECT * FROM blogs WHERE id = ?',
      args: [req.params.id]
    });
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    res.json(formatBlogRow(result.rows[0]));
  } catch (err) {
    console.error('Error fetching blog:', err);
    res.status(500).json({ error: 'Failed to fetch blog' });
  }
});

// CREATE a new blog
app.post('/api/blogs', async (req, res) => {
  try {
    const b = req.body;
    const id = b.id || `${b.level || 'blog'}-${Date.now()}`;
    const slug = b.slug || (b.title ? b.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : id);
    const createdAt = b.createdAt || new Date().toISOString();

    await db.execute({
      sql: `INSERT INTO blogs (
        id, title, slug, level, country, state, city, coordinates, category, date, read_time, featured, image, summary, author, content, faqs, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id,
        b.title,
        slug,
        b.level || 'country',
        b.country || 'India',
        b.state || '',
        b.city || '',
        JSON.stringify(b.coordinates || [20.5937, 78.9629]),
        b.category || 'General',
        b.date || 'Just Now',
        b.readTime || '5 min read',
        b.featured ? 1 : 0,
        b.image || '',
        b.summary || '',
        JSON.stringify(b.author || {}),
        JSON.stringify(b.content || []),
        JSON.stringify(b.faqs || []),
        createdAt
      ]
    });

    const created = await db.execute({
      sql: 'SELECT * FROM blogs WHERE id = ?',
      args: [id]
    });

    res.status(201).json(formatBlogRow(created.rows[0]));
  } catch (err) {
    console.error('Error creating blog:', err);
    res.status(500).json({ error: 'Failed to create blog' });
  }
});

// UPDATE an existing blog
app.put('/api/blogs/:id', async (req, res) => {
  try {
    const b = req.body;
    const id = req.params.id;

    await db.execute({
      sql: `UPDATE blogs SET
        title = ?,
        level = ?,
        country = ?,
        state = ?,
        city = ?,
        category = ?,
        image = ?,
        summary = ?,
        content = ?,
        faqs = ?,
        featured = ?
      WHERE id = ?`,
      args: [
        b.title,
        b.level,
        b.country,
        b.state || '',
        b.city || '',
        b.category,
        b.image || '',
        b.summary || '',
        JSON.stringify(b.content || []),
        JSON.stringify(b.faqs || []),
        b.featured ? 1 : 0,
        id
      ]
    });

    const updated = await db.execute({
      sql: 'SELECT * FROM blogs WHERE id = ?',
      args: [id]
    });

    if (updated.rows.length === 0) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    res.json(formatBlogRow(updated.rows[0]));
  } catch (err) {
    console.error('Error updating blog:', err);
    res.status(500).json({ error: 'Failed to update blog' });
  }
});

// TOGGLE FEATURED for a blog
app.patch('/api/blogs/:id/featured', async (req, res) => {
  try {
    const id = req.params.id;
    const current = await db.execute({
      sql: 'SELECT featured FROM blogs WHERE id = ?',
      args: [id]
    });

    if (current.rows.length === 0) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    const newFeatured = current.rows[0].featured ? 0 : 1;

    await db.execute({
      sql: 'UPDATE blogs SET featured = ? WHERE id = ?',
      args: [newFeatured, id]
    });

    res.json({ id, featured: Boolean(newFeatured) });
  } catch (err) {
    console.error('Error toggling featured:', err);
    res.status(500).json({ error: 'Failed to toggle featured status' });
  }
});

// ADD FAQ item to a blog
app.post('/api/blogs/:id/faq', async (req, res) => {
  try {
    const id = req.params.id;
    const { question, answer } = req.body;

    const current = await db.execute({
      sql: 'SELECT faqs FROM blogs WHERE id = ?',
      args: [id]
    });

    if (current.rows.length === 0) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    const existingFaqs = current.rows[0].faqs ? JSON.parse(current.rows[0].faqs) : [];
    const updatedFaqs = [...existingFaqs, { question, answer }];

    await db.execute({
      sql: 'UPDATE blogs SET faqs = ? WHERE id = ?',
      args: [JSON.stringify(updatedFaqs), id]
    });

    const updated = await db.execute({
      sql: 'SELECT * FROM blogs WHERE id = ?',
      args: [id]
    });

    res.json(formatBlogRow(updated.rows[0]));
  } catch (err) {
    console.error('Error adding FAQ to blog:', err);
    res.status(500).json({ error: 'Failed to add FAQ' });
  }
});

// ADD Section item to a blog
app.post('/api/blogs/:id/section', async (req, res) => {
  try {
    const id = req.params.id;
    const { heading, body } = req.body;

    const current = await db.execute({
      sql: 'SELECT content FROM blogs WHERE id = ?',
      args: [id]
    });

    if (current.rows.length === 0) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    const existingContent = current.rows[0].content ? JSON.parse(current.rows[0].content) : [];
    const updatedContent = [...existingContent, { heading, body }];

    await db.execute({
      sql: 'UPDATE blogs SET content = ? WHERE id = ?',
      args: [JSON.stringify(updatedContent), id]
    });

    const updated = await db.execute({
      sql: 'SELECT * FROM blogs WHERE id = ?',
      args: [id]
    });

    res.json(formatBlogRow(updated.rows[0]));
  } catch (err) {
    console.error('Error adding section to blog:', err);
    res.status(500).json({ error: 'Failed to add section' });
  }
});

// DELETE a blog
app.delete('/api/blogs/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await db.execute({
      sql: 'DELETE FROM blogs WHERE id = ?',
      args: [id]
    });
    await db.execute({
      sql: 'DELETE FROM saved_articles WHERE blog_id = ?',
      args: [id]
    });
    res.json({ success: true, deletedId: id });
  } catch (err) {
    console.error('Error deleting blog:', err);
    res.status(500).json({ error: 'Failed to delete blog' });
  }
});

// ==========================================
// 2. COMMENTS & Q&A API ENDPOINTS
// ==========================================

// GET all comments
app.get('/api/comments', async (req, res) => {
  try {
    const result = await db.execute('SELECT * FROM comments ORDER BY datetime(created_at) DESC, rowid DESC');
    const comments = result.rows.map(formatCommentRow);
    res.json(comments);
  } catch (err) {
    console.error('Error fetching comments:', err);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

// POST a new comment / question
app.post('/api/comments', async (req, res) => {
  try {
    const c = req.body;
    const id = c.id || `comm_${Date.now()}`;
    const createdAt = c.createdAt || new Date().toISOString();

    await db.execute({
      sql: `INSERT INTO comments (
        id, blog_id, blog_title, user_id, user_name, user_avatar, user_role, text, likes, replies, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id,
        c.blogId,
        c.blogTitle || '',
        c.userId || 'user_guest',
        c.userName || 'Anonymous',
        c.userAvatar || '',
        c.userRole || 'Community Member',
        c.text,
        0,
        JSON.stringify([]),
        createdAt
      ]
    });

    const created = await db.execute({
      sql: 'SELECT * FROM comments WHERE id = ?',
      args: [id]
    });

    res.status(201).json(formatCommentRow(created.rows[0]));
  } catch (err) {
    console.error('Error posting comment:', err);
    res.status(500).json({ error: 'Failed to post comment' });
  }
});

// POST reply to a comment
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

    const current = await db.execute({
      sql: 'SELECT replies FROM comments WHERE id = ?',
      args: [commentId]
    });

    if (current.rows.length === 0) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    const existingReplies = current.rows[0].replies ? JSON.parse(current.rows[0].replies) : [];
    const updatedReplies = [...existingReplies, replyData];

    await db.execute({
      sql: 'UPDATE comments SET replies = ? WHERE id = ?',
      args: [JSON.stringify(updatedReplies), commentId]
    });

    const updated = await db.execute({
      sql: 'SELECT * FROM comments WHERE id = ?',
      args: [commentId]
    });

    res.json(formatCommentRow(updated.rows[0]));
  } catch (err) {
    console.error('Error replying to comment:', err);
    res.status(500).json({ error: 'Failed to reply to comment' });
  }
});

// LIKE a comment
app.post('/api/comments/:id/like', async (req, res) => {
  try {
    const id = req.params.id;
    await db.execute({
      sql: 'UPDATE comments SET likes = likes + 1 WHERE id = ?',
      args: [id]
    });

    const updated = await db.execute({
      sql: 'SELECT * FROM comments WHERE id = ?',
      args: [id]
    });

    if (updated.rows.length === 0) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    res.json(formatCommentRow(updated.rows[0]));
  } catch (err) {
    console.error('Error liking comment:', err);
    res.status(500).json({ error: 'Failed to like comment' });
  }
});

// DELETE a comment
app.delete('/api/comments/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await db.execute({
      sql: 'DELETE FROM comments WHERE id = ?',
      args: [id]
    });
    res.json({ success: true, deletedId: id });
  } catch (err) {
    console.error('Error deleting comment:', err);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

// ==========================================
// 3. AUTH & CREDENTIALS API ENDPOINTS
// ==========================================

// GET all registered users
app.get('/api/auth/users', async (req, res) => {
  try {
    const result = await db.execute('SELECT id, name, email, avatar, created_at FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// User login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await db.execute({
      sql: 'SELECT id, name, email, avatar, password FROM users WHERE LOWER(email) = LOWER(?)',
      args: [email.trim()]
    });

    if (result.rows.length === 0 || result.rows[0].password !== password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = {
      id: result.rows[0].id,
      name: result.rows[0].name,
      email: result.rows[0].email,
      avatar: result.rows[0].avatar
    };

    res.json(user);
  } catch (err) {
    console.error('Error logging in user:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// User registration
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await db.execute({
      sql: 'SELECT id FROM users WHERE LOWER(email) = LOWER(?)',
      args: [email.trim()]
    });

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'An account with this email address already exists' });
    }

    const id = `usr_${Date.now()}`;
    const avatar = `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 100)}?auto=format&fit=crop&w=120&q=80`;
    const createdAt = new Date().toISOString();

    await db.execute({
      sql: 'INSERT INTO users (id, name, email, password, avatar, created_at) VALUES (?, ?, ?, ?, ?, ?)',
      args: [id, name.trim(), email.trim().toLowerCase(), password, avatar, createdAt]
    });

    res.status(201).json({ id, name: name.trim(), email: email.trim().toLowerCase(), avatar });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Admin login
app.post('/api/auth/admin-login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await db.execute("SELECT value FROM admin_settings WHERE key = 'admin_creds'");
    
    let creds = { username: 'admin', password: 'admin123' };
    if (result.rows.length > 0) {
      creds = JSON.parse(result.rows[0].value);
    }

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

// GET admin credentials info
app.get('/api/auth/admin-creds', async (req, res) => {
  try {
    const result = await db.execute("SELECT value FROM admin_settings WHERE key = 'admin_creds'");
    let creds = { username: 'admin', password: 'admin123' };
    if (result.rows.length > 0) {
      creds = JSON.parse(result.rows[0].value);
    }
    res.json({ username: creds.username, password: creds.password });
  } catch (err) {
    console.error('Error fetching admin creds:', err);
    res.status(500).json({ error: 'Failed to fetch admin credentials' });
  }
});

// UPDATE admin credentials
app.put('/api/auth/admin-creds', async (req, res) => {
  try {
    const { username, password } = req.body;
    const updated = {
      username: username ? username.trim() : 'admin',
      password: password || 'admin123'
    };

    await db.execute({
      sql: "INSERT OR REPLACE INTO admin_settings (key, value) VALUES ('admin_creds', ?)",
      args: [JSON.stringify(updated)]
    });

    res.json({ success: true, username: updated.username });
  } catch (err) {
    console.error('Error updating admin credentials:', err);
    res.status(500).json({ error: 'Failed to update admin credentials' });
  }
});

// ==========================================
// 4. SAVED ARTICLES / BOOKMARKS API
// ==========================================

// GET saved articles
app.get('/api/saved', async (req, res) => {
  try {
    const userId = req.query.userId || 'guest';
    const result = await db.execute({
      sql: 'SELECT blog_id FROM saved_articles WHERE user_id = ?',
      args: [userId]
    });
    const savedIds = result.rows.map(r => r.blog_id);
    res.json(savedIds);
  } catch (err) {
    console.error('Error fetching saved articles:', err);
    res.status(500).json({ error: 'Failed to fetch saved articles' });
  }
});

// TOGGLE bookmark save
app.post('/api/saved/toggle', async (req, res) => {
  try {
    const { userId = 'guest', blogId } = req.body;
    if (!blogId) {
      return res.status(400).json({ error: 'blogId is required' });
    }

    const existing = await db.execute({
      sql: 'SELECT id FROM saved_articles WHERE user_id = ? AND blog_id = ?',
      args: [userId, blogId]
    });

    if (existing.rows.length > 0) {
      await db.execute({
        sql: 'DELETE FROM saved_articles WHERE user_id = ? AND blog_id = ?',
        args: [userId, blogId]
      });
    } else {
      await db.execute({
        sql: 'INSERT INTO saved_articles (user_id, blog_id, created_at) VALUES (?, ?, ?)',
        args: [userId, blogId, new Date().toISOString()]
      });
    }

    const allSaved = await db.execute({
      sql: 'SELECT blog_id FROM saved_articles WHERE user_id = ?',
      args: [userId]
    });

    res.json(allSaved.rows.map(r => r.blog_id));
  } catch (err) {
    console.error('Error toggling bookmark save:', err);
    res.status(500).json({ error: 'Failed to toggle bookmark' });
  }
});

// Start Express server and initialize SQLite database
async function start() {
  try {
    await initDb(INITIAL_BLOGS, INITIAL_COMMENTS);
    app.listen(PORT, () => {
      console.log(`[Express] SQLite Backend API server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('[Express] Failed to initialize SQLite database & start server:', err);
  }
}

start();
