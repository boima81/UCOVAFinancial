import React, { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { DocumentUpload } from "@/components/document-upload";
import { CheckCircle, ArrowLeft, ArrowRight, User, FileText, DollarSign, Check } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

type Step = 'basic' | 'identity' | 'financial' | 'documents' | 'review';

interface ProfileData {
  employmentStatus: string;
  monthlyIncome: string;
  address: string;
  nationalId: string;
}

export default function ProfileCompletion() {
  const { user, setUser } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [currentStep, setCurrentStep] = useState<Step>('basic');
  const [profileData, setProfileData] = useState<ProfileData>({
    employmentStatus: user?.employmentStatus || '',
    monthlyIncome: user?.monthlyIncome || '',
    address: user?.address || '',
    nationalId: user?.nationalId || '',
  });

  const [uploadedDocuments, setUploadedDocuments] = useState({
    nationalId: false,
    bankStatement: false,
    mobileMoneyStatement: false,
  });

  const steps: { key: Step; title: string; description: string; icon: any; }[] = [
    { key: 'basic', title: 'Basic Info', description: 'Employment and income details', icon: User },
    { key: 'identity', title: 'Identity Verification', description: 'National ID verification', icon: FileText },
    { key: 'financial', title: 'Financial Documents', description: 'Bank and mobile money statements', icon: DollarSign },
    { key: 'review', title: 'Review & Submit', description: 'Review and submit for approval', icon: Check },
  ];

  const getCurrentStepIndex = () => steps.findIndex(step => step.key === currentStep);
  const getProgress = () => ((getCurrentStepIndex() + 1) / steps.length) * 100;

  const updateProfileMutation = useMutation({
    mutationFn: async (data: Partial<ProfileData & { profileStatus: string }>) => {
      const response = await fetch(`/api/users/${user?.id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      
      return response.json();
    },
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
    },
  });

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleDocumentUpload = (type: string) => {
    setUploadedDocuments(prev => ({ ...prev, [type]: true }));
    toast({
      title: "Document uploaded successfully",
      description: `Your ${type.replace(/([A-Z])/g, ' $1').toLowerCase()} has been uploaded.`,
    });
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 'basic':
        return profileData.employmentStatus && profileData.monthlyIncome && profileData.address;
      case 'identity':
        return profileData.nationalId && uploadedDocuments.nationalId;
      case 'financial':
        return uploadedDocuments.bankStatement && uploadedDocuments.mobileMoneyStatement;
      default:
        return true;
    }
  };

  const handleNext = () => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].key);
    }
  };

  const handleBack = () => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].key);
    }
  };

  const handleSubmit = async () => {
    try {
      await updateProfileMutation.mutateAsync({
        ...profileData,
        profileStatus: 'pending'
      });
      
      toast({
        title: "Profile submitted successfully!",
        description: "Your profile is now under review. You'll be notified once approved.",
      });
      
      setLocation("/borrower-dashboard");
    } catch (error) {
      toast({
        title: "Error submitting profile",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'basic':
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="employmentStatus">Employment Status</Label>
              <Select 
                value={profileData.employmentStatus} 
                onValueChange={(value) => handleInputChange('employmentStatus', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select employment status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employed">Employed</SelectItem>
                  <SelectItem value="self-employed">Self-Employed</SelectItem>
                  <SelectItem value="business-owner">Business Owner</SelectItem>
                  <SelectItem value="unemployed">Unemployed</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="monthlyIncome">Monthly Income (USD)</Label>
              <Input
                id="monthlyIncome"
                type="number"
                placeholder="Enter your monthly income"
                value={profileData.monthlyIncome}
                onChange={(e) => handleInputChange('monthlyIncome', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                placeholder="Enter your full address"
                value={profileData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
        );

      case 'identity':
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="nationalId">National ID Number</Label>
              <Input
                id="nationalId"
                placeholder="Enter your National ID number"
                value={profileData.nationalId}
                onChange={(e) => handleInputChange('nationalId', e.target.value)}
              />
            </div>

            <div>
              <Label>Upload National ID Document</Label>
              <DocumentUpload
                type="nationalId"
                label="National ID (Front & Back)"
                icon={<FileText className="h-6 w-6" />}
                onUpload={() => handleDocumentUpload('nationalId')}
              />
              {uploadedDocuments.nationalId && (
                <div className="flex items-center mt-2 text-sm text-green-600">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  National ID uploaded successfully
                </div>
              )}
            </div>
          </div>
        );

      case 'financial':
        return (
          <div className="space-y-6">
            <div>
              <Label>Bank Statement</Label>
              <DocumentUpload
                type="bankStatement"
                label="Bank Statement (Last 3 months)"
                icon={<DollarSign className="h-6 w-6" />}
                onUpload={() => handleDocumentUpload('bankStatement')}
              />
              {uploadedDocuments.bankStatement && (
                <div className="flex items-center mt-2 text-sm text-green-600">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Bank statement uploaded successfully
                </div>
              )}
            </div>

            <div>
              <Label>Mobile Money Statement</Label>
              <DocumentUpload
                type="mobileMoneyStatement"
                label="Mobile Money Statement (Last 3 months)"
                icon={<DollarSign className="h-6 w-6" />}
                onUpload={() => handleDocumentUpload('mobileMoneyStatement')}
              />
              {uploadedDocuments.mobileMoneyStatement && (
                <div className="flex items-center mt-2 text-sm text-green-600">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Mobile money statement uploaded successfully
                </div>
              )}
            </div>
          </div>
        );

      case 'review':
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-3">Profile Summary</h3>
              <div className="space-y-2 text-sm">
                <div><span className="font-medium">Employment Status:</span> {profileData.employmentStatus}</div>
                <div><span className="font-medium">Monthly Income:</span> ${profileData.monthlyIncome}</div>
                <div><span className="font-medium">Address:</span> {profileData.address}</div>
                <div><span className="font-medium">National ID:</span> {profileData.nationalId}</div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-3">Uploaded Documents</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  National ID Document
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  Bank Statement
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  Mobile Money Statement
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                By submitting your profile, you agree to our terms and conditions. 
                Your information will be reviewed within 2-3 business days.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Profile</h1>
          <p className="text-gray-600">Complete all steps to unlock loan offers and applications</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => {
              const isActive = step.key === currentStep;
              const isCompleted = getCurrentStepIndex() > index;
              const Icon = step.icon;

              return (
                <div key={step.key} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    isCompleted 
                      ? 'bg-ucova-success border-ucova-success text-white'
                      : isActive 
                        ? 'bg-ucova-blue border-ucova-blue text-white'
                        : 'bg-white border-gray-300 text-gray-400'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>
                  <div className="ml-3">
                    <div className={`text-sm font-medium ${isActive ? 'text-ucova-blue' : isCompleted ? 'text-ucova-success' : 'text-gray-400'}`}>
                      {step.title}
                    </div>
                    <div className="text-xs text-gray-500">{step.description}</div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`ml-6 w-16 h-0.5 ${isCompleted ? 'bg-ucova-success' : 'bg-gray-300'}`} />
                  )}
                </div>
              );
            })}
          </div>
          
          <Progress value={getProgress()} className="h-2" />
        </div>

        {/* Step Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              {React.createElement(steps.find(s => s.key === currentStep)?.icon || User, { className: "h-5 w-5 mr-2" })}
              {steps.find(s => s.key === currentStep)?.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={getCurrentStepIndex() === 0}
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          {currentStep === 'review' ? (
            <Button
              onClick={handleSubmit}
              disabled={updateProfileMutation.isPending}
              className="bg-ucova-blue hover:bg-ucova-blue/90 flex items-center"
            >
              {updateProfileMutation.isPending ? "Submitting..." : "Submit for Review"}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!canProceedToNext()}
              className="bg-ucova-blue hover:bg-ucova-blue/90 flex items-center"
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}