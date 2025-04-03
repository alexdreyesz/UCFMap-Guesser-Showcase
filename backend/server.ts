import express from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer } from "vite";
import { apiRouter } from "./api";

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const app = express();

const base = path.resolve(__dirname, "../frontend");

// Development mode: Use Vite's middleware for hot module replacement (HMR)
async function startDevServer() {
  const vite = await createViteServer({
    server: {
      middlewareMode: true, // Run Vite in middleware mode
    },
  });

  app.use("/api", apiRouter);

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

  app.listen(3000, () => {
    console.log("Development server running at http://localhost:3000");
  });
}

// Production mode: Serve the Vite build assets from the "dist" folder
function startProdServer() {
  app.use(express.static(path.join(__dirname, "../dist")));

  // Example API route
  app.use("/api", apiRouter);

  app.get("*", (_req, res) => {
    res.sendFile(path.resolve(__dirname, "../dist", "index.html"));
  });

  app.listen(3000, () => {
    console.log("Production server running at http://localhost:3000");
  });
}

// Check the environment and run the appropriate server
if (process.env.NODE_ENV === "production") {
  startProdServer();
} else {
  startDevServer();
}
