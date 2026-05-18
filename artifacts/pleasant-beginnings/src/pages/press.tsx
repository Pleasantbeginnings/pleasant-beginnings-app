import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { motion } from "framer-motion";
import { ExternalLink, Award, FileText, Mail, Newspaper, Download, Send, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const COVERAGE = [
  {
    outlet: "Baltimore Sun",
    headline: "Pleasant Beginnings builds a community ecosystem for Baltimore's youth",
    date: "2024",
    description: "Coverage of Pleasant Beginnings' expansion across Baltimore City and County, spotlighting the seven-program model and TeeLee Lee's founding vision.",
    href: "#",
  },
  {
    outlet: "4CornersTV",
    headline: "Tea & Truth with BJ Dawkins — Now Streaming Globally",
    date: "2025",
    description: "Pleasant Beginnings' original talk show brings Baltimore community voices to a worldwide audience through the PBTV media platform on 4CornersTV.",
    href: "https://4cornerstv.net/",
  },
  {
    outlet: "Baltimore Business Journal",
    headline: "Nonprofit of the Year: Pleasant Beginnings Inc. leads community-centered change",
    date: "2024",
    description: "Recognition of Pleasant Beginnings' innovative wraparound model, partnerships with the Baltimore Ravens, Johns Hopkins, and NexTech Academy.",
    href: "#",
  },
];

const AWARDS = [
  {
    title: "501(c)(3) Federal Nonprofit Recognition",
    org: "Internal Revenue Service",
    year: "2021",
    description: "Granted federal tax-exempt status as a public charity, validating the organization's mission and governance.",
  },
  {
    title: "Baltimore Ravens Community Partner",
    org: "Baltimore Ravens NFL Organization",
    year: "2024",
    description: "Selected as an official community partner of the Baltimore Ravens, amplifying our reach to thousands of Baltimore families.",
  },
  {
    title: "Johns Hopkins Medical System Resource & Referral Partner",
    org: "Johns Hopkins Medicine",
    year: "2024",
    description: "Recognized as a trusted referral organization within the Johns Hopkins Medical System's community health network.",
  },
  {
    title: "NexTech Academy Workforce Development Partner",
    org: "NexTech Academy",
    year: "2024",
    description: "Partnered to provide tech workforce pathways for PB youth and young adults through coding, cybersecurity, and digital skills training.",
  },
];

const BRAND = [
  { label: "Organization Name", value: "Pleasant Beginnings Inc." },
  { label: "Founder & President", value: "Taneisha \"TeeLee\" Lee" },
  { label: "Co-Executive Director", value: "De'Ashia \"Black Girl Dee\" Gibbs" },
  { label: "Founded", value: "2020, Baltimore, Maryland" },
  { label: "EIN / Tax ID", value: "86-2300371" },
  { label: "Status", value: "501(c)(3) Public Charity" },
  { label: "Mission", value: "Preparing for a Better Tomorrow." },
  { label: "Primary Color", value: "#0D1B2A (Navy)" },
  { label: "Accent Color", value: "#C9A84C (Gold)" },
  { label: "Website", value: "pleasantbeginnings.info" },
  { label: "Social Media", value: "@pleasantbeginningsnonprofit" },
  { label: "Press Contact", value: "Admin@pleasantbeginnings.info" },
];

type FormStatus = "idle" | "submitting" | "success" | "error";

export default function Press() {
  const [form, setForm] = useState({ name: "", outlet: "", email: "", message: "" });
  const [status, setStatus] = useState<FormStatus>("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    const subject = encodeURIComponent(`Press Inquiry — ${form.outlet || form.name}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nOutlet / Organization: ${form.outlet}\nEmail: ${form.email}\n\nMessage:\n${form.message}`
    );
    window.location.href = `mailto:Admin@pleasantbeginnings.info?subject=${subject}&body=${body}`;
    setTimeout(() => setStatus("success"), 800);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <PageHeader
        title="Press & Media"
        description="News, recognition, media resources, and press inquiries for Pleasant Beginnings Inc."
      />

      {/* In the Press */}
      <section className="py-20 px-4 md:px-8">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-3">
              <Newspaper className="w-5 h-5 text-secondary" />
              <p className="text-sm font-semibold tracking-widest text-secondary uppercase">Coverage</p>
            </div>
            <h2 className="font-serif text-4xl font-bold text-primary">In the Press</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {COVERAGE.map((item, i) => (
              <motion.a
                key={item.headline}
                href={item.href}
                target={item.href !== "#" ? "_blank" : undefined}
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.45 }}
                className={`group flex flex-col bg-card border border-border/60 rounded-2xl p-6 hover:border-secondary/50 hover:shadow-md transition-all ${item.href === "#" ? "cursor-default" : "cursor-pointer"}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-secondary bg-secondary/10 px-3 py-1 rounded-full">
                    {item.outlet}
                  </span>
                  <span className="text-xs text-muted-foreground">{item.date}</span>
                </div>
                <h3 className="font-serif text-lg font-bold text-primary mb-3 leading-snug group-hover:text-secondary transition-colors flex-1">
                  {item.headline}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{item.description}</p>
                {item.href !== "#" && (
                  <div className="flex items-center gap-1 text-secondary text-sm font-medium mt-auto">
                    Read coverage <ExternalLink className="w-3.5 h-3.5" />
                  </div>
                )}
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Awards & Recognition */}
      <section className="py-20 px-4 md:px-8 bg-muted border-t border-border/50">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-3">
              <Award className="w-5 h-5 text-secondary" />
              <p className="text-sm font-semibold tracking-widest text-secondary uppercase">Recognition</p>
            </div>
            <h2 className="font-serif text-4xl font-bold text-primary">Awards & Partnerships</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-5">
            {AWARDS.map((award, i) => (
              <motion.div
                key={award.title}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.45 }}
                className="bg-background rounded-2xl border border-border/60 p-6 hover:border-secondary/40 hover:shadow-sm transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary/15 border border-secondary/30 flex items-center justify-center shrink-0 mt-1">
                    <Award className="w-4 h-4 text-secondary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{award.year}</span>
                    </div>
                    <h3 className="font-serif text-lg font-bold text-primary leading-snug mb-1">{award.title}</h3>
                    <p className="text-sm font-medium text-secondary mb-2">{award.org}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{award.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Media Kit */}
      <section className="py-20 px-4 md:px-8 bg-background border-t border-border/50">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-3">
              <FileText className="w-5 h-5 text-secondary" />
              <p className="text-sm font-semibold tracking-widest text-secondary uppercase">Resources</p>
            </div>
            <h2 className="font-serif text-4xl font-bold text-primary mb-2">Media Kit & Brand Facts</h2>
            <p className="text-muted-foreground">
              Use these facts and brand elements when writing about Pleasant Beginnings Inc. For logos or high-resolution images, please submit a press inquiry below.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="bg-primary text-primary-foreground rounded-2xl overflow-hidden"
          >
            <div className="px-8 py-6 border-b border-primary-foreground/10 flex items-center justify-between">
              <h3 className="font-serif text-xl font-bold text-secondary">Quick Reference Facts</h3>
              <a
                href="mailto:Admin@pleasantbeginnings.info?subject=Media%20Kit%20Request"
                className="inline-flex items-center gap-2 text-sm text-secondary/80 hover:text-secondary transition-colors"
              >
                <Download className="w-4 h-4" />
                Request Full Kit
              </a>
            </div>
            <div className="divide-y divide-primary-foreground/10">
              {BRAND.map((item) => (
                <div key={item.label} className="grid grid-cols-2 px-8 py-4 hover:bg-primary-foreground/5 transition-colors">
                  <span className="text-sm font-semibold text-primary-foreground/60 uppercase tracking-wide">{item.label}</span>
                  <span className="text-sm text-primary-foreground/90 font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Press Inquiry Form */}
      <section className="py-20 px-4 md:px-8 bg-muted border-t border-border/50">
        <div className="container mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-10"
          >
            <div className="flex items-center justify-center gap-3 mb-3">
              <Mail className="w-5 h-5 text-secondary" />
              <p className="text-sm font-semibold tracking-widest text-secondary uppercase">Get in Touch</p>
            </div>
            <h2 className="font-serif text-4xl font-bold text-primary mb-3">Press Inquiry</h2>
            <p className="text-muted-foreground">
              Journalists, producers, and podcasters — we'd love to connect. Send us a message and we'll respond within 48 hours.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="bg-background rounded-2xl border border-border/60 shadow-sm p-8"
          >
            {status === "success" ? (
              <div className="text-center py-10 space-y-4">
                <div className="mx-auto w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-primary">Message Sent!</h3>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  Your email client should have opened with your inquiry. We'll respond within 48 hours.
                </p>
                <Button variant="outline" onClick={() => setStatus("idle")} className="mt-4">
                  Send Another Inquiry
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name</Label>
                    <Input id="name" name="name" placeholder="Alex Johnson" required value={form.name} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="outlet">Outlet / Organization</Label>
                    <Input id="outlet" name="outlet" placeholder="Baltimore Sun, Podcast Name…" value={form.outlet} onChange={handleChange} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Your Email</Label>
                  <Input id="email" name="email" type="email" placeholder="you@outlet.com" required value={form.email} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">What's your inquiry about?</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Tell us about the story you're working on, what you need, and your deadline…"
                    className="h-32 resize-none"
                    required
                    value={form.message}
                    onChange={handleChange}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 text-base py-6"
                  disabled={status === "submitting"}
                >
                  {status === "submitting" ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending…</>
                  ) : (
                    <><Send className="w-4 h-4 mr-2" /> Send Press Inquiry</>
                  )}
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  Or email us directly at{" "}
                  <a href="mailto:Admin@pleasantbeginnings.info" className="text-secondary hover:underline">
                    Admin@pleasantbeginnings.info
                  </a>
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
