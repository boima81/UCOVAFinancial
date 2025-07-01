import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertLoanApplicationSchema, 
  insertDocumentSchema,
  insertAuditLogSchema,
  loginSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      const user = await storage.getUserByEmail(email);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Log login
      await storage.createAuditLog({
        userId: user.id,
        action: "User Login",
        target: user.email,
        status: "Success"
      });

      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.post("/api/auth/signup", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
      }

      const user = await storage.createUser({
        ...userData,
        role: "borrower" // Default role for new signups
      });

      // Log signup
      await storage.createAuditLog({
        userId: user.id,
        action: "User Registration",
        target: user.email,
        status: "Success"
      });

      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  // User routes
  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      const usersWithoutPasswords = users.map(({ password, ...user }) => user);
      res.json(usersWithoutPasswords);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Update user profile
  app.patch("/api/users/:id", async (req, res) => {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    // Check if user is authenticated and can update this profile
    if (!req.user || req.user.id !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    try {
      const updates = req.body;
      const updatedUser = await storage.updateUser(userId, updates);
      
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      // Don't send password in response
      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Failed to update user" });
    }
  });

  // Loan application routes
  app.post("/api/loan-applications", async (req, res) => {
    try {
      const applicationData = insertLoanApplicationSchema.parse(req.body);
      const application = await storage.createLoanApplication(applicationData);

      // Log application submission
      await storage.createAuditLog({
        userId: application.borrowerId!,
        action: "Loan Application Submitted",
        target: application.applicationId,
        status: "Success"
      });

      res.json(application);
    } catch (error) {
      res.status(400).json({ message: "Invalid application data" });
    }
  });

  app.get("/api/loan-applications", async (req, res) => {
    try {
      const borrowerId = req.query.borrowerId ? parseInt(req.query.borrowerId as string) : undefined;
      
      let applications;
      if (borrowerId) {
        applications = await storage.getLoanApplicationsByBorrower(borrowerId);
      } else {
        applications = await storage.getAllLoanApplications();
      }

      res.json(applications);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  });

  app.patch("/api/loan-applications/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      
      const application = await storage.updateLoanApplication(id, {
        ...updates,
        reviewedAt: new Date()
      });

      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }

      // Log application review
      await storage.createAuditLog({
        userId: updates.reviewedBy || 0,
        action: `Application ${updates.status}`,
        target: application.applicationId,
        status: "Success"
      });

      res.json(application);
    } catch (error) {
      res.status(500).json({ message: "Failed to update application" });
    }
  });

  // Document routes
  app.post("/api/documents", async (req, res) => {
    try {
      const documentData = insertDocumentSchema.parse(req.body);
      const document = await storage.createDocument(documentData);

      // Log document upload
      await storage.createAuditLog({
        userId: document.userId!,
        action: "Document Upload",
        target: document.type,
        status: "Success"
      });

      res.json(document);
    } catch (error) {
      res.status(400).json({ message: "Invalid document data" });
    }
  });

  app.get("/api/documents", async (req, res) => {
    try {
      const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
      const applicationId = req.query.applicationId ? parseInt(req.query.applicationId as string) : undefined;

      let documents;
      if (userId) {
        documents = await storage.getDocumentsByUser(userId);
      } else if (applicationId) {
        documents = await storage.getDocumentsByApplication(applicationId);
      } else {
        return res.status(400).json({ message: "userId or applicationId required" });
      }

      res.json(documents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });

  // Credit score routes
  app.get("/api/credit-scores/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const creditScore = await storage.getCreditScore(userId);
      
      if (!creditScore) {
        return res.status(404).json({ message: "Credit score not found" });
      }

      res.json(creditScore);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch credit score" });
    }
  });

  // Audit log routes
  app.get("/api/audit-logs", async (req, res) => {
    try {
      const logs = await storage.getAuditLogs();
      res.json(logs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch audit logs" });
    }
  });

  // Statistics routes for dashboards
  app.get("/api/stats/overview", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      const applications = await storage.getAllLoanApplications();
      
      const totalUsers = users.length;
      const totalApplications = applications.length;
      const pendingApplications = applications.filter(app => app.status === "Under Review").length;
      const approvedApplications = applications.filter(app => app.status === "Approved").length;
      const rejectedApplications = applications.filter(app => app.status === "Rejected").length;
      
      const totalLoanVolume = applications
        .filter(app => app.status === "Approved")
        .reduce((sum, app) => sum + parseFloat(app.amount), 0);

      const defaultRate = applications.length > 0 ? 
        (rejectedApplications / applications.length * 100).toFixed(1) : "0.0";

      res.json({
        totalUsers,
        totalApplications,
        pendingApplications,
        approvedApplications,
        rejectedApplications,
        totalLoanVolume,
        defaultRate,
        monthlyGrowth: 12.5, // Static for demo
        complianceRate: 94.2, // Static for demo
        registeredAgencies: 47 // Static for demo
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
