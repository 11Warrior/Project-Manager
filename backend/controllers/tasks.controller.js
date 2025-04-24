import groupProjectModel from "../models/groupProjects.js";
import User from "../models/userModel.js";

export const createTasks = async (req, res) => {
  try {
    const { assignedTo, taskname } = req.body;
    const { groupId } = req.params;

    const group = await groupProjectModel.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    const taskExists = group.tasks.some(task => task.taskname === taskname);

    if (taskExists) return res.status(400).json({ message: "Task already exists!" });

    const user = await User.findOne({ userName: assignedTo });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isUserInGroup = group.members.some(memberId =>
      memberId.toString() === user._id.toString()
    );

    if (!isUserInGroup) {
      return res.status(403).json({ message: "User is not a member of this group" });
    }

    group.tasks.push({
      assignedTo: user._id,
      taskname
    });

    await group.save();

    return res.status(201).json({ message: "Task created successfully", group });
  } catch (error) {
    console.error("Error in createTask:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const commentOnTask = async (req, res) => {
  try {
    const {text} = req.body
    const {groupId, taskId} = req.params
    const userId = req.user._id

    if (!text) 
    {
      return res.status(400).json({message: "Please add a comment"}) 
    }

    const group = await groupProjectModel.findById(groupId);
    
    if (!group) return res.status(404).json({ message: "Group not found" });
    const task = group.tasks.id(taskId); 
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const comment = { user: userId, text };
    task.comments.push(comment);

    await group.save(); 

    res.status(201).json({ message: "Comment added", task });
  } catch (error) {
    console.log(error)
    res.status(500).json({message: "Internal server error in comment post controller"})
  }

}

export const getAllTasks = async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await groupProjectModel
      .findById(groupId)
      .populate(
        'tasks.assignedTo', 'fullName userName'
      ); 
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    return res.status(200).json(group.tasks);
  } catch (error) {
    console.log("Error in all tasks :", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}