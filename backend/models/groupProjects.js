import mongoose from "mongoose";

const groupProject = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  Description: {
    type: String,
    required: true
  },
  createdBy: {
    type: String,
    required: true
  },
  members: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'  
  }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  tasks: [{
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    taskname: {
      type : String,
      required: true
    },    
    comments: [
      {
        text: {
          type: String,
          required: true
        },
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        }
      }
    ]
  }],
}, {timestamps: true})

const groupProjectModel = mongoose.model('Group', groupProject)
export default groupProjectModel