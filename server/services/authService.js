import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

export const loginAdminUser = async (username, password) => {
  if (!username || !password) {
    throw new Error('Username and password are required.');
  }

  const admin = await Admin.findOne({ username: username.toLowerCase() });
  if (!admin) {
    throw new Error('Invalid credentials.');
  }

  const isMatch = await admin.comparePassword(password);
  if (!isMatch) {
    throw new Error('Invalid credentials.');
  }

  const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_plot_value_2026';
  const token = jwt.sign(
    { id: admin._id, username: admin.username },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return {
    token,
    admin: {
      id: admin._id,
      username: admin.username,
      name: admin.name
    }
  };
};

export const createDefaultAdminIfEmpty = async () => {
  const count = await Admin.countDocuments();
  if (count > 0) return;

  const defaultUsername = (process.env.ADMIN_USERNAME || 'admin').toLowerCase();
  const defaultPassword = process.env.ADMIN_PASSWORD || 'admin123';

  await Admin.create({
    username: defaultUsername,
    password: defaultPassword,
    name: 'Layout Administrator'
  });

  console.log(`Created default Admin account: username='${defaultUsername}'`);
};
