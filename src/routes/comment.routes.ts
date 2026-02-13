import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import {postcomment, deletecomment} from "../controllers/comment.controller";

const router=Router();

router.post("/:id/comment",authenticate,postcomment);
router.delete("/:id/comment",authenticate,deletecomment);
router.post("/comment",postcomment);

export default router;  