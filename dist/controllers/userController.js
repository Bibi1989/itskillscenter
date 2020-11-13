"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validateUser_1 = require("../validation/validateUser");
const db = require("../../database/models");
const { User, Project, Task } = db;
exports.registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("req.body === ", req.body);
    const { value, error } = validateUser_1.validateUserRegister(req.body);
    if (error.username)
        return res.status(400).json({ status: "error", error: error.username });
    if (error.email)
        return res.status(400).json({ status: "error", error: error.email });
    if (error.password)
        return res.status(400).json({ status: "error", error: error.password });
    const checkUserExist = yield User.findOne({
        where: { email: value.email },
    });
    if (checkUserExist)
        return res.status(400).json({ status: "error", error: "User exist already" });
    const salt = yield bcryptjs_1.default.genSalt(10);
    const hashedPassword = yield bcryptjs_1.default.hash(value.password, salt);
    try {
        const registered = yield User.create(Object.assign(Object.assign({}, value), { password: hashedPassword }));
        const token = yield jsonwebtoken_1.default.sign(registered.dataValues, process.env.SECRET_KEY);
        return res.json({ status: "success", user: registered, token });
    }
    catch (error) {
        return res.status(400).json({ status: 'error', error: error.message });
    }
});
exports.loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { value, error } = validateUser_1.validateUserLogin(req.body);
    if (error.email)
        return res.status(400).json({ status: "error", error: error.email });
    if (error.password)
        return res.status(400).json({ status: "error", error: error.password });
    const checkUser = yield User.findOne({
        where: { email: value.email },
    });
    if (!checkUser)
        return res.status(400).json({ status: "error", error: "You are yet to register" });
    const validPassword = yield bcryptjs_1.default.compare(value.password, checkUser.dataValues.password);
    if (!validPassword)
        return res.status(400).json({ status: "error", error: "Password is not valid" });
    try {
        const token = yield jsonwebtoken_1.default.sign(checkUser.dataValues, process.env.SECRET_KEY);
        return res.json({
            status: "success",
            user: Object.assign(Object.assign({}, checkUser.dataValues), { password: null }),
            token,
        });
    }
    catch (error) {
        return res.status(400).json({ status: 'error', error: error.message });
    }
});
exports.updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { value, error } = validateUser_1.validateUserLogin(req.body);
    try {
        const user = yield User.update(value, {
            where: {
                id: Number(req.params.id)
            }
        });
        return res.json({
            status: "success",
            user,
        });
    }
    catch (error) {
        return res.status(400).json({ status: 'error', error: error.message });
    }
});
exports.getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.params.id);
        const user = yield User.findOne({
            where: {
                id: Number(req.params.id)
            }
        });
        res.json({ status: 'success', user });
    }
    catch (error) {
        return res.status(400).json({ status: 'error', error: error.message });
    }
});
//# sourceMappingURL=userController.js.map