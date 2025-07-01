import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DocumentUpload } from "@/components/document-upload";
import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { InsertLoanApplication } from "@shared/schema";

export default function LoanApplication() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<InsertLoanApplication>({
    borrowerId: user?.id || 0,
    amount: "",
    purpose: "",
    monthlyIncome: "",
    employmentStatus: "",
    guarantorName: "",
    guarantorContact: "",
  });

  const submitApplication = useMutation({
    mutationFn: async (data: InsertLoanApplication) => {
      const res = await apiRequest("POST", "/api/loan-applications", data);
      return res.json();
    },
    onSuccess: (application) => {
      toast({
        title: "Application submitted successfully",
        description: `Your application ${application.applicationId} has been submitted for review.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/loan-applications"] });
      setLocation("/loan-confirmation", { state: { application } });
    },
    onError: (error: any) => {
      toast({
        title: "Application failed",
        description: error.message || "Failed to submit application",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitApplication.mutate(formData);
  };

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="pt-16 bg-ucova-gray min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link href="/dashboard" className="text-ucova-blue hover:text-ucova-dark mb-4 inline-flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Loan Application</h1>
          <p className="text-gray-600">Complete your loan application form</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Application Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="amount">Loan Amount (USD)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter amount"
                    value={formData.amount}
                    onChange={(e) => handleChange("amount", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="purpose">Loan Purpose</Label>
                  <Select value={formData.purpose} onValueChange={(value) => handleChange("purpose", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select purpose" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="personal">Personal</SelectItem>
                      <SelectItem value="home">Home Improvement</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="monthlyIncome">Monthly Income (USD)</Label>
                  <Input
                    id="monthlyIncome"
                    type="number"
                    placeholder="Enter monthly income"
                    value={formData.monthlyIncome}
                    onChange={(e) => handleChange("monthlyIncome", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="employmentStatus">Employment Status</Label>
                  <Select value={formData.employmentStatus} onValueChange={(value) => handleChange("employmentStatus", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="employed">Employed</SelectItem>
                      <SelectItem value="self-employed">Self-Employed</SelectItem>
                      <SelectItem value="unemployed">Unemployed</SelectItem>
                      <SelectItem value="student">Student</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="guarantorName">Guarantor Name</Label>
                  <Input
                    id="guarantorName"
                    placeholder="Enter guarantor name"
                    value={formData.guarantorName}
                    onChange={(e) => handleChange("guarantorName", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="guarantorContact">Guarantor Contact</Label>
                  <Input
                    id="guarantorContact"
                    type="tel"
                    placeholder="Enter guarantor phone"
                    value={formData.guarantorContact}
                    onChange={(e) => handleChange("guarantorContact", e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Document Upload */}
              <div>
                <Label className="text-base font-medium">Supporting Documents</Label>
                <div className="mt-4">
                  <DocumentUpload
                    type="supporting_docs"
                    label="Upload Documents"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Link href="/dashboard">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
                <Button 
                  type="submit" 
                  className="bg-ucova-blue hover:bg-ucova-blue/90"
                  disabled={submitApplication.isPending}
                >
                  {submitApplication.isPending ? "Submitting..." : "Submit Application"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
