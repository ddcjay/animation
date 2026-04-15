"use client";

import { motion } from 'framer-motion';
import { Code2 } from 'lucide-react';
import { AnimationItem } from '@/types/animation';

interface AnimationCardProps {
  item: AnimationItem;
  onClick: (item: AnimationItem) => void;
}

export default function AnimationCard({ item, onClick }: AnimationCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
      onClick={() => onClick(item)}
      className="group relative bg-card border border-border rounded-2xl overflow-hidden cursor-pointer hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300"
    >
      {/* 預覽區 */}
      <div className="aspect-video bg-gradient-to-br from-indigo-50 to-slate-100 dark:from-indigo-950/20 dark:to-slate-900 flex items-center justify-center p-6 overflow-hidden">
        <div className="w-full h-full border-2 border-dashed border-indigo-200/50 dark:border-indigo-800/20 rounded-xl flex items-center justify-center">
          <span className="text-sm font-mono text-indigo-400">Preview Animation</span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded cursor-default">
            {item.category}
          </span>
        </div>

        <h3 className="text-lg font-bold mb-2 group-hover:text-indigo-600 transition-colors">{item.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
          {item.description}
        </p>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
          <div className="flex -space-x-1">
            {item.techStack.map((tech, i) => (
              <div
                key={i}
                className="w-7 h-7 rounded-full bg-background border border-border flex items-center justify-center text-[10px] font-bold shadow-sm"
                title={tech}
              >
                {tech[0]}
              </div>
            ))}
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onClick(item); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors"
          >
            <Code2 className="h-3.5 w-3.5" />
            查看程式碼
          </button>
        </div>
      </div>
    </motion.div>
  );
}
