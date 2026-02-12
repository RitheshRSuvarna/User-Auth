import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
  createPost,
  getAllPosts,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
} from "../controllers/post.controller";

const router = Router();

router.post("/", authenticate, createPost);
router.get("/", getAllPosts);
router.put("/:id", authenticate, updatePost);
router.delete("/:id", authenticate, deletePost);
router.post("/:id/like", authenticate, likePost);
router.delete("/:id/like", authenticate, unlikePost);

export default router;
