import { useCreateContact, useListPrograms, getListProgramsQueryKey } from "@workspace/api-client-react";
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
import { Loader2, CheckCircle2, Phone, Mail, MapPin } from "lucide-react";
import { useState } from "react";

const formSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  programInterest: z.string().optional(),
  message: z.string().min(10, "Please provide more details about how we can help"),
});

type FormValues = z.infer<typeof formSchema>;

export default function Contact() {
  const { toast } = useToast();
  const [isSuccess, setIsSuccess] = useState(false);
  const createContact = useCreateContact();
  const { data: programs } = useListPrograms({ query: { queryKey: getListProgramsQueryKey() } });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      programInterest: "general",
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
            description: "We couldn't submit your message. Please try again later.",
            variant: "destructive",
          });
        },
      }
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <PageHeader 
        title="Get in Touch" 
        description="We are here for you. Reach out for support, information, or to learn more about our programs."
      />

      <section className="py-20 px-4 md:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-5 gap-12 items-start">
            <motion.div 
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
              className="md:col-span-2 space-y-10"
            >
              <div>
                <h2 className="font-serif text-3xl font-bold text-primary mb-4">Contact Information</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Fill out the form to request assistance or learn more. Our team treats all inquiries with confidentiality and respect.
                </p>
              </div>

              <div className="space-y-6 bg-primary text-primary-foreground p-8 rounded-2xl">
                <div className="flex gap-4 items-center">
                  <div className="bg-secondary/20 p-3 rounded-full text-secondary">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-lg">Baltimore, Maryland</p>
                    <p className="text-primary-foreground/70">Headquarters</p>
                  </div>
                </div>
                <div className="flex gap-4 items-center">
                  <div className="bg-secondary/20 p-3 rounded-full text-secondary">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-lg">Admin@pleasantbeginnings.info</p>
                    <p className="text-primary-foreground/70">General Inquiries</p>
                  </div>
                </div>
                <div className="flex gap-4 items-center">
                  <div className="bg-secondary/20 p-3 rounded-full text-secondary">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-lg">(410) 637-9113</p>
                    <p className="text-primary-foreground/70">Office Phone</p>
                  </div>
                </div>
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
                      <h3 className="font-serif text-3xl font-bold text-primary">Message Received</h3>
                      <p className="text-muted-foreground max-w-sm mx-auto">
                        Thank you for reaching out. We have received your message and will respond as soon as possible.
                      </p>
                      <Button onClick={() => setIsSuccess(false)} variant="outline" className="mt-8">
                        Send Another Message
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
                          name="programInterest"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Area of Interest</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="bg-background">
                                    <SelectValue placeholder="Select a program" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="general">General Inquiry</SelectItem>
                                  {programs?.map((p) => (
                                    <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="message"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Message</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="How can we help you?" 
                                  className="resize-none h-32 bg-background" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button 
                          type="submit" 
                          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-lg py-6"
                          disabled={createContact.isPending}
                        >
                          {createContact.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            "Send Message"
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
    </div>
  );
}