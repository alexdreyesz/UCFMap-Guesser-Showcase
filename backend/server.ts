import { config } from "dotenv";
import express from "express";
import session from "express-session";
import fs from "fs";
import mongoose from "mongoose";
import passport from "passport";
import path from "path";
import { createServer as createViteServer } from "vite";
import { apiRouter } from "./api.js";


config();
console.log("Environment", process.env.NODE_ENV);
console.log("DATABASE URL:", process.env.DATABASE_URL);
const __dirname = path.dirname(new URL(import.meta.url).pathname);
const app = express();

const base = path.resolve(__dirname, "../frontend");
const PORT = 80;

// mongoose
// .connect(process.env.DATABASE_URL || "mongodb://localhost:27017/ucfmap")
mongoose.connect(process.env.DATABASE_URL, {
  auth: {
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
  },
})
  .then(() => {
    console.log("Connected");
  })
  .catch((e) => {
    console.log(e);
  });

// Development mode: Use Vite's middleware for hot module replacement (HMR)
async function startDevServer() {
  const vite = await createViteServer({
    server: {
      middlewareMode: true, // Run Vite in middleware mode
    },
  });
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Add session middleware
  app.use(
    session({
      secret: "your-secret-key", // can change to something more secure
      resave: false,
      saveUninitialized: false,
    })
  );

  // Initialize Passport
  app.use(passport.initialize());
  app.use(passport.session());

  app.use("/api", apiRouter);

  // Serve static files from the "uploads" directory
  app.use("/uploads", express.static("uploads"));

  // Use Vite's dev server as middleware to handle frontend requests
  app.use(vite.middlewares);

  // Handle all other requests and let Vite handle the client-side code (in development)
  app.all("/", async (req, res) => {
    try {
      const url = req.originalUrl;
      const template = path.resolve(base, "index.html");
      let html = fs.readFileSync(template, "utf-8");

      // Apply Vite HTML transforms (only necessary for dev mode)
      html = await vite.transformIndexHtml(url, html);

      res.status(200).set({ "Content-Type": "text/html" }).send(html);
    } catch (e: any) {
      vite.ssrFixStacktrace(e);
      res.status(500).send(e.message);
    }
  });

  app.listen(PORT, () => {
    console.log("Development server running at http://localhost:" + PORT);
  });
}

// Production mode: Serve the Vite build assets from the "dist" folder
function startProdServer() {
  console.log("Launching Production Server");
  const frontendPath = path.resolve(__dirname, "../frontend");
  console.log("frontendPath", frontendPath);
  app.use(express.static(frontendPath));

  // Add session middleware
  app.use(
    session({
      secret: "your-secret-key", // can change to something more secure
      resave: false,
      saveUninitialized: false,
    })
  );

  // Initialize Passport
  app.use(passport.initialize());
  app.use(passport.session());

  app.use("/api", apiRouter);

  // Serve static files from the "uploads" directory
  app.use("/uploads", express.static("uploads"));

  app.listen(PORT, () => {
    console.log("Production server running at http://localhost:" + PORT);
  });
}

// Check the environment and run the appropriate server
if (process.env.NODE_ENV === "production") {
  startProdServer();
} else {
  startDevServer();
}
