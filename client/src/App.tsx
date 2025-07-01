import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navigation } from "@/components/navigation";
import { useAuth } from "@/hooks/use-auth";

// Import all pages
import Welcome from "@/pages/welcome";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import BorrowerDashboard from "@/pages/borrower-dashboard";
import LoanApplication from "@/pages/loan-application";
import LoanConfirmation from "@/pages/loan-confirmation";
import AgentPortal from "@/pages/agent-portal";
import ComplianceDashboard from "@/pages/compliance-dashboard";
import AdminDashboard from "@/pages/admin-dashboard";
import BorrowerProfile from "@/pages/borrower-profile";
import ProfileCompletion from "@/pages/profile-completion";
import NotFound from "@/pages/not-found";

function ProtectedRoute({ component: Component, allowedRoles }: { 
  component: React.ComponentType; 
  allowedRoles?: string[];
}) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Welcome />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <NotFound />;
  }

  return <Component />;
}

function Router() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {isAuthenticated && <Navigation />}
      <Switch>
        {/* Public routes */}
        <Route path="/" component={Welcome} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        
        {/* Protected routes for borrowers */}
        <Route path="/dashboard">
          <ProtectedRoute component={BorrowerDashboard} allowedRoles={["borrower"]} />
        </Route>
        <Route path="/loan-application">
          <ProtectedRoute component={LoanApplication} allowedRoles={["borrower"]} />
        </Route>
        <Route path="/loan-confirmation">
          <ProtectedRoute component={LoanConfirmation} allowedRoles={["borrower"]} />
        </Route>
        <Route path="/profile">
          <ProtectedRoute component={BorrowerProfile} allowedRoles={["borrower"]} />
        </Route>
        <Route path="/profile-completion">
          <ProtectedRoute component={ProfileCompletion} allowedRoles={["borrower"]} />
        </Route>

        {/* Protected routes for agents */}
        <Route path="/agent-portal">
          <ProtectedRoute component={AgentPortal} allowedRoles={["agent", "admin"]} />
        </Route>

        {/* Protected routes for compliance */}
        <Route path="/compliance">
          <ProtectedRoute component={ComplianceDashboard} allowedRoles={["compliance", "admin"]} />
        </Route>

        {/* Protected routes for admin */}
        <Route path="/admin">
          <ProtectedRoute component={AdminDashboard} allowedRoles={["admin"]} />
        </Route>

        {/* Fallback to 404 */}
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
