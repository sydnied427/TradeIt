import { Link, useLocation } from "wouter";
import { BookOpen, LineChart, Search, BrainCircuit, Leaf } from "lucide-react";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();

  const navItems = [
    { href: "/jargon", label: "Jargon", icon: BookOpen },
    { href: "/trading", label: "Trade", icon: LineChart },
    { href: "/search", label: "Search", icon: Search },
    { href: "/quiz", label: "Quiz", icon: BrainCircuit },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-primary-foreground group-hover:scale-105 transition-transform">
              <Leaf className="w-5 h-5" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-foreground">TradeIt</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link 
                key={item.href} 
                href={item.href}
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                  location === item.href ? "text-primary" : "text-muted-foreground"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="md:hidden flex items-center gap-4">
             {/* Mobile bottom nav instead, see below */}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 pb-24 md:pb-8">
        {children}
      </main>

      {/* Mobile Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur-xl border-t border-border/50 pb-safe z-50">
        <div className="flex items-center justify-around px-2 h-16">
          <Link 
            href="/"
            className={cn(
              "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
              location === "/" ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Leaf className="w-5 h-5" />
            <span className="text-[10px] font-medium">Home</span>
          </Link>
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
                location === item.href ? "text-primary" : "text-muted-foreground"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
