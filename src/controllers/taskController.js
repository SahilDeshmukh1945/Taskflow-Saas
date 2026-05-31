const asyncHandler = require("express-async-handler");
const Task = require("../models/task");
const Project = require("../models/project");
const Workspace = require("../models/workspace");

// =========================
// CREATE TASK
// =========================
const createTask = asyncHandler(async (req, res) => {
  const { title, projectId, assignedTo } = req.body;

  // 1️⃣ Check project exists
  const project = await Project.findById(projectId);

  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  // 2️⃣ Get workspace
  const workspace = await Workspace.findById(project.workspace);

  if (!workspace) {
    res.status(404);
    throw new Error("Workspace not found");
  }

  // 3️⃣ Check user is member
const member = workspace.members.find(
  (m) => {
    const memberId = m.user._id ? m.user._id.toString() : m.user.toString()
    return memberId === req.user.toString()
  }
)

  if (!member) {
    res.status(403);
    throw new Error("Not authorized");
  }

  // 4️⃣ Validate assigned user
  if (assignedTo) {
    const isAssignedMember = workspace.members.find(
      (m) => m.user.toString() === assignedTo.toString()
    );

    if (!isAssignedMember) {
      res.status(400);
      throw new Error("Assigned user is not part of workspace");
    }
  }

  // 5️⃣ Create task
  const task = await Task.create({
    title,
    project: projectId,
    assignedTo,
    createdBy: req.user,
  });

  res.status(201).json(task);
});

// =========================
// GET TASKS
// =========================
const getTasks = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  // 1️⃣ Check project exists
  const project = await Project.findById(projectId);

  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  // 2️⃣ Get workspace
  const workspace = await Workspace.findById(project.workspace);

  if (!workspace) {
    res.status(404);
    throw new Error("Workspace not found");
  }

  // 3️⃣ Check membership
const member = workspace.members.find(
  (m) => {
    const memberId = m.user._id ? m.user._id.toString() : m.user.toString()
    return memberId === req.user.toString()
  }
)

  if (!member) {
    res.status(403);
    throw new Error("Not authorized");
  }

  // 4️⃣ Filters
  const { status, assignedTo } = req.query;

  const filter = {
    project: projectId,
  };

  if (status) {
    filter.status = status;
  }

  if (assignedTo) {
    filter.assignedTo = assignedTo;
  }

  // 5️⃣ Get tasks
  const tasks = await Task.find(filter)
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email");

  res.json(tasks);
});

// =========================
// UPDATE TASK
// =========================
const updateTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params
  const { title, status, assignedTo } = req.body

  const task = await Task.findById(taskId)
  if (!task) {
    res.status(404)
    throw new Error("Task not found")
  }

  const project = await Project.findById(task.project)
  const workspace = await Workspace.findById(project.workspace)

  const member = workspace.members.find(
    (m) => {
      const memberId = m.user._id ? m.user._id.toString() : m.user.toString()
      return memberId === req.user.toString()
    }
  )

  if (!member) {
    res.status(403)
    throw new Error("Not authorized")
  }

  const isAssignedUser = task.assignedTo &&
    task.assignedTo.toString() === req.user.toString()

  const isAdminOrOwner = member.role === "owner" || member.role === "admin"

  if (!isAssignedUser && !isAdminOrOwner) {
    res.status(403)
    throw new Error("Only assigned user or admin/owner can update task")
  }

  if (assignedTo) {
    const isAssignedMember = workspace.members.find(
      (m) => {
        const memberId = m.user._id ? m.user._id.toString() : m.user.toString()
        return memberId === assignedTo.toString()
      }
    )
    if (!isAssignedMember) {
      res.status(400)
      throw new Error("Assigned user is not part of workspace")
    }
    task.assignedTo = assignedTo
  }

  if (title) task.title = title
  if (status) task.status = status

  await task.save()
  res.json(task)
})

// =========================
// DELETE TASK
// =========================
const deleteTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  // 1️⃣ Find task
  const task = await Task.findById(taskId);

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  // 2️⃣ Get project
  const project = await Project.findById(task.project);

  // 3️⃣ Get workspace
  const workspace = await Workspace.findById(project.workspace);

  // 4️⃣ Check membership
 const member = workspace.members.find(
  (m) => {
    const memberId = m.user._id ? m.user._id.toString() : m.user.toString()
    return memberId === req.user.toString()
  }
)

  if (!member) {
    res.status(403);
    throw new Error("Not authorized");
  }

  // 5️⃣ Only owner/admin can delete
  if (member.role !== "owner" && member.role !== "admin") {
    res.status(403);
    throw new Error("Only owner/admin can delete task");
  }

  await task.deleteOne();

  res.json({ message: "Task deleted successfully" });
});

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
};
