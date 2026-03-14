import { Link } from "wouter";
import { Layout } from "@/components/layout";
import { BookOpen, LineChart, Search, BrainCircuit, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const cards = [
  {
    title: "Jargon Explainer",
    description: "Wall Street speak, translated for humans. Swipe through flashcards to learn the basics.",
    icon: BookOpen,
    href: "/jargon",
    color: "bg-blue-50 text-blue-600 border-blue-100",
    iconBg: "bg-blue-100/50"
  },
  {
    title: "Paper Trading",
    description: "Start with $10,000 in fake cash. Practice buying and selling real stocks with zero risk.",
    icon: LineChart,
    href: "/trading",
    color: "bg-primary/5 text-primary border-primary/10",
    iconBg: "bg-primary/10"
  },
  {
    title: "Stock Search",
    description: "Look up any company to see how they're doing. See what's trending in the market today.",
    icon: Search,
    href: "/search",
    color: "bg-purple-50 text-purple-600 border-purple-100",
    iconBg: "bg-purple-100/50"
  },
  {
    title: "Beginner Quiz",
    description: "Test your knowledge. Questions adapt to your skill level as you get smarter.",
    icon: BrainCircuit,
    href: "/quiz",
    color: "bg-orange-50 text-orange-600 border-orange-100",
    iconBg: "bg-orange-100/50"
  }
];

export default function Home() {
  return (
    <Layout>
      <div className="flex flex-col items-center text-center max-w-2xl mx-auto mt-8 sm:mt-12 mb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6"
        >
          <Sparkles className="w-4 h-4" />
          <span>The friendliest way to learn investing</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold text-foreground tracking-tight leading-[1.1] mb-6"
        >
          Learn to invest. <br />
          <span className="text-primary">Start with $0 risk.</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg sm:text-xl text-muted-foreground max-w-xl"
        >
          We remove the intimidation from the stock market. Plain English definitions, fun quizzes, and a fake-money simulator.
        </motion.p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
      >
        {cards.map((card, i) => (
          <Link key={card.title} href={card.href}>
            <div className="group relative bg-card p-6 sm:p-8 rounded-3xl border border-border/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">
                <ArrowRight className="w-6 h-6 text-muted-foreground" />
              </div>
              
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${card.iconBg} ${card.color.split(' ')[1]}`}>
                <card.icon className="w-7 h-7" />
              </div>
              
              <h3 className="text-2xl font-display font-bold text-foreground mb-3">{card.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{card.description}</p>
            </div>
          </Link>
        ))}
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-16 sm:mt-24 text-center pb-8"
      >
        <div className="inline-block bg-accent text-accent-foreground px-6 py-4 rounded-2xl max-w-lg shadow-sm border border-primary/10">
          <p className="text-sm font-semibold uppercase tracking-wider mb-1 opacity-70">💡 Did you know?</p>
          <p className="font-medium text-base">If you invested $100 in the S&P 500 in 1990, it would be worth over $2,000 today. Time in the market beats timing the market!</p>
        </div>
      </motion.div>
    </Layout>
  );
}
