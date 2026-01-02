import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export default function Pricing() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navigation />
      
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h1 className="text-4xl md:text-5xl font-display font-bold">Simple, Transparent Pricing</h1>
          <p className="text-xl text-slate-400">
            For frequent flyers of the barber chair. Subscribe and save.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Basic Plan */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col">
            <h3 className="text-xl font-bold mb-2">Starter</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-bold">€29</span>
              <span className="text-slate-400">/month</span>
            </div>
            <p className="text-slate-400 mb-8">Perfect for keeping it tidy once a month.</p>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex gap-3">
                <Check className="w-5 h-5 text-primary" />
                <span>1 Premium Haircut</span>
              </li>
              <li className="flex gap-3">
                <Check className="w-5 h-5 text-primary" />
                <span>Priority Booking</span>
              </li>
            </ul>
            <Button variant="outline" className="w-full border-slate-700 hover:bg-slate-800 hover:text-white">
              Choose Starter
            </Button>
          </div>

          {/* Pro Plan */}
          <div className="bg-gradient-to-b from-primary/20 to-slate-900 border border-primary/50 rounded-3xl p-8 flex flex-col relative transform md:-translate-y-4 shadow-2xl shadow-primary/10">
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-2xl">
              POPULAR
            </div>
            <h3 className="text-xl font-bold mb-2 text-primary">Gold Pass</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-bold">€49</span>
              <span className="text-slate-400">/month</span>
            </div>
            <p className="text-slate-300 mb-8">Look sharp every two weeks.</p>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex gap-3">
                <Check className="w-5 h-5 text-primary" />
                <span>2 Premium Haircuts</span>
              </li>
              <li className="flex gap-3">
                <Check className="w-5 h-5 text-primary" />
                <span>Beard Trim Included</span>
              </li>
              <li className="flex gap-3">
                <Check className="w-5 h-5 text-primary" />
                <span>Flexible Cancellation</span>
              </li>
            </ul>
            <Button className="w-full">
              Choose Gold Pass
            </Button>
          </div>

          {/* Unlimited Plan */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col">
            <h3 className="text-xl font-bold mb-2">Unlimited</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-bold">€89</span>
              <span className="text-slate-400">/month</span>
            </div>
            <p className="text-slate-400 mb-8">For the perfectionist who needs weekly trims.</p>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex gap-3">
                <Check className="w-5 h-5 text-primary" />
                <span>Unlimited Haircuts</span>
              </li>
              <li className="flex gap-3">
                <Check className="w-5 h-5 text-primary" />
                <span>All Add-ons Included</span>
              </li>
              <li className="flex gap-3">
                <Check className="w-5 h-5 text-primary" />
                <span>VIP Support</span>
              </li>
            </ul>
            <Button variant="outline" className="w-full border-slate-700 hover:bg-slate-800 hover:text-white">
              Choose Unlimited
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
