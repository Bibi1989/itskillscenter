import { Router } from "express";
import {
  registerUser,
  loginUser,
  getUserById,
  updateUser
} from "../controllers/userController";
import jwt from "jsonwebtoken";
import { Auth } from "./userAuth";

const router = Router();

// get user
router.route('/user/:id').get(getUserById)

// route to create a user
router.route("/register").post(registerUser);

router.route("/login").post(loginUser)

router.route("/user/update/:id").patch(updateUser)

export default router;
