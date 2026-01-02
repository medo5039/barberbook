import { useAuth } from "@/hooks/use-auth";
import { useAppointments } from "@/hooks/use-appointments";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Calendar, Clock, MapPin, Scissors, Loader2 } from "lucide-react";
import { Link } from "wouter";

export default function CustomerDashboard() {
  const { user } = useAuth();
  const { data: appointments, isLoading } = useAppointments('customer');

  if (!user) return null;

  return (
    <div className="min-h-screen bg-muted/10">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-display font-bold">My Appointments</h1>
          <Link href="/find-barbers">
            <Button>Book New Appointment</Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="animate-spin w-8 h-8 text-primary" /></div>
        ) : appointments?.length === 0 ? (
          <div className="text-center py-20 bg-background rounded-2xl border border-dashed">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-bold">No appointments yet</h3>
            <p className="text-muted-foreground mb-6">Book your first cut today!</p>
            <Link href="/find-barbers">
              <Button>Find a Barber</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {appointments?.map((apt) => (
              <Card key={apt.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="bg-primary/5 p-6 flex flex-col justify-center items-center w-full md:w-32 border-r border-border/50">
                    <span className="text-3xl font-bold text-primary">{format(new Date(apt.startTime), "d")}</span>
                    <span className="text-sm font-medium uppercase tracking-wider text-muted-foreground">{format(new Date(apt.startTime), "MMM")}</span>
                  </div>
                  
                  <div className="flex-1 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg">{apt.service.name}</h3>
                        <Badge variant={
                          apt.status === 'confirmed' ? 'default' : 
                          apt.status === 'completed' ? 'secondary' : 'outline'
                        }>
                          {apt.status}
                        </Badge>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Scissors className="w-4 h-4" />
                          <span>{apt.barber.shopName}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          <span>{format(new Date(apt.startTime), "HH:mm")} - {format(new Date(apt.endTime), "HH:mm")}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4" />
                          <span>{apt.barber.location}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-1">
                      <span className="font-bold text-lg">€{Number(apt.service.price).toFixed(2)}</span>
                      {apt.status === 'pending' && (
                        <span className="text-xs text-amber-600 font-medium">Awaiting confirmation</span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
