// import { Request, Response } from "express";
// import {db} from "../config/db";

// export const postcomment = async (req: Request, res: Response) => {
//   const { content } = req.body;
//   const postId = req.params.id;
//   const userId = req.user!.id;

//     await db.execute(
//       "INSERT INTO comments (user_id, post_id, content ) VALUES (?, ?, ?)",
//       [userId, postId, content]
//     );
//     res.json({ message: "commented on post" });
  
// };

// export const deletecomment = async (req: Request, res: Response) => {
//   const {Id}=req.params;
//   const postId = req.params.id;
//   const userId = req.user!.id;

//     const [rows]: any = await db.execute(
//     "DELETE from comments where user_id=? and id = ?",
//     [userId,Id]
//   );
//     res.json({ message: "commented deleted" });
  
// };

// export const getcomment= async(req: Request, res:Response) => {
//   const postId = req.params.id;
//   const userId = req.user!.id;
//    const [rows] = await db.execute(`
//     SELECT
//     comment.id,
//     comment.content,
//     comment.user_id
//     FROM comments where post_id=?
//    `,[postId]);

//      res.json(rows);
// };

import { Request, Response } from "express";
import { db } from "../config/db";

/**
 * POST /posts/:id/comments
 */
export const postcomment = async (req: Request, res: Response) => {
  const { content } = req.body;
  const postId = req.params.id;
  const userId = req.user!.id;

  if (!content || !postId) {
    return res.status(400).json({ message: "Content or postId missing" });
  }

  await db.execute(
    "INSERT INTO comments (user_id, post_id, content) VALUES (?, ?, ?)",
    [userId, postId, content]
  );

  res.status(201).json({ message: "Comment added" });
};

/**
 * DELETE /comments/:id
 */
export const deletecomment = async (req: Request, res: Response) => {
  const commentId = req.params.id;
  const userId = req.user!.id;

  const [result]: any = await db.execute(
    "DELETE FROM comments WHERE id = ? AND user_id = ?",
    [commentId, userId]
  );

  if (result.affectedRows === 0) {
    return res.status(403).json({ message: "Not allowed or comment not found" });
  }

  res.json({ message: "Comment deleted" });
};

/**
 * GET /posts/:id/comments
 */
export const getcomment = async (req: Request, res: Response) => {
  const postId = req.params.id;

  const [rows] = await db.execute(
    `
    SELECT
      id,
      content,
      user_id
    FROM comments
    WHERE post_id = ?
    `,
    [postId]
  );

  res.json(rows);
};