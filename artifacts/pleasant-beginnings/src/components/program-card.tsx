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
      <Card className="h-full flex flex-col hover:border-secondary transition-colors duration-300">
        {program.imageUrl && (
          <div className="h-48 w-full overflow-hidden rounded-t-lg">
            <img 
              src={program.imageUrl} 
              alt={program.name} 
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        )}
        <CardHeader>
          <div className="mb-2">
            <Badge variant="secondary" className="bg-secondary/10 text-secondary-foreground hover:bg-secondary/20">
              {program.category}
            </Badge>
          </div>
          <CardTitle className="font-serif text-2xl text-primary">{program.name}</CardTitle>
        </CardHeader>
        <CardContent className="flex-1">
          <CardDescription className="text-base text-muted-foreground leading-relaxed">
            {program.description}
          </CardDescription>
        </CardContent>
      </Card>
    </motion.div>
  );
}