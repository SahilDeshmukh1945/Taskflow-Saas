
const connectDB = require('./config/db')
const dotenv = require('dotenv');
const cors = require('cors');
const express = require('express');
const authRoutes = require("./routes/authRoutes");
const workspaceRoutes = require("./routes/workspaceRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");
dotenv.config();
connectDB();
const app = express();
//middlewares
app.use(express.json());
app.use(cors());

//test route
app.get("/",(req,res)=>{
    res.send("Api is running");
});
app.use("/api/auth",authRoutes);
app.use("/api/workspace",workspaceRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/task", taskRoutes);

app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    message: err.message,
  });
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});