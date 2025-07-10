import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, message: "No token provided." });
  }

  if (token.startsWith("guest_")) {
    req.user = {
      isGuest: true,
      guestId: token,
    };
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      isGuest: false,
      id: decoded.id,
      username: decoded.username,
    };
    return next();
  } catch (err) {
    return res.status(403).json({ success: false, message: "Invalid Or Expired Token" });
  }
};
