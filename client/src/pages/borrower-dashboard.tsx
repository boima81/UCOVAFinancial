import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { DocumentUpload } from "@/components/document-upload";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { Plus, CheckCircle, Clock, CreditCard, FileText } from "lucide-react";

interface LoanApplication {
  id: number;
  applicationId: string;
  amount: string;
  purpose: string;
  status: string;
  submittedAt: string;
}

export default function BorrowerDashboard() {
  const { user } = useAuth();

  const { data: applications, isLoading } = useQuery<LoanApplication[]>({
    queryKey: ["/api/loan-applications", { borrowerId: user?.id }],
    enabled: !!user && user.profileStatus === 'approved',
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-ucova-success text-white";
      case "Rejected":
        return "bg-ucova-error text-white";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getProfileCompletion = (profileStatus: string) => {
    switch (profileStatus) {
      case 'approved': return 100;
      case 'pending': return 90;
      case 'incomplete': return 30;
      default: return 0;
    }
  };

  const profileCompletion = getProfileCompletion(user?.profileStatus || 'incomplete');

  return (
    <div className="pt-16 bg-ucova-gray min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Borrower Dashboard</h1>
          <p className="text-gray-600">Manage your loan applications and profile</p>
        </div>

        {/* Profile Completion */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Profile Status</h2>
              <span className="text-ucova-blue font-medium">{profileCompletion}% Complete</span>
            </div>
            <Progress value={profileCompletion} className="mb-4" />
            
            {user?.profileStatus === 'incomplete' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <div className="flex items-center mb-2">
                  <Clock className="h-5 w-5 text-ucova-warning mr-2" />
                  <span className="font-medium text-gray-900">Profile Incomplete</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Complete your profile to unlock loan offers and apply for loans.
                </p>
                <Link href="/profile-completion">
                  <Button className="bg-ucova-blue hover:bg-ucova-blue/90">
                    Complete Profile
                  </Button>
                </Link>
              </div>
            )}
            
            {user?.profileStatus === 'pending' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-center mb-2">
                  <Clock className="h-5 w-5 text-ucova-blue mr-2" />
                  <span className="font-medium text-gray-900">Profile Under Review</span>
                </div>
                <p className="text-sm text-gray-600">
                  Your profile is being reviewed. You'll be notified once approved.
                </p>
              </div>
            )}
            
            {user?.profileStatus === 'approved' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <div className="flex items-center mb-2">
                  <CheckCircle className="h-5 w-5 text-ucova-success mr-2" />
                  <span className="font-medium text-gray-900">Profile Approved</span>
                </div>
                <p className="text-sm text-gray-600">
                  Your profile is approved. You can now apply for loans and view offers.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Document Upload */}
            <Card>
              <CardHeader>
                <CardTitle>Document Upload</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DocumentUpload
                    type="national_id"
                    label="National ID"
                    icon={<CreditCard className="h-8 w-8 text-gray-400" />}
                  />
                  <DocumentUpload
                    type="bank_statement"
                    label="Bank/Mobile Money Statement"
                    icon={<FileText className="h-8 w-8 text-gray-400" />}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Active Applications */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Active Applications</CardTitle>
                {user?.profileStatus === 'approved' ? (
                  <Link href="/loan-application">
                    <Button className="bg-ucova-blue hover:bg-ucova-blue/90">
                      <Plus className="h-4 w-4 mr-2" />
                      Apply for Loan
                    </Button>
                  </Link>
                ) : (
                  <Button disabled className="bg-gray-300 text-gray-500">
                    <Plus className="h-4 w-4 mr-2" />
                    Apply for Loan
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">Loading applications...</div>
                ) : applications?.length ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Application ID</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Amount</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {applications.map((app) => (
                          <tr key={app.id} className="border-b border-gray-100">
                            <td className="py-3 px-4 text-gray-900">{app.applicationId}</td>
                            <td className="py-3 px-4 text-gray-900">${app.amount}</td>
                            <td className="py-3 px-4">
                              <Badge className={getStatusColor(app.status)}>
                                {app.status}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-gray-600">
                              {new Date(app.submittedAt).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4">
                              <Button variant="ghost" size="sm" className="text-ucova-blue">
                                View Details
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No applications yet. Start by applying for your first loan!
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Available Offers - Only show if profile is approved */}
            {user?.profileStatus === 'approved' && (
              <Card>
                <CardHeader>
                  <CardTitle>Available Offers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Card className="border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">Quick Cash</h4>
                        <span className="text-sm text-ucova-success">4.5% Interest Rate</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">Up to $10,000 • 6-24 months</p>
                      <Button className="w-full bg-ucova-blue hover:bg-ucova-blue/90 text-sm">
                        Apply Now
                      </Button>
                    </CardContent>
                  </Card>
                  <Card className="border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">Business Loan</h4>
                        <span className="text-sm text-ucova-success">3.8% Interest Rate</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">Up to $50,000 • 12-60 months</p>
                      <Button className="w-full bg-ucova-blue hover:bg-ucova-blue/90 text-sm">
                        Apply Now
                      </Button>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            )}

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-ucova-blue rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-gray-900">Application under review</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-ucova-success rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-gray-900">Document uploaded successfully</p>
                    <p className="text-xs text-gray-500">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-ucova-warning rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-gray-900">Profile completion reminder</p>
                    <p className="text-xs text-gray-500">2 days ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
