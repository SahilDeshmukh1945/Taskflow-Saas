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
  const { workspaceId, email, role } = req.body

  const workspace = await Workspace.findById(workspaceId)
  if (!workspace) {
    res.status(404)
    throw new Error("Workspace not found")
  }

  // Check current user is owner
  const currentUser = workspace.members.find(
    (m) => m.user._id
      ? m.user._id.toString() === req.user.toString()
      : m.user.toString() === req.user.toString()
  )

  if (!currentUser) {
    res.status(403)
    throw new Error("Not authorized")
  }

  if (currentUser.role !== "owner") {
    res.status(403)
    throw new Error("Only owner can add members")
  }

  // Find user by email
  const userToAdd = await User.findOne({ email })
  if (!userToAdd) {
    res.status(404)
    throw new Error("No user found with that email")
  }

  // Check if already member
  const alreadyMember = workspace.members.find(
    (m) => m.user._id
      ? m.user._id.toString() === userToAdd._id.toString()
      : m.user.toString() === userToAdd._id.toString()
  )

  if (alreadyMember) {
    res.status(400)
    throw new Error("User already a member")
  }

  workspace.members.push({
    user: userToAdd._id,
    role: role || "member",
  })

  await workspace.save()
  const updatedWorkspace = await Workspace.findById(workspace._id)
  .populate("members.user", "name email")
  res.status(200).json({
    message: "Member added successfully",
    workspace: updatedWorkspace,
  })
})

module.exports = {
  createWorkspace,
  getWorkspace,
  addMember,
};