import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "wouter";
import { insertBarberSchema } from "@shared/schema";
import { useCreateBarber } from "@/hooks/use-barbers";
import { useAuth } from "@/hooks/use-auth";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { z } from "zod";

export default function JoinBarber() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const createBarber = useCreateBarber();

  const form = useForm<z.infer<typeof insertBarberSchema>>({
    resolver: zodResolver(insertBarberSchema),
    defaultValues: {
      shopName: "",
      bio: "",
      location: "",
      address: "",
      city: "",
      country: "Germany",
      workingHours: {
        monday: { start: "09:00", end: "18:00", isOpen: true },
        tuesday: { start: "09:00", end: "18:00", isOpen: true },
        wednesday: { start: "09:00", end: "18:00", isOpen: true },
        thursday: { start: "09:00", end: "18:00", isOpen: true },
        friday: { start: "09:00", end: "18:00", isOpen: true },
        saturday: { start: "10:00", end: "16:00", isOpen: true },
        sunday: { start: "00:00", end: "00:00", isOpen: false },
      }
    },
  });

  async function onSubmit(values: z.infer<typeof insertBarberSchema>) {
    if (!user) {
      toast({ title: "Please log in first", variant: "destructive" });
      return;
    }

    try {
      const barber = await createBarber.mutateAsync(values);
      toast({
        title: "Profile Created!",
        description: "Welcome to Cuts & Co. Let's set up your services.",
      });
      setLocation(`/dashboard/barber/${barber.id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create profile",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-display font-bold mb-4">Join as a Barber</h1>
          <p className="text-muted-foreground">
            Create your professional profile, manage appointments, and grow your business.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="shopName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shop Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Master Cuts Berlin" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Berlin" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? 'Germany'} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street Address</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Alexanderplatz 1" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Location</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Berlin, Mitte" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is what customers will see in search results.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Tell customers about your experience and style..." 
                      className="min-h-[120px]"
                      {...field} 
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" size="lg" className="w-full" disabled={createBarber.isPending}>
              {createBarber.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Profile
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
