import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";

export default function Welcome() {
  return (
    <div className="min-h-screen gradient-ucova flex items-center justify-center">
      <Card className="max-w-md w-full shadow-2xl mx-4">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="bg-ucova-blue text-white px-6 py-3 rounded-lg font-bold text-2xl mb-4 inline-block">
              UCOVA
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Financial Verification System
            </h1>
            <p className="text-gray-600">Secure, Fast, Reliable</p>
          </div>

          <div className="space-y-4">
            <Link href="/login">
              <Button className="w-full bg-ucova-blue hover:bg-ucova-blue/90 text-white">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button variant="outline" className="w-full border-ucova-blue text-ucova-blue hover:bg-ucova-blue hover:text-white">
                Sign Up
              </Button>
            </Link>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">Serving Liberia's Financial Sector</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
