import { useState } from "react";
import { Event, useGetEventRsvpCount, getGetEventRsvpCountQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { MapPin, Calendar, ExternalLink, Users, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { RsvpModal } from "@/components/rsvp-modal";

interface EventCardProps {
  event: Event;
  index?: number;
  isPast?: boolean;
}

export function EventCard({ event, index = 0, isPast = false }: EventCardProps) {
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const eventDate = new Date(event.eventDate);

  const { data: rsvpCount } = useGetEventRsvpCount(event.id, {
    query: {
      queryKey: getGetEventRsvpCountQueryKey(event.id),
      enabled: !isPast,
    },
  });

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="h-full"
      >
        <Card className="h-full flex flex-col hover:shadow-md transition-shadow duration-300 border-border/50">
          <CardHeader className="bg-primary/5 pb-6">
            <CardTitle className="font-serif text-2xl text-primary mb-4">{event.title}</CardTitle>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-secondary" />
                <span>{format(eventDate, "MMMM d, yyyy 'at' h:mm a")}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                <span>{event.location}</span>
              </div>
              {!isPast && rsvpCount !== undefined && (
                <div className="flex items-center gap-2 pt-1">
                  <Users className="w-4 h-4 text-secondary" />
                  <span className="text-secondary font-medium">
                    {rsvpCount.rsvpCount === 0
                      ? "Be the first to RSVP!"
                      : `${rsvpCount.rsvpCount} ${rsvpCount.rsvpCount === 1 ? "person" : "people"} registered${rsvpCount.totalGuests > rsvpCount.rsvpCount ? ` · ${rsvpCount.totalGuests} guests total` : ""}`}
                  </span>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="flex-1 pt-6 flex flex-col gap-3">
            <p className="text-muted-foreground leading-relaxed flex-1">
              {event.description}
            </p>

            {!isPast && (
              <Button
                onClick={() => setRsvpOpen(true)}
                className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                RSVP for this Event
              </Button>
            )}

            {event.registrationUrl && (
              <Button asChild variant="outline" className="w-full border-secondary/50 text-secondary hover:bg-secondary/10">
                <a href={event.registrationUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                  External Registration <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <RsvpModal event={event} open={rsvpOpen} onClose={() => setRsvpOpen(false)} />
    </>
  );
}
