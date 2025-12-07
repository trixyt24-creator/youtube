import ratelimit from "../config/upstash.js";

const rateLimiter = async (req, res, next) => {
  try {
    const { success } = await ratelimit.limit("my-rate-limit"); //unique key to identify the requested user
    if (!success) return res.status(429).json({ message: "Too many requests, try again later!" });
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
    next(err);
  }
};

export default rateLimiter;
