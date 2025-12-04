module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret_key_here',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'your_jwt_refresh_secret_key_here',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/your_database'
};
