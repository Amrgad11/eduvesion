import express from 'express';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Database from 'better-sqlite3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JWT_SECRET = process.env.JWT_SECRET || 'eduvision-secret-key';
const db = new Database('eduvision.db');

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('student', 'instructor', 'admin')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    instructor_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (instructor_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS enrollments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER,
    course_id INTEGER,
    progress INTEGER DEFAULT 0,
    enrolled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id),
    FOREIGN KEY (course_id) REFERENCES courses(id)
  );

  CREATE TABLE IF NOT EXISTS lessons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id INTEGER,
    title TEXT NOT NULL,
    content TEXT,
    FOREIGN KEY (course_id) REFERENCES courses(id)
  );

  CREATE TABLE IF NOT EXISTS performance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER,
    course_id INTEGER,
    score INTEGER,
    engagement_level TEXT,
    FOREIGN KEY (student_id) REFERENCES users(id),
    FOREIGN KEY (course_id) REFERENCES courses(id)
  );

  CREATE TABLE IF NOT EXISTS ai_recommendations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER,
    recommended_course TEXT,
    reason TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id)
  );

  // Seed Data
  const adminExists = db.prepare('SELECT id FROM users WHERE email = ?').get('admin@eduvision.ai');
  if (!adminExists) {
    const hashedAdminPassword = bcrypt.hashSync('admin123', 10);
    const hashedInstPassword = bcrypt.hashSync('inst123', 10);
    
    db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)').run('Admin User', 'admin@eduvision.ai', hashedAdminPassword, 'admin');
    const instId = db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)').run('Elite Instructor', 'instructor@eduvision.ai', hashedInstPassword, 'instructor').lastInsertRowid;
    
    db.prepare('INSERT INTO courses (title, description, instructor_id) VALUES (?, ?, ?)').run('Introduction to AI Vision', 'Master the basics of computer vision and neural networks.', instId);
    db.prepare('INSERT INTO courses (title, description, instructor_id) VALUES (?, ?, ?)').run('Python for Data Science', 'Comprehensive guide to numpy, pandas, and scikit-learn.', instId);
  }
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Auth Middleware
  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  };

  // Auth APIs
  app.post('/api/auth/register', async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const stmt = db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)');
      const info = stmt.run(name, email, hashedPassword, role);
      res.status(201).json({ id: info.lastInsertRowid, message: 'User registered successfully' });
    } catch (error: any) {
      if (error.code === 'SQLITE_CONSTRAINT') {
        res.status(400).json({ error: 'Email already exists' });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    const user: any = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

    if (!user) return res.status(400).json({ error: 'User not found' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Invalid password' });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, JWT_SECRET);
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  });

  // Courses APIs
  app.get('/api/courses', (req, res) => {
    const courses = db.prepare(`
      SELECT c.*, u.name as instructor_name 
      FROM courses c 
      JOIN users u ON c.instructor_id = u.id
    `).all();
    res.json(courses);
  });

  app.post('/api/courses', authenticateToken, (req: any, res) => {
    if (req.user.role !== 'instructor' && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only instructors and admins can create courses' });
    }
    const { title, description } = req.body;
    const stmt = db.prepare('INSERT INTO courses (title, description, instructor_id) VALUES (?, ?, ?)');
    const info = stmt.run(title, description, req.user.id);
    res.status(201).json({ id: info.lastInsertRowid });
  });

  app.put('/api/courses/:id', authenticateToken, (req: any, res) => {
    const { title, description } = req.body;
    const course: any = db.prepare('SELECT * FROM courses WHERE id = ?').get(req.params.id);
    
    if (!course) return res.status(410).json({ error: 'Course not found' });
    if (course.instructor_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    db.prepare('UPDATE courses SET title = ?, description = ? WHERE id = ?').run(title, description, req.params.id);
    res.json({ message: 'Course updated' });
  });

  app.delete('/api/courses/:id', authenticateToken, (req: any, res) => {
    const course: any = db.prepare('SELECT * FROM courses WHERE id = ?').get(req.params.id);
    if (!course) return res.status(410).json({ error: 'Course not found' });
    if (course.instructor_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    db.prepare('DELETE FROM courses WHERE id = ?').run(req.params.id);
    res.json({ message: 'Course deleted' });
  });

  // Dashboard & Analytics
  app.get('/api/dashboard', authenticateToken, (req: any, res) => {
    const { id, role } = req.user;
    
    if (role === 'student') {
      const enrollments = db.prepare(`
        SELECT e.*, c.title as course_title, c.description 
        FROM enrollments e 
        JOIN courses c ON e.course_id = c.id 
        WHERE e.student_id = ?
      `).all(id);
      
      const recommendations = db.prepare('SELECT * FROM ai_recommendations WHERE student_id = ? ORDER BY created_at DESC').all(id);
      const performance = db.prepare('SELECT * FROM performance WHERE student_id = ?').all(id);

      res.json({ enrollments, recommendations, performance });
    } else if (role === 'instructor') {
      const myCourses = db.prepare('SELECT * FROM courses WHERE instructor_id = ?').all(id);
      const studentCount = db.prepare(`
        SELECT COUNT(DISTINCT student_id) as count 
        FROM enrollments e 
        JOIN courses c ON e.course_id = c.id 
        WHERE c.instructor_id = ?
      `).get(id);

      res.json({ myCourses, studentCount });
    } else if (role === 'admin') {
      const stats = {
        users: db.prepare('SELECT COUNT(*) as count FROM users').get(),
        courses: db.prepare('SELECT COUNT(*) as count FROM courses').get(),
        enrollments: db.prepare('SELECT COUNT(*) as count FROM enrollments').get()
      };
      res.json(stats);
    }
  });

  app.get('/api/analytics', authenticateToken, (req: any, res) => {
    // Basic aggregation for charts
    const enrollmentTrends = db.prepare(`
      SELECT enrolled_at, COUNT(*) as count 
      FROM enrollments 
      GROUP BY enrolled_at 
      ORDER BY enrolled_at LIMIT 10
    `).all();
    res.json({ enrollmentTrends });
  });

  // Enrollment (Student)
  app.post('/api/courses/:id/enroll', authenticateToken, (req: any, res) => {
    if (req.user.role !== 'student') return res.status(403).json({ error: 'Only students can enroll' });
    try {
      db.prepare('INSERT INTO enrollments (student_id, course_id) VALUES (?, ?)').run(req.user.id, req.params.id);
      res.status(201).json({ message: 'Enrolled successfully' });
    } catch (e) {
      res.status(500).json({ error: 'Enrollment failed' });
    }
  });

  // Recommendations (Backend part - simple logic for now, Frontend will use Gemini)
  app.post('/api/recommendations', authenticateToken, (req: any, res) => {
    const { student_id, recommended_course, reason } = req.body;
    db.prepare('INSERT INTO ai_recommendations (student_id, recommended_course, reason) VALUES (?, ?, ?)')
      .run(student_id, recommended_course, reason);
    res.status(201).json({ message: 'Recommendation saved' });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
