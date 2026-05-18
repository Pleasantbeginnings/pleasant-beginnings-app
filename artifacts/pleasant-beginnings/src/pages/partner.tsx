import { useCreateContact } from "@workspace/api-client-react";
import { PageHeader } from "@/components/page-header";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Loader2, ArrowRight } from "lucide-react";
import { useState } from "react";

const formSchema = z.object({
  firstName: z.string().min(2, "Organization Name is required"),
  lastName: z.string().min(2, "Contact Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  programInterest: z.string().min(1, "Partnership Type is required"),
  message: z.string().min(10, "Please provide more details"),
});

type FormValues = z.infer<typeof formSchema>;

export default function Partner() {
  const { toast } = useToast();
  const [isSuccess, setIsSuccess] = useState(false);
  const createContact = useCreateContact();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      programInterest: "",
      message: "",
    },
  });

  function onSubmit(data: FormValues) {
    createContact.mutate(
      { data },
      {
        onSuccess: () => {
          setIsSuccess(true);
          form.reset();
        },
        onError: () => {
          toast({
            title: "Something went wrong",
            description: "We couldn't submit your inquiry. Please try again later.",
            variant: "destructive",
          });
        },
      }
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <PageHeader 
        title="Partner With Us" 
        description="From curriculum licensing to corporate sponsorship — there's a place for your organization in the Pleasant Beginnings ecosystem."
      />

      <section className="py-20 px-4 md:px-8 bg-background">
        <div className="container mx-auto max-w-6xl">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-3 gap-8"
          >
            {/* Card 1 */}
            <motion.div variants={itemVariants} className="h-full">
              <Card className="h-full bg-primary border-l-4 border-l-secondary border-t-0 border-r-0 border-b-0 rounded-none shadow-lg hover:shadow-[0_0_15px_rgba(201,168,76,0.3)] transition-all duration-300">
                <CardContent className="p-8 flex flex-col h-full text-white">
                  <span className="text-secondary font-bold text-sm tracking-wider uppercase mb-4 block">Program Licensing</span>
                  <h3 className="font-serif text-3xl font-bold mb-4 leading-tight">Bring Our Programs to Your School</h3>
                  <p className="text-primary-foreground/80 mb-6 leading-relaxed">
                    All 7 Pleasant Beginnings youth curricula are available for purchase by schools, after-school programs, and districts through B2G/WorldERP/K12 purchasing channels. Each program was authored from scratch by Founder TeeLee Lee.
                  </p>
                  <ul className="space-y-2 mb-8 flex-1 text-primary-foreground/90 text-sm">
                    <li className="flex items-start"><ArrowRight className="w-4 h-4 mr-2 text-secondary shrink-0 mt-0.5" /> <span>Truth University — Youth Entrepreneurship (Grades 5–12)</span></li>
                    <li className="flex items-start"><ArrowRight className="w-4 h-4 mr-2 text-secondary shrink-0 mt-0.5" /> <span>Podcast Academy — Media & Communication</span></li>
                    <li className="flex items-start"><ArrowRight className="w-4 h-4 mr-2 text-secondary shrink-0 mt-0.5" /> <span>Supreme Fitness — Youth Wellness</span></li>
                    <li className="flex items-start"><ArrowRight className="w-4 h-4 mr-2 text-secondary shrink-0 mt-0.5" /> <span>Vocal University — Mental Health Through Music</span></li>
                    <li className="flex items-start"><ArrowRight className="w-4 h-4 mr-2 text-secondary shrink-0 mt-0.5" /> <span>Mullyvation — Leadership & Motivation</span></li>
                    <li className="flex items-start"><ArrowRight className="w-4 h-4 mr-2 text-secondary shrink-0 mt-0.5" /> <span>Officer-Civilian Engagement — Youth & Police Relations</span></li>
                    <li className="flex items-start"><ArrowRight className="w-4 h-4 mr-2 text-secondary shrink-0 mt-0.5" /> <span>ISA Sports Agency — Business of Sports</span></li>
                  </ul>
                  <a href="#inquire" className="text-secondary font-semibold hover:text-white transition-colors inline-flex items-center">
                    Inquire About Licensing <ArrowRight className="ml-2 w-4 h-4" />
                  </a>
                </CardContent>
              </Card>
            </motion.div>

            {/* Card 2 */}
            <motion.div variants={itemVariants} className="h-full">
              <Card className="h-full bg-primary border-l-4 border-l-secondary border-t-0 border-r-0 border-b-0 rounded-none shadow-lg hover:shadow-[0_0_15px_rgba(201,168,76,0.3)] transition-all duration-300">
                <CardContent className="p-8 flex flex-col h-full text-white">
                  <span className="text-secondary font-bold text-sm tracking-wider uppercase mb-4 block">Curriculum Development</span>
                  <h3 className="font-serif text-3xl font-bold mb-4 leading-tight">We Build the Programs Behind the Programs</h3>
                  <p className="text-primary-foreground/80 mb-6 leading-relaxed">
                    TeeLee Lee has written all 7 PB curricula from the ground up — and this service is available to you. From concept to curriculum to delivery framework, PB makes your idea fundable, scalable, and real.
                  </p>
                  <ul className="space-y-2 mb-8 flex-1 text-primary-foreground/90 text-sm">
                    <li className="flex items-start"><ArrowRight className="w-4 h-4 mr-2 text-secondary shrink-0 mt-0.5" /> <span>Full curriculum writing & design</span></li>
                    <li className="flex items-start"><ArrowRight className="w-4 h-4 mr-2 text-secondary shrink-0 mt-0.5" /> <span>Program launch support</span></li>
                    <li className="flex items-start"><ArrowRight className="w-4 h-4 mr-2 text-secondary shrink-0 mt-0.5" /> <span>Nonprofit consulting</span></li>
                    <li className="flex items-start"><ArrowRight className="w-4 h-4 mr-2 text-secondary shrink-0 mt-0.5" /> <span>Wraparound service partnerships (housing, workforce, behavioral health)</span></li>
                    <li className="flex items-start"><ArrowRight className="w-4 h-4 mr-2 text-secondary shrink-0 mt-0.5" /> <span>Stitch by Stitch Creative Network — artists & nonprofits growing together</span></li>
                  </ul>
                  <a href="#inquire" className="text-secondary font-semibold hover:text-white transition-colors inline-flex items-center">
                    Start a Conversation <ArrowRight className="ml-2 w-4 h-4" />
                  </a>
                </CardContent>
              </Card>
            </motion.div>

            {/* Card 3 */}
            <motion.div variants={itemVariants} className="h-full">
              <Card className="h-full bg-primary border-l-4 border-l-secondary border-t-0 border-r-0 border-b-0 rounded-none shadow-lg hover:shadow-[0_0_15px_rgba(201,168,76,0.3)] transition-all duration-300">
                <CardContent className="p-8 flex flex-col h-full text-white">
                  <span className="text-secondary font-bold text-sm tracking-wider uppercase mb-4 block">Sponsorship & Partnership</span>
                  <h3 className="font-serif text-3xl font-bold mb-4 leading-tight">Invest in Baltimore's Future</h3>
                  <p className="text-primary-foreground/80 mb-6 leading-relaxed">
                    Join our network of 15+ active partners — including the Baltimore Ravens, Win Waste, NexTech Academy, and Redesigning Minds — in building a stronger, safer Baltimore.
                  </p>
                  <ul className="space-y-2 mb-8 flex-1 text-primary-foreground/90 text-sm">
                    <li className="flex items-start"><ArrowRight className="w-4 h-4 mr-2 text-secondary shrink-0 mt-0.5" /> <span>Event sponsorship (Fashion Meets Philanthropy & more)</span></li>
                    <li className="flex items-start"><ArrowRight className="w-4 h-4 mr-2 text-secondary shrink-0 mt-0.5" /> <span>Workforce development pipeline (NexTech MOU model)</span></li>
                    <li className="flex items-start"><ArrowRight className="w-4 h-4 mr-2 text-secondary shrink-0 mt-0.5" /> <span>PBTV / 4CornersTV media visibility</span></li>
                    <li className="flex items-start"><ArrowRight className="w-4 h-4 mr-2 text-secondary shrink-0 mt-0.5" /> <span>Community impact reporting</span></li>
                    <li className="flex items-start"><ArrowRight className="w-4 h-4 mr-2 text-secondary shrink-0 mt-0.5" /> <span>501(c)(3) tax-deductible giving recognition</span></li>
                  </ul>
                  <a href="#inquire" className="text-secondary font-semibold hover:text-white transition-colors inline-flex items-center">
                    Become a Partner <ArrowRight className="ml-2 w-4 h-4" />
                  </a>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-4 md:px-8 bg-muted/30 border-y border-border/50">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-16">Why Partner with Pleasant Beginnings?</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12">
              <div className="p-6 bg-background rounded-xl shadow-sm border border-border/40">
                <div className="font-serif text-4xl font-bold text-secondary mb-2">1,200+</div>
                <div className="font-bold text-primary mb-2 text-lg">Lives Impacted</div>
                <p className="text-muted-foreground text-sm">Baltimore City, County & beyond</p>
              </div>
              <div className="p-6 bg-background rounded-xl shadow-sm border border-border/40">
                <div className="font-serif text-4xl font-bold text-secondary mb-2">7</div>
                <div className="font-bold text-primary mb-2 text-lg">Licensed Curricula</div>
                <p className="text-muted-foreground text-sm">Available through B2G/K12 channels</p>
              </div>
              <div className="p-6 bg-background rounded-xl shadow-sm border border-border/40">
                <div className="font-serif text-4xl font-bold text-secondary mb-2">15+</div>
                <div className="font-bold text-primary mb-2 text-lg">Active Partners</div>
                <p className="text-muted-foreground text-sm">And growing</p>
              </div>
              <div className="p-6 bg-background rounded-xl shadow-sm border border-border/40">
                <div className="font-serif text-4xl font-bold text-secondary mb-2">501(c)(3)</div>
                <div className="font-bold text-primary mb-2 text-lg">Verified</div>
                <p className="text-muted-foreground text-sm">Approved 2021, full tax deductibility</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="inquire" className="py-24 px-4 md:px-8 bg-primary">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-12">
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">Start the Conversation</h2>
              <p className="text-primary-foreground/80 text-lg">Fill out the form below to inquire about partnership opportunities.</p>
            </div>

            <div className="bg-background/5 p-8 md:p-10 rounded-2xl border border-white/10 backdrop-blur-sm">
              {isSuccess ? (
                <div className="text-center py-12">
                  <h3 className="font-serif text-3xl font-bold text-secondary mb-4">Thank you — we'll be in touch within 48 hours.</h3>
                  <Button onClick={() => setIsSuccess(false)} variant="outline" className="mt-8 bg-transparent text-white border-white/20 hover:bg-white/10 hover:text-white">
                    Submit Another Inquiry
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
                            <FormLabel className="text-white/90">Organization Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Acme Corp" {...field} className="bg-background/10 border-white/20 text-white placeholder:text-white/40" />
                            </FormControl>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white/90">Your Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Jane Doe" {...field} className="bg-background/10 border-white/20 text-white placeholder:text-white/40" />
                            </FormControl>
                            <FormMessage className="text-red-400" />
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
                            <FormLabel className="text-white/90">Email Address</FormLabel>
                            <FormControl>
                              <Input placeholder="jane@example.com" type="email" {...field} className="bg-background/10 border-white/20 text-white placeholder:text-white/40" />
                            </FormControl>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white/90">Phone Number (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="(555) 123-4567" {...field} className="bg-background/10 border-white/20 text-white placeholder:text-white/40" />
                            </FormControl>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="programInterest"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white/90">Partnership Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-background/10 border-white/20 text-white">
                                <SelectValue placeholder="Select partnership type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="School/District">School/District</SelectItem>
                              <SelectItem value="Nonprofit/Organization">Nonprofit/Organization</SelectItem>
                              <SelectItem value="Corporate Sponsor">Corporate Sponsor</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white/90">Message</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Tell us about your organization and what you're looking for." 
                              className="resize-none h-32 bg-background/10 border-white/20 text-white placeholder:text-white/40" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full bg-secondary text-primary hover:bg-secondary/90 text-lg py-6 font-bold mt-4"
                      disabled={createContact.isPending}
                    >
                      {createContact.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        "Send Inquiry"
                      )}
                    </Button>
                  </form>
                </Form>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
