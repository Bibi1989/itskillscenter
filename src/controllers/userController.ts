import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserInterface, LoginInterface } from "../interfaces/userInterface";
import {
  validateUserRegister,
  validateUserLogin,
} from "../validation/validateUser";
import { Auth } from "../routes/userAuth";
import { Request, Response } from "express";
const db = require("../../database/models");

const { User, Project, Task } = db;

export const registerUser = async (req: Request, res: Response) => {

  const { value, error } = validateUserRegister(req.body);

  if (error.username) return res.status(400).json({ status: "error", error: error.username });
  if (error.email) return res.status(400).json({ status: "error", error: error.email });
  if (error.password) return res.status(400).json({ status: "error", error: error.password });

  const checkUserExist = await User.findOne({
    where: { email: value.email },
  });

  if (checkUserExist) return res.status(400).json({ status: "error", error: "User exist already" });

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(value.password, salt);

  try {
    const registered = await User.create({
      ...value,
      password: hashedPassword,
    });

    const token = await jwt.sign(registered.dataValues, process.env.SECRET_KEY);

    return res.json({ status: "success", user: registered, token })
  } catch (error) {
    return res.status(400).json({status: 'error', error: error.message});
  }
};

export const loginUser = async (req: Request, res: Response) => {

  const { value, error } = validateUserLogin(req.body);

  console.log({value, error})

  if (error.email) return res.status(400).json({ status: "error", error: error.email });
  if (error.password) return res.status(400).json({ status: "error", error: error.password });

  const checkUser = await User.findOne({
    where: { email: value.email },
  });

  if (!checkUser) return res.status(400).json({ status: "error", error: "You are yet to register" });

  const validPassword = await bcrypt.compare(
    value.password,
    checkUser.dataValues.password
  );

  if (!validPassword) return res.status(400).json({ status: "error", error: "Password is not valid" });

  try {
    const token = await jwt.sign(checkUser.dataValues, process.env.SECRET_KEY);

    return res.json({
      status: "success",
      user: { ...checkUser.dataValues, password: null },
      token,
    })
  } catch (error) {
    return res.status(400).json({status: 'error', error: error.message});
  }
};

export const updateUser = async (req: Request, res: Response) => {

  const { value, error } = validateUserLogin(req.body);

  
  try {
    const user = await User.update(value, {
      where: {
        id: Number(req.params.id)
      }
    })

    return res.json({
      status: "success",
      user,
    })
  } catch (error) {
    return res.status(400).json({status: 'error', error: error.message});
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    console.log(req.params.id)
    const user = await User.findOne({
      where: {
        id: Number(req.params.id)
      }
    })

    res.json({status: 'success', user})
  } catch (error) {
    return res.status(400).json({status: 'error', error: error.message});
  }
}
