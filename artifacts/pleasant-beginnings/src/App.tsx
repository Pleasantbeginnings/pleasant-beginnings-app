import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout";
import { AnimatePresence, motion } from "framer-motion";

import Home from "@/pages/home";
import Programs from "@/pages/programs";
import Events from "@/pages/events";
import Gallery from "@/pages/gallery";
import Stories from "@/pages/stories";
import About from "@/pages/about";
import Volunteer from "@/pages/volunteer";
import Contact from "@/pages/contact";
import Partner from "@/pages/partner";
import Press from "@/pages/press";
import Impact from "@/pages/impact";
import NotFound from "@/pages/not-found";
import Admin from "@/pages/admin";

const queryClient = new QueryClient();

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.15, ease: "easeIn" } },
};

function AnimatedRoutes() {
  const [location] = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div key={location} variants={pageVariants} initial="initial" animate="animate" exit="exit">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/programs" component={Programs} />
          <Route path="/events" component={Events} />
          <Route path="/gallery" component={Gallery} />
          <Route path="/stories" component={Stories} />
          <Route path="/about" component={About} />
          <Route path="/volunteer" component={Volunteer} />
          <Route path="/partner" component={Partner} />
          <Route path="/press" component={Press} />
          <Route path="/impact" component={Impact} />
          <Route path="/contact" component={Contact} />
          <Route component={NotFound} />
        </Switch>
      </motion.div>
    </AnimatePresence>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/admin" component={Admin} />
      <Route>
        <Layout>
          <AnimatedRoutes />
        </Layout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
