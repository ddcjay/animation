import { AnimationItem } from '@/types/animation';

export const mockAnimations: AnimationItem[] = [
  {
    id: 1,
    title: "流暢的捲動進場效果",
    category: "GSAP",
    description: "利用 GSAP ScrollTrigger 實作的元素淡入並位移效果，適合用於 landing page 的內容呈現。元素在進入視窗時從下方平滑滑入，並帶有透明度過渡。",
    techStack: ["GSAP", "ScrollTrigger", "CSS"],
    codeSnippet: `import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

gsap.from(".fade-in", {
  scrollTrigger: {
    trigger: ".fade-in",
    start: "top 80%",
  },
  y: 60,
  opacity: 0,
  duration: 0.8,
  stagger: 0.15,
  ease: "power3.out",
});`
  },
  {
    id: 2,
    title: "互動式 3D 卡片",
    category: "Framer Motion",
    description: "游標懸浮時具備透視感旋轉與發光的高質感卡片，增強介面的互動深度。追蹤游標位置動態計算傾斜角度。",
    techStack: ["Framer Motion", "React", "CSS"],
    codeSnippet: `import { motion, useMotionValue, useTransform } from "framer-motion";

export function Card3D() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [15, -15]);
  const rotateY = useTransform(x, [-100, 100], [-15, 15]);

  return (
    <motion.div
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - rect.left - rect.width / 2);
        y.set(e.clientY - rect.top - rect.height / 2);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      className="card"
    />
  );
}`
  },
  {
    id: 3,
    title: "SVG 路徑繪製動畫",
    category: "SVG",
    description: "動態描繪 SVG 路徑的動畫效果，常用於 Logo 展示或流程說明圖。利用 stroke-dashoffset 技巧達成手繪感。",
    techStack: ["SVG", "GSAP", "CSS"],
    codeSnippet: `/* CSS 手繪路徑動畫 */
.path {
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  animation: draw 2s ease forwards;
}

@keyframes draw {
  to {
    stroke-dashoffset: 0;
  }
}

/* HTML */
/* <svg viewBox="0 0 200 200">
  <path class="path" d="M10,80 Q95,10 180,80" 
    stroke="#6366f1" fill="none" stroke-width="4"/>
</svg> */`
  },
  {
    id: 4,
    title: "粒子背景效果",
    category: "Three.js",
    description: "使用 Three.js 渲染的輕量化點雲背景，為網頁增添現代科技感。透過 BufferGeometry 高效管理大量粒子。",
    techStack: ["Three.js", "WebGL", "JavaScript"],
    codeSnippet: `import * as THREE from "three";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });

// 建立 2000 個粒子
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(2000 * 3);
for (let i = 0; i < positions.length; i++) {
  positions[i] = (Math.random() - 0.5) * 10;
}
geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

const material = new THREE.PointsMaterial({ color: 0x6366f1, size: 0.02 });
scene.add(new THREE.Points(geometry, material));
camera.position.z = 3;

function animate() {
  requestAnimationFrame(animate);
  scene.rotation.y += 0.001;
  renderer.render(scene, camera);
}
animate();`
  },
  {
    id: 5,
    title: "多重 Hover 文字變色",
    category: "CSS 動畫",
    description: "純 CSS 實現的高性能文字漸層動畫，游標懸停時觸發流動的彩虹色波浪效果，零 JavaScript 依賴。",
    techStack: ["CSS", "HTML"],
    codeSnippet: `.gradient-text {
  background: linear-gradient(
    90deg,
    #6366f1, #8b5cf6, #ec4899, #6366f1
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transition: background-position 0.5s ease;
}

.gradient-text:hover {
  background-position: right center;
}`
  },
  {
    id: 6,
    title: "頁面切換過渡動畫",
    category: "Framer Motion",
    description: "流暢的頁面轉場動畫，提升 Single Page Application (SPA) 的使用者體驗。使用 AnimatePresence 管理元件掛載與卸載的動畫生命週期。",
    techStack: ["Framer Motion", "Next.js"],
    codeSnippet: `// app/layout.tsx
import { AnimatePresence } from "framer-motion";

export default function Layout({ children }) {
  return <AnimatePresence mode="wait">{children}</AnimatePresence>;
}

// app/page.tsx
import { motion } from "framer-motion";

export default function Page() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
    >
      {/* 頁面內容 */}
    </motion.div>
  );
}`
  }
];
