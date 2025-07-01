import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { login } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import type { LoginRequest } from "@shared/schema";

export default function Login() {
  const [, setLocation] = useLocation();
  const { setUser } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState<LoginRequest>({
    email: "",
    password: "",
  });

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: ({ user }) => {
      setUser(user);
      toast({
        title: "Login successful",
        description: `Welcome back, ${user.name}!`,
      });
      
      // Redirect based on role
      const roleRedirects = {
        borrower: "/dashboard",
        agent: "/agent-portal",
        compliance: "/compliance",
        admin: "/admin",
      };
      setLocation(roleRedirects[user.role as keyof typeof roleRedirects] || "/dashboard");
    },
    onError: (error: any) => {
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen gradient-ucova flex items-center justify-center">
      <Card className="max-w-md w-full shadow-2xl mx-4">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="bg-ucova-blue text-white px-6 py-3 rounded-lg font-bold text-2xl mb-4 inline-block">
              UCOVA
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
            <p className="text-gray-600">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email or Phone</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter email or phone number"
                value={formData.email}
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
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember" className="text-sm">Remember me</Label>
              </div>
              <Link href="#" className="text-sm text-ucova-blue hover:text-ucova-dark">
                Forgot password?
              </Link>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-ucova-blue hover:bg-ucova-blue/90"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link href="/signup" className="text-ucova-blue hover:text-ucova-dark font-medium">
                Sign up
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
