import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { signup } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import type { InsertUser } from "@shared/schema";

export default function Signup() {
  const [, setLocation] = useLocation();
  const { setUser } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState<InsertUser>({
    name: "",
    email: "",
    phone: "",
    nationalId: "",
    password: "",
    role: "borrower",
    isActive: true,
  });
  const [twoFactorCode, setTwoFactorCode] = useState("");

  const signupMutation = useMutation({
    mutationFn: signup,
    onSuccess: ({ user }) => {
      setUser(user);
      toast({
        title: "Account created successfully",
        description: `Welcome to UCOVA, ${user.name}!`,
      });
      setLocation("/dashboard");
    },
    onError: (error: any) => {
      toast({
        title: "Signup failed",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!twoFactorCode) {
      toast({
        title: "Two-factor code required",
        description: "Please enter your two-factor authentication code",
        variant: "destructive",
      });
      return;
    }
    signupMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen gradient-ucova flex items-center justify-center py-12">
      <Card className="max-w-md w-full shadow-2xl mx-4">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="bg-ucova-blue text-white px-6 py-3 rounded-lg font-bold text-2xl mb-4 inline-block">
              UCOVA
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
            <p className="text-gray-600">Join UCOVA today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="nationalId">National ID</Label>
              <Input
                id="nationalId"
                name="nationalId"
                placeholder="Enter National ID"
                value={formData.nationalId || ""}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Create password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="twoFactorCode">Two-Factor Code</Label>
              <Input
                id="twoFactorCode"
                placeholder="Enter 2FA code"
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value)}
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-ucova-blue hover:bg-ucova-blue/90"
              disabled={signupMutation.isPending}
            >
              {signupMutation.isPending ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="text-ucova-blue hover:text-ucova-dark font-medium">
                Sign in
              </Link>
            </p>
          </div>

          <Link href="/" className="mt-4 inline-flex items-center text-gray-500 hover:text-gray-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
