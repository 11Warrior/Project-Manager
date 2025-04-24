import { createTasks, commentOnTask, getAllTasks } from "../controllers/tasks.controller.js";
import express from "express"
import { protectRoute } from "../middleware/protectRoute.js";

const router =  express.Router();
router.post('/:groupId/createTasks', protectRoute, createTasks);
router.post('/:groupId/comment/:taskId', protectRoute, commentOnTask);
router.get('/allTasks/:groupId', protectRoute, getAllTasks);


export default router