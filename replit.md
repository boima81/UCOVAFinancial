# UCOVA Financial Verification System

## Overview

This is a full-stack web application for loan processing and financial verification built for Liberia's financial sector. The system provides a comprehensive platform for loan applications, document verification, credit scoring, and compliance management with role-based access control.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: Zustand for authentication state, TanStack Query for server state
- **UI Framework**: Radix UI components with shadcn/ui styling system
- **Styling**: Tailwind CSS with custom UCOVA brand colors
- **Build Tool**: Vite with custom configuration for development and production

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Session Management**: Express sessions with PostgreSQL store
- **Development**: Hot reload with Vite middleware integration

### Database Strategy
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon serverless)
- **Migrations**: Drizzle Kit for schema management
- **Storage Interface**: Abstracted storage layer with in-memory fallback for development

## Key Components

### Authentication System
- Role-based access control (borrower, agent, compliance, admin)
- Secure password authentication
- Session-based authentication with persistent storage
- Protected routes with role-specific access

### User Roles and Permissions
- **Borrower**: Apply for loans, upload documents, view application status
- **Agent**: Review loan applications, approve/reject applications
- **Compliance**: Monitor regulatory compliance, audit logs
- **Admin**: Full system access, user management, system statistics

### Loan Application Workflow
- Multi-step application form with validation
- Document upload system (national ID, bank statements, mobile money statements)
- Credit score calculation and display
- Application status tracking (Under Review, Approved, Rejected)
- Guarantor information collection

### Document Management
- File upload system with type validation
- Document status tracking (pending, verified, rejected)
- Support for PDF and image formats
- Association with users and loan applications

### Credit Scoring System
- Credit score calculation based on payment history and debt-to-income ratio
- Credit utilization tracking
- Risk assessment integration
- Historical credit data storage

### Audit and Compliance
- Comprehensive audit logging for all user actions
- Compliance dashboard for regulatory oversight
- System statistics and reporting
- User activity monitoring

## Data Flow

### User Authentication Flow
1. User submits login credentials
2. Server validates against database
3. Session established and user data returned
4. Client stores authentication state
5. Protected routes accessible based on user role

### Loan Application Flow
1. Borrower completes application form
2. Required documents uploaded and validated
3. Credit score automatically calculated
4. Application submitted for agent review
5. Agent approves/rejects with comments
6. Borrower notified of decision
7. All actions logged for compliance

### Document Verification Flow
1. User uploads documents with type classification
2. Files stored and metadata recorded in database
3. Document status tracked through verification process
4. Compliance team can review and approve documents

## External Dependencies

### UI and Styling
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Pre-built component library
- **Lucide React**: Icon library

### State Management and Data Fetching
- **TanStack Query**: Server state management and caching
- **Zustand**: Client-side state management
- **React Hook Form**: Form handling and validation

### Development and Build
- **Vite**: Fast build tool and development server
- **TypeScript**: Type safety and developer experience
- **Drizzle Kit**: Database schema management

### Database and Backend
- **Neon Database**: Serverless PostgreSQL
- **Drizzle ORM**: Type-safe database operations
- **Express.js**: Web application framework

## Deployment Strategy

### Development Environment
- Vite development server with hot reload
- In-memory storage fallback for rapid development
- Replit integration with runtime error overlay
- Environment-specific configuration

### Production Build
- Vite builds optimized client bundle
- esbuild compiles server code for production
- Static assets served from Express
- Database migrations applied via Drizzle Kit

### Database Management
- Schema defined in shared TypeScript files
- Migrations generated and applied through Drizzle Kit
- Environment-based database URL configuration
- Backup and recovery through cloud provider

### Security Considerations
- Environment variables for sensitive configuration
- Session-based authentication with secure storage
- Input validation on both client and server
- Role-based access control throughout application

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

Changelog:
- July 01, 2025. Initial setup