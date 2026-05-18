import { useListSuccessStories, getListSuccessStoriesQueryKey } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/page-header";

export default function Stories() {
  const { data: stories, isLoading } = useListSuccessStories({ 
    query: { queryKey: getListSuccessStoriesQueryKey() } 
  });

  const featuredStories = stories?.filter(s => s.featured) || [];
  const regularStories = stories?.filter(s => !s.featured) || [];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <PageHeader 
        title="Success Stories" 
        subtitle="Real voices from our Baltimore community."
      />

      <div className="container mx-auto px-4 md:px-8 py-16 max-w-6xl">
        {isLoading ? (
          <div className="space-y-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <Skeleton key={`f-${i}`} className="h-[300px] w-full rounded-xl" />
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map(i => (
                <Skeleton key={`r-${i}`} className="h-[250px] w-full rounded-xl" />
              ))}
            </div>
          </div>
        ) : !stories || stories.length === 0 ? (
          <div className="text-center py-20 bg-muted/30 rounded-xl border border-border/50">
            <Quote className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-2xl font-serif text-primary mb-2">More stories coming soon</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              We are continually gathering stories from our community. Check back soon to hear from the people whose lives have been changed.
            </p>
          </div>
        ) : (
          <div className="space-y-20">
            {/* Featured Stories */}
            {featuredStories.length > 0 && (
              <section>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {featuredStories.map((story, index) => (
                    <motion.div
                      key={story.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ delay: index * 0.1, duration: 0.6 }}
                      className="bg-card text-card-foreground p-8 rounded-xl shadow-sm border-l-4 border-[#C9A84C] relative flex flex-col h-full hover:shadow-md transition-shadow"
                    >
                      <Quote className="w-12 h-12 text-[#C9A84C] opacity-20 absolute top-4 left-4" />
                      <div className="relative z-10 flex-1">
                        <p className="font-sans text-foreground/80 mb-6 italic leading-relaxed text-lg">
                          "{story.quote}"
                        </p>
                      </div>
                      <div className="mt-auto pt-6 border-t border-border/50">
                        <p className="font-sans font-bold text-[#C9A84C] text-lg">
                          {story.name}
                        </p>
                        {story.role && (
                          <p className="font-sans text-sm text-muted-foreground italic mt-1">
                            {story.role}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* Regular Stories */}
            {regularStories.length > 0 && (
              <section>
                {featuredStories.length > 0 && (
                  <div className="mb-10 text-center">
                    <div className="w-16 h-1 bg-[#C9A84C]/30 mx-auto rounded-full mb-8"></div>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {regularStories.map((story, index) => (
                    <motion.div
                      key={story.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ delay: (index % 4) * 0.1, duration: 0.5 }}
                      className="bg-card text-card-foreground p-8 rounded-xl shadow-sm border-l-4 border-[#C9A84C] relative flex flex-col h-full hover:shadow-md transition-shadow"
                    >
                      <Quote className="w-8 h-8 text-[#C9A84C] opacity-20 absolute top-4 left-4" />
                      <div className="relative z-10 flex-1">
                        <p className="font-sans text-foreground/80 mb-6 italic leading-relaxed">
                          "{story.quote}"
                        </p>
                      </div>
                      <div className="mt-auto pt-4 border-t border-border/50">
                        <p className="font-sans font-bold text-[#C9A84C]">
                          {story.name}
                        </p>
                        {story.role && (
                          <p className="font-sans text-sm text-muted-foreground italic mt-1">
                            {story.role}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}