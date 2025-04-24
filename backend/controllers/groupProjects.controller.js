import groupProjectModel from "../models/groupProjects.js";
import User from "../models/userModel.js";

export const createGroup = async (req, res) => {
  try {
    const {title, Description} = req.body;
    const userId = req.user._id.toString();
    const user = await User.findById(userId)
    if (!user) return res.status(404).json({message: "User not found"})
    
    if (!title) return res.status(404).json({message: "Please add group title"})
    
    const existingGroup = await groupProjectModel.findOne({ title, user: userId });
    if (existingGroup) {
      return res.status(409).json({ message: "Please enter a new title." });
    }
    const newGroupProject = new groupProjectModel({
      title,
      createdBy: user.userName,
      user: userId,
      Description
    })
    await newGroupProject.save()
    res.status(201).json(newGroupProject)
      
  } catch (error) {
    console.log(error)
    res.status(500).json({message: "Internal server error in create group"})
  }
}

export const joinLeaveGroup = async (req, res) => {
  try {
    const {groupId} = req.params;
    const userId = req.user._id;
    const group = await groupProjectModel.findById(groupId);
    
    if (!group) return res.status(404).json({ error: "Group not found" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const alreadyJoined = user.Joined.includes(groupId);

    if (alreadyJoined) {
      await User.findByIdAndUpdate(userId, { $pull: { Joined: groupId } });
      await groupProjectModel.findByIdAndUpdate(groupId, {$pull : { members: userId}})
      return res.status(200).json({ message: "Left the group" });
    } else {
      await User.findByIdAndUpdate(userId, { $push: { Joined: groupId } });
      await groupProjectModel.findByIdAndUpdate(groupId, {$push : { members: userId}})
      return res.status(200).json({ message: "Joined the group" });
    }

  } catch (error) {
    console.log("Join group error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const allGroups = async (req, res) => {
  try {
    const groups = await groupProjectModel.find().
    sort({createdAt: -1}).populate({
      path: 'user',
      select: '-password',
    })

    if (groups.length === 0) {
      return res.status(404).json([])
    }
    res.status(200).json(groups);

  } catch (error) {
    console.log(error);
    res.status(500).json({message: "Internal server error in get all posts controller"})
  }
}

export const allMembers = async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await groupProjectModel
      .findById(groupId)
      .populate('members', 'fullName userName'); 
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    return res.status(200).json(group.members);
  } catch (error) {
    console.log("Error in allMembers:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

