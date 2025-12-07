import { Ratelimit } from "@upstash/ratelimit"; // for demo: import { Ratelimit } from "https://deno.land/x/upstash_ratelimit@v0.1.0/mod.ts";
import { Redis } from "@upstash/redis"; // for demo: import { Redis } from "https://deno.land/x/upstash_redis@v1.16.0/mod.ts";

import dotenv from "dotenv";

dotenv.config();

// Create a new ratelimiter, that allows 100 requests per 10 seconds
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(), // connects to UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN environment variables
  limiter: Ratelimit.slidingWindow(100, "10 s"), // 100 requests per 10 seconds
});

export default ratelimit;
