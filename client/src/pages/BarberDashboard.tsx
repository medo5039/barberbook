import { useRoute, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useBarber, useBarberStats } from "@/hooks/use-barbers";
import { useAppointments, useUpdateAppointmentStatus } from "@/hooks/use-appointments";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Calendar as CalendarIcon, DollarSign, Users, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function BarberDashboard() {
  const [, params] = useRoute("/dashboard/barber/:id");
  const [, setLocation] = useLocation();
  const barberId = Number(params?.id);
  
  const { user, isLoading: loadingAuth } = useAuth();
  const { data: barber, isLoading: loadingBarber } = useBarber(barberId);
  const { data: stats } = useBarberStats(barberId);
  const { data: appointments, isLoading: loadingAppts } = useAppointments('barber');
  const updateStatus = useUpdateAppointmentStatus();

  if (loadingAuth || loadingBarber) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>;

  // Simple security check (in real app, backend handles this)
  if (!user || (barber && barber.userId !== user.id)) {
    setLocation("/");
    return null;
  }

  const handleStatusUpdate = (id: number, status: "confirmed" | "cancelled" | "completed") => {
    updateStatus.mutate({ id, status });
  };

  return (
    <div className="min-h-screen bg-muted/10">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-display font-bold">Barber Dashboard</h1>
          <Button variant="outline">Manage Services</Button>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€{stats?.totalRevenue?.toFixed(2) || "0.00"}</div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Appointments</CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalAppointments || 0}</div>
              <p className="text-xs text-muted-foreground">+12 since last week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Popular Service</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold truncate">
                {stats?.popularServices?.[0]?.name || "N/A"}
              </div>
              <p className="text-xs text-muted-foreground">Most booked this month</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Appointments */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingAppts ? (
                <Loader2 className="animate-spin mx-auto" />
              ) : appointments?.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No appointments found.</p>
              ) : (
                <div className="space-y-4">
                  {appointments?.slice(0, 5).map((apt) => (
                    <div key={apt.id} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg border">
                      <div className="space-y-1">
                        <p className="font-medium">{format(new Date(apt.startTime), "MMM d, HH:mm")}</p>
                        <p className="text-sm text-muted-foreground">{apt.service.name} • {apt.service.durationMinutes}m</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={
                          apt.status === 'confirmed' ? 'default' : 
                          apt.status === 'completed' ? 'secondary' : 'outline'
                        }>
                          {apt.status}
                        </Badge>
                        {apt.status === 'pending' && (
                          <div className="flex gap-1">
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600" onClick={() => handleStatusUpdate(apt.id, 'confirmed')}>
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => handleStatusUpdate(apt.id, 'cancelled')}>
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Analytics Chart */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Services Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.popularServices || []}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
