const asyncHandler = require("express-async-handler");
const Task = require("../models/task");
const Project = require("../models/project");
const Workspace = require("../models/workspace");

const getMember = (workspace, userId) => {
  return workspace.members.find(
    (m) => m.user.toString() === userId.toString()
  );
};

const createTask = asyncHandler(async (req, res) => {
  const { title, projectId, assignedTo } = req.body;

  const project = await Project.findById(projectId);
  if (!project) { res.status(404); throw new Error("Project not found"); }

  const workspace = await Workspace.findById(project.workspace);
  if (!workspace) { res.status(404); throw new Error("Workspace not found"); }

  const member = getMember(workspace, req.user);
  if (!member) { res.status(403); throw new Error("Not authorized"); }

  if (assignedTo) {
    const isAssignedMember = getMember(workspace, assignedTo);
    if (!isAssignedMember) {
      res.status(400);
      throw new Error("Assigned user is not part of workspace");
    }
  }

  const task = await Task.create({
    title,
    project: projectId,
    assignedTo,
    createdBy: req.user,
  });

  res.status(201).json(task);
});

const getTasks = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const project = await Project.findById(projectId);
  if (!project) { res.status(404); throw new Error("Project not found"); }

  const workspace = await Workspace.findById(project.workspace);
  if (!workspace) { res.status(404); throw new Error("Workspace not found"); }

  const member = getMember(workspace, req.user);
  if (!member) { res.status(403); throw new Error("Not authorized"); }

  const { status, assignedTo } = req.query;
  const filter = { project: projectId };
  if (status) filter.status = status;
  if (assignedTo) filter.assignedTo = assignedTo;

  const tasks = await Task.find(filter)
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email");

  res.json(tasks);
});

const updateTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { title, status, assignedTo } = req.body;

  const task = await Task.findById(taskId);
  if (!task) { res.status(404); throw new Error("Task not found"); }

  const project = await Project.findById(task.project);
  const workspace = await Workspace.findById(project.workspace);

  const member = getMember(workspace, req.user);
  if (!member) { res.status(403); throw new Error("Not authorized"); }

  const isAssignedUser = task.assignedTo &&
    task.assignedTo.toString() === req.user.toString();
  const isAdminOrOwner = member.role === "owner" || member.role === "admin";

  if (!isAssignedUser && !isAdminOrOwner) {
    res.status(403);
    throw new Error("Only assigned user or admin/owner can update task");
  }

  if (assignedTo) {
    const isAssignedMember = getMember(workspace, assignedTo);
    if (!isAssignedMember) {
      res.status(400);
      throw new Error("Assigned user is not part of workspace");
    }
    task.assignedTo = assignedTo;
  }

  if (title) task.title = title;
  if (status) task.status = status;

  await task.save();
  res.json(task);
});

const deleteTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  const task = await Task.findById(taskId);
  if (!task) { res.status(404); throw new Error("Task not found"); }

  const project = await Project.findById(task.project);
  const workspace = await Workspace.findById(project.workspace);

  const member = getMember(workspace, req.user);
  if (!member) { res.status(403); throw new Error("Not authorized"); }

  if (member.role !== "owner" && member.role !== "admin") {
    res.status(403);
    throw new Error("Only owner/admin can delete task");
  }

  await task.deleteOne();
  res.json({ message: "Task deleted successfully" });
});

module.exports = { createTask, getTasks, updateTask, deleteTask };