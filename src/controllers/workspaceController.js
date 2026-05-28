const Workspace = require("../models/workspace");
const asyncHandler = require("express-async-handler");

// =========================
// CREATE WORKSPACE
// =========================
const createWorkspace = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const workspace = await Workspace.create({
    name,
    owner: req.user,
    members: [
      {
        user: req.user,
        role: "owner",
      },
    ],
  });

  res.status(201).json({
    message: "Workspace created",
    workspace,
  });
});

// =========================
// GET WORKSPACES
// =========================
const getWorkspace = asyncHandler(async (req, res) => {
  const workspaces = await Workspace.find({
    "members.user": req.user,
  }).populate("members.user", "name email");

  res.status(200).json({
    workspaces,
  });
});

// =========================
// ADD MEMBER
// =========================
const addMember = asyncHandler(async (req, res) => {
  const { workspaceId, userId } = req.body;

  const workspace = await Workspace.findById(workspaceId);

  if (!workspace) {
    res.status(404);
    throw new Error("Workspace not found");
  }

  // 🔥 Find current user in members
  const currentUser = workspace.members.find(
    (m) => m.user.toString() === req.user.toString()
  );

  if (!currentUser) {
    res.status(403);
    throw new Error("Not authorized");
  }

  // 🔥 Only owner can add members
  if (currentUser.role !== "owner") {
    res.status(403);
    throw new Error("Only owner can add members");
  }

  // 🔥 Check if already member
  const alreadyMember = workspace.members.find(
    (m) => m.user.toString() === userId
  );

  if (alreadyMember) {
    res.status(400);
    throw new Error("User already a member");
  }

  // ✅ Add member
  workspace.members.push({
    user: userId,
    role: "member",
  });

  await workspace.save();

  res.status(200).json({
    message: "Member added successfully",
    workspace,
  });
});

module.exports = {
  createWorkspace,
  getWorkspace,
  addMember,
};