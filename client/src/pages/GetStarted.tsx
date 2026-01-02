import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { useAuth } from "@/hooks/use-auth";
import { Scissors, User } from "lucide-react";
import { motion } from "framer-motion";

export default function GetStarted() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardHeader className="text-center">
              <CardTitle>Sign In Required</CardTitle>
              <CardDescription>
                Please sign in to continue setting up your account
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <a href="/api/login">
                <Button data-testid="button-login">Sign In with Replit</Button>
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-4"
          >
            <h1 className="text-3xl md:text-4xl font-bold">Welcome to BarberBook</h1>
            <p className="text-muted-foreground text-lg">
              How would you like to use BarberBook?
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card 
                className="h-full hover-elevate transition-all"
                data-testid="card-customer-role"
              >
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <User className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">I want to book appointments</CardTitle>
                  <CardDescription className="text-base">
                    Find and book with top barbers in your area
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Link href="/select-city">
                    <Button className="w-full" data-testid="button-continue-customer">
                      Continue as Customer
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card 
                className="h-full hover-elevate transition-all"
                data-testid="card-barber-role"
              >
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Scissors className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">I am a barber</CardTitle>
                  <CardDescription className="text-base">
                    List your services and accept bookings online
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Link href="/join-as-barber">
                    <Button variant="outline" className="w-full" data-testid="button-continue-barber">
                      Join as a Barber
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
