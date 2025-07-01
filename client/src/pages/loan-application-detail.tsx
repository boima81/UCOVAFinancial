import React from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, User, DollarSign, FileText, Check, X, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface LoanApplicationDetail {
  id: number;
  applicationId: string;
  borrowerId: number;
  amount: string;
  purpose: string;
  status: string;
  employmentStatus: string;
  monthlyIncome: string;
  guarantorName: string;
  guarantorContact: string;
  creditScore: number;
  submittedAt: string;
  reviewedAt: string | null;
  reviewedBy: number | null;
  comments: string | null;
  borrowerName?: string;
  borrowerEmail?: string;
}

export default function LoanApplicationDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [comments, setComments] = useState("");

  const { data: application, isLoading } = useQuery<LoanApplicationDetail>({
    queryKey: ["/api/loan-applications", id],
    enabled: !!id,
  });

  const updateApplicationMutation = useMutation({
    mutationFn: async (updates: { status: string; comments?: string }) => {
      const response = await fetch(`/api/loan-applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update application');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/loan-applications"] });
      toast({
        title: "Application updated successfully",
        description: "Loan application status has been updated.",
      });
    },
  });

  const handleApprove = () => {
    updateApplicationMutation.mutate({ 
      status: 'Approved',
      comments: comments || 'Application approved'
    });
  };

  const handleReject = () => {
    if (!comments.trim()) {
      toast({
        title: "Comments required",
        description: "Please provide comments when rejecting an application.",
        variant: "destructive",
      });
      return;
    }
    updateApplicationMutation.mutate({ 
      status: 'Rejected',
      comments 
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'Rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      case 'Under Review':
        return <Badge className="bg-yellow-100 text-yellow-800">Under Review</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  const getCreditScoreColor = (score: number) => {
    if (score >= 750) return "text-green-600";
    if (score >= 650) return "text-yellow-600";
    return "text-red-600";
  };

  const getBackUrl = () => {
    // Determine where to go back based on current path or user role
    if (window.location.pathname.includes('agent')) {
      return '/agent-portal';
    }
    return '/admin-dashboard';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Application Not Found</h1>
          <Button onClick={() => setLocation(getBackUrl())}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setLocation(getBackUrl())}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Loan Application</h1>
              <p className="text-gray-600">Application ID: {application.applicationId}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {getStatusBadge(application.status)}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Application Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Loan Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Loan Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Loan Amount</label>
                    <p className="text-2xl font-bold text-gray-900">${application.amount}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Credit Score</label>
                    <p className={`text-2xl font-bold ${getCreditScoreColor(application.creditScore)}`}>
                      {application.creditScore}
                    </p>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Purpose</label>
                  <p className="text-gray-900">{application.purpose}</p>
                </div>
                
                <Separator />
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Submitted</label>
                  <p className="text-gray-900">{new Date(application.submittedAt).toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>

            {/* Borrower Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Borrower Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Employment Status</label>
                    <p className="text-gray-900 capitalize">{application.employmentStatus}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Monthly Income</label>
                    <p className="text-gray-900">${application.monthlyIncome}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Guarantor Name</label>
                    <p className="text-gray-900">{application.guarantorName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Guarantor Contact</label>
                    <p className="text-gray-900">{application.guarantorContact}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Documents */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Supporting Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-sm font-medium">National ID</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Verified</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-sm font-medium">Bank Statement</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Verified</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-sm font-medium">Mobile Money Statement</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Verified</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Review Section */}
            {application.status === 'Under Review' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Review Comments
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="comments">Comments</Label>
                    <Textarea
                      id="comments"
                      placeholder="Add your review comments here..."
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>
                  
                  <div className="flex space-x-3">
                    <Button
                      onClick={handleReject}
                      variant="outline"
                      disabled={updateApplicationMutation.isPending}
                      className="border-red-300 text-red-700 hover:bg-red-50"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Reject Application
                    </Button>
                    <Button
                      onClick={handleApprove}
                      disabled={updateApplicationMutation.isPending}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Approve Application
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Previous Comments */}
            {application.comments && (
              <Card>
                <CardHeader>
                  <CardTitle>Review Comments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-900">{application.comments}</p>
                    {application.reviewedAt && (
                      <p className="text-sm text-gray-500 mt-2">
                        Reviewed on {new Date(application.reviewedAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Application Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Application Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status:</span>
                    <span>{application.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Amount:</span>
                    <span className="font-medium">${application.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Credit Score:</span>
                    <span className={getCreditScoreColor(application.creditScore)}>
                      {application.creditScore}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Submitted:</span>
                    <span>{new Date(application.submittedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Risk Assessment */}
            <Card>
              <CardHeader>
                <CardTitle>Risk Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Credit Score</span>
                    <Badge className={application.creditScore >= 700 ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                      {application.creditScore >= 700 ? "Low Risk" : "Medium Risk"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Income Verification</span>
                    <Badge className="bg-green-100 text-green-800">Verified</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Document Verification</span>
                    <Badge className="bg-green-100 text-green-800">Complete</Badge>
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