"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletecomment = exports.postcomment = void 0;
const db_1 = require("../config/db");
const postcomment = async (req, res) => {
    const { content } = req.body;
    const postId = req.params.id;
    const userId = req.user.id;
    await db_1.db.execute("INSERT INTO comments (user_id, post_id, content ) VALUES (?, ?, ?)", [userId, postId, content]);
    res.json({ message: "commented on post" });
};
exports.postcomment = postcomment;
const deletecomment = async (req, res) => {
    const { commentId } = req.params;
    const postId = req.params.id;
    const userId = req.user.id;
    const [rows] = await db_1.db.execute("DELETE from comments where user_id=? and id = ?", [userId, commentId]);
    res.json({ message: "commented deleted" });
};
exports.deletecomment = deletecomment;
