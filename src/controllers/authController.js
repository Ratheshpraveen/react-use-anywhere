const User = require('../models/User');

const users = []; // In-memory user storage (replace with database in production)

const register = (req, res) => {
  const { username, password } = req.body;

  // Check if user already exists
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ error: 'User already exists' });
  }

  const newUser = new User(username, password);
  users.push(newUser);

  const token = newUser.generateAuthToken();
  res.status(201).json({ token });
};

const login = (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username);

  if (!user || !user.comparePassword(password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = user.generateAuthToken();
  res.json({ token });
};

module.exports = {
  register,
  login
};
