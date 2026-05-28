const express = require("express");
const { createProject, getProjects, deleteProject } = require("../controllers/projectController")
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create", protect, createProject);
router.get("/:workspaceId", protect, getProjects);
router.delete("/:projectId", protect, deleteProject)
module.exports = router;