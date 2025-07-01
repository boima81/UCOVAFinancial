import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { LogOut, User } from "lucide-react";

interface NavigationItem {
  label: string;
  path: string;
}

const getNavigationItems = (role: string): NavigationItem[] => {
  const navigation: Record<string, NavigationItem[]> = {
    borrower: [
      { label: 'Dashboard', path: '/dashboard' },
      { label: 'Apply for Loan', path: '/loan-application' },
      { label: 'Profile', path: '/profile' }
    ],
    agent: [
      { label: 'Agent Portal', path: '/agent-portal' }
    ],
    compliance: [
      { label: 'Compliance Dashboard', path: '/compliance' }
    ],
    admin: [
      { label: 'Admin Dashboard', path: '/admin' },
      { label: 'Compliance', path: '/compliance' },
      { label: 'Agent Portal', path: '/agent-portal' }
    ]
  };
  return navigation[role] || [];
};

export function Navigation() {
  const { user, logout } = useAuth();
  const [location] = useLocation();

  if (!user) return null;

  const navigationItems = getNavigationItems(user.role);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="bg-ucova-blue text-white px-3 py-1 rounded-lg font-bold text-lg">
                UCOVA
              </div>
            </div>
            <div className="ml-10 flex items-baseline space-x-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location === item.path
                      ? 'text-ucova-blue bg-blue-50'
                      : 'text-gray-700 hover:text-ucova-blue'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm text-gray-700">
              <User className="h-4 w-4 mr-2" />
              <span>{user.name} ({user.role})</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-ucova-blue hover:text-ucova-dark"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
