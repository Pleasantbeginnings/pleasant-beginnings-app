import { useListPrograms, getListProgramsQueryKey } from "@workspace/api-client-react";
import { PageHeader } from "@/components/page-header";
import { ProgramCard } from "@/components/program-card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { Info } from "lucide-react";

const FALLBACK_PROGRAMS = [
  {
    name: "Truth University",
    category: "Entrepreneurship",
    description: "Students develop business ideas, learn money management, branding, and leadership. Includes pitch presentations and team collaboration. Curriculum authored by TeeLee Lee. Grades 5–12. Available in schools and after-school settings through B2G/K12 purchasing channels.",
  },
  {
    name: "Podcast Academy",
    category: "Media & Communication",
    description: "Students build confidence, communication skills, and digital literacy by creating and recording real podcast episodes. An end-of-program showcase is included. Available for schools, after-school programs, and districts.",
  },
  {
    name: "Supreme Fitness",
    category: "Youth Wellness",
    description: "A structured fitness and wellness program focused on physical health, discipline, confidence, and positive lifestyle habits. Students receive certification upon completion. Designed for youth across Baltimore City and County.",
  },
  {
    name: "Vocal University",
    category: "Mental Health Through Music",
    description: "A trauma-informed music and wellness program using vocal expression, songwriting, and group collaboration to support student mental health and build confidence. Available as 6–12 week cohorts.",
  },
  {
    name: "Mullyvation",
    category: "Leadership & Motivation",
    description: "A motivational leadership program focused on self-belief, goal setting, resilience, and positive decision-making. Available as a school assembly, a cohort, or a full semester partnership with your organization.",
  },
  {
    name: "Officer-Civilian Engagement",
    category: "Community Relations",
    description: "A relationship-building program designed to foster communication, trust, and mutual understanding between youth and law enforcement. Available in 1-day and 5-day formats for schools and community organizations.",
  },
  {
    name: "ISA Sports Agency",
    category: "Business of Sports",
    description: "An introduction to sports management, agency roles, branding, marketing, and career pathways in the sports industry. Students participate in mock agency presentations and learn the business side of athletics.",
  },
];

export default function Programs() {
  const { data: programs, isLoading } = useListPrograms({ query: { queryKey: getListProgramsQueryKey() } });

  const displayPrograms = programs?.length ? programs : FALLBACK_PROGRAMS;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <PageHeader 
        title="Our Programs" 
        description="Comprehensive wraparound services designed to uplift youth and families in Baltimore."
      />

      <section className="py-20 px-4 md:px-8">
        <div className="container mx-auto">
          {!programs?.length && !isLoading && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-muted/50 border border-border p-4 rounded-lg flex items-start gap-3 mb-12 max-w-3xl"
            >
              <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                Showing our core program areas. The active program schedule is currently being updated by our staff.
              </p>
            </motion.div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <Skeleton key={i} className="h-[400px] w-full rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayPrograms.map((program, index) => (
                <ProgramCard 
                  key={'id' in program ? program.id : index} 
                  program={program} 
                  index={index} 
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}