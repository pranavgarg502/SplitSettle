import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get('/me', verifyToken, (req, res) => {
  const isGuest = req.user?.isGuest;
  const userId = isGuest ? req.user.guestId : req.user.id;
  const username = isGuest ? 'Guest' : req.user.username;

  res.json({
    success: true,
    isGuest,
    username,
    message: `Welcome, ${username} (${userId})`,
  });
});

export default router;
