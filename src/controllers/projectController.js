const Project = require("../models/project");
const Workspace = require("../models/workspace");
const Task = require('../models/task')
const createProject = async (req, res) => {
  try {
    const { name, workspaceId } = req.body;

    // 1️⃣ Check workspace exists
    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    // 2️⃣ Check user is member (VERY IMPORTANT 🔥)
const member = workspace.members.find(
  (m) => m.user.toString() === req.user.toString()
);

    if (!member) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // 3️⃣ Create project
    const project = await Project.create({
      name,
      workspace: workspaceId,
      createdBy: req.user,
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getProjects = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    // 1️⃣ Check workspace exists
    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    // 2️⃣ Check user is member
const member = workspace.members.find(
  (m) => m.user.toString() === req.user.toString()
);

    if (!member) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // 3️⃣ Get projects
    const projects = await Project.find({
      workspace: workspaceId,
    });

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params

    const project = await Project.findById(projectId)
    if (!project) {
      return res.status(404).json({ message: 'Project not found' })
    }

    // Check workspace membership
    const workspace = await Workspace.findById(project.workspace)
    const member = workspace.members.find(
      m => m.user.toString() === req.user.toString()
    )
    if (!member) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    // Only owner or admin can delete
    if (member.role !== 'owner' && member.role !== 'admin') {
      return res.status(403).json({ message: 'Only owner/admin can delete project' })
    }

    // Delete all tasks in project too
    await Task.deleteMany({ project: projectId })

    await project.deleteOne()

    res.json({ message: 'Project deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


module.exports = { createProject, getProjects, deleteProject };