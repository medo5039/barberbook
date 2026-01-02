import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useCreateAppointment } from "@/hooks/use-appointments";
import { useAuth } from "@/hooks/use-auth";
import { type Service, type Barber } from "@shared/schema";
import { Loader2 } from "lucide-react";
import { insertAppointmentSchema } from "@shared/schema";

interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  barber: Barber;
  service: Service;
}

const formSchema = z.object({
  date: z.date({ required_error: "A date is required" }),
  timeSlot: z.string({ required_error: "Please select a time" }),
  notes: z.string().optional(),
});

export function BookingDialog({ open, onOpenChange, barber, service }: BookingDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const createAppointment = useCreateAppointment();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  // Mock time slots generation - in real app would check availability
  const timeSlots = [
    "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"
  ];

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to book an appointment.",
        variant: "destructive",
      });
      return;
    }

    try {
      const [hours, minutes] = values.timeSlot.split(":").map(Number);
      const startTime = new Date(values.date);
      startTime.setHours(hours, minutes, 0, 0);
      
      const endTime = new Date(startTime);
      endTime.setMinutes(endTime.getMinutes() + service.durationMinutes);

      await createAppointment.mutateAsync({
        barberId: barber.id,
        serviceId: service.id,
        customerId: user.id, // Using the user ID from auth
        startTime,
        endTime,
        notes: values.notes || null,
        status: "pending"
      });

      toast({
        title: "Appointment Requested!",
        description: "The barber will confirm your booking shortly.",
      });
      onOpenChange(false);
      form.reset();
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Book Appointment</DialogTitle>
          <DialogDescription>
            {service.name} with {barber.shopName} ({service.durationMinutes} mins)
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                      className="rounded-md border self-center"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="timeSlot"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {timeSlots.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="bg-muted p-3 rounded-lg text-sm space-y-2">
                  <div className="flex justify-between">
                    <span>Service Price</span>
                    <span className="font-semibold">€{Number(service.price).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Booking Fee</span>
                    <span className="font-semibold">€1.00</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold">
                    <span>Total</span>
                    <span>€{(Number(service.price) + 1).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="submit" className="w-full" disabled={createAppointment.isPending}>
                {createAppointment.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Confirm Booking
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
