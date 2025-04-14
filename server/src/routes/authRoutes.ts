import { Router } from "express";
import { authController } from "../controllers/authController";

const router = Router();

router.get("/login", authController.loginWithInstagram);
router.get("/callback", authController.handleCallback);
router.get("/profile/:userId", authController.getProfile);

export default router;
