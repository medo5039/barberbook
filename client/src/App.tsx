import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import Home from "@/pages/Home";
import FindBarbers from "@/pages/FindBarbers";
import BarberProfile from "@/pages/BarberProfile";
import JoinBarber from "@/pages/JoinBarber";
import BarberDashboard from "@/pages/BarberDashboard";
import CustomerDashboard from "@/pages/CustomerDashboard";
import Pricing from "@/pages/Pricing";
import GetStarted from "@/pages/GetStarted";
import SelectCity from "@/pages/SelectCity";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/get-started" component={GetStarted} />
      <Route path="/select-city" component={SelectCity} />
      <Route path="/find-barbers" component={FindBarbers} />
      <Route path="/barber/:id" component={BarberProfile} />
      <Route path="/join-as-barber" component={JoinBarber} />
      <Route path="/dashboard/barber/:id" component={BarberDashboard} />
      <Route path="/dashboard/customer" component={CustomerDashboard} />
      <Route path="/pricing" component={Pricing} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
