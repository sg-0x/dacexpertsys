import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dacexpertsys_dev_secret_change_me';

export function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

export function requireRoles(...allowedRoles) {
  return (req, res, next) => {
    const role = String(req.user?.role || '').toLowerCase();
    if (!allowedRoles.map((value) => String(value).toLowerCase()).includes(role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    return next();
  };
}
