import express from 'express';
import bcrypt from 'bcryptjs';
import { generateToken } from '../middleware/authMiddleware';

const router = express.Router();

// Mock user database (replace with your actual database)
const users = [
  {
    id: '1',
    username: 'testuser',
    password: bcrypt.hashSync('password123', 10)
  }
];

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = generateToken(user.id);
  res.json({ token });
});

router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  const existingUser = users.find(u => u.username === username);
  if (existingUser) {
    return res.status(400).json({ error: 'Username already exists' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = {
    id: String(users.length + 1),
    username,
    password: hashedPassword
  };

  users.push(newUser);
  const token = generateToken(newUser.id);
  res.status(201).json({ token });
});

export default router;
