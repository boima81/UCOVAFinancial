import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

import serverless from 'serverless-http';

// Register routes and middleware as before
registerRoutes(app); // Assuming registerRoutes configures the app passed to it and doesn't need to return the server for this setup.

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  log(`Error: ${status} - ${message}`); // Log the error
  res.status(status).json({ message });
  // For serverless, we don't typically re-throw the error in the same way,
  // as the response itself signals completion or failure of the function.
});

// Vite setup and static serving are typically not handled within the serverless function itself
// when deployed to Netlify. Netlify handles serving static assets from the 'publish' directory.
// The Vite dev server part (`setupVite`) is for local development.
// The `serveStatic` might be for a local production build outside Netlify.
// For Netlify deployment, these parts related to app.listen() and vite/static serving directly by this server are not needed.

// Export the handler for Netlify
export const handler = serverless(app);

// The original IIFE and app.listen() are removed as Netlify handles the server lifecycle.
// (async () => {
//   const server = await registerRoutes(app); // registerRoutes now just configures 'app'

//   app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
//     const status = err.status || err.statusCode || 500;
//     const message = err.message || "Internal Server Error";

//     res.status(status).json({ message });
//     throw err;
//   });

//   if (app.get("env") === "development") {
//     // This part is for local dev, Netlify build won't run this way
//     // await setupVite(app, server); // 'server' from createServer is not used in serverless context
//   } else {
//     // serveStatic(app); // Netlify serves static files from 'publish' directory
//   }

//   // ALWAYS serve the app on port 5000
//   // this serves both the API and the client.
//   // It is the only port that is not firewalled.
//   // const port = 5000;
//   // server.listen({ // app.listen() or server.listen() is not used in serverless
//   //   port,
//   //   host: "0.0.0.0",
//   //   reusePort: true,
//   // }, () => {
//   //   log(`serving on port ${port}`);
//   // });
// })();
