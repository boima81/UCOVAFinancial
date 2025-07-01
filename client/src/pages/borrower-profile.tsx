import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { ArrowLeft, User } from "lucide-react";

interface CreditScore {
  score: number;
  paymentHistory: string;
  debtToIncomeRatio: string;
  creditUtilization: string;
}

interface LoanApplication {
  id: number;
  applicationId: string;
  amount: string;
  purpose: string;
  status: string;
  submittedAt: string;
}

export default function BorrowerProfile() {
  const { user } = useAuth();

  const { data: creditScore } = useQuery<CreditScore>({
    queryKey: [`/api/credit-scores/${user?.id}`],
    enabled: !!user,
  });

  const { data: applications } = useQuery<LoanApplication[]>({
    queryKey: ["/api/loan-applications", { borrowerId: user?.id }],
    enabled: !!user,
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

  const getCreditRating = (score: number) => {
    if (score >= 750) return { rating: "Excellent", color: "text-ucova-success" };
    if (score >= 700) return { rating: "Good", color: "text-ucova-blue" };
    if (score >= 650) return { rating: "Fair", color: "text-ucova-warning" };
    return { rating: "Poor", color: "text-ucova-error" };
  };

  const totalBorrowed = applications?.reduce((sum, app) => 
    app.status === "Approved" ? sum + parseFloat(app.amount) : sum, 0) || 0;

  const totalRepaid = totalBorrowed * 0.6; // Mock calculation
  const outstandingBalance = totalBorrowed - totalRepaid;

  return (
    <div className="pt-16 bg-ucova-gray min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link href="/dashboard" className="text-ucova-blue hover:text-ucova-dark mb-4 inline-flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Borrower Profile</h1>
          <p className="text-gray-600">Detailed borrower information and credit history</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-1">
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-ucova-blue rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                    <User className="h-10 w-10" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
                  <p className="text-gray-600">{user?.email}</p>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="text-gray-900">{user?.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">National ID:</span>
                    <span className="text-gray-900">{user?.nationalId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Member Since:</span>
                    <span className="text-gray-900">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Credit Score */}
            <Card>
              <CardHeader>
                <CardTitle>Credit Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-ucova-success mb-2">
                    {creditScore?.score || 750}
                  </div>
                  <div className={`text-sm mb-4 ${getCreditRating(creditScore?.score || 750).color}`}>
                    {getCreditRating(creditScore?.score || 750).rating}
                  </div>
                  <Progress value={(creditScore?.score || 750) / 850 * 100} className="mb-2" />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>300</span>
                    <span>850</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Loan History */}
            <Card>
              <CardHeader>
                <CardTitle>Loan History</CardTitle>
              </CardHeader>
              <CardContent>
                {applications?.length ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Loan ID</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Amount</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Purpose</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {applications.map((app) => (
                          <tr key={app.id} className="border-b border-gray-100">
                            <td className="py-3 px-4 text-ucova-blue font-medium">{app.applicationId}</td>
                            <td className="py-3 px-4 text-gray-900">${app.amount}</td>
                            <td className="py-3 px-4 text-gray-900 capitalize">{app.purpose}</td>
                            <td className="py-3 px-4">
                              <Badge className={getStatusColor(app.status)}>
                                {app.status}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-gray-600">
                              {new Date(app.submittedAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No loan history available.
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Financial Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Financial Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">
                      ${totalBorrowed.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Total Borrowed</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-ucova-success">
                      ${totalRepaid.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Total Repaid</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-ucova-blue">
                      ${outstandingBalance.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Outstanding Balance</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Risk Assessment */}
            <Card>
              <CardHeader>
                <CardTitle>Risk Assessment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Payment History</span>
                  <div className="flex items-center">
                    <Progress value={parseFloat(creditScore?.paymentHistory || "95")} className="w-32 mr-3" />
                    <span className="text-sm font-medium text-ucova-success">
                      {creditScore?.paymentHistory || "95"}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Debt-to-Income Ratio</span>
                  <div className="flex items-center">
                    <Progress value={parseFloat(creditScore?.debtToIncomeRatio || "35")} className="w-32 mr-3" />
                    <span className="text-sm font-medium text-ucova-warning">
                      {creditScore?.debtToIncomeRatio || "35"}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Credit Utilization</span>
                  <div className="flex items-center">
                    <Progress value={parseFloat(creditScore?.creditUtilization || "25")} className="w-32 mr-3" />
                    <span className="text-sm font-medium text-ucova-success">
                      {creditScore?.creditUtilization || "25"}%
                    </span>
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
