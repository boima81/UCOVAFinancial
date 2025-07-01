import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull(),
  nationalId: text("national_id"),
  password: text("password").notNull(),
  role: text("role").notNull().default("borrower"), // borrower, agent, compliance, admin
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const loanApplications = pgTable("loan_applications", {
  id: serial("id").primaryKey(),
  applicationId: text("application_id").notNull().unique(),
  borrowerId: integer("borrower_id").references(() => users.id),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  purpose: text("purpose").notNull(),
  monthlyIncome: decimal("monthly_income", { precision: 12, scale: 2 }).notNull(),
  employmentStatus: text("employment_status").notNull(),
  guarantorName: text("guarantor_name").notNull(),
  guarantorContact: text("guarantor_contact").notNull(),
  status: text("status").notNull().default("Under Review"), // Under Review, Approved, Rejected
  creditScore: integer("credit_score"),
  submittedAt: timestamp("submitted_at").defaultNow(),
  reviewedAt: timestamp("reviewed_at"),
  reviewedBy: integer("reviewed_by").references(() => users.id),
  comments: text("comments"),
});

export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  applicationId: integer("application_id").references(() => loanApplications.id),
  type: text("type").notNull(), // national_id, bank_statement, mobile_money_statement
  filename: text("filename").notNull(),
  status: text("status").notNull().default("pending"), // pending, verified, rejected
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

export const creditScores = pgTable("credit_scores", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  score: integer("score").notNull(),
  paymentHistory: decimal("payment_history", { precision: 5, scale: 2 }),
  debtToIncomeRatio: decimal("debt_to_income_ratio", { precision: 5, scale: 2 }),
  creditUtilization: decimal("credit_utilization", { precision: 5, scale: 2 }),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  action: text("action").notNull(),
  target: text("target").notNull(),
  status: text("status").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertLoanApplicationSchema = createInsertSchema(loanApplications).omit({
  id: true,
  applicationId: true,
  submittedAt: true,
  reviewedAt: true,
  reviewedBy: true,
});

export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  uploadedAt: true,
});

export const insertCreditScoreSchema = createInsertSchema(creditScores).omit({
  id: true,
  updatedAt: true,
});

export const insertAuditLogSchema = createInsertSchema(auditLogs).omit({
  id: true,
  timestamp: true,
});

// Login schema
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoanApplication = typeof loanApplications.$inferSelect;
export type InsertLoanApplication = z.infer<typeof insertLoanApplicationSchema>;
export type Document = typeof documents.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type CreditScore = typeof creditScores.$inferSelect;
export type InsertCreditScore = z.infer<typeof insertCreditScoreSchema>;
export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
export type LoginRequest = z.infer<typeof loginSchema>;
