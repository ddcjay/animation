"use client";

import { useState } from 'react';

const categories = [
  '全部', 'CSS 動畫', 'GSAP', 'Framer Motion', 'Three.js', 'SVG', '捲動視差'
];

export default function CategoryTabs() {
  const [active, setActive] = useState('全部');

  return (
    <div className="w-full flex justify-center py-6 overflow-x-auto no-scrollbar">
      <div className="flex gap-2 px-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`whitespace-nowrap px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              active === cat 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' 
                : 'bg-card border border-border text-muted-foreground hover:border-indigo-400 hover:text-indigo-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
