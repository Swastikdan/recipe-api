import express from "express";
import "dotenv/config";
import cors from "cors";
import compression from "compression";
import morgan from "morgan";
import responseTime from "response-time";
import rateLimit from "express-rate-limit";
import { router as apiRouter } from "./router/apirouter.js";

const app = express();
const port = process.env.PORT || 3000;

// Enable rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(morgan("tiny")); // Log HTTP requests
app.use(responseTime()); // Measure response time
app.use(limiter); // Apply rate limiting
app.use("/api/recipes/", apiRouter);

app.get("/", (req, res) => {
  res.send("Welcome to the Recipe API!");
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