import express from "express";
import {  createGroup, allGroups, joinLeaveGroup, allMembers } from "../controllers/groupProjects.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";
const groupRoutes = express.Router();

groupRoutes.post('/createGroup', protectRoute, createGroup)
groupRoutes.post('/joinLeaveGroup/:groupId', protectRoute, joinLeaveGroup)
groupRoutes.get('/allMembers/:groupId', protectRoute, allMembers)
groupRoutes.post('/allGroups', protectRoute, allGroups)

export default groupRoutes;
