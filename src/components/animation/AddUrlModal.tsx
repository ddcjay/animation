"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Link2, Loader2, AlertCircle } from 'lucide-react';
import { AnimationItem } from '@/types/animation';

interface AddUrlModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: AnimationItem) => void;
}

export default function AddUrlModal({ isOpen, onClose, onAdd }: AddUrlModalProps) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || '分析失敗，請確認網址是否正確。');
      }

      onAdd({ ...data.data, id: Date.now(), sourceUrl: url.trim() });
      setUrl('');
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '發生未知錯誤');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="relative w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl pointer-events-auto p-6">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-secondary text-muted-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="mb-6">
                <h2 className="text-xl font-bold mb-1">快速新增動畫範例</h2>
                <p className="text-sm text-muted-foreground">
                  輸入動畫範例的網頁網址，AI 將自動分析其技術架構與核心程式碼。
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-2 items-center bg-secondary/50 border border-border rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-indigo-500/30 transition-all">
                  <Link2 className="h-4 w-4 text-muted-foreground shrink-0" />
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com/animation-demo"
                    className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground/60"
                    required
                  />
                </div>

                {error && (
                  <div className="flex items-start gap-2 text-sm text-red-500 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/30 rounded-lg px-3 py-2">
                    <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl text-sm font-medium hover:bg-secondary transition-colors"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !url.trim()}
                    className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl text-sm font-medium transition-colors"
                  >
                    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                    {loading ? 'AI 分析中...' : '開始分析'}
                  </button>
                </div>
              </form>

              {/* 分析說明 */}
              <div className="mt-5 pt-4 border-t border-border text-xs text-muted-foreground space-y-1">
                <p>🔍 系統將抓取該網頁的 HTML 原始碼</p>
                <p>🤖 透過 Gemini AI 分析技術架構與程式碼</p>
                <p>✨ 自動新增到您的動畫範例清單</p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
