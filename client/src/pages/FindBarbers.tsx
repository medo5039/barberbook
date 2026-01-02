import { useState, useEffect } from "react";
import { useSearch } from "wouter";
import { Navigation } from "@/components/Navigation";
import { BarberCard } from "@/components/BarberCard";
import { useBarbers } from "@/hooks/use-barbers";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Search, MapPin, LayoutGrid, Map } from "lucide-react";

export default function FindBarbers() {
  const searchParams = useSearch();
  const urlCity = new URLSearchParams(searchParams).get("city") || "";
  
  const [city, setCity] = useState(urlCity);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
  const { data: barbers, isLoading, error } = useBarbers({ city, search });

  useEffect(() => {
    const savedCity = localStorage.getItem("selectedCity");
    if (!urlCity && savedCity) {
      setCity(savedCity);
    }
  }, [urlCity]);

  return (
    <div className="min-h-screen bg-muted/10">
      <Navigation />
      
      <div className="bg-background border-b py-12">
        <div className="container mx-auto px-4 space-y-8">
          <h1 className="text-4xl font-display font-bold">Find Your Barber</h1>
          
          <div className="flex flex-col md:flex-row gap-4 max-w-3xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input 
                placeholder="Search by name..." 
                className="pl-9 h-12"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                data-testid="input-barber-search"
              />
            </div>
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input 
                placeholder="Filter by city (e.g. Berlin)" 
                className="pl-9 h-12"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                data-testid="input-city-filter"
              />
            </div>
            <Button size="lg" className="h-12 px-8" data-testid="button-search" onClick={() => {
              localStorage.setItem('selectedCity', city);
            }}>Search</Button>
          </div>
          
          <div className="flex items-center gap-4">
            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "grid" | "map")}>
              <TabsList>
                <TabsTrigger value="grid" data-testid="tab-grid-view">
                  <LayoutGrid className="w-4 h-4 mr-2" />
                  Grid
                </TabsTrigger>
                <TabsTrigger value="map" data-testid="tab-map-view">
                  <Map className="w-4 h-4 mr-2" />
                  Map
                </TabsTrigger>
              </TabsList>
            </Tabs>
            {city && (
              <span className="text-sm text-muted-foreground">
                Showing barbers in <span className="font-medium text-foreground">{city}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-[350px] bg-muted animate-pulse rounded-xl" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-destructive">Failed to load barbers. Please try again.</p>
          </div>
        ) : barbers?.length === 0 ? (
          <div className="text-center py-20 bg-background rounded-2xl border border-dashed">
            <div className="bg-muted/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-bold mb-2">No barbers found</h3>
            <p className="text-muted-foreground">Try adjusting your search filters.</p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {barbers?.map((barber) => (
              <BarberCard key={barber.id} barber={barber} />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6 h-[600px]">
            <Card className="relative overflow-hidden bg-gradient-to-br from-muted/50 to-muted">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                <div className="text-center space-y-4 opacity-30">
                  <Map className="w-24 h-24 mx-auto text-muted-foreground/30" />
                </div>
              </div>
              <div className="absolute top-4 left-4 z-10">
                <div className="bg-background/80 backdrop-blur-sm rounded-md px-3 py-2 text-sm">
                  {city ? `${barbers?.length || 0} barbers in ${city}` : "All locations"}
                </div>
              </div>
              {barbers && barbers.length > 0 && (
                <div className="absolute inset-0 p-6">
                  <div className="relative w-full h-full">
                    {barbers.slice(0, 8).map((barber, index) => {
                      const positions = [
                        { top: "15%", left: "20%" },
                        { top: "25%", left: "60%" },
                        { top: "45%", left: "35%" },
                        { top: "60%", left: "70%" },
                        { top: "75%", left: "25%" },
                        { top: "35%", left: "80%" },
                        { top: "80%", left: "55%" },
                        { top: "50%", left: "15%" },
                      ];
                      const pos = positions[index % positions.length];
                      return (
                        <div
                          key={barber.id}
                          className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                          style={{ top: pos.top, left: pos.left }}
                        >
                          <div className="bg-primary text-primary-foreground rounded-full p-2 shadow-lg group-hover:scale-110 transition-transform">
                            <MapPin className="w-4 h-4" />
                          </div>
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            <div className="bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow whitespace-nowrap">
                              {barber.shopName}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </Card>
            <div className="space-y-4 overflow-y-auto max-h-[600px]">
              <h3 className="font-semibold text-lg sticky top-0 bg-muted/10 py-2">
                Barbers Near You ({barbers?.length || 0})
              </h3>
              {barbers?.map((barber) => (
                <Card key={barber.id} className="hover-elevate cursor-pointer" data-testid={`map-barber-${barber.id}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                        {barber.shopName.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold truncate">{barber.shopName}</h4>
                        <p className="text-sm text-muted-foreground truncate">
                          {barber.city || barber.location}
                        </p>
                      </div>
                      <Button size="sm" variant="outline" asChild>
                        <a href={`/barber/${barber.id}`}>View</a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
