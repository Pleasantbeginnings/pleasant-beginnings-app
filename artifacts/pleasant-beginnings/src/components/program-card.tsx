import { Program } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface ProgramCardProps {
  program: Program | { name: string; description: string; category: string; imageUrl?: string | null };
  index?: number;
}

export function ProgramCard({ program, index = 0 }: ProgramCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="h-full"
    >
      <Card className="group relative h-full flex flex-col overflow-hidden border-border/60 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-secondary/60 transition-all duration-300">
        <div className="absolute inset-x-0 top-0 h-1 z-10 bg-gradient-to-r from-secondary/0 via-secondary to-secondary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {program.imageUrl && (
          <div className="h-48 w-full overflow-hidden">
            <img
              src={program.imageUrl}
              alt={program.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}
        <CardHeader>
          <div className="mb-2">
            <Badge variant="secondary" className="bg-secondary/10 text-secondary-foreground hover:bg-secondary/20 uppercase tracking-wider text-[11px] font-semibold px-2.5 py-0.5">
              {program.category}
            </Badge>
          </div>
          <CardTitle className="font-serif text-[26px] leading-snug text-primary">{program.name}</CardTitle>
        </CardHeader>
        <CardContent className="flex-1">
          <CardDescription className="text-[15px] text-muted-foreground leading-relaxed">
            {program.description}
          </CardDescription>
        </CardContent>
      </Card>
    </motion.div>
  );
}