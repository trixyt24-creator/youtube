import express from "express";

import {
  register,
  logIn,
  logOut,
  googleSignIn,
  sendOTP,
  verifyOTP,
  resetPassword,
  emailVerificationSendOTP,
  emailVerificationVerifyOTP,
} from "../controllers/auth.controller.js";
import upload from "../middlewares/multer.js";

const authRouter = express.Router();

authRouter.post("/register", upload.single("photoUrl"), register);
authRouter.post("/login", logIn);
authRouter.post("/logout", logOut);
authRouter.post("/google", googleSignIn);
authRouter.post("/send-otp", sendOTP);
authRouter.post("/verify-otp", verifyOTP);
authRouter.post("/reset-password", resetPassword);
authRouter.post("/send-otp-email", emailVerificationSendOTP);
authRouter.post("/verify-otp-email", emailVerificationVerifyOTP);

export default authRouter;
