import { Router } from "express";
import { mediaController } from "../controllers/mediaController";

const router = Router();

router.get("/:userId", mediaController.getMedia);
router.get("/:mediaId/comments", mediaController.getComments);
router.post(
  "/:mediaId/comments/:commentId/reply",
  mediaController.replyToComment
);

export default router;
