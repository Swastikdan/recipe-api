import express from "express";
import "dotenv/config";
import cors from "cors";
import compression from "compression";
import morgan from "morgan";
import responseTime from "response-time";
import rateLimit from "express-rate-limit";
import { router as apiRouter } from "./router/apirouter.js";
// import cache from "memory-cache";

const app = express();
const port = process.env.PORT || 3000;

app.set("trust proxy", 1); // Add this line

// Enable rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000000, // limit each IP to 100 requests per windowMs
});

// Cache middleware
// const cacheMiddleware = (duration) => {
//   return (req, res, next) => {
//     let key = "__express__" + req.originalUrl || req.url;
//     let cachedBody = cache.get(key);
//     if (cachedBody) {
//       res.send(cachedBody);
//       return;
//     } else {
//       res.sendResponse = res.send;
//       res.send = (body) => {
//         cache.put(key, body, duration * 1000); // cache for duration minutes
//         res.sendResponse(body);
//       };
//       next();
//     }
//   };
// };

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(morgan("tiny")); // Log HTTP requests
app.use(responseTime()); // Measure response time
app.use(limiter); // Apply rate limiting
const successResponseMiddleware = (req, res, next) => {
  const oldSend = res.send;
  res.send = function (data) {
    let success = true;
    let parsedData;
    try {
      parsedData = JSON.parse(data);
    } catch (e) {
      success = false;
    }
    oldSend.call(res, JSON.stringify({ success, recipes: parsedData }));
  };
  next();
};

app.use("/api/recipes/", successResponseMiddleware, apiRouter);
app.get("/", (req, res) => {
  res.redirect("https://therecipedb.vercel.app/");
});
app.use("/favicon.ico", express.static("public/icon.svg"));

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    message:
      "Route not found | Visit https://github.com/Swastikdan/recipe-api for documentation.",
  });
});
app.listen(port, (error) => {
  if (!error) {
    console.log(
      `Server is Successfully Running, and App is listening on port ${port}`
    );
  } else {
    console.error("Error occurred, server can't start", error);
  }
});
