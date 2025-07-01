import React from "react";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Building2, Users, FileText, Shield, CheckCircle, AlertTriangle } from "lucide-react";

interface AgencyDetails {
  id: number;
  name: string;
  registrationNumber: string;
  type: string;
  status: string;
  establishedDate: string;
  address: string;
  contactPerson: string;
  email: string;
  phone: string;
  website: string;
  totalUsers: number;
  activeApplications: number;
  complianceScore: number;
  lastAuditDate: string;
}

export default function AgencyDetails() {
  const { id } = useParams();
  const [, setLocation] = useLocation();

  // Mock data for demonstration - in real app this would come from API
  const agency: AgencyDetails = {
    id: parseInt(id || "1"),
    name: "First National Bank of Liberia",
    registrationNumber: "REG-2020-001",
    type: "Commercial Bank",
    status: "Active",
    establishedDate: "2020-01-15",
    address: "123 Tubman Boulevard, Monrovia, Liberia",
    contactPerson: "Samuel Johnson",
    email: "samuel.johnson@fnbl.lr",
    phone: "+231-777-123-456",
    website: "www.fnbl.lr",
    totalUsers: 2458,
    activeApplications: 89,
    complianceScore: 95,
    lastAuditDate: "2024-11-15",
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'Suspended':
        return <Badge className="bg-red-100 text-red-800">Suspended</Badge>;
      case 'Under Review':
        return <Badge className="bg-yellow-100 text-yellow-800">Under Review</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  const getComplianceScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getComplianceIcon = (score: number) => {
    if (score >= 90) return <CheckCircle className="h-5 w-5 text-green-500" />;
    if (score >= 70) return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    return <AlertTriangle className="h-5 w-5 text-red-500" />;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setLocation("/compliance-dashboard")}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{agency.name}</h1>
              <p className="text-gray-600">Registration: {agency.registrationNumber}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {getStatusBadge(agency.status)}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Agency Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="h-5 w-5 mr-2" />
                  Agency Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Agency Name</label>
                    <p className="text-gray-900">{agency.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Type</label>
                    <p className="text-gray-900">{agency.type}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Registration Number</label>
                    <p className="text-gray-900">{agency.registrationNumber}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Established</label>
                    <p className="text-gray-900">{new Date(agency.establishedDate).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Address</label>
                  <p className="text-gray-900">{agency.address}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Website</label>
                    <p className="text-gray-900">{agency.website}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <p className="text-gray-900">{agency.status}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Contact Person</label>
                    <p className="text-gray-900">{agency.contactPerson}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-gray-900">{agency.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone</label>
                    <p className="text-gray-900">{agency.phone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Compliance Records */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Compliance Records
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 mr-3 text-green-500" />
                      <div>
                        <p className="font-medium">Anti-Money Laundering (AML)</p>
                        <p className="text-sm text-gray-500">Last updated: Dec 15, 2024</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Compliant</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 mr-3 text-green-500" />
                      <div>
                        <p className="font-medium">Know Your Customer (KYC)</p>
                        <p className="text-sm text-gray-500">Last updated: Dec 10, 2024</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Compliant</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-3 text-yellow-500" />
                      <div>
                        <p className="font-medium">Data Protection</p>
                        <p className="text-sm text-gray-500">Review required by Jan 30, 2025</p>
                      </div>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">Review Pending</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 mr-3 text-green-500" />
                      <div>
                        <p className="font-medium">Financial Reporting</p>
                        <p className="text-sm text-gray-500">Last updated: Dec 01, 2024</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Compliant</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm font-medium">Compliance audit completed</p>
                      <p className="text-xs text-gray-500">2 days ago</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Complete</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm font-medium">Monthly risk assessment submitted</p>
                      <p className="text-xs text-gray-500">1 week ago</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">Submitted</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm font-medium">New loan products registered</p>
                      <p className="text-xs text-gray-500">2 weeks ago</p>
                    </div>
                    <Badge className="bg-purple-100 text-purple-800">Approved</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{agency.totalUsers.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">Total Users</p>
                </div>
                
                <Separator />
                
                <div className="text-center">
                  <p className="text-2xl font-bold text-ucova-blue">{agency.activeApplications}</p>
                  <p className="text-sm text-gray-500">Active Applications</p>
                </div>
                
                <Separator />
                
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    {getComplianceIcon(agency.complianceScore)}
                    <p className={`text-2xl font-bold ml-2 ${getComplianceScoreColor(agency.complianceScore)}`}>
                      {agency.complianceScore}%
                    </p>
                  </div>
                  <p className="text-sm text-gray-500">Compliance Score</p>
                </div>
              </CardContent>
            </Card>

            {/* Audit Information */}
            <Card>
              <CardHeader>
                <CardTitle>Audit Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Last Audit Date</label>
                  <p className="text-gray-900">{new Date(agency.lastAuditDate).toLocaleDateString()}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Next Audit Due</label>
                  <p className="text-gray-900">November 15, 2025</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Audit Status</label>
                  <Badge className="bg-green-100 text-green-800">Up to Date</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Download Report
                </Button>
                
                <Button className="w-full" variant="outline">
                  <Shield className="h-4 w-4 mr-2" />
                  Schedule Audit
                </Button>
                
                <Button className="w-full bg-ucova-blue hover:bg-ucova-blue/90">
                  <Users className="h-4 w-4 mr-2" />
                  Contact Agency
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}