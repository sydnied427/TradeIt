import { useState, useMemo } from "react";
import { Layout } from "@/components/layout";
import { quizData } from "@/data/quiz";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, BrainCircuit, Trophy, Star } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Quiz() {
  const [currentLevel, setCurrentLevel] = useState<1 | 2 | 3>(1);
  const [streak, setStreak] = useState(0);
  const [wrongInLevel, setWrongInLevel] = useState(0);
  const [score, setScore] = useState(0);
  
  // Track seen questions to avoid immediate repeats
  const [seenIds, setSeenIds] = useState<Set<string>>(new Set());
  
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // Pick a random unseen question for current level
  const currentQuestion = useMemo(() => {
    let available = quizData.filter(q => q.level === currentLevel && !seenIds.has(q.id));
    if (available.length === 0) {
      // If we've seen all questions in this level, reset seen for this level
      available = quizData.filter(q => q.level === currentLevel);
      setSeenIds(new Set([...seenIds].filter(id => quizData.find(q => q.id === id)?.level !== currentLevel)));
    }
    return available[Math.floor(Math.random() * available.length)];
  }, [currentLevel, seenIds, score]); // regenerate when score changes (moves to next question)

  const handleAnswer = (index: number) => {
    if (feedback) return; // Prevent double clicking

    setSelectedOption(index);
    const isCorrect = index === currentQuestion.correctIndex;
    
    setSeenIds(prev => new Set(prev).add(currentQuestion.id));

    if (isCorrect) {
      setFeedback('correct');
      setScore(s => s + 10 * currentLevel);
      const newStreak = streak + 1;
      
      if (newStreak >= 3 && currentLevel < 3) {
        // Level up!
        setTimeout(() => {
          setCurrentLevel(c => (c + 1) as 1 | 2 | 3);
          setStreak(0);
          setWrongInLevel(0);
          setFeedback(null);
          setSelectedOption(null);
        }, 1500);
      } else {
        setStreak(newStreak);
        setTimeout(nextQuestion, 1500);
      }
    } else {
      setFeedback('incorrect');
      setStreak(0);
      const newWrong = wrongInLevel + 1;
      
      if (newWrong >= 2 && currentLevel > 1) {
        // Drop down a level
        setTimeout(() => {
          setCurrentLevel(c => (c - 1) as 1 | 2 | 3);
          setWrongInLevel(0);
          setFeedback(null);
          setSelectedOption(null);
        }, 3000);
      } else {
        setWrongInLevel(newWrong);
        setTimeout(nextQuestion, 3000); // Give them time to read the hint
      }
    }
  };

  const nextQuestion = () => {
    setFeedback(null);
    setSelectedOption(null);
  };

  const levelTitles = {
    1: "Rookie Investor",
    2: "Wall Street Wizard",
    3: "Market Master"
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto pt-4">
        
        {/* Top Stats Bar */}
        <div className="flex items-center justify-between bg-card p-4 rounded-2xl border border-border shadow-sm mb-8">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold",
              currentLevel === 1 ? "bg-blue-500" : currentLevel === 2 ? "bg-purple-500" : "bg-orange-500"
            )}>
              Lv.{currentLevel}
            </div>
            <div>
              <div className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Current Level</div>
              <div className="font-display font-bold text-lg leading-tight">{levelTitles[currentLevel]}</div>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="text-center hidden sm:block">
              <div className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">Streak</div>
              <div className="flex gap-1 justify-center">
                {[0,1,2].map(i => (
                  <div key={i} className={cn(
                    "w-3 h-3 rounded-full transition-colors",
                    i < streak ? "bg-primary" : "bg-secondary"
                  )} />
                ))}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Score</div>
              <div className="font-display font-bold text-2xl text-primary flex items-center gap-1">
                {score} <Trophy className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Question Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-card rounded-3xl border border-border shadow-lg p-6 sm:p-10"
          >
            <div className="mb-8">
              <div className="inline-block px-3 py-1 bg-secondary text-secondary-foreground rounded-lg text-xs font-bold uppercase tracking-wider mb-4">
                Category: {currentQuestion.category}
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold leading-relaxed">
                {currentQuestion.question}
              </h2>
            </div>

            <div className="space-y-3">
              {currentQuestion.options.map((opt, i) => {
                const isSelected = selectedOption === i;
                const isCorrect = i === currentQuestion.correctIndex;
                const showStatus = feedback !== null;
                
                let buttonClass = "bg-secondary hover:bg-secondary/80 text-foreground border-transparent";
                
                if (showStatus) {
                  if (isCorrect) {
                    buttonClass = "bg-primary/10 border-primary text-primary-foreground text-primary font-semibold ring-2 ring-primary ring-offset-2 ring-offset-background";
                  } else if (isSelected && !isCorrect) {
                    buttonClass = "bg-destructive/10 border-destructive text-destructive opacity-70";
                  } else {
                    buttonClass = "bg-secondary/50 opacity-50 border-transparent";
                  }
                }

                return (
                  <button
                    key={i}
                    disabled={showStatus}
                    onClick={() => handleAnswer(i)}
                    className={cn(
                      "w-full text-left p-5 rounded-2xl border-2 transition-all duration-200 text-lg flex justify-between items-center",
                      buttonClass
                    )}
                  >
                    <span>{opt}</span>
                    {showStatus && isCorrect && <CheckCircle2 className="w-6 h-6 text-primary" />}
                    {showStatus && isSelected && !isCorrect && <XCircle className="w-6 h-6 text-destructive" />}
                  </button>
                );
              })}
            </div>

            {/* Feedback Area */}
            <AnimatePresence>
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  className="overflow-hidden"
                >
                  <div className={cn(
                    "p-5 rounded-2xl flex items-start gap-4",
                    feedback === 'correct' ? "bg-primary/10 text-primary-foreground" : "bg-destructive/10 text-destructive-foreground"
                  )}>
                    {feedback === 'correct' ? (
                      <Star className="w-8 h-8 text-primary shrink-0 fill-primary" />
                    ) : (
                      <BrainCircuit className="w-8 h-8 text-destructive shrink-0" />
                    )}
                    <div>
                      <h4 className={cn("font-bold text-lg mb-1", feedback === 'correct' ? "text-primary" : "text-destructive")}>
                        {feedback === 'correct' ? "Nice work!" : "Almost got it!"}
                      </h4>
                      {feedback === 'incorrect' && (
                        <p className="text-foreground/80 font-medium">Hint: {currentQuestion.hint}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>

      </div>
    </Layout>
  );
}
