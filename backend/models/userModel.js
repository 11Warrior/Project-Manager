import mongoose from "mongoose"

const userModel = mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  fullName: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    minLength: 6
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  Joined: [{
    type:  mongoose.Schema.Types.ObjectId,
    ref: 'Group', 
    default: []
  }]
}, { timestamps: true }) 

const User = mongoose.model('User', userModel);

export default User
