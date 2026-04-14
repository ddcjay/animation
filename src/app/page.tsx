import Header from "@/components/layout/Header";
import CategoryTabs from "@/components/layout/CategoryTabs";
import AnimationCard from "@/components/animation/AnimationCard";
import { mockAnimations } from "@/data/mockAnimations";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-12 text-center max-w-2xl mx-auto py-12">
          <h2 className="text-4xl font-extrabold tracking-tight mb-4 sm:text-5xl">
            探索下一個動畫 <span className="text-indigo-600">靈感</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            收錄全球頂尖的網頁動畫範例，並透過 AI 解構背後所使用的程式技術。
            輕鬆一鍵複製，讓您的網頁即刻充滿活力。
          </p>
        </section>

        <CategoryTabs />

        {/* Animation Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {mockAnimations.map((item) => (
            <AnimationCard
              key={item.id}
              title={item.title}
              category={item.category}
              description={item.description}
              techStack={item.techStack}
            />
          ))}
        </div>
      </main>

      <footer className="border-t border-border py-12 mt-20">
        <div className="container mx-auto px-4 text-center">
        </div>
      </footer>
    </div>
  );
}
