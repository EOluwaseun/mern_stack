import jwt from 'jsonwebtoken';

// generate token with id and it expires in 3days
export const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};
