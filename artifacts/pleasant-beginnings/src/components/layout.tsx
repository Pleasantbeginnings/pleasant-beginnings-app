import { Link, useLocation } from "wouter";
import { ReactNode, useEffect, useState } from "react";
import { Menu, X, Phone, Mail, Instagram, Facebook, Youtube, ArrowUp, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { DonateModal } from "@/components/donate-modal";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [donateOpen, setDonateOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
      setShowBackToTop(scrollTop > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Programs", href: "/programs" },
    { label: "Events", href: "/events" },
    { label: "Gallery", href: "/gallery" },
    { label: "Stories", href: "/stories" },
    { label: "Volunteer", href: "/volunteer" },
    { label: "About", href: "/about" },
    { label: "Partner", href: "/partner" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground">
      {/* Scroll progress bar */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-[3px] bg-transparent pointer-events-none">
        <motion.div
          className="h-full bg-secondary origin-left"
          style={{ scaleX: scrollProgress / 100 }}
          initial={{ scaleX: 0 }}
        />
      </div>

      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-serif text-2xl font-bold text-primary dark:text-secondary tracking-tight">
              Pleasant Beginnings Inc.
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-secondary ${
                  location === link.href ? "text-secondary" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={() => setDonateOpen(true)}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-secondary hover:text-secondary/80 transition-colors border border-secondary/40 hover:border-secondary rounded-full px-4 py-1.5"
            >
              <Heart className="w-3.5 h-3.5 fill-secondary" />
              Donate
            </button>
            <Link href="/contact">
              <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                Get Help
              </Button>
            </Link>
          </nav>

          <button
            className="md:hidden p-2 text-foreground"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileMenuOpen((v) => !v)}
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileMenuOpen ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="block"
                >
                  <X size={24} />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="block"
                >
                  <Menu size={24} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* Animated mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="md:hidden overflow-hidden border-b border-border/40 bg-background shadow-lg"
            >
              <div className="px-4 py-4 flex flex-col gap-1">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.2 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block text-lg font-medium p-3 rounded-md transition-colors ${
                        location === link.href
                          ? "bg-primary/5 text-secondary"
                          : "text-foreground hover:bg-muted"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.04, duration: 0.2 }}
                  className="pt-2 flex flex-col gap-2"
                >
                  <button
                    onClick={() => { setMobileMenuOpen(false); setDonateOpen(true); }}
                    className="w-full flex items-center justify-center gap-2 border border-secondary/40 text-secondary rounded-md py-3 text-lg font-medium hover:bg-secondary/5 transition-colors"
                  >
                    <Heart className="w-4 h-4 fill-secondary" />
                    Donate
                  </button>
                  <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-secondary text-secondary-foreground">
                      Get Help
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <h3 className="font-serif text-3xl font-bold text-secondary mb-4">Pleasant Beginnings Inc.</h3>
            <p className="text-primary-foreground/80 max-w-md text-lg italic font-serif">
              "Preparing for a Better Tomorrow."
            </p>
            <p className="text-primary-foreground/70 mt-4 max-w-sm leading-relaxed text-sm">
              A 501(c)(3) nonprofit organization serving youth and families in Baltimore, Maryland through entrepreneurship, creative economy, workforce development, mental health, and wraparound services.
            </p>
            <button
              onClick={() => setDonateOpen(true)}
              className="mt-6 inline-flex items-center gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors px-6 py-3 rounded-md font-semibold text-sm"
            >
              <Heart className="w-4 h-4 fill-secondary-foreground" />
              Support Our Mission
            </button>
            <div className="flex items-center gap-4 mt-6">
              <a
                href="https://www.instagram.com/pleasantbeginningsnonprofit"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="bg-primary-foreground/10 hover:bg-secondary/20 text-secondary p-3 rounded-full transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.facebook.com/pleasantbeginningsnonprofit"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="bg-primary-foreground/10 hover:bg-secondary/20 text-secondary p-3 rounded-full transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://4cornerstv.net/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Watch on 4CornersTV"
                className="bg-primary-foreground/10 hover:bg-secondary/20 text-secondary p-3 rounded-full transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-white uppercase tracking-wider text-sm">Quick Links</h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-primary-foreground/70 hover:text-secondary transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/press" className="text-primary-foreground/70 hover:text-secondary transition-colors text-sm">
                  Press & Media
                </Link>
              </li>
              <li>
                <Link href="/impact" className="text-primary-foreground/70 hover:text-secondary transition-colors text-sm">
                  Impact Report
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-white uppercase tracking-wider text-sm">Contact Us</h4>
            <address className="not-italic text-primary-foreground/70 space-y-4 text-sm">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-secondary shrink-0" />
                <a href="tel:4106379113" className="hover:text-secondary transition-colors">(410) 637-9113</a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-secondary shrink-0" />
                <a href="mailto:Admin@pleasantbeginnings.info" className="hover:text-secondary transition-colors">
                  Admin@pleasantbeginnings.info
                </a>
              </div>
              <p className="pt-2 text-primary-foreground/50">Baltimore, Maryland</p>
              <p>
                <Link href="/contact" className="text-secondary hover:text-white transition-colors underline underline-offset-4">
                  Send us a message
                </Link>
              </p>
            </address>
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-8 mt-16 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center text-primary-foreground/50 text-sm gap-4">
          <span>&copy; {new Date().getFullYear()} Pleasant Beginnings Inc. A 501(c)(3) Nonprofit Organization. EIN: 86-2300371. All rights reserved.</span>
          <div className="flex items-center gap-6">
            <a
              href="https://www.instagram.com/pleasantbeginningsnonprofit"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-secondary transition-colors"
            >
              @pleasantbeginningsnonprofit
            </a>
            <Link href="/admin" className="hover:text-primary-foreground/80 transition-colors">Admin</Link>
          </div>
        </div>
      </footer>

      {/* Back to top button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            key="back-to-top"
            initial={{ opacity: 0, scale: 0.8, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 8 }}
            transition={{ duration: 0.2 }}
            onClick={scrollToTop}
            aria-label="Back to top"
            className="fixed bottom-8 right-8 z-50 w-12 h-12 bg-secondary text-secondary-foreground rounded-full shadow-lg hover:bg-secondary/90 transition-colors flex items-center justify-center"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      <DonateModal open={donateOpen} onClose={() => setDonateOpen(false)} />
    </div>
  );
}
