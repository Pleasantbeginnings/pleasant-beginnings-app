import { PageHeader } from "@/components/page-header";
import { motion } from "framer-motion";

const MILESTONES = [
  {
    year: "2020",
    title: "Founded",
    description:
      "Taneisha \"TeeLee\" Lee founded Pleasant Beginnings Inc. in Baltimore, MD with a singular vision: use entrepreneurship, creative expression, and wraparound services to break the cycle of youth violence.",
  },
  {
    year: "2021",
    title: "501(c)(3) Approved",
    description:
      "Pleasant Beginnings officially received federal 501(c)(3) nonprofit status, opening the door to grants, corporate partnerships, and expanded community impact.",
  },
  {
    year: "2022",
    title: "First Programs Take Root",
    description:
      "The organization launched its first cohort of youth programs — Truth University, Supreme Fitness, and Vocal University — bringing entrepreneurship, wellness, and performing arts to Baltimore youth for the first time.",
  },
  {
    year: "2023",
    title: "Programs Expand Across Baltimore",
    description:
      "Mullyvation and Officer-Civilian Engagement launched, deepening our reach into mentorship and community safety. Programs expanded across Baltimore City and Baltimore County, serving more families than ever.",
  },
  {
    year: "2024",
    title: "Partnerships & Full Program Suite",
    description:
      "Podcast Academy and ISA Sports Agency launched, completing all seven core programs. Formalized partnerships with the Baltimore Ravens, Johns Hopkins Medical System, NexTech Academy, and others solidified PB's place as a community institution.",
  },
  {
    year: "2025",
    title: "4CornersTV, PBTV & Global Reach",
    description:
      "All seven programs fully active. Pleasant Beginnings partnered with 4CornersTV to launch PBTV and bring Tea & Truth with BJ Dawkins to a global streaming audience. With 1,200+ lives impacted and 15+ partners, PB now reaches nationally and globally.",
  },
];

export default function About() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <PageHeader
        title="About Us"
        description="Learn about our mission, vision, and the people behind Pleasant Beginnings Inc."
      />

      {/* Mission & Vision */}
      <section className="py-20 px-4 md:px-8">
        <div className="container mx-auto max-w-4xl">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="bg-primary text-primary-foreground p-8 rounded-2xl"
            >
              <h2 className="font-serif text-3xl font-bold text-secondary mb-4">Our Mission</h2>
              <p className="text-lg leading-relaxed text-primary-foreground/90">
                To break cycles of violence in Baltimore and beyond by equipping youth, families, and communities with the tools, opportunities, and platforms they need to build sustainable futures — through entrepreneurship, creative expression, education, wellness, and wraparound support.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="bg-secondary text-secondary-foreground p-8 rounded-2xl"
            >
              <h2 className="font-serif text-3xl font-bold text-primary mb-4">Our Vision</h2>
              <p className="text-lg leading-relaxed text-secondary-foreground/90">
                A safer, stronger Baltimore — and a model for cities nationwide — where every young person has access to entrepreneurship, creative opportunity, and community support; where families are stable and resourced; and where the cycle of violence is replaced by a cycle of generational wealth, leadership, and purpose.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-20 px-4 md:px-8 bg-muted border-t border-border/50">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          >
            <p className="text-sm font-semibold tracking-widest text-secondary uppercase mb-3">Who We Are</p>
            <h2 className="font-serif text-4xl font-bold text-primary mb-6">A Community Ecosystem Built from the Ground Up</h2>
            <div className="space-y-5 text-muted-foreground text-lg leading-relaxed">
              <p>
                Pleasant Beginnings Inc. is a Baltimore-based 501(c)(3) nonprofit organization founded in 2020 by Taneisha "TeeLee" Lee. What began as a vision to reduce youth violence through entrepreneurship has grown into one of Baltimore's most comprehensive community ecosystems — spanning seven active youth programs, family services, behavioral health partnerships, creative economy platforms, workforce development, and global media.
              </p>
              <p>
                We serve youth from elementary through high school — and we serve their families too. Because we know the truth: a youth cannot thrive when their home is in crisis. So we work with the whole family unit, providing the stability behind the student.
              </p>
              <p>
                Pleasant Beginnings operates across Baltimore City, Baltimore County, and surrounding counties — with programs, partnerships, and platforms that reach nationally and globally through 4CornersTV and the Stitch by Stitch Creative Network.
              </p>
              <p className="font-medium text-foreground">
                We don't just run programs. We build the infrastructure that makes lasting change possible.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              {[
                { label: "Founded", value: "2020" },
                { label: "501(c)(3) Status", value: "Approved 2021" },
                { label: "Lives Impacted", value: "1,200+" },
                { label: "Active Partners", value: "15+" },
              ].map((item) => (
                <div key={item.label} className="bg-background p-6 rounded-xl border border-border/50 text-center">
                  <div className="font-serif text-3xl font-bold text-secondary mb-1">{item.value}</div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{item.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Journey — Timeline */}
      <section className="py-24 px-4 md:px-8 bg-background border-t border-border/50 overflow-hidden">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-20"
          >
            <p className="text-sm font-semibold tracking-widest text-secondary uppercase mb-3">Our Journey</p>
            <h2 className="font-serif text-4xl font-bold text-primary">From Vision to Community Institution</h2>
          </motion.div>

          <div className="relative">
            {/* Center vertical line — desktop */}
            <div className="hidden md:block absolute left-1/2 -translate-x-px top-0 bottom-0 w-[2px] bg-gradient-to-b from-secondary/60 via-secondary/30 to-transparent" />

            <div className="flex flex-col gap-0">
              {MILESTONES.map((milestone, index) => {
                const isLeft = index % 2 === 0;
                return (
                  <motion.div
                    key={milestone.year}
                    initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.55, delay: 0.05, ease: "easeOut" }}
                    className={`relative flex items-start md:items-center gap-6 md:gap-0 pb-12 md:pb-16 ${
                      isLeft ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    {/* Content card */}
                    <div className={`flex-1 ${isLeft ? "md:pr-16 md:text-right" : "md:pl-16 md:text-left"}`}>
                      <div className={`inline-block bg-secondary/10 rounded-2xl p-6 md:p-8 border border-secondary/20 hover:border-secondary/40 hover:shadow-md transition-all max-w-md ${isLeft ? "md:ml-auto" : ""}`}>
                        <span className="inline-block font-serif text-5xl font-bold text-secondary/30 leading-none mb-1">
                          {milestone.year}
                        </span>
                        <h3 className="font-serif text-xl font-bold text-primary mb-3">{milestone.title}</h3>
                        <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                          {milestone.description}
                        </p>
                      </div>
                    </div>

                    {/* Center dot — desktop */}
                    <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-secondary border-4 border-background shadow-md z-10" />

                    {/* Left vertical line + dot — mobile */}
                    <div className="md:hidden flex flex-col items-center shrink-0 pt-2">
                      <div className="w-4 h-4 rounded-full bg-secondary border-4 border-background shadow z-10 shrink-0" />
                      {index < MILESTONES.length - 1 && (
                        <div className="w-[2px] flex-1 bg-secondary/30 mt-2 min-h-[60px]" />
                      )}
                    </div>

                    {/* Empty half for alternating layout — desktop */}
                    <div className="hidden md:block flex-1" />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-20 px-4 md:px-8 bg-muted border-t border-border/50">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-sm font-semibold tracking-widest text-secondary uppercase mb-3">Our Leadership</p>
            <h2 className="font-serif text-4xl font-bold text-primary">The People Behind the Mission</h2>
          </motion.div>

          <div className="flex flex-col gap-20">
            {/* TeeLee */}
            <div className="flex flex-col md:flex-row items-center gap-12">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                className="w-full md:w-1/3 shrink-0"
              >
                <div className="aspect-square rounded-full overflow-hidden border-4 border-secondary/30 shadow-xl bg-primary flex items-center justify-center max-w-[280px] mx-auto">
                  <span className="font-serif text-6xl text-secondary">TL</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="w-full md:w-2/3"
              >
                <p className="text-sm font-semibold tracking-widest text-secondary uppercase mb-3">Founder & President</p>
                <h2 className="font-serif text-4xl font-bold text-primary mb-2">Taneisha "TeeLee" Lee</h2>
                <p className="text-muted-foreground italic mb-6">Founder · President · Executive Director</p>

                <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
                  <p>
                    Pleasant Beginnings Inc. was born out of a deep love for Baltimore and a clear-eyed recognition of the interconnected challenges facing our families. TeeLee saw that providing a youth with academic support wasn't enough if they were facing housing instability, mental health crises, or economic hardship at home.
                  </p>
                  <p>
                    Every one of PB's seven youth programs was written from scratch by TeeLee — built from the vision and expertise of each program lead. That same curriculum development expertise is now available as a service for nonprofits, entrepreneurs, and organizations building their own programming.
                  </p>
                  <p className="font-medium text-foreground">
                    Our work isn't just about fixing problems — it's about honoring the inherent potential in every person and building the infrastructure that makes lasting change possible.
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Divider */}
            <div className="border-t border-border/50" />

            {/* Deashia */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-12">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                className="w-full md:w-1/3 shrink-0"
              >
                <div className="aspect-square rounded-full overflow-hidden border-4 border-secondary/30 shadow-xl bg-primary flex items-center justify-center max-w-[280px] mx-auto">
                  <span className="font-serif text-6xl text-secondary">DG</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="w-full md:w-2/3"
              >
                <p className="text-sm font-semibold tracking-widest text-secondary uppercase mb-3">Co-Executive Director</p>
                <h2 className="font-serif text-4xl font-bold text-primary mb-2">De'Ashia "Black Girl Dee" Gibbs</h2>
                <p className="text-muted-foreground italic mb-6">Co-Executive Director</p>

                <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
                  <p>
                    De'Ashia Gibbs brings vision, energy, and deep community roots to her role as Co-Executive Director of Pleasant Beginnings Inc. Known as "Black Girl Dee," she is a driving force behind the organization's day-to-day operations, program execution, and community engagement.
                  </p>
                  <p>
                    Her commitment to Baltimore's youth and families is reflected in everything she does — from building relationships on the ground to ensuring that every program delivers real, lasting impact.
                  </p>
                  <p className="font-medium text-foreground">
                    Together with Founder TeeLee Lee, De'Ashia helps lead an organization built on the belief that every person deserves the tools, support, and opportunity to build a better tomorrow.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
