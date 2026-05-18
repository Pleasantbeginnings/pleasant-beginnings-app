import { useCreateVolunteer, useListVolunteers, getListVolunteersQueryKey } from "@workspace/api-client-react";
import { PageHeader } from "@/components/page-header";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Heart, Loader2, CheckCircle2, Star, Users } from "lucide-react";
import { useState } from "react";

const formSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  interests: z.string().optional(),
  availability: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

function VolunteerWall() {
  const { data: volunteers = [], isLoading } = useListVolunteers({
    query: { queryKey: getListVolunteersQueryKey() },
  });

  const active = volunteers.filter((v) => v.active !== false);

  if (isLoading) {
    return (
      <div className="flex flex-wrap justify-center gap-3 py-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-10 w-28 rounded-full bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  if (active.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
        <p className="text-sm">Our volunteer family is growing — be the first to join!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-3">
      {active.map((v, i) => (
        <motion.div
          key={v.id}
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.04, duration: 0.3 }}
          className="flex items-center gap-2 bg-background border border-secondary/30 hover:border-secondary/60 text-foreground rounded-full px-4 py-2 text-sm font-medium shadow-sm transition-colors"
        >
          <Star className="w-3 h-3 text-secondary fill-secondary shrink-0" />
          {v.firstName} {v.lastName ? v.lastName.charAt(0) + "." : ""}
        </motion.div>
      ))}
    </div>
  );
}

export default function Volunteer() {
  const { toast } = useToast();
  const [isSuccess, setIsSuccess] = useState(false);
  const createVolunteer = useCreateVolunteer();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      interests: "",
      availability: "",
    },
  });

  function onSubmit(data: FormValues) {
    createVolunteer.mutate(
      { data },
      {
        onSuccess: () => {
          setIsSuccess(true);
          form.reset();
        },
        onError: () => {
          toast({
            title: "Something went wrong",
            description: "We couldn't submit your form. Please try again later.",
            variant: "destructive",
          });
        },
      }
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <PageHeader
        title="Become a Volunteer"
        description="Your time and talents can help us prepare our community for a better tomorrow."
      />

      <section className="py-20 px-4 md:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-5 gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
              className="md:col-span-2 space-y-8"
            >
              <div>
                <h2 className="font-serif text-3xl font-bold text-primary mb-4">Why Volunteer With Us?</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Volunteers are the heartbeat of Pleasant Beginnings Inc. Whether you have professional skills to share, or simply the desire to lend a helping hand, there is a place for you here.
                </p>
              </div>

              <div className="space-y-6">
                {[
                  {
                    title: "Make a Real Impact",
                    desc: "Work directly with youth and families in Baltimore to provide tangible support.",
                  },
                  {
                    title: "Build Community",
                    desc: "Connect with other passionate individuals who share your commitment to our city.",
                  },
                  {
                    title: "Share Your Expertise",
                    desc: "Help with workshops, events, administrative tasks, or mentorship.",
                  },
                ].map(({ title, desc }) => (
                  <div key={title} className="flex gap-4 items-start">
                    <div className="bg-secondary/20 p-3 rounded-full text-secondary mt-1 shrink-0">
                      <Heart className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground mb-1">{title}</h3>
                      <p className="text-sm text-muted-foreground">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
              className="md:col-span-3"
            >
              <Card className="border-border/50 shadow-lg">
                <CardContent className="p-8">
                  {isSuccess ? (
                    <div className="text-center py-16 space-y-6">
                      <div className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-10 h-10" />
                      </div>
                      <h3 className="font-serif text-3xl font-bold text-primary">Thank You!</h3>
                      <p className="text-muted-foreground max-w-sm mx-auto">
                        We have received your volunteer application. A member of our team will reach out to you shortly to discuss opportunities.
                      </p>
                      <Button onClick={() => setIsSuccess(false)} variant="outline" className="mt-8">
                        Submit Another Form
                      </Button>
                    </div>
                  ) : (
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Jane" {...field} className="bg-background" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Last Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Doe" {...field} className="bg-background" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email Address</FormLabel>
                                <FormControl>
                                  <Input placeholder="jane@example.com" type="email" {...field} className="bg-background" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone Number (Optional)</FormLabel>
                                <FormControl>
                                  <Input placeholder="(555) 123-4567" {...field} className="bg-background" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="interests"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Areas of Interest</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Which programs or activities are you most interested in helping with?"
                                  className="resize-none h-24 bg-background"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="availability"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Availability</FormLabel>
                              <FormControl>
                                <Input placeholder="E.g., Weekends, Tuesday evenings" {...field} className="bg-background" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button
                          type="submit"
                          className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 text-lg py-6"
                          disabled={createVolunteer.isPending}
                        >
                          {createVolunteer.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            "Submit Application"
                          )}
                        </Button>
                      </form>
                    </Form>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Volunteer Recognition Wall */}
      <section className="py-20 px-4 md:px-8 bg-muted border-t border-border/50">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary border border-secondary/30 rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
              <Star className="w-3.5 h-3.5 fill-secondary" />
              Volunteer Hall of Fame
            </div>
            <h2 className="font-serif text-4xl font-bold text-primary mb-3">
              Our Amazing Volunteers
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Every name here represents someone who chose to give their time to make Baltimore better. We are grateful for each and every one of you.
            </p>
          </motion.div>

          <div className="bg-background rounded-2xl border border-border/50 shadow-sm p-8">
            <VolunteerWall />
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-center text-sm text-muted-foreground mt-6"
          >
            Want to see your name here?{" "}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="text-secondary underline underline-offset-4 hover:text-secondary/80 transition-colors"
            >
              Sign up above
            </button>{" "}
            and join our volunteer family.
          </motion.p>
        </div>
      </section>
    </div>
  );
}
