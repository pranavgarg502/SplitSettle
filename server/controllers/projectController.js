import Project from "../models/Project.js";
import Transaction from "../models/Transaction.js"

const getUserId = (req) => {
  if (!req.user) return null;
  return req.user.isGuest ? req.user.guestId : req.user.id;
};

export const fetchProjects = async (req, res) => {
  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "User not authenticated",
    });
  }

  try {
    const projectList = await Project.find({ createdBy: userId });
    res.status(200).json({
      success: true,
      projects: projectList,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Could not fetch projects",
    });
  }
};

export const addProject = async(req,res)=>{
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const { name , description} = req.body;
    if (!name) return res.status(400).json({ success: false, message: "Project name required" });

    try {
        const newProject = await Project.create({
        name,
        description,
        createdBy: userId,
        });

        res.status(201).json({ success: true, project: newProject });
    } catch (err) {
        res.status(500).json({ success: false, message: "Could not create project" });
  }

}
export const getProjectTransactionList = async (req, res) => {
  try {
    const userId = getUserId(req);
    const projectId = req.query.projectId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    if (!projectId) {
      return res.status(400).json({ success: false, message: "Project ID is missing" });
    }

    const transactions = await Transaction.find({ projectId });
    
    console.log("✅ Transactions found:", transactions.length);

    return res.status(200).json({
      success: true,
      list: transactions,
    });

  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
export const deleteProject = async (req, res) => {
  const userId = getUserId(req);
  const { projectId } = req.params;

  if (!userId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const project = await Project.findOne({ _id: projectId, createdBy: userId });

    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    await Transaction.deleteMany({ projectId });

    await Project.findByIdAndDelete(projectId);

    res.status(200).json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    console.error("Delete Project Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};