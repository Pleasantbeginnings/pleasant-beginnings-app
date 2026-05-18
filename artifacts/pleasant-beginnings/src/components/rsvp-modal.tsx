import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateEventRsvp, getGetEventRsvpCountQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Loader2, Users } from "lucide-react";
import { format } from "date-fns";
import type { Event } from "@workspace/api-client-react";

interface RsvpModalProps {
  event: Event;
  open: boolean;
  onClose: () => void;
}

export function RsvpModal({ event, open, onClose }: RsvpModalProps) {
  const qc = useQueryClient();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", guestCount: 1 });
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState("");

  const mutation = useCreateEventRsvp({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: getGetEventRsvpCountQueryKey(event.id) });
        setDone(true);
        setServerError("");
      },
      onError: async (err: unknown) => {
        const res = err as Response;
        try {
          const json = await res.json();
          setServerError(json?.error ?? "Something went wrong. Please try again.");
        } catch {
          setServerError("Something went wrong. Please try again.");
        }
      },
    },
  });

  const handleClose = () => {
    setDone(false);
    setForm({ firstName: "", lastName: "", email: "", guestCount: 1 });
    setServerError("");
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");
    mutation.mutate({ id: event.id, data: { ...form } });
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-primary">
            {done ? "You're registered!" : "RSVP for this Event"}
          </DialogTitle>
        </DialogHeader>

        {done ? (
          <div className="flex flex-col items-center text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-foreground text-lg">
                See you there, {form.firstName}!
              </p>
              <p className="text-muted-foreground text-sm mt-1">
                <strong>{event.title}</strong><br />
                {format(new Date(event.eventDate), "EEEE, MMMM d 'at' h:mm a")}
              </p>
              {form.guestCount > 1 && (
                <p className="text-sm text-secondary mt-2 flex items-center justify-center gap-1">
                  <Users className="w-4 h-4" />
                  {form.guestCount} guests registered
                </p>
              )}
            </div>
            <Button onClick={handleClose} className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90">
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="rounded-lg bg-muted px-4 py-3 text-sm text-muted-foreground">
              <p className="font-semibold text-foreground">{event.title}</p>
              <p>{format(new Date(event.eventDate), "EEEE, MMMM d, yyyy 'at' h:mm a")}</p>
              <p>{event.location}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="rsvp-first">First Name</Label>
                <Input
                  id="rsvp-first"
                  placeholder="First"
                  required
                  value={form.firstName}
                  onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="rsvp-last">Last Name</Label>
                <Input
                  id="rsvp-last"
                  placeholder="Last"
                  required
                  value={form.lastName}
                  onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="rsvp-email">Email Address</Label>
              <Input
                id="rsvp-email"
                type="email"
                placeholder="you@example.com"
                required
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="rsvp-guests">Number of Guests (including yourself)</Label>
              <Input
                id="rsvp-guests"
                type="number"
                min={1}
                max={10}
                value={form.guestCount}
                onChange={(e) => setForm((f) => ({ ...f, guestCount: parseInt(e.target.value, 10) || 1 }))}
              />
            </div>

            {serverError && (
              <p className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">
                {serverError}
              </p>
            )}

            <Button
              type="submit"
              className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 py-5"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Registering…</>
              ) : (
                "Confirm My RSVP"
              )}
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              One RSVP per email address per event.
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
