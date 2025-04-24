import express from "express"
import { signUp, logIn, getAuthUser, logOut } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";
const router = express.Router();

router.post('/signup', signUp);
router.get('/getAuthUser', protectRoute,getAuthUser)
router.post('/login',logIn);
router.post('/logout', logOut);


export default router