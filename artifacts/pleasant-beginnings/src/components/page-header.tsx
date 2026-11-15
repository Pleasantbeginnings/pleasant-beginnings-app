import { ReactNode } from "react";
import { motion } from "framer-motion";

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="relative overflow-hidden bg-primary text-primary-foreground py-20 px-4 md:px-8">
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-black/25 pointer-events-none"></div>
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[560px] h-[560px] rounded-full bg-secondary/10 blur-3xl pointer-events-none"></div>
      <div className="container mx-auto max-w-4xl text-center relative">
        <motion.h1
          className="font-serif text-4xl md:text-6xl font-bold mb-5 text-secondary tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {title}
        </motion.h1>
        <motion.div
          className="w-16 h-1 bg-secondary rounded-full mx-auto mb-7"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.08 }}
        />
        {description && (
          <motion.p 
            className="text-lg md:text-xl text-primary-foreground/80 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {description}
          </motion.p>
        )}
        {children && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {children}
          </motion.div>
        )}
      </div>
    </div>
  );
}