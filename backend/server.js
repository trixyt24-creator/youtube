import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";

import connectDB from "./config/dB.js";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import contentRouter from "./routes/content.route.js";
import rateLimiter from "./middlewares/rateLimiter.js"

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
const PORT = process.env.PORT || 8000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(
  helmet({
    contentSecurityPolicy: false, // disable CSP for simplicity; configure as needed
  })
);

app.use(morgan("dev")); // log all the requests to the console

app.use(rateLimiter); // use before defining routes to apply rate limiting

// routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/content", contentRouter);

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
