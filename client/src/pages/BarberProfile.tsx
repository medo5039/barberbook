import { useRoute } from "wouter";
import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { BookingDialog } from "@/components/BookingDialog";
import { useBarber } from "@/hooks/use-barbers";
import { useServices } from "@/hooks/use-services";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Clock, Star, Check } from "lucide-react";
import { type Service } from "@shared/schema";

export default function BarberProfile() {
  const [, params] = useRoute("/barber/:id");
  const barberId = Number(params?.id);
  
  const { data: barber, isLoading: loadingBarber } = useBarber(barberId);
  const { data: services, isLoading: loadingServices } = useServices(barberId);
  
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const handleBook = (service: Service) => {
    setSelectedService(service);
    setIsBookingOpen(true);
  };

  if (loadingBarber || loadingServices) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-12">
          <div className="h-96 bg-muted animate-pulse rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!barber) return <div>Barber not found</div>;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Profile Header */}
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-32 h-32 md:w-48 md:h-48 bg-gradient-to-br from-primary to-primary/60 rounded-2xl flex items-center justify-center text-primary-foreground font-display font-bold text-5xl shadow-xl">
              {barber.shopName.substring(0, 2).toUpperCase()}
            </div>
            
            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-4xl font-display font-bold">{barber.shopName}</h1>
                  {barber.isVerified && (
                    <Badge className="bg-primary text-primary-foreground">Verified</Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{barber.address}, {barber.city}, {barber.country}</span>
                </div>
                <div className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star className="w-5 h-5 fill-current" />
                  <span>5.0</span>
                  <span className="text-muted-foreground font-normal ml-1">(124 reviews)</span>
                </div>
              </div>
              
              <p className="text-lg max-w-2xl">{barber.bio}</p>
            </div>

            <Card className="w-full md:w-80 shadow-lg border-primary/10">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-2 font-bold text-lg">
                  <Clock className="w-5 h-5 text-primary" />
                  <h3>Opening Hours</h3>
                </div>
                <div className="space-y-2 text-sm">
                  {Object.entries(barber.workingHours || {}).map(([day, hours]: [string, any]) => (
                    <div key={day} className="flex justify-between">
                      <span className="capitalize text-muted-foreground">{day}</span>
                      <span className="font-medium">
                        {hours.isOpen ? `${hours.start} - ${hours.end}` : "Closed"}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Services List */}
      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="services" className="space-y-8">
          <TabsList>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          </TabsList>
          
          <TabsContent value="services" className="space-y-6">
            <h2 className="text-2xl font-bold font-display">Select a Service</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {services?.map((service) => (
                <div 
                  key={service.id} 
                  className="group flex items-center justify-between p-6 rounded-xl border bg-card hover:border-primary/50 hover:shadow-md transition-all duration-300"
                >
                  <div className="space-y-1">
                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{service.name}</h3>
                    <p className="text-muted-foreground text-sm">{service.description}</p>
                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mt-2">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{service.durationMinutes} mins</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <span className="font-bold text-xl">€{Number(service.price).toFixed(2)}</span>
                    <Button onClick={() => handleBook(service)}>Book</Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reviews">
            <div className="p-8 text-center text-muted-foreground bg-muted/20 rounded-xl border border-dashed">
              Reviews coming soon...
            </div>
          </TabsContent>
          
          <TabsContent value="portfolio">
             <div className="p-8 text-center text-muted-foreground bg-muted/20 rounded-xl border border-dashed">
              Portfolio images coming soon...
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {selectedService && (
        <BookingDialog
          open={isBookingOpen}
          onOpenChange={setIsBookingOpen}
          barber={barber}
          service={selectedService}
        />
      )}
    </div>
  );
}
