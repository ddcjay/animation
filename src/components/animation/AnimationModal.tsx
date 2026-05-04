"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { AnimationItem } from '@/types/animation';

interface AnimationModalProps {
  item: AnimationItem | null;
  onClose: () => void;
}

const techColors: Record<string, string> = {
  'GSAP': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  'ScrollTrigger': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  'Framer Motion': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  'React': 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  'Next.js': 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  'Three.js': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  'CSS': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'SVG': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  'default': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
};

export default function AnimationModal({ item, onClose }: AnimationModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!item) return;
    await navigator.clipboard.writeText(item.codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {item && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal 主體 */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-card border border-border rounded-2xl shadow-2xl pointer-events-auto">
              {/* 關閉按鈕 */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors z-10"
              >
                <X className="h-5 w-5" />
              </button>

              {/* 預覽區 */}
              <div className="aspect-video bg-gradient-to-br from-indigo-50 to-slate-100 dark:from-indigo-950/20 dark:to-slate-900 flex items-center justify-center rounded-t-2xl overflow-hidden">
                {item.previewType === 'image' && item.previewUrl ? (
                  <img 
                    src={item.previewUrl} 
                    alt={`${item.title} preview`} 
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="border-2 border-dashed border-indigo-200/50 dark:border-indigo-800/30 rounded-xl w-[85%] h-[75%] flex items-center justify-center">
                    <span className="text-sm font-mono text-indigo-400">Preview Animation</span>
                  </div>
                )}
              </div>

              {/* 內容區 */}
              <div className="p-6">
                {/* 分類標籤 */}
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded">
                  {item.category}
                </span>

                <h2 className="text-2xl font-bold mt-3 mb-2">{item.title}</h2>
                <p className="text-muted-foreground leading-relaxed mb-6">{item.description}</p>

                {/* 技術標籤 */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold mb-3 text-foreground/70 uppercase tracking-wider">使用技術</h3>
                  <div className="flex flex-wrap gap-2">
                    {item.techStack.map((tech) => (
                      <span
                        key={tech}
                        className={`px-3 py-1 rounded-full text-sm font-medium ${techColors[tech] ?? techColors.default}`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 程式碼區塊 */}
                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-foreground/70 uppercase tracking-wider">核心程式碼</h3>
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-secondary hover:bg-secondary/80 text-foreground transition-colors"
                    >
                      {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                      {copied ? '已複製！' : '複製程式碼'}
                    </button>
                  </div>
                  <pre className="bg-slate-900 dark:bg-black/50 text-slate-100 rounded-xl p-5 overflow-x-auto text-sm leading-relaxed font-mono border border-white/5">
                    <code>{item.codeSnippet}</code>
                  </pre>
                </div>

                {/* 來源連結 */}
                {item.sourceUrl && (
                  <a
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-500 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    查看原始範例
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
