import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building, Shield, AlertTriangle, File, Download } from "lucide-react";

interface AuditLog {
  id: number;
  userId: number;
  action: string;
  target: string;
  status: string;
  timestamp: string;
}

interface Stats {
  registeredAgencies: number;
  complianceRate: number;
  pendingApplications: number;
}

export default function ComplianceDashboard() {
  const { data: auditLogs, isLoading } = useQuery<AuditLog[]>({
    queryKey: ["/api/audit-logs"],
  });

  const { data: stats } = useQuery<Stats>({
    queryKey: ["/api/stats/overview"],
  });

  const getStatusColor = (status: string) => {
    return status === "Success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  return (
    <div className="pt-16 bg-ucova-gray min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">UCOVA Compliance Dashboard</h1>
          <p className="text-gray-600">Regulatory oversight and compliance monitoring</p>
        </div>

        {/* Compliance Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Building className="h-5 w-5 text-ucova-blue" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Registered Agencies</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.registeredAgencies || 47}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Shield className="h-5 w-5 text-ucova-success" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Compliance Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.complianceRate || 94.2}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-ucova-warning" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Verifications</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.pendingApplications || 18}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <File className="h-5 w-5 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Audits</p>
                  <p className="text-2xl font-bold text-gray-900">3</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Agency Onboarding */}
          <Card>
            <CardHeader>
              <CardTitle>Agency Onboarding Queue</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Card className="border border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Liberty Bank Microfinance</h4>
                      <p className="text-sm text-gray-500">Registration submitted: Jan 20, 2024</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" className="bg-ucova-success hover:bg-green-700">
                        Approve
                      </Button>
                      <Button size="sm" variant="destructive">
                        Reject
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Monrovia Credit Union</h4>
                      <p className="text-sm text-gray-500">Registration submitted: Jan 18, 2024</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" className="bg-ucova-success hover:bg-green-700">
                        Approve
                      </Button>
                      <Button size="sm" variant="destructive">
                        Reject
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>

          {/* Verification Queue */}
          <Card>
            <CardHeader>
              <CardTitle>Verification Queue</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Card className="border border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">John Doe - ID Verification</h4>
                      <p className="text-sm text-gray-500">Submitted: 2 hours ago</p>
                    </div>
                    <div>
                      <Button size="sm" className="bg-ucova-blue hover:bg-ucova-blue/90">
                        Review
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Jane Smith - Financial Docs</h4>
                      <p className="text-sm text-gray-500">Submitted: 4 hours ago</p>
                    </div>
                    <div>
                      <Button size="sm" className="bg-ucova-blue hover:bg-ucova-blue/90">
                        Review
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>

        {/* Audit Logs */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Audit Logs</CardTitle>
            <div className="flex space-x-4">
              <Select>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Activities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Activities</SelectItem>
                  <SelectItem value="approvals">Approvals</SelectItem>
                  <SelectItem value="rejections">Rejections</SelectItem>
                  <SelectItem value="uploads">Document Uploads</SelectItem>
                </SelectContent>
              </Select>
              <Button className="bg-ucova-blue hover:bg-ucova-blue/90">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading audit logs...</div>
            ) : auditLogs?.length ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Timestamp</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">User</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Action</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Target</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="border-b border-gray-100">
                        <td className="py-3 px-4 text-gray-900">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-gray-900">User #{log.userId}</td>
                        <td className="py-3 px-4 text-gray-900">{log.action}</td>
                        <td className="py-3 px-4 text-gray-900">{log.target}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(log.status)}`}>
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No audit logs available.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
