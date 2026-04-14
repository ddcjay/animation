"use client";

import { motion } from 'framer-motion';
import { ExternalLink, Code2 } from 'lucide-react';

interface AnimationCardProps {
  title: string;
  category: string;
  description: string;
  techStack: string[];
}

export default function AnimationCard({ title, category, description, techStack }: AnimationCardProps) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="group relative bg-card border border-border rounded-2xl overflow-hidden hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300"
    >
      <div className="aspect-video bg-gradient-to-br from-indigo-50 to-slate-100 dark:from-indigo-950/20 dark:to-slate-900 flex items-center justify-center p-6 overflow-hidden">
        {/* 動畫預覽預留區 */}
        <div className="w-full h-full border-2 border-dashed border-indigo-200/50 dark:border-indigo-800/20 rounded-xl flex items-center justify-center">
            <span className="text-sm font-mono text-indigo-400">Preview Animation</span>
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded cursor-default">
            {category}
          </span>
        </div>
        
        <h3 className="text-lg font-bold mb-2 group-hover:text-indigo-600 transition-colors">{title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
          {description}
        </p>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
          <div className="flex -space-x-1">
            {techStack.map((tech, i) => (
              <div 
                key={i}
                className="w-7 h-7 rounded-full bg-background border border-border flex items-center justify-center text-[10px] font-bold shadow-sm"
                title={tech}
              >
                {tech[0]}
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <button className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-indigo-600 transition-colors">
              <Code2 className="h-4 w-4" />
            </button>
            <button className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-indigo-600 transition-colors">
              <ExternalLink className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
