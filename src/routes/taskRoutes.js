const express = require("express");
const { createTask, getTasks , updateTask,deleteTask} = require("../controllers/taskController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create", protect, createTask);
// Get Tasks (with filters)
router.get("/:projectId", protect, getTasks);
router.put("/:taskId", protect, updateTask);
router.delete("/:taskId", protect, deleteTask);
module.exports = router;