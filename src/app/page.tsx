"use client";

import { useState } from 'react';
import Header from "@/components/layout/Header";
import CategoryTabs from "@/components/layout/CategoryTabs";
import AnimationCard from "@/components/animation/AnimationCard";
import AnimationModal from "@/components/animation/AnimationModal";
import AddUrlModal from "@/components/animation/AddUrlModal";
import { mockAnimations } from "@/data/mockAnimations";
import { AnimationItem } from "@/types/animation";

export default function Home() {
  const [animations, setAnimations] = useState<AnimationItem[]>(mockAnimations);
  const [selectedItem, setSelectedItem] = useState<AnimationItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState('全部');

  const filteredAnimations = activeCategory === '全部'
    ? animations
    : animations.filter(a => a.category === activeCategory);

  const handleAdd = (newItem: AnimationItem) => {
    setAnimations(prev => [newItem, ...prev]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header onAddClick={() => setShowAddModal(true)} />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-8 text-center max-w-2xl mx-auto py-12">
          <h1 className="text-4xl font-extrabold tracking-tight mb-4 sm:text-5xl">
            探索下一個動畫 <span className="text-indigo-600">靈感</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            收錄全球頂尖的網頁動畫範例，並透過 AI 解構背後所使用的程式技術。
            輸入任意動畫網頁網址，立刻生成技術解析卡片。
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-6 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-semibold transition-colors shadow-lg shadow-indigo-500/20"
          >
            ＋ 貼上網址，AI 自動分析
          </button>
        </section>

        <CategoryTabs activeCategory={activeCategory} onCategoryChange={setActiveCategory} />

        {/* Animation Grid */}
        {filteredAnimations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {filteredAnimations.map((item) => (
              <AnimationCard
                key={item.id}
                item={item}
                onClick={setSelectedItem}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <p className="text-lg">此分類暫無範例</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-4 text-sm text-indigo-600 hover:underline"
            >
              點此新增第一個範例 →
            </button>
          </div>
        )}
      </main>

      <footer className="border-t border-border py-8 mt-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            Jay&apos;s Animation · 以 AI 驅動的動畫技術解構平台
          </p>
        </div>
      </footer>

      {/* Modals */}
      <AnimationModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      <AddUrlModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAdd}
      />
    </div>
  );
}
