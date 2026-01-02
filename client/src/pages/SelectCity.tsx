import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { useAuth } from "@/hooks/use-auth";
import { Input } from "@/components/ui/input";
import { MapPin, Search } from "lucide-react";
import { motion } from "framer-motion";

const GERMAN_CITIES = [
  { name: "Berlin", region: "Berlin" },
  { name: "Hamburg", region: "Hamburg" },
  { name: "Munich", region: "Bavaria" },
  { name: "Cologne", region: "North Rhine-Westphalia" },
  { name: "Frankfurt", region: "Hesse" },
  { name: "Stuttgart", region: "Baden-Wurttemberg" },
  { name: "Dusseldorf", region: "North Rhine-Westphalia" },
  { name: "Leipzig", region: "Saxony" },
  { name: "Dortmund", region: "North Rhine-Westphalia" },
  { name: "Essen", region: "North Rhine-Westphalia" },
  { name: "Bremen", region: "Bremen" },
  { name: "Dresden", region: "Saxony" },
];

export default function SelectCity() {
  const { isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState<string | null>(() => {
    return localStorage.getItem("selectedCity");
  });

  const filteredCities = GERMAN_CITIES.filter(city =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    city.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                Please sign in to continue
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

  const handleContinue = () => {
    if (selectedCity) {
      localStorage.setItem('selectedCity', selectedCity);
      setLocation(`/find-barbers?city=${encodeURIComponent(selectedCity)}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto space-y-8"
        >
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold">Select Your City</h1>
            <p className="text-muted-foreground text-lg">
              Choose your city to find barbers near you
            </p>
          </div>

          <Card>
            <CardContent className="pt-6 space-y-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search for a city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="input-city-search"
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto">
                {filteredCities.map((city) => (
                  <motion.button
                    key={city.name}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => setSelectedCity(city.name)}
                    className={`p-4 rounded-md text-left transition-all ${
                      selectedCity === city.name
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted hover-elevate'
                    }`}
                    data-testid={`button-city-${city.name.toLowerCase()}`}
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 shrink-0" />
                      <div>
                        <div className="font-medium">{city.name}</div>
                        <div className={`text-xs ${selectedCity === city.name ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                          {city.region}
                        </div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>

              {filteredCities.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No cities found matching "{searchQuery}"
                </div>
              )}

              <Button
                className="w-full"
                disabled={!selectedCity}
                onClick={handleContinue}
                data-testid="button-continue-city"
              >
                Continue to Find Barbers
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
