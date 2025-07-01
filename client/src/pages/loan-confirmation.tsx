import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { Check } from "lucide-react";

export default function LoanConfirmation() {
  const [location] = useLocation();
  const state = history.state || {};
  const application = state.application;

  return (
    <div className="min-h-screen bg-gradient-to-br from-ucova-success to-green-700 flex items-center justify-center">
      <Card className="max-w-md w-full shadow-2xl mx-4">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-ucova-success rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
            <p className="text-gray-600">
              Your loan application has been successfully submitted for review.
            </p>
          </div>

          {application && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="text-sm text-gray-600">Application ID</div>
              <div className="text-lg font-bold text-gray-900">{application.applicationId}</div>
            </div>
          )}

          <div className="space-y-3 text-left mb-6">
            {application && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Amount:</span>
                <span className="font-medium text-gray-900">${application.amount}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Status:</span>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                Under Review
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Expected Review:</span>
              <span className="font-medium text-gray-900">2-3 business days</span>
            </div>
          </div>

          <Link href="/dashboard">
            <Button className="w-full bg-ucova-blue hover:bg-ucova-blue/90">
              Return to Dashboard
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
