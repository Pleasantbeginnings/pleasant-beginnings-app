import { useRef } from "react";
import {
  useGetSummaryStats, getGetSummaryStatsQueryKey,
  useListPrograms, getListProgramsQueryKey,
  useListSuccessStories, getListSuccessStoriesQueryKey,
  useGetAnalyticsDashboard, getGetAnalyticsDashboardQueryKey,
} from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { useCountUp } from "@/hooks/use-count-up";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Printer, Award, Users, BookOpen, Heart, TrendingUp,
  Calendar, MapPin, Globe, CheckCircle2, Quote, Star,
} from "lucide-react";
import { format } from "date-fns";

const PROGRAMS_STATIC = [
  { name: "Truth University", category: "Entrepreneurship", icon: "💡", desc: "Equipping youth and adults with business skills, financial literacy, and an entrepreneurial mindset." },
  { name: "Podcast Academy", category: "Media & Communication", icon: "🎙️", desc: "Teaching storytelling, recording, and media production to amplify community voices." },
  { name: "Supreme Fitness", category: "Youth Wellness", icon: "🏃", desc: "Physical wellness programming that builds discipline, teamwork, and healthy habits." },
  { name: "Vocal University", category: "Performing Arts", icon: "🎤", desc: "Developing performance, confidence, and artistic expression through music and spoken word." },
  { name: "Mullyvation", category: "Mentorship", icon: "🤝", desc: "One-on-one and group mentorship connecting youth to career-ready professionals." },
  { name: "Officer-Civilian Engagement", category: "Community Safety", icon: "🛡️", desc: "Building trust and dialogue between law enforcement and the Baltimore community." },
  { name: "ISA Sports Agency", category: "Sports & Career", icon: "🏆", desc: "Guiding student-athletes through academic success, brand building, and professional pathways." },
];

const MILESTONES = [
  { year: "2020", title: "Organization Founded", desc: "Taneisha \"TeeLee\" Lee establishes Pleasant Beginnings Inc. in Baltimore, MD with a mission to prepare families for a better tomorrow." },
  { year: "2021", title: "501(c)(3) Status Granted", desc: "The IRS grants federal tax-exempt status, validating our governance and public charity mission." },
  { year: "2022", title: "First Programs Launch", desc: "Truth University and Podcast Academy launch, serving our first cohort of Baltimore youth and young adults." },
  { year: "2023", title: "Program Expansion", desc: "Supreme Fitness, Vocal University, and Officer-Civilian Engagement added — reaching deeper into Baltimore communities." },
  { year: "2024", title: "Major Partnerships", desc: "Formalized partnerships with the Baltimore Ravens, Johns Hopkins Medical System, and NexTech Academy for workforce development." },
  { year: "2025", title: "Media Platform Launch", desc: "PBTV launches on 4CornersTV with 'Tea & Truth with BJ Dawkins,' bringing Baltimore voices to a global audience." },
];

const PARTNERS = [
  { name: "Baltimore Ravens", role: "NFL Community Partner", icon: "🏈" },
  { name: "Johns Hopkins Medical System", role: "Health Resource & Referral Partner", icon: "🏥" },
  { name: "NexTech Academy", role: "Workforce Development Partner", icon: "💻" },
  { name: "4CornersTV / PBTV", role: "Media & Broadcasting Partner", icon: "📺" },
];

function CounterStat({ value, suffix = "", label, delay = 0 }: {
  value: number; suffix?: string; label: string; delay?: number;
}) {
  const { ref, count } = useCountUp(value, 1800);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.45 }}
      className="text-center"
    >
      <div className="text-5xl font-serif font-bold text-secondary mb-1">{count}{suffix}</div>
      <div className="text-sm font-semibold text-primary-foreground/70 uppercase tracking-widest">{label}</div>
    </motion.div>
  );
}

export default function ImpactReport() {
  const printRef = useRef<HTMLDivElement>(null);
  const { data: stats, isLoading: statsLoading } = useGetSummaryStats({ query: { queryKey: getGetSummaryStatsQueryKey() } });
  const { data: programs, isLoading: programsLoading } = useListPrograms({ query: { queryKey: getListProgramsQueryKey() } });
  const { data: stories, isLoading: storiesLoading } = useListSuccessStories({ query: { queryKey: getListSuccessStoriesQueryKey() } });
  const { data: analytics } = useGetAnalyticsDashboard({ query: { queryKey: getGetAnalyticsDashboardQueryKey() } });

  const totalRsvps = analytics?.rsvpsByEvent.reduce((s, e) => s + e.rsvpCount, 0) ?? 0;
  const totalGuests = analytics?.rsvpsByEvent.reduce((s, e) => s + e.totalGuests, 0) ?? 0;
  const displayPrograms = programs?.length ? programs : PROGRAMS_STATIC.map((p, i) => ({ id: i, ...p, active: true, description: p.desc }));
  const featuredStories = stories?.filter((s) => s.active).slice(0, 3) ?? [];

  const handlePrint = () => window.print();

  return (
    <>
      {/* Print-only global styles */}
      <style>{`
        @media print {
          header, footer, nav, [data-no-print] { display: none !important; }
          body { background: white !important; }
          .print-page-break { page-break-before: always; }
        }
      `}</style>

      <div ref={printRef} className="flex flex-col min-h-screen bg-background">

        {/* ── HERO ─────────────────────────────────────────────── */}
        <section className="bg-primary text-primary-foreground py-20 px-4 md:px-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 bg-[url('https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center" />
          <div className="container mx-auto max-w-5xl relative z-10">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <p className="text-secondary text-xs font-bold uppercase tracking-widest mb-3">Community Impact Report</p>
                <h1 className="font-serif text-5xl md:text-6xl font-bold text-secondary mb-3">
                  Pleasant Beginnings Inc.
                </h1>
                <p className="text-xl md:text-2xl text-primary-foreground/80 italic font-serif mb-6">
                  "Preparing for a Better Tomorrow."
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-primary-foreground/60">
                  <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-secondary" /> Baltimore, Maryland</span>
                  <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-secondary" /> 501(c)(3) · EIN: 86-2300371</span>
                  <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-secondary" /> Founded 2020 · Report: {format(new Date(), "MMMM yyyy")}</span>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                data-no-print
                className="shrink-0"
              >
                <Button
                  onClick={handlePrint}
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/90 gap-2 px-6 py-5 text-base font-semibold"
                >
                  <Printer className="w-4 h-4" />
                  Download / Print
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── KEY STATS ─────────────────────────────────────────── */}
        <section className="bg-primary py-16 px-4 md:px-8 border-t border-secondary/20">
          <div className="container mx-auto max-w-5xl">
            {statsLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[1,2,3,4].map(i => <Skeleton key={i} className="h-20 bg-primary-foreground/10 rounded-xl" />)}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                <CounterStat value={stats?.totalPrograms ?? 7} label="Active Programs" delay={0} />
                <CounterStat value={stats?.totalVolunteers ?? 0} label="Volunteers" delay={0.08} />
                <CounterStat value={stats?.totalContacts ?? 0} label="Families Reached" delay={0.16} />
                <CounterStat value={totalRsvps > 0 ? totalRsvps : stats?.upcomingEventsCount ?? 3} suffix={totalRsvps > 0 ? "+" : ""} label={totalRsvps > 0 ? "Event RSVPs" : "Upcoming Events"} delay={0.24} />
              </div>
            )}
          </div>
        </section>

        {/* ── MISSION & VISION ──────────────────────────────────── */}
        <section className="py-20 px-4 md:px-8 bg-background">
          <div className="container mx-auto max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="grid md:grid-cols-2 gap-10"
            >
              <div className="bg-muted rounded-2xl border border-border/60 p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Heart className="w-5 h-5 text-secondary" />
                  <h2 className="font-serif text-2xl font-bold text-primary">Our Mission</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed text-base">
                  Pleasant Beginnings Inc. is a Baltimore-based 501(c)(3) nonprofit dedicated to preparing youth, families,
                  and adults for a better tomorrow through entrepreneurship, creative economy programming, workforce
                  development, mental health support, and wraparound community services.
                </p>
              </div>
              <div className="bg-muted rounded-2xl border border-border/60 p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Globe className="w-5 h-5 text-secondary" />
                  <h2 className="font-serif text-2xl font-bold text-primary">Our Vision</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed text-base">
                  A Baltimore where every person — regardless of zip code — has access to the tools, mentorship, and
                  community connections needed to build a stable, fulfilling life. We believe in systemic change driven
                  by those who live and breathe the community every day.
                </p>
              </div>
            </motion.div>

            {/* Founder */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="mt-10 bg-primary text-primary-foreground rounded-2xl p-8 flex flex-col md:flex-row gap-6 items-start"
            >
              <div className="w-14 h-14 rounded-full bg-secondary/20 border-2 border-secondary flex items-center justify-center text-2xl shrink-0">
                👑
              </div>
              <div>
                <p className="text-secondary text-xs font-bold uppercase tracking-widest mb-1">Founder & President</p>
                <h3 className="font-serif text-2xl font-bold text-secondary mb-2">Taneisha "TeeLee" Lee</h3>
                <p className="text-primary-foreground/75 leading-relaxed text-sm max-w-2xl">
                  A lifelong Baltimore native and community advocate, TeeLee founded Pleasant Beginnings Inc. in 2020
                  after identifying critical gaps in resources for youth and families in underserved neighborhoods.
                  Her vision — a fully integrated, community-centered ecosystem — drives every program, partnership,
                  and initiative the organization pursues.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── PROGRAMS ──────────────────────────────────────────── */}
        <section className="py-20 px-4 md:px-8 bg-muted border-t border-border/50 print-page-break">
          <div className="container mx-auto max-w-5xl">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
              <div className="flex items-center gap-3 mb-3">
                <BookOpen className="w-5 h-5 text-secondary" />
                <p className="text-sm font-semibold tracking-widest text-secondary uppercase">Programming</p>
              </div>
              <h2 className="font-serif text-4xl font-bold text-primary">7 Programs. One Community Ecosystem.</h2>
              <p className="text-muted-foreground mt-3 max-w-2xl">
                Our seven signature programs span entrepreneurship, media, wellness, arts, mentorship, community safety,
                and sports — providing a holistic support system for every phase of life.
              </p>
            </motion.div>

            {programsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1,2,3,4,5,6,7].map(i => <Skeleton key={i} className="h-28 rounded-xl" />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(displayPrograms as typeof PROGRAMS_STATIC).map((prog, i) => {
                  const staticInfo = PROGRAMS_STATIC.find(p => p.name === prog.name);
                  return (
                    <motion.div
                      key={prog.id ?? i}
                      initial={{ opacity: 0, x: i % 2 === 0 ? -16 : 16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.06, duration: 0.4 }}
                      className="bg-background rounded-xl border border-border/60 p-5 flex items-start gap-4 hover:border-secondary/40 transition-colors"
                    >
                      <span className="text-2xl shrink-0 mt-0.5">{staticInfo?.icon ?? "✨"}</span>
                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-serif font-bold text-primary text-base">{prog.name}</h3>
                          <span className="text-xs bg-secondary/10 text-secondary border border-secondary/20 px-2 py-0.5 rounded-full font-medium">
                            {staticInfo?.category ?? (prog as { category?: string }).category ?? ""}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {staticInfo?.desc ?? prog.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* ── MILESTONES ────────────────────────────────────────── */}
        <section className="py-20 px-4 md:px-8 bg-background border-t border-border/50">
          <div className="container mx-auto max-w-5xl">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp className="w-5 h-5 text-secondary" />
                <p className="text-sm font-semibold tracking-widest text-secondary uppercase">Growth</p>
              </div>
              <h2 className="font-serif text-4xl font-bold text-primary">Our Journey, 2020 – 2025</h2>
            </motion.div>

            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-px bg-border hidden md:block" />
              <div className="space-y-8">
                {MILESTONES.map((m, i) => (
                  <motion.div
                    key={m.year}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.45 }}
                    className="flex gap-6 items-start md:ml-0"
                  >
                    <div className="flex flex-col items-center shrink-0 md:ml-0">
                      <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center z-10">
                        <span className="text-secondary font-bold font-serif text-sm">{m.year}</span>
                      </div>
                    </div>
                    <div className="bg-muted rounded-xl border border-border/60 p-5 flex-1 hover:border-secondary/30 transition-colors">
                      <h3 className="font-serif font-bold text-primary text-lg mb-1">{m.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{m.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── PARTNERSHIPS ──────────────────────────────────────── */}
        <section className="py-20 px-4 md:px-8 bg-muted border-t border-border/50 print-page-break">
          <div className="container mx-auto max-w-5xl">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
              <div className="flex items-center gap-3 mb-3">
                <Award className="w-5 h-5 text-secondary" />
                <p className="text-sm font-semibold tracking-widest text-secondary uppercase">Partnerships & Recognition</p>
              </div>
              <h2 className="font-serif text-4xl font-bold text-primary">Trusted by Baltimore's Leading Institutions</h2>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {PARTNERS.map((p, i) => (
                <motion.div
                  key={p.name}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  className="bg-background rounded-2xl border border-border/60 p-6 flex items-center gap-5 hover:border-secondary/40 hover:shadow-sm transition-all"
                >
                  <span className="text-3xl shrink-0">{p.icon}</span>
                  <div>
                    <h3 className="font-serif font-bold text-primary text-lg leading-snug">{p.name}</h3>
                    <p className="text-sm text-secondary font-medium mt-0.5">{p.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Credentials bar */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="mt-8 bg-primary rounded-2xl px-8 py-5 flex flex-wrap gap-6 items-center justify-between"
            >
              {[
                { icon: CheckCircle2, label: "IRS 501(c)(3) Certified Public Charity" },
                { icon: Star, label: "EIN: 86-2300371" },
                { icon: MapPin, label: "Baltimore City & County, MD" },
                { icon: Calendar, label: "Serving communities since 2020" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-primary-foreground/80 text-sm">
                  <item.icon className="w-4 h-4 text-secondary shrink-0" />
                  <span>{item.label}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── TESTIMONIALS ──────────────────────────────────────── */}
        {(storiesLoading || featuredStories.length > 0) && (
          <section className="py-20 px-4 md:px-8 bg-background border-t border-border/50">
            <div className="container mx-auto max-w-5xl">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
                <div className="flex items-center gap-3 mb-3">
                  <Quote className="w-5 h-5 text-secondary" />
                  <p className="text-sm font-semibold tracking-widest text-secondary uppercase">Community Voices</p>
                </div>
                <h2 className="font-serif text-4xl font-bold text-primary">What Our Community Says</h2>
              </motion.div>

              {storiesLoading ? (
                <div className="grid md:grid-cols-3 gap-6">
                  {[1,2,3].map(i => <Skeleton key={i} className="h-44 rounded-2xl" />)}
                </div>
              ) : (
                <div className="grid md:grid-cols-3 gap-6">
                  {featuredStories.map((story, i) => (
                    <motion.div
                      key={story.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, duration: 0.45 }}
                      className="bg-muted rounded-2xl border border-border/60 p-6 flex flex-col"
                    >
                      <Quote className="w-6 h-6 text-secondary/40 mb-3 shrink-0" />
                      <p className="text-muted-foreground italic leading-relaxed text-sm flex-1">"{story.quote}"</p>
                      <div className="mt-4 pt-4 border-t border-border/50">
                        <p className="font-semibold text-primary text-sm">{story.name}</p>
                        {story.role && <p className="text-xs text-secondary mt-0.5">{story.role}</p>}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── MEDIA & PRESENCE ──────────────────────────────────── */}
        <section className="py-20 px-4 md:px-8 bg-muted border-t border-border/50">
          <div className="container mx-auto max-w-5xl">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
              <div className="flex items-center gap-3 mb-3">
                <Globe className="w-5 h-5 text-secondary" />
                <p className="text-sm font-semibold tracking-widest text-secondary uppercase">Media & Presence</p>
              </div>
              <h2 className="font-serif text-4xl font-bold text-primary">Our Voice Beyond Baltimore</h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                className="bg-background rounded-2xl border border-border/60 p-7"
              >
                <h3 className="font-serif text-xl font-bold text-primary mb-2">PBTV on 4CornersTV</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  Pleasant Beginnings Television (PBTV) launched in 2025 on the globally distributed 4CornersTV network.
                  Our flagship show <em>Tea & Truth with BJ Dawkins</em> brings authentic Baltimore conversations to audiences worldwide,
                  amplifying the voices of our community and elevating the organization's reach far beyond Maryland.
                </p>
                <a href="https://4cornerstv.net/" target="_blank" rel="noopener noreferrer" className="text-sm text-secondary font-medium hover:underline">
                  Watch on 4CornersTV →
                </a>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                className="bg-background rounded-2xl border border-border/60 p-7"
              >
                <h3 className="font-serif text-xl font-bold text-primary mb-2">Social Media Reach</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  Follow us <strong>@pleasantbeginningsnonprofit</strong> on Instagram and Facebook for real-time updates,
                  program highlights, event announcements, and community impact stories. Our growing digital presence
                  connects Baltimore and beyond with our mission daily.
                </p>
                <div className="flex gap-4">
                  <a href="https://www.instagram.com/pleasantbeginningsnonprofit" target="_blank" rel="noopener noreferrer" className="text-sm text-secondary font-medium hover:underline">Instagram →</a>
                  <a href="https://www.facebook.com/pleasantbeginningsnonprofit" target="_blank" rel="noopener noreferrer" className="text-sm text-secondary font-medium hover:underline">Facebook →</a>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── CALL TO ACTION ────────────────────────────────────── */}
        <section className="py-20 px-4 md:px-8 bg-primary text-primary-foreground print-page-break">
          <div className="container mx-auto max-w-4xl text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="font-serif text-4xl font-bold text-secondary mb-4">Partner With Us</h2>
              <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
                Pleasant Beginnings Inc. is actively seeking grant funding, corporate sponsorships, and individual donors
                who believe in transformative community investment. Every dollar directly supports programming, operations,
                and the families we serve in Baltimore.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mb-10">
                {[
                  { icon: "💼", title: "Corporate Partnerships", desc: "Co-branded programming, sponsorship packages, and employee volunteer days." },
                  { icon: "📋", title: "Grant Funding", desc: "We welcome foundation and government grants aligned with education, workforce, and youth development." },
                  { icon: "❤️", title: "Individual Donors", desc: "Tax-deductible contributions directly fund program participants and operational needs." },
                ].map((item) => (
                  <div key={item.title} className="bg-primary-foreground/5 border border-primary-foreground/10 rounded-xl p-5">
                    <span className="text-2xl block mb-2">{item.icon}</span>
                    <h3 className="font-serif font-bold text-secondary mb-1 text-base">{item.title}</h3>
                    <p className="text-sm text-primary-foreground/70 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-primary-foreground/60">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-secondary" /> EIN: 86-2300371</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-secondary" /> 501(c)(3) Tax-Exempt</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-secondary" /> Admin@pleasantbeginnings.info</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-secondary" /> (410) 637-9113</span>
              </div>
            </motion.div>
          </div>
        </section>

      </div>
    </>
  );
}
