import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { FileText, CheckCircle, XCircle, Clock } from "lucide-react";
import { useLocation } from "wouter";

interface LoanApplication {
  id: number;
  applicationId: string;
  borrowerId: number;
  amount: string;
  purpose: string;
  status: string;
  creditScore: number;
  submittedAt: string;
}

interface Stats {
  pendingApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
}

export default function AgentPortal() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  const { data: applications, isLoading } = useQuery<LoanApplication[]>({
    queryKey: ["/api/loan-applications"],
  });

  const { data: stats } = useQuery<Stats>({
    queryKey: ["/api/stats/overview"],
  });

  const updateApplication = useMutation({
    mutationFn: async ({ id, status, comments }: { id: number; status: string; comments?: string }) => {
      const res = await apiRequest("PATCH", `/api/loan-applications/${id}`, {
        status,
        reviewedBy: user?.id,
        comments,
      });
      return res.json();
    },
    onSuccess: (application, variables) => {
      toast({
        title: `Application ${variables.status.toLowerCase()}`,
        description: `Application ${application.applicationId} has been ${variables.status.toLowerCase()}.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/loan-applications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats/overview"] });
    },
    onError: (error: any) => {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update application",
        variant: "destructive",
      });
    },
  });

  const handleApprove = (id: number) => {
    updateApplication.mutate({ id, status: "Approved" });
  };

  const handleReject = (id: number) => {
    updateApplication.mutate({ id, status: "Rejected" });
  };

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

  const getCreditScoreColor = (score: number) => {
    if (score >= 750) return "bg-green-100 text-green-800";
    if (score >= 650) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <div className="pt-16 bg-ucova-gray min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Loan Agent Portal</h1>
          <p className="text-gray-600">Review and process loan applications</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="h-5 w-5 text-ucova-blue" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Applications</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.pendingApplications || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-ucova-success" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Approved Today</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.approvedApplications || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <XCircle className="h-5 w-5 text-ucova-error" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Rejected Today</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.rejectedApplications || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="h-5 w-5 text-ucova-warning" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg. Review Time</p>
                  <p className="text-2xl font-bold text-gray-900">2.3h</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Applications Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Pending Applications</CardTitle>
            <div className="flex space-x-4">
              <Input placeholder="Search applications..." className="w-64" />
              <Select>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Under Review">Under Review</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Borrower</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Amount</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Purpose</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Credit Score</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((app) => (
                      <tr key={app.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td 
                          className="py-3 px-4 text-ucova-blue font-medium cursor-pointer hover:underline"
                          onClick={() => setLocation(`/loan-application/${app.id}`)}
                        >
                          {app.applicationId}
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-medium text-gray-900">Borrower #{app.borrowerId}</div>
                            <div className="text-sm text-gray-500">borrower@example.com</div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-900">${app.amount}</td>
                        <td className="py-3 px-4 text-gray-900 capitalize">{app.purpose}</td>
                        <td className="py-3 px-4">
                          <Badge className={getCreditScoreColor(app.creditScore)}>
                            {app.creditScore}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={getStatusColor(app.status)}>
                            {app.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-ucova-blue hover:text-ucova-dark"
                            >
                              View
                            </Button>
                            {app.status === "Under Review" && (
                              <>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-ucova-success hover:text-green-700"
                                  onClick={() => handleApprove(app.id)}
                                  disabled={updateApplication.isPending}
                                >
                                  Approve
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-ucova-error hover:text-red-700"
                                  onClick={() => handleReject(app.id)}
                                  disabled={updateApplication.isPending}
                                >
                                  Reject
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No applications to review at this time.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
