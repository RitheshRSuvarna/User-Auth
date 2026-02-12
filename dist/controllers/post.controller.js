"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unlikePost = exports.likePost = exports.deletePost = exports.updatePost = exports.getAllPosts = exports.createPost = void 0;
const db_1 = require("../config/db");
/* Create post */
const createPost = async (req, res) => {
    const { content } = req.body;
    const userId = req.user.id;
    await db_1.db.execute("INSERT INTO posts (user_id, content) VALUES (?, ?)", [userId, content]);
    res.status(201).json({ message: "Post created" });
};
exports.createPost = createPost;
/* View all posts with like count */
const getAllPosts = async (_req, res) => {
    const [rows] = await db_1.db.execute(`
    SELECT 
      posts.id,
      posts.content,
      posts.user_id,
      COUNT(likes.id) AS likeCount
    FROM posts
    LEFT JOIN likes ON posts.id = likes.post_id
    GROUP BY posts.id
    ORDER BY posts.created_at DESC
  `);
    res.json(rows);
};
exports.getAllPosts = getAllPosts;
/* Update own post */
const updatePost = async (req, res) => {
    const postId = req.params.id;
    const userId = req.user.id;
    const { content } = req.body;
    const [rows] = await db_1.db.execute("SELECT user_id FROM posts WHERE id = ?", [postId]);
    if (rows.length === 0) {
        return res.status(404).json({ message: "Post not found" });
    }
    if (rows[0].user_id !== userId) {
        return res.status(403).json({ message: "Not allowed" });
    }
    await db_1.db.execute("UPDATE posts SET content = ? WHERE id = ?", [content, postId]);
    res.json({ message: "Post updated" });
};
exports.updatePost = updatePost;
/* Delete own post */
const deletePost = async (req, res) => {
    const postId = req.params.id;
    const userId = req.user.id;
    const [rows] = await db_1.db.execute("SELECT user_id FROM posts WHERE id = ?", [postId]);
    if (rows.length === 0) {
        return res.status(404).json({ message: "Post not found" });
    }
    if (rows[0].user_id !== userId) {
        return res.status(403).json({ message: "Not allowed" });
    }
    await db_1.db.execute("DELETE FROM posts WHERE id = ?", [postId]);
    await db_1.db.execute("DELETE FROM likes WHERE post_id = ?", [postId]);
    res.json({ message: "Post deleted" });
};
exports.deletePost = deletePost;
/* Like a post */
const likePost = async (req, res) => {
    const postId = req.params.id;
    const userId = req.user.id;
    try {
        await db_1.db.execute("INSERT INTO likes (user_id, post_id) VALUES (?, ?)", [userId, postId]);
        res.json({ message: "Post liked" });
    }
    catch {
        res.status(400).json({ message: "Already liked" });
    }
};
exports.likePost = likePost;
/* Unlike a post */
const unlikePost = async (req, res) => {
    const postId = req.params.id;
    const userId = req.user.id;
    await db_1.db.execute("DELETE FROM likes WHERE user_id = ? AND post_id = ?", [userId, postId]);
    res.json({ message: "Like removed" });
};
exports.unlikePost = unlikePost;
