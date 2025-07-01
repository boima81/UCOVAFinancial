import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Users, DollarSign, Percent, TrendingUp, Download, FileText } from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

interface Stats {
  totalUsers: number;
  totalLoanVolume: number;
  defaultRate: string;
  monthlyGrowth: number;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users");

  const { data: users, isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  const { data: stats } = useQuery<Stats>({
    queryKey: ["/api/stats/overview"],
  });

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800";
      case "agent":
        return "bg-blue-100 text-blue-800";
      case "compliance":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="pt-16 bg-ucova-gray min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">System administration and analytics</p>
        </div>

        {/* Admin Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-5 w-5 text-ucova-blue" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.totalUsers || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="h-5 w-5 text-ucova-success" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Loan Volume</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${stats?.totalLoanVolume?.toLocaleString() || "0"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Percent className="h-5 w-5 text-ucova-warning" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Default Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.defaultRate || "0.0"}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Monthly Growth</p>
                  <p className="text-2xl font-bold text-gray-900">+{stats?.monthlyGrowth || 0}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <Card>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <CardHeader>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
              </TabsList>
            </CardHeader>

            {/* Users Tab */}
            <TabsContent value="users">
              <CardContent>
                <div className="flex items-center justify-between mb-6">
                  <CardTitle>User Management</CardTitle>
                  <div className="flex space-x-4">
                    <Input placeholder="Search users..." className="w-64" />
                    <Select>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="All Roles" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="borrower">Borrower</SelectItem>
                        <SelectItem value="agent">Agent</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="compliance">Compliance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {usersLoading ? (
                  <div className="text-center py-8">Loading users...</div>
                ) : users?.length ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-medium text-gray-900">User</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Role</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Created</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr key={user.id} className="border-b border-gray-100">
                            <td className="py-3 px-4">
                              <div>
                                <div className="font-medium text-gray-900">{user.name}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <Badge className={getRoleBadgeColor(user.role)}>
                                {user.role}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <Badge className={user.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                                {user.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-gray-900">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex space-x-2">
                                <Button variant="ghost" size="sm" className="text-ucova-blue">
                                  Edit
                                </Button>
                                <Button variant="ghost" size="sm" className="text-ucova-error">
                                  {user.isActive ? "Suspend" : "Activate"}
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No users found.
                  </div>
                )}
              </CardContent>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics">
              <CardContent>
                <CardTitle className="mb-6">Analytics Overview</CardTitle>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Monthly Loan Volume Chart */}
                  <Card className="bg-gray-50">
                    <CardContent className="p-6">
                      <h4 className="font-medium text-gray-900 mb-4">Monthly Loan Volume</h4>
                      <div className="h-64 flex items-end justify-between space-x-2">
                        {[40, 60, 80, 50, 90, 70].map((height, index) => (
                          <div 
                            key={index}
                            className="bg-ucova-blue rounded-t flex-1"
                            style={{ height: `${height}%` }}
                          />
                        ))}
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-2">
                        <span>Aug</span>
                        <span>Sep</span>
                        <span>Oct</span>
                        <span>Nov</span>
                        <span>Dec</span>
                        <span>Jan</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Default Rate Chart */}
                  <Card className="bg-gray-50">
                    <CardContent className="p-6">
                      <h4 className="font-medium text-gray-900 mb-4">Default Rate Trend</h4>
                      <div className="h-64 flex items-end justify-between space-x-2">
                        {[15, 20, 25, 18, 22, 16].map((height, index) => (
                          <div 
                            key={index}
                            className="bg-ucova-error rounded-t flex-1"
                            style={{ height: `${height}%` }}
                          />
                        ))}
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-2">
                        <span>Aug</span>
                        <span>Sep</span>
                        <span>Oct</span>
                        <span>Nov</span>
                        <span>Dec</span>
                        <span>Jan</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </TabsContent>

            {/* Reports Tab */}
            <TabsContent value="reports">
              <CardContent>
                <CardTitle className="mb-6">Generate Reports</CardTitle>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="border border-gray-200">
                    <CardContent className="p-6">
                      <h4 className="font-medium text-gray-900 mb-2">Monthly Performance</h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Complete overview of monthly loan performance and metrics
                      </p>
                      <div className="flex space-x-2">
                        <Button size="sm" className="bg-ucova-blue hover:bg-ucova-blue/90">
                          <FileText className="h-4 w-4 mr-1" />
                          PDF
                        </Button>
                        <Button size="sm" className="bg-ucova-success hover:bg-green-700">
                          <Download className="h-4 w-4 mr-1" />
                          Excel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border border-gray-200">
                    <CardContent className="p-6">
                      <h4 className="font-medium text-gray-900 mb-2">User Activity</h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Detailed user activity and engagement analytics
                      </p>
                      <div className="flex space-x-2">
                        <Button size="sm" className="bg-ucova-blue hover:bg-ucova-blue/90">
                          <FileText className="h-4 w-4 mr-1" />
                          PDF
                        </Button>
                        <Button size="sm" className="bg-ucova-success hover:bg-green-700">
                          <Download className="h-4 w-4 mr-1" />
                          Excel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border border-gray-200">
                    <CardContent className="p-6">
                      <h4 className="font-medium text-gray-900 mb-2">Compliance Report</h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Regulatory compliance and audit trail report
                      </p>
                      <div className="flex space-x-2">
                        <Button size="sm" className="bg-ucova-blue hover:bg-ucova-blue/90">
                          <FileText className="h-4 w-4 mr-1" />
                          PDF
                        </Button>
                        <Button size="sm" className="bg-ucova-success hover:bg-green-700">
                          <Download className="h-4 w-4 mr-1" />
                          Excel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
