import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useBarbers } from "@/hooks/use-barbers";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, Scissors, LogOut, User, Calendar } from "lucide-react";

export function Navigation() {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  
  // Check if current user is a barber
  // In a real app we'd have a specific "me" endpoint for this, 
  // but for now we'll check if any barber has the current user's ID
  const { data: barbers } = useBarbers();
  const userBarberProfile = barbers?.find(b => b.userId === user?.id);
  const isBarber = !!userBarberProfile;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-lg">
              <Scissors className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">Cuts & Co.</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/find-barbers" className={`text-sm font-medium transition-colors hover:text-primary ${location === '/find-barbers' ? 'text-primary' : 'text-muted-foreground'}`}>
              Find a Barber
            </Link>
            <Link href="/pricing" className={`text-sm font-medium transition-colors hover:text-primary ${location === '/pricing' ? 'text-primary' : 'text-muted-foreground'}`}>
              Pricing
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full" data-testid="button-user-menu">
                  <Avatar className="h-10 w-10 border border-border">
                    <AvatarImage src={user.profileImageUrl || undefined} />
                    <AvatarFallback>{user.firstName?.[0]}{user.lastName?.[0]}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex flex-col space-y-1 p-2">
                  <p className="text-sm font-medium leading-none">{user.firstName} {user.lastName}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/customer">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>My Appointments</span>
                  </Link>
                </DropdownMenuItem>
                
                {isBarber ? (
                  <DropdownMenuItem asChild>
                    <Link href={`/dashboard/barber/${userBarberProfile.id}`}>
                      <Scissors className="mr-2 h-4 w-4" />
                      <span>Barber Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem asChild>
                    <Link href="/join-as-barber">
                      <Scissors className="mr-2 h-4 w-4" />
                      <span>Join as Barber</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()} className="text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <a href="/api/login">
              <Button data-testid="button-login">Sign In</Button>
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}
