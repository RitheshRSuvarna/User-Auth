"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const comment_controller_1 = require("../controllers/comment.controller");
const router = (0, express_1.Router)();
router.post("/:id/comment", auth_middleware_1.authenticate, comment_controller_1.postcomment);
router.delete("/:id/comment", auth_middleware_1.authenticate, comment_controller_1.deletecomment);
exports.default = router;
