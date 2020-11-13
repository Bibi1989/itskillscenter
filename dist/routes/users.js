"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const router = express_1.Router();
// get user
router.route('/user/:id').get(userController_1.getUserById);
// route to create a user
router.route("/register").post(userController_1.registerUser);
router.route("/login").post(userController_1.loginUser);
router.route("/user/update/:id").patch(userController_1.updateUser);
exports.default = router;
//# sourceMappingURL=users.js.map