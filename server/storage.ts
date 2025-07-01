import { 
  users, 
  loanApplications, 
  documents, 
  creditScores, 
  auditLogs,
  type User, 
  type InsertUser,
  type LoanApplication,
  type InsertLoanApplication,
  type Document,
  type InsertDocument,
  type CreditScore,
  type InsertCreditScore,
  type AuditLog,
  type InsertAuditLog
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;

  // Loan Applications
  createLoanApplication(application: InsertLoanApplication): Promise<LoanApplication>;
  getLoanApplication(id: number): Promise<LoanApplication | undefined>;
  getLoanApplicationsByBorrower(borrowerId: number): Promise<LoanApplication[]>;
  getAllLoanApplications(): Promise<LoanApplication[]>;
  updateLoanApplication(id: number, updates: Partial<LoanApplication>): Promise<LoanApplication | undefined>;

  // Documents
  createDocument(document: InsertDocument): Promise<Document>;
  getDocumentsByUser(userId: number): Promise<Document[]>;
  getDocumentsByApplication(applicationId: number): Promise<Document[]>;

  // Credit Scores
  getCreditScore(userId: number): Promise<CreditScore | undefined>;
  upsertCreditScore(creditScore: InsertCreditScore): Promise<CreditScore>;

  // Audit Logs
  createAuditLog(log: InsertAuditLog): Promise<AuditLog>;
  getAuditLogs(): Promise<AuditLog[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private loanApplications: Map<number, LoanApplication> = new Map();
  private documents: Map<number, Document> = new Map();
  private creditScores: Map<number, CreditScore> = new Map(); // userId -> creditScore
  private auditLogs: Map<number, AuditLog> = new Map();
  
  private currentUserId = 1;
  private currentApplicationId = 1;
  private currentDocumentId = 1;
  private currentCreditScoreId = 1;
  private currentAuditLogId = 1;

  constructor() {
    this.seedInitialData();
  }

  private seedInitialData() {
    // Seed test users
    const testUsers = [
      { name: 'John Doe', email: 'borrower@test.com', phone: '+231-123-4567', nationalId: 'LIB123456789', password: 'password', role: 'borrower' },
      { name: 'Agent Smith', email: 'agent@test.com', phone: '+231-123-4568', nationalId: 'LIB123456790', password: 'password', role: 'agent' },
      { name: 'Compliance Officer', email: 'compliance@test.com', phone: '+231-123-4569', nationalId: 'LIB123456791', password: 'password', role: 'compliance' },
      { name: 'System Admin', email: 'admin@test.com', phone: '+231-123-4570', nationalId: 'LIB123456792', password: 'password', role: 'admin' },
    ];

    testUsers.forEach(userData => {
      const user: User = {
        id: this.currentUserId++,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        nationalId: userData.nationalId,
        password: userData.password,
        role: userData.role,
        isActive: true,
        profileStatus: userData.role === 'borrower' ? 'incomplete' : 'approved',
        employmentStatus: null,
        monthlyIncome: null,
        address: null,
        createdAt: new Date(),
      };
      this.users.set(user.id, user);
    });

    // Seed credit scores
    const borrower = Array.from(this.users.values()).find(u => u.role === 'borrower');
    if (borrower) {
      const creditScore: CreditScore = {
        id: this.currentCreditScoreId++,
        userId: borrower.id,
        score: 750,
        paymentHistory: "95.00",
        debtToIncomeRatio: "35.00",
        creditUtilization: "25.00",
        updatedAt: new Date(),
      };
      this.creditScores.set(borrower.id, creditScore);
    }

    // Add mock pending loan applications
    const mockApplications = [
      {
        borrowerId: 1,
        amount: '25000',
        purpose: 'Business expansion for local farming equipment',
        employmentStatus: 'self-employed',
        monthlyIncome: '3500',
        guarantorName: 'Marie Johnson',
        guarantorContact: '+231-777-987-654',
        creditScore: 720,
        status: 'Under Review'
      },
      {
        borrowerId: 5, // Boima's application
        amount: '15000', 
        purpose: 'Education funding for university tuition',
        employmentStatus: 'employed',
        monthlyIncome: '2200',
        guarantorName: 'Joseph Smith',
        guarantorContact: '+231-777-456-789',
        creditScore: 685,
        status: 'Under Review'
      },
      {
        borrowerId: 1,
        amount: '8500',
        purpose: 'Vehicle purchase for transportation business',
        employmentStatus: 'business-owner',
        monthlyIncome: '2800',
        guarantorName: 'Rebecca Wilson',
        guarantorContact: '+231-777-321-987',
        creditScore: 710,
        status: 'Under Review'
      }
    ];

    mockApplications.forEach(appData => {
      const application: LoanApplication = {
        id: this.currentApplicationId++,
        applicationId: `LA-${Date.now()}-${this.currentApplicationId}`,
        borrowerId: appData.borrowerId,
        amount: appData.amount,
        purpose: appData.purpose,
        status: appData.status,
        employmentStatus: appData.employmentStatus,
        monthlyIncome: appData.monthlyIncome,
        guarantorName: appData.guarantorName,
        guarantorContact: appData.guarantorContact,
        creditScore: appData.creditScore,
        submittedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random date within last week
        reviewedAt: null,
        reviewedBy: null,
        comments: null,
      };
      this.loanApplications.set(application.id, application);
    });
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      id: this.currentUserId++,
      name: insertUser.name,
      email: insertUser.email,
      phone: insertUser.phone,
      nationalId: insertUser.nationalId || null,
      password: insertUser.password,
      role: insertUser.role || 'borrower',
      isActive: true,
      profileStatus: 'incomplete',
      employmentStatus: null,
      monthlyIncome: null,
      address: null,
      createdAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (user) {
      const updatedUser = { ...user, ...updates };
      this.users.set(id, updatedUser);
      return updatedUser;
    }
    return undefined;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Loan Applications
  async createLoanApplication(insertApplication: InsertLoanApplication): Promise<LoanApplication> {
    const applicationId = `#LA2024${String(this.currentApplicationId).padStart(3, '0')}`;
    const application: LoanApplication = {
      id: this.currentApplicationId++,
      applicationId,
      ...insertApplication,
      status: "Under Review",
      creditScore: Math.floor(Math.random() * 300) + 550, // Random score between 550-850
      submittedAt: new Date(),
      reviewedAt: null,
      reviewedBy: null,
      comments: null,
    };
    this.loanApplications.set(application.id, application);
    return application;
  }

  async getLoanApplication(id: number): Promise<LoanApplication | undefined> {
    return this.loanApplications.get(id);
  }

  async getLoanApplicationsByBorrower(borrowerId: number): Promise<LoanApplication[]> {
    return Array.from(this.loanApplications.values()).filter(app => app.borrowerId === borrowerId);
  }

  async getAllLoanApplications(): Promise<LoanApplication[]> {
    return Array.from(this.loanApplications.values());
  }

  async updateLoanApplication(id: number, updates: Partial<LoanApplication>): Promise<LoanApplication | undefined> {
    const application = this.loanApplications.get(id);
    if (application) {
      const updatedApplication = { ...application, ...updates };
      this.loanApplications.set(id, updatedApplication);
      return updatedApplication;
    }
    return undefined;
  }

  // Documents
  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    const document: Document = {
      id: this.currentDocumentId++,
      ...insertDocument,
      status: "pending",
      uploadedAt: new Date(),
    };
    this.documents.set(document.id, document);
    return document;
  }

  async getDocumentsByUser(userId: number): Promise<Document[]> {
    return Array.from(this.documents.values()).filter(doc => doc.userId === userId);
  }

  async getDocumentsByApplication(applicationId: number): Promise<Document[]> {
    return Array.from(this.documents.values()).filter(doc => doc.applicationId === applicationId);
  }

  // Credit Scores
  async getCreditScore(userId: number): Promise<CreditScore | undefined> {
    return this.creditScores.get(userId);
  }

  async upsertCreditScore(insertCreditScore: InsertCreditScore): Promise<CreditScore> {
    const existingScore = this.creditScores.get(insertCreditScore.userId!);
    if (existingScore) {
      const updatedScore = { ...existingScore, ...insertCreditScore, updatedAt: new Date() };
      this.creditScores.set(insertCreditScore.userId!, updatedScore);
      return updatedScore;
    } else {
      const newScore: CreditScore = {
        id: this.currentCreditScoreId++,
        ...insertCreditScore,
        updatedAt: new Date(),
      };
      this.creditScores.set(insertCreditScore.userId!, newScore);
      return newScore;
    }
  }

  // Audit Logs
  async createAuditLog(insertLog: InsertAuditLog): Promise<AuditLog> {
    const log: AuditLog = {
      id: this.currentAuditLogId++,
      ...insertLog,
      timestamp: new Date(),
    };
    this.auditLogs.set(log.id, log);
    return log;
  }

  async getAuditLogs(): Promise<AuditLog[]> {
    return Array.from(this.auditLogs.values()).sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }
}

export const storage = new MemStorage();
