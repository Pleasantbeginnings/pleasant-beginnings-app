import { useListEvents, getListEventsQueryKey } from "@workspace/api-client-react";
import { PageHeader } from "@/components/page-header";
import { EventCard } from "@/components/event-card";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarX } from "lucide-react";
import { motion } from "framer-motion";

export default function Events() {
  const { data: events, isLoading } = useListEvents({ query: { queryKey: getListEventsQueryKey() } });

  const upcomingEvents = events?.filter(e => new Date(e.eventDate) >= new Date()) || [];
  const pastEvents = events?.filter(e => new Date(e.eventDate) < new Date()) || [];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <PageHeader 
        title="Community Events" 
        description="Gather, learn, and grow with your neighbors at our upcoming activities."
      />

      <section className="py-20 px-4 md:px-8">
        <div className="container mx-auto">
          {isLoading ? (
            <div className="space-y-16">
              <div>
                <Skeleton className="h-10 w-64 mb-8" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[1, 2, 3].map(i => <Skeleton key={i} className="h-[300px] w-full rounded-xl" />)}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-20">
              {/* Upcoming Events */}
              <div>
                <h2 className="font-serif text-3xl font-bold text-primary mb-8 border-b border-border pb-4">Upcoming Events</h2>
                
                {upcomingEvents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {upcomingEvents.map((event, index) => (
                      <EventCard key={event.id} event={event} index={index} />
                    ))}
                  </div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-16 text-center bg-muted/30 rounded-xl border border-border/50"
                  >
                    <CalendarX className="w-12 h-12 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-medium text-foreground mb-2">No upcoming events</h3>
                    <p className="text-muted-foreground">Check back soon for new community gatherings and workshops.</p>
                  </motion.div>
                )}
              </div>

              {/* Past Events */}
              {pastEvents.length > 0 && (
                <div>
                  <h2 className="font-serif text-3xl font-bold text-primary mb-8 border-b border-border pb-4">Past Events</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 opacity-70">
                    {pastEvents.map((event, index) => (
                      <EventCard key={event.id} event={event} index={index} isPast />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}