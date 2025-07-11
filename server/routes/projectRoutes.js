import express from "express"
import { verifyToken } from "../middlewares/authMiddleware.js"
import { addProject, deleteProject, fetchProjects, getProjectTransactionList,  } from "../controllers/projectController.js";

const router = express.Router();
router.get('/fetch' , verifyToken , fetchProjects);
router.post('/create' , verifyToken , addProject);
router.get('/list' , verifyToken , getProjectTransactionList);
router.delete('/delete/:projectId', verifyToken, deleteProject);

export default router;