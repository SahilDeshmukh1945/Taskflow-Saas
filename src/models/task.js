const mongoose = require("mongoose")
const taskSchema = mongoose.Schema({
    title :{
        type : String,
        required: true
    },
    project:{
        type:mongoose.Schema.ObjectId,
        ref:"Project",
        required : true
    },
    assignedTo:{
        type : mongoose.Schema.ObjectId,
        ref:"User",
    },
    status:{
        type: String,
        enum: ["todo", "in-progress", "done"],
        default: "todo",
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
},
{timestamps:true}
);

module.exports = mongoose.model("Task", taskSchema);