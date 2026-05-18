import { useState } from "react";
import { useGetSummaryStats, getGetSummaryStatsQueryKey, useListUpcomingEvents, getListUpcomingEventsQueryKey, useListPrograms, getListProgramsQueryKey, useSubscribeNewsletter, useListSuccessStories, getListSuccessStoriesQueryKey, useListGallery, getListGalleryQueryKey } from "@workspace/api-client-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ProgramCard } from "@/components/program-card";
import { EventCard } from "@/components/event-card";
import { ArrowRight, HeartHandshake, Users, Quote, Images } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useCountUp } from "@/hooks/use-count-up";

function StatCounter({ value, suffix = "", label, delay = 0, color = "text-primary" }: {
  value: number;
  suffix?: string;
  label: string;
  delay?: number;
  color?: string;
}) {
  const { ref, count } = useCountUp(value, 2000);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="text-center"
    >
      <div className={`text-4xl md:text-5xl font-serif font-bold mb-2 ${color}`}>
        {count}{suffix}
      </div>
      <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{label}</div>
    </motion.div>
  );
}

export default function Home() {
  const { data: stats, isLoading: statsLoading } = useGetSummaryStats({ query: { queryKey: getGetSummaryStatsQueryKey() } });
  const { data: upcomingEvents, isLoading: eventsLoading } = useListUpcomingEvents({ query: { queryKey: getListUpcomingEventsQueryKey() } });
  const { data: programs, isLoading: programsLoading } = useListPrograms({ query: { queryKey: getListProgramsQueryKey() } });
  const { data: stories, isLoading: storiesLoading } = useListSuccessStories({ query: { queryKey: getListSuccessStoriesQueryKey() } });
  const { data: galleryImages = [] } = useListGallery({ query: { queryKey: getListGalleryQueryKey() } });

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [subscribeStatus, setSubscribeStatus] = useState<"idle" | "success" | "already_subscribed" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const subscribeMutation = useSubscribeNewsletter();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribeStatus("idle");
    setErrorMessage("");
    subscribeMutation.mutate({ data: { email, firstName } }, {
      onSuccess: (data) => {
        setSubscribeStatus(data.alreadySubscribed ? "already_subscribed" : "success");
      },
      onError: () => {
        setSubscribeStatus("error");
        setErrorMessage("An error occurred. Please try again.");
      }
    });
  };

  const featuredPrograms = programs?.slice(0, 3);
  const featuredStories = stories?.slice(0, 3) || [];
  const previewImages = galleryImages.slice(0, 6);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-primary text-primary-foreground py-32 px-4 md:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="container mx-auto max-w-5xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center"
          >
            <span className="inline-block py-1 px-3 rounded-full bg-secondary/20 text-secondary border border-secondary/30 text-sm font-semibold tracking-wider mb-6">
              BALTIMORE, MARYLAND
            </span>
            <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 text-white leading-tight">
              Preparing for a <span className="text-secondary italic">Better Tomorrow</span>
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/80 mb-10 max-w-3xl mx-auto font-light leading-relaxed">
              We are a community-centered home serving youth and families. Everyone is expected, and everyone belongs.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/programs">
                <Button size="lg" className="w-full sm:w-auto bg-secondary text-secondary-foreground hover:bg-secondary/90 text-lg px-8 py-6 h-auto">
                  Explore Our Programs
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10 text-lg px-8 py-6 h-auto">
                  Get Help Today
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-16 bg-muted px-4 md:px-8 border-y border-border/50">
        <div className="container mx-auto">
          {statsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="text-center space-y-2">
                  <Skeleton className="h-12 w-24 mx-auto" />
                  <Skeleton className="h-4 w-32 mx-auto" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <StatCounter value={stats?.yearsServing ?? 10} suffix="+" label="Years Serving" delay={0.1} color="text-primary" />
              <StatCounter value={stats?.totalPrograms ?? 7} label="Core Programs" delay={0.2} color="text-secondary" />
              <StatCounter value={stats?.totalVolunteers ?? 0} label="Volunteers" delay={0.3} color="text-primary" />
              <StatCounter value={stats?.totalContacts ?? 0} label="Families Reached" delay={0.4} color="text-secondary" />
            </div>
          )}
        </div>
      </section>

      {/* Featured Programs */}
      <section className="py-24 px-4 md:px-8 bg-background">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="max-w-2xl">
              <h2 className="font-serif text-4xl font-bold text-primary mb-4">Our Work in the Community</h2>
              <p className="text-lg text-muted-foreground">
                We provide wraparound support through seven core programs designed to uplift families and empower youth.
              </p>
            </div>
            <Link href="/programs">
              <Button variant="ghost" className="text-primary hover:text-secondary group">
                View All Programs <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          {programsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-[400px] w-full rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredPrograms?.map((program, index) => (
                <ProgramCard key={program.id} program={program} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-24 px-4 md:px-8 bg-muted border-t border-border/50">
        <div className="container mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-serif text-4xl font-bold text-primary mb-4">Join Us</h2>
            <p className="text-lg text-muted-foreground">
              Connect with your neighbors at our upcoming community events.
            </p>
          </div>

          {eventsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-[300px] w-full rounded-xl" />
              ))}
            </div>
          ) : upcomingEvents && upcomingEvents.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {upcomingEvents.map((event, index) => (
                  <EventCard key={event.id} event={event} index={index} />
                ))}
              </div>
              <div className="text-center">
                <Link href="/events">
                  <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                    See All Events
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12 bg-background rounded-xl border border-border/50">
              <p className="text-muted-foreground text-lg mb-4">No upcoming events at the moment.</p>
              <Link href="/events">
                <Button variant="outline">View Past Events</Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Gallery Preview — live from DB */}
      {previewImages.length > 0 && (
        <section className="py-24 px-4 md:px-8 bg-background border-t border-border/50">
          <div className="container mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="font-serif text-4xl font-bold text-primary mb-4">A Glimpse of Our Work</h2>
              <p className="text-lg text-muted-foreground">
                See the impact happening every day in Baltimore.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
              {previewImages.map((image, index) => (
                <Link href="/gallery" key={image.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08, duration: 0.5 }}
                    className="relative group overflow-hidden rounded-xl shadow-sm cursor-pointer h-56 md:h-64"
                  >
                    <img
                      src={`/api/storage${image.objectPath}`}
                      alt={image.caption}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-primary/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                      <span className="text-secondary text-xs font-bold uppercase tracking-wider mb-1">
                        {image.category}
                      </span>
                      <p className="text-white font-medium leading-snug text-sm">
                        {image.caption}
                      </p>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
            <div className="text-center">
              <Link href="/gallery">
                <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-8 text-lg h-12">
                  View Full Gallery
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Gallery CTA if no photos yet — just a quiet teaser */}
      {previewImages.length === 0 && (
        <section className="py-16 px-4 md:px-8 bg-background border-t border-border/50">
          <div className="container mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col items-center gap-4"
            >
              <Images className="w-12 h-12 text-secondary/60" />
              <h2 className="font-serif text-3xl font-bold text-primary">Photos Coming Soon</h2>
              <p className="text-muted-foreground max-w-md">
                We're documenting our work in the community. Check back to see our gallery grow.
              </p>
              <Link href="/gallery">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground mt-2">
                  Visit Gallery
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* Success Stories Preview */}
      <section className="py-24 px-4 md:px-8 bg-muted border-t border-border/50">
        <div className="container mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-serif text-4xl font-bold text-primary mb-4">Stories of Impact</h2>
            <p className="text-lg text-muted-foreground">
              Hear from the people whose lives have been changed.
            </p>
          </div>

          {storiesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-[250px] w-full rounded-xl" />
              ))}
            </div>
          ) : featuredStories.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {featuredStories.map((story, index) => (
                  <motion.div
                    key={story.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="bg-card text-card-foreground p-8 rounded-xl shadow-sm border-l-4 border-[#C9A84C] relative flex flex-col h-full"
                  >
                    <Quote className="w-10 h-10 text-[#C9A84C] opacity-20 absolute top-4 left-4" />
                    <div className="relative z-10 flex-1">
                      <p className="font-sans text-foreground/80 mb-6 italic leading-relaxed text-lg">
                        "{story.quote}"
                      </p>
                    </div>
                    <div className="mt-auto pt-6 border-t border-border/50">
                      <p className="font-sans font-bold text-[#C9A84C] text-lg">{story.name}</p>
                      {story.role && (
                        <p className="font-sans text-sm text-muted-foreground italic">{story.role}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="text-center">
                <Link href="/stories">
                  <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                    Read More Stories
                  </Button>
                </Link>
              </div>
            </>
          ) : null}
        </div>
      </section>

      {/* PBTV / Tea & Truth */}
      <section className="py-24 px-4 md:px-8 bg-primary text-primary-foreground border-t border-primary-foreground/10">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-sm font-semibold tracking-widest text-secondary uppercase mb-3">PBTV · 4CornersTV</p>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-6">
                Tea &amp; Truth<br /><span className="text-secondary italic">with BJ Dawkins</span>
              </h2>
              <p className="text-primary-foreground/70 text-lg leading-relaxed mb-8">
                Watch our original talk show streaming globally on 4CornersTV — the Pleasant Beginnings media platform bringing real conversations about community, culture, and change to audiences worldwide.
              </p>
              <a
                href="https://4cornerstv.net/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors px-8 py-4 font-semibold text-lg rounded-md"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                Watch on 4CornersTV
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <a
                href="https://4cornerstv.net/"
                target="_blank"
                rel="noopener noreferrer"
                className="block relative rounded-2xl overflow-hidden border border-secondary/20 shadow-2xl group"
              >
                <div className="aspect-video bg-primary-foreground/5 flex flex-col items-center justify-center gap-4 p-8">
                  <div className="w-20 h-20 rounded-full bg-secondary/20 border-2 border-secondary/40 flex items-center justify-center group-hover:bg-secondary/30 transition-colors">
                    <svg className="w-8 h-8 text-secondary ml-1" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="font-serif text-2xl font-bold text-white mb-1">Tea &amp; Truth</p>
                    <p className="text-secondary text-sm font-medium tracking-wider uppercase">Now Streaming · 4CornersTV</p>
                  </div>
                </div>
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-secondary/30 rounded-2xl transition-colors pointer-events-none" />
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-24 px-4 md:px-8 bg-muted border-t border-border/50">
        <div className="container mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-sm font-semibold tracking-widest text-secondary uppercase mb-3">Our Network</p>
            <h2 className="font-serif text-4xl font-bold text-primary mb-4">Key Partners</h2>
            <p className="text-lg text-muted-foreground">
              We are proud to work alongside organizations committed to building a stronger Baltimore.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { name: "Baltimore Ravens", role: "Community Partner" },
              { name: "Win Waste", role: "Corporate Partner" },
              { name: "NexTech Academy", role: "Workforce Development Partner" },
              { name: "Redesigning Minds", role: "Behavioral Health Partner" },
              { name: "Johns Hopkins Medi System", role: "Resource & Referral Partner" },
              { name: "4CornersTV", role: "Global Media Partner" },
              { name: "Bombcity", role: "Fashion Meets Philanthropy" },
              { name: "Stitch by Stitch Network", role: "Creative Economy Partner" },
            ].map((partner, index) => (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.07, duration: 0.4 }}
                className="bg-background border border-border/60 rounded-xl p-6 flex flex-col gap-2 hover:border-secondary/40 hover:shadow-sm transition-all"
              >
                <div className="w-10 h-1 bg-secondary rounded-full mb-1" />
                <p className="font-serif text-lg font-bold text-primary leading-snug">{partner.name}</p>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{partner.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-24 px-4 md:px-8 bg-[#0D1B2A] text-white">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4 text-[#D4AF37]">Stay Connected</h2>
            <p className="text-lg md:text-xl font-sans font-light text-white/80 mb-10">
              Get updates on programs, events, and opportunities — delivered to your inbox.
            </p>

            {subscribeStatus === "success" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/10 p-6 rounded-lg border border-white/20"
              >
                <p className="text-xl font-serif text-[#D4AF37]">You're in! We'll keep you in the loop.</p>
              </motion.div>
            ) : subscribeStatus === "already_subscribed" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/10 p-6 rounded-lg border border-white/20"
              >
                <p className="text-xl font-serif text-[#D4AF37]">You're already on the list — thank you!</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
                <input
                  type="text"
                  placeholder="First Name (Optional)"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="flex-1 bg-white/5 border border-white/20 rounded-md px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
                <input
                  type="email"
                  placeholder="Email Address (Required)"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-white/5 border border-white/20 rounded-md px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
                <Button
                  type="submit"
                  disabled={subscribeMutation.isPending}
                  className="bg-[#D4AF37] text-[#0D1B2A] hover:bg-[#D4AF37]/90 px-8 py-3 h-auto text-lg font-medium"
                >
                  {subscribeMutation.isPending ? "Subscribing..." : "Subscribe"}
                </Button>
              </form>
            )}
            {subscribeStatus === "error" && (
              <p className="text-red-400 mt-4">{errorMessage}</p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Call to Action Strip */}
      <section className="grid grid-cols-1 md:grid-cols-2">
        <div className="bg-primary text-primary-foreground py-20 px-8 flex flex-col items-center justify-center text-center">
          <HeartHandshake className="w-16 h-16 text-secondary mb-6" />
          <h3 className="font-serif text-3xl font-bold mb-4">Need Support?</h3>
          <p className="text-primary-foreground/80 mb-8 max-w-md">
            Whether you need housing resources, workforce training, or mental health support, we are here for you.
          </p>
          <Link href="/contact">
            <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 w-full sm:w-auto">
              Reach Out to Us
            </Button>
          </Link>
        </div>
        <div className="bg-secondary text-secondary-foreground py-20 px-8 flex flex-col items-center justify-center text-center">
          <Users className="w-16 h-16 text-primary mb-6" />
          <h3 className="font-serif text-3xl font-bold mb-4 text-primary">Want to Give Back?</h3>
          <p className="text-secondary-foreground/80 mb-8 max-w-md">
            Our work is made possible by dedicated volunteers. Join us in preparing our community for a better tomorrow.
          </p>
          <Link href="/volunteer">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto border-none">
              Become a Volunteer
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
