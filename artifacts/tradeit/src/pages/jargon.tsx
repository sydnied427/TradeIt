import { useState } from "react";
import { Layout } from "@/components/layout";
import { jargonData, jargonCategories, JargonCategory } from "@/data/jargon";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export default function JargonExplainer() {
  const [activeCategory, setActiveCategory] = useState<JargonCategory>('Basics');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const currentCards = jargonData.filter(c => c.category === activeCategory);
  const currentCard = currentCards[currentIndex];

  const nextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % currentCards.length);
    }, 150);
  };

  const prevCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + currentCards.length) % currentCards.length);
    }, 150);
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-display font-bold mb-3">Jargon Explainer</h1>
          <p className="text-muted-foreground text-lg">Tap a card to reveal the plain-English translation.</p>
        </div>

        {/* Categories */}
        <div className="flex overflow-x-auto pb-4 mb-6 -mx-4 px-4 sm:mx-0 sm:px-0 hide-scrollbar gap-2">
          {jargonCategories.map(cat => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setCurrentIndex(0);
                setIsFlipped(false);
              }}
              className={cn(
                "whitespace-nowrap px-5 py-2.5 rounded-full font-medium transition-all",
                activeCategory === cat 
                  ? "bg-primary text-primary-foreground shadow-md" 
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Flashcard Container */}
        <div className="flex flex-col items-center">
          <div className="w-full aspect-[4/3] sm:aspect-[16/9] preserve-3d cursor-pointer relative group" onClick={() => setIsFlipped(!isFlipped)}>
            <motion.div
              initial={false}
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
              className="w-full h-full preserve-3d"
            >
              {/* FRONT */}
              <div className="absolute inset-0 backface-hidden bg-card border-2 border-border shadow-lg rounded-3xl p-8 sm:p-12 flex flex-col items-center justify-center text-center">
                <div className="absolute top-6 left-6 px-3 py-1 bg-accent text-accent-foreground rounded-lg text-xs font-bold uppercase tracking-wider">
                  {currentCard.category}
                </div>
                <div className="absolute top-6 right-6 text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  <RotateCcw className="w-4 h-4" /> <span className="text-xs font-semibold uppercase tracking-wider">Tap to flip</span>
                </div>
                
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold text-foreground">
                  {currentCard.term}
                </h2>
              </div>

              {/* BACK */}
              <div className="absolute inset-0 backface-hidden rotate-y-180 bg-primary border-2 border-primary/20 shadow-xl rounded-3xl p-8 sm:p-12 flex flex-col items-center justify-center text-center text-primary-foreground">
                <div className="absolute top-6 right-6 opacity-50 flex items-center gap-1">
                  <RotateCcw className="w-4 h-4" /> <span className="text-xs font-semibold uppercase tracking-wider">Tap to flip</span>
                </div>
                <p className="text-2xl sm:text-3xl font-medium leading-relaxed">
                  {currentCard.definition}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between w-full mt-8 px-4">
            <button 
              onClick={prevCard}
              className="p-3 sm:p-4 rounded-full bg-secondary hover:bg-border transition-colors text-foreground"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <div className="font-medium text-muted-foreground font-display tracking-widest text-sm uppercase">
              {currentIndex + 1} OF {currentCards.length}
            </div>

            <button 
              onClick={nextCard}
              className="p-3 sm:p-4 rounded-full bg-secondary hover:bg-border transition-colors text-foreground"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
