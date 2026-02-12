"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.post("/register", auth_controller_1.register);
router.post("/login", auth_controller_1.login);
router.get("/user", auth_controller_1.getProfile);
router.get("/profile", auth_middleware_1.authenticate, (req, res) => {
    res.json({ message: "Welcome! You are authorized." });
});
exports.default = router;
