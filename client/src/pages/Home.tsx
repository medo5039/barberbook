import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { ArrowRight, Scissors, Star, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden bg-slate-950">
        {/* Abstract shapes/gradient background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/10 to-transparent" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        </div>

        <div className="container relative z-10 mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight text-white mb-6">
                Masterful Cuts,<br />
                <span className="text-primary">Effortless Booking</span>
              </h1>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                Connect with Germany's top-tier barbers. Experience premium grooming services booked in seconds.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/get-started">
                <Button size="lg" className="h-14 px-8 text-lg rounded-full" data-testid="button-get-started">
                  Get Started
                </Button>
              </Link>
              <Link href="/join-as-barber">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-white/20 text-white hover:bg-white/10 hover:text-white" data-testid="button-for-barbers">
                  For Barbers
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <Scissors className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Expert Barbers</h3>
              <p className="text-muted-foreground leading-relaxed">
                Curated selection of the finest barbers across Germany. Verified skills and authentic reviews.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <Star className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Premium Experience</h3>
              <p className="text-muted-foreground leading-relaxed">
                From classic cuts to luxury treatments. Find exactly what you need for your style.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Secure Booking</h3>
              <p className="text-muted-foreground leading-relaxed">
                Hassle-free scheduling and secure payments. Manage your appointments with ease.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Subscription Teaser */}
      <section className="py-24 border-t bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="bg-slate-900 rounded-3xl p-8 md:p-12 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-slate-900 to-slate-900" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="space-y-6 max-w-xl">
                <h2 className="text-3xl md:text-4xl font-display font-bold text-white">
                  Unlimited Style with <span className="text-primary">Gold Pass</span>
                </h2>
                <p className="text-slate-300 text-lg">
                  Subscribe to get unlimited haircuts from selected top-rated barbers for a flat monthly fee. Look sharp, always.
                </p>
                <Link href="/pricing">
                  <Button variant="secondary" size="lg" className="rounded-full">
                    View Membership Plans <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
              
              {/* Abstract decorative element representing a pass */}
              <div className="w-full max-w-xs aspect-video bg-gradient-to-br from-amber-300 to-yellow-600 rounded-2xl shadow-2xl p-6 flex flex-col justify-between transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="flex justify-between items-start">
                  <span className="font-display font-bold text-xl text-yellow-950">Gold Pass</span>
                  <Scissors className="text-yellow-950/50 w-8 h-8" />
                </div>
                <div className="text-yellow-950 font-mono text-sm opacity-70">
                  •••• •••• •••• 8842
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t bg-background">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>© 2024 Cuts & Co. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
