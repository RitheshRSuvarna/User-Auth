import { Request, Response } from "express";
import {db} from "../config/db";

/* Create post */
export const createPost = async (req: Request, res: Response) => {
  const { content } = req.body;
  const userId = req.user!.id;

  await db.execute(
    "INSERT INTO posts (user_id, content) VALUES (?, ?)",
    [userId, content]
  );

  res.status(201).json({ message: "Post created" });
};

/* View all posts with like count */
export const getAllPosts = async (_req: Request, res: Response) => {
  const [rows] = await db.execute(`
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

/* Update own post */
export const updatePost = async (req: Request, res: Response) => {
  const postId = req.params.id;
  const userId = req.user!.id;
  const { content } = req.body;

  const [rows]: any = await db.execute(
    "SELECT user_id FROM posts WHERE id = ?",
    [postId]
  );

  if (rows.length === 0) {
    return res.status(404).json({ message: "Post not found" });
  }

  if (rows[0].user_id !== userId) {
    return res.status(403).json({ message: "Not allowed" });
  }

  await db.execute(
    "UPDATE posts SET content = ? WHERE id = ?",
    [content, postId]
  );

  res.json({ message: "Post updated" });
};

/* Delete own post */
export const deletePost = async (req: Request, res: Response) => {
  const postId = req.params.id;
  const userId = req.user!.id;

  const [rows]: any = await db.execute(
    "SELECT user_id FROM posts WHERE id = ?",
    [postId]
  );

  if (rows.length === 0) {
    return res.status(404).json({ message: "Post not found" });
  }

  if (rows[0].user_id !== userId) {
    return res.status(403).json({ message: "Not allowed" });
  }

  await db.execute("DELETE FROM posts WHERE id = ?", [postId]);
  await db.execute("DELETE FROM likes WHERE post_id = ?", [postId]);

  res.json({ message: "Post deleted" });
};

/* Like a post */
export const likePost = async (req: Request, res: Response) => {
  const postId = req.params.id;
  const userId = req.user!.id;

  try {
    await db.execute(
      "INSERT INTO likes (user_id, post_id) VALUES (?, ?)",
      [userId, postId]
    );
    res.json({ message: "Post liked" });
  } catch {
    res.status(400).json({ message: "Already liked" });
  }
};

/* Unlike a post */
export const unlikePost = async (req: Request, res: Response) => {
  const postId = req.params.id;
  const userId = req.user!.id;

  await db.execute(
    "DELETE FROM likes WHERE user_id = ? AND post_id = ?",
    [userId, postId]
  );

  res.json({ message: "Like removed" });
};
