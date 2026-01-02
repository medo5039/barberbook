import { Link } from "wouter";
import { type Barber } from "@shared/schema";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Star, Clock } from "lucide-react";

interface BarberCardProps {
  barber: Barber;
}

export function BarberCard({ barber }: BarberCardProps) {
  // Parsing working hours just to show a status
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const hours = barber.workingHours?.[today] || null;
  const isOpen = hours?.isOpen;

  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300 border-border/50">
      <div className="aspect-[4/3] bg-muted relative overflow-hidden">
        {/* Placeholder gradient since we don't have real images yet */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary transition-transform group-hover:scale-105 duration-500" />
        
        {/* Initials as fallback */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl font-display font-bold text-muted-foreground/20">
            {barber.shopName.substring(0, 2).toUpperCase()}
          </span>
        </div>

        {barber.isVerified && (
          <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground shadow-sm">
            Verified
          </Badge>
        )}
      </div>

      <CardHeader className="p-5 pb-2">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-display font-bold text-xl truncate">{barber.shopName}</h3>
          <div className="flex items-center gap-1 text-amber-500 text-sm font-bold">
            <Star className="w-4 h-4 fill-current" />
            <span>5.0</span>
          </div>
        </div>
        <div className="flex items-center text-muted-foreground text-sm gap-1">
          <MapPin className="w-4 h-4" />
          <span className="truncate">{barber.location}</span>
        </div>
      </CardHeader>

      <CardContent className="p-5 py-2">
        <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
          {barber.bio || "Professional barber providing excellent grooming services."}
        </p>
      </CardContent>

      <CardFooter className="p-5 pt-4 flex items-center justify-between border-t bg-muted/20">
        <div className="flex items-center gap-2 text-xs font-medium">
          <Clock className="w-3.5 h-3.5" />
          <span className={isOpen ? "text-green-600" : "text-muted-foreground"}>
            {isOpen ? `Open · Closes ${hours.end}` : "Closed today"}
          </span>
        </div>
        <Link href={`/barber/${barber.id}`}>
          <Button size="sm" className="font-semibold">Book Now</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
