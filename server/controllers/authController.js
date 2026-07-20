import { loginAdminUser } from '../services/authService.js';

export const loginHandler = async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await loginAdminUser(username, password);

    return res.status(200).json({
      success: true,
      message: 'Admin authentication successful.',
      data: result
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message
    });
  }
};

export const getMeHandler = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      data: {
        admin: req.admin
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
