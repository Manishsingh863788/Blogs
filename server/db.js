import { createClient } from '@libsql/client';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In production (Vercel), use Turso cloud database via env vars.
// In local development, fall back to the local SQLite file.
const isProduction = process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN;

export const db = isProduction
  ? createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    })
  : createClient({
      url: `file:${path.join(__dirname, '..', 'database.sqlite')}`,
    });

export async function initDb(initialBlogs = [], initialComments = []) {
  // 1. Create tables
  await db.execute(`
    CREATE TABLE IF NOT EXISTS blogs (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT,
      level TEXT NOT NULL,
      country TEXT NOT NULL,
      state TEXT,
      city TEXT,
      coordinates TEXT,
      category TEXT,
      date TEXT,
      read_time TEXT,
      featured INTEGER DEFAULT 0,
      image TEXT,
      summary TEXT,
      author TEXT,
      content TEXT,
      faqs TEXT,
      created_at TEXT
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS comments (
      id TEXT PRIMARY KEY,
      blog_id TEXT NOT NULL,
      blog_title TEXT,
      user_id TEXT,
      user_name TEXT,
      user_avatar TEXT,
      user_role TEXT,
      text TEXT NOT NULL,
      likes INTEGER DEFAULT 0,
      replies TEXT,
      created_at TEXT
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      avatar TEXT,
      created_at TEXT
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS admin_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS saved_articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT,
      blog_id TEXT NOT NULL,
      created_at TEXT,
      UNIQUE(user_id, blog_id)
    );
  `);

  // 2. Check and seed blogs if empty
  const blogsCount = await db.execute('SELECT COUNT(*) as count FROM blogs');
  const count = Number(blogsCount.rows[0].count);

  if (count === 0 && initialBlogs && initialBlogs.length > 0) {
    console.log(`[SQLite] Seeding ${initialBlogs.length} initial blogs into database.sqlite...`);
    for (const b of initialBlogs) {
      await db.execute({
        sql: `INSERT INTO blogs (
          id, title, slug, level, country, state, city, coordinates, category, date, read_time, featured, image, summary, author, content, faqs, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          b.id,
          b.title,
          b.slug || b.id,
          b.level,
          b.country,
          b.state || '',
          b.city || '',
          JSON.stringify(b.coordinates || [20.5937, 78.9629]),
          b.category || 'General',
          b.date || 'Recent',
          b.readTime || '5 min read',
          b.featured ? 1 : 0,
          b.image || '',
          b.summary || '',
          JSON.stringify(b.author || {}),
          JSON.stringify(b.content || []),
          JSON.stringify(b.faqs || []),
          new Date().toISOString()
        ]
      });
    }
  }

  // 3. Seed comments if empty
  const commentsCount = await db.execute('SELECT COUNT(*) as count FROM comments');
  if (Number(commentsCount.rows[0].count) === 0 && initialComments && initialComments.length > 0) {
    console.log(`[SQLite] Seeding ${initialComments.length} initial comments...`);
    for (const c of initialComments) {
      await db.execute({
        sql: `INSERT INTO comments (
          id, blog_id, blog_title, user_id, user_name, user_avatar, user_role, text, likes, replies, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          c.id,
          c.blogId,
          c.blogTitle || '',
          c.userId || 'user_demo',
          c.userName,
          c.userAvatar || '',
          c.userRole || 'Community Member',
          c.text,
          c.likes || 0,
          JSON.stringify(c.replies || []),
          c.createdAt || new Date().toISOString()
        ]
      });
    }
  }

  // 4. Seed demo user if users empty
  const usersCount = await db.execute('SELECT COUNT(*) as count FROM users');
  if (Number(usersCount.rows[0].count) === 0) {
    await db.execute({
      sql: `INSERT INTO users (id, name, email, password, avatar, created_at) VALUES (?, ?, ?, ?, ?, ?)`,
      args: [
        'user_demo',
        'Demo Citizen',
        'user@example.com',
        'password123',
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
        new Date().toISOString()
      ]
    });
  }

  // 5. Seed default admin credentials if not set
  const adminCreds = await db.execute("SELECT value FROM admin_settings WHERE key = 'admin_creds'");
  if (adminCreds.rows.length === 0) {
    await db.execute({
      sql: "INSERT INTO admin_settings (key, value) VALUES ('admin_creds', ?)",
      args: [JSON.stringify({ username: 'admin', password: 'admin123' })]
    });
  }

  console.log('[SQLite] Database database.sqlite initialized successfully.');
}
