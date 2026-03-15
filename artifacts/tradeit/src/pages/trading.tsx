import { useState } from "react";
import { Layout } from "@/components/layout";
import { usePortfolio } from "@/hooks/use-portfolio";
import { useGetStockQuote } from "@workspace/api-client-react";
import { formatMoney, formatPercent, cn } from "@/lib/utils";
import { Wallet, Search as SearchIcon, ArrowRightLeft, TrendingUp, TrendingDown, RefreshCcw, BarChart2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { resolveToTicker } from "@/data/companyMap";

// Helper component to fetch current price for a held position
function PositionRow({
  ticker,
  shares,
  avgPrice,
  onTrade
}: {
  ticker: string,
  shares: number,
  avgPrice: number,
  onTrade: (ticker: string) => void
}) {
  const { data: quote, isLoading } = useGetStockQuote({ ticker }, { query: { refetchInterval: 30000 } });

  const currentPrice = quote?.price || avgPrice;
  const currentValue = shares * currentPrice;
  const totalCost = shares * avgPrice;
  const profitDollar = currentValue - totalCost;
  const profitPercent = totalCost > 0 ? (profitDollar / totalCost) * 100 : 0;

  const isPositive = profitDollar >= 0;

  return (
    <div className="flex items-center justify-between p-4 border-b border-border/50 last:border-0 hover:bg-secondary/20 transition-colors group">
      <div>
        <div className="font-bold text-lg">{ticker}</div>
        <div className="text-sm text-muted-foreground">{shares} shares @ {formatMoney(avgPrice)}</div>
      </div>
      <div className="flex items-center gap-6">
        <div className="text-right">
          <div className="font-bold">{isLoading ? "..." : formatMoney(currentValue)}</div>
          <div className={cn(
            "text-sm font-semibold flex items-center justify-end gap-1",
            isPositive ? "text-primary" : "text-destructive"
          )}>
            {isPositive ? '+' : ''}{formatMoney(profitDollar)} ({formatPercent(profitPercent)})
          </div>
        </div>
        <button
          onClick={() => onTrade(ticker)}
          className="opacity-0 group-hover:opacity-100 p-2 bg-secondary text-foreground rounded-lg hover:bg-primary hover:text-primary-foreground transition-all"
          title="Trade this stock"
        >
          <ArrowRightLeft className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// Starting balance setup screen
function BalanceSetup({ onStart }: { onStart: (balance: number) => void }) {
  const [rawValue, setRawValue] = useState("10000");
  const parsed = parseFloat(rawValue.replace(/,/g, "")) || 0;
  const isValid = parsed >= 0.01 && parsed <= 1_000_000;

  const presets = [1000, 5000, 10000, 25000, 50000];

  return (
    <Layout>
      <div className="max-w-xl mx-auto mt-12 sm:mt-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
          <Sparkles className="w-4 h-4" />
          Paper Trading Simulator
        </div>

        <h1 className="text-3xl sm:text-4xl font-display font-extrabold mb-3">
          Set your starting balance
        </h1>
        <p className="text-muted-foreground text-lg mb-10">
          Choose how much fake money you want to practice with. You can always reset later.
        </p>

        <div className="bg-card border border-border rounded-3xl p-8 shadow-md space-y-8">
          {/* Amount display */}
          <div>
            <div className="text-5xl font-display font-extrabold text-primary mb-2">
              {isValid ? formatMoney(parsed) : "$—"}
            </div>
            <p className="text-sm text-muted-foreground">Starting cash balance</p>
          </div>

          {/* Slider */}
          <input
            type="range"
            min={1}
            max={1000000}
            step={500}
            value={Math.min(Math.max(parsed, 1), 1000000)}
            onChange={(e) => setRawValue(e.target.value)}
            className="w-full accent-primary"
          />

          {/* Preset buttons */}
          <div className="flex flex-wrap gap-2 justify-center">
            {presets.map((p) => (
              <button
                key={p}
                onClick={() => setRawValue(String(p))}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all",
                  parsed === p
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-secondary text-secondary-foreground hover:border-primary/40"
                )}
              >
                {formatMoney(p)}
              </button>
            ))}
          </div>

          {/* Custom input */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Or enter a custom amount</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-muted-foreground font-bold text-lg">$</span>
              <input
                type="number"
                min={0.01}
                max={1000000}
                step={0.01}
                value={rawValue}
                onChange={(e) => setRawValue(e.target.value)}
                className="w-full pl-8 pr-4 py-3 text-lg font-bold border-2 border-border rounded-xl focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none"
                placeholder="10000"
              />
            </div>
            {!isValid && rawValue !== "" && (
              <p className="text-sm text-destructive mt-1">Enter an amount between $0.01 and $1,000,000</p>
            )}
          </div>

          <button
            disabled={!isValid}
            onClick={() => isValid && onStart(parsed)}
            className={cn(
              "w-full py-4 rounded-xl font-bold text-lg transition-all",
              isValid
                ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25 active:scale-[0.98]"
                : "bg-secondary text-muted-foreground cursor-not-allowed"
            )}
          >
            Start Trading →
          </button>
        </div>
      </div>
    </Layout>
  );
}

export default function Trading() {
  const { cash, positions, buyStock, sellStock, resetPortfolio, configurePortfolio, hasConfigured, startingBalance } = usePortfolio();
  const { toast } = useToast();

  const [searchInput, setSearchInput] = useState("");
  const [activeTicker, setActiveTicker] = useState("");
  const [tradeAction, setTradeAction] = useState<'buy' | 'sell'>('buy');
  const [sharesInput, setSharesInput] = useState<string>("1");

  // All hooks must be called before any conditional returns
  const { data: quote, isLoading: quoteLoading } = useGetStockQuote(
    { ticker: activeTicker },
    { query: { enabled: !!activeTicker && hasConfigured, retry: false } }
  );

  // Show setup screen on first visit (or after reset)
  if (!hasConfigured) {
    return <BalanceSetup onStart={(balance) => configurePortfolio(balance)} />;
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setActiveTicker(resolveToTicker(searchInput));
      setSharesInput("1");
    }
  };

  const handleTrade = () => {
    if (!quote) return;
    const shares = parseFloat(sharesInput);
    if (isNaN(shares) || shares <= 0) {
      toast({ title: "Invalid shares", variant: "destructive" });
      return;
    }

    if (tradeAction === 'buy') {
      const cost = shares * quote.price;
      if (cost > cash) {
        toast({ title: "Not enough cash", description: `Need ${formatMoney(cost)}`, variant: "destructive" });
        return;
      }
      buyStock(quote.ticker, shares, quote.price);
      toast({
        title: "Trade Executed",
        description: `Bought ${shares} shares of ${quote.ticker}`,
        className: "bg-primary text-primary-foreground border-none"
      });
    } else {
      const pos = positions.find(p => p.ticker === quote.ticker);
      if (!pos || pos.shares < shares) {
        toast({ title: "Not enough shares to sell", variant: "destructive" });
        return;
      }
      sellStock(quote.ticker, shares, quote.price);
      toast({
        title: "Trade Executed",
        description: `Sold ${shares} shares of ${quote.ticker}`,
      });
    }
    setSharesInput("1");
  };

  const estimatedInvested = positions.reduce((acc, pos) => acc + (pos.shares * pos.averageBuyPrice), 0);
  const estimatedTotal = cash + estimatedInvested;
  const totalReturn = estimatedTotal - startingBalance;

  return (
    <Layout>
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold">Paper Trading</h1>
          <p className="text-muted-foreground text-lg">Practice trading with {formatMoney(startingBalance)} of fake money.</p>
        </div>
        <button
          onClick={() => {
            if (confirm("Reset your portfolio? You'll be able to set a new starting balance.")) resetPortfolio();
          }}
          className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors text-sm font-semibold"
        >
          <RefreshCcw className="w-4 h-4" /> Reset Account
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left Column: Portfolio */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-card rounded-3xl border border-border shadow-md overflow-hidden">
            <div className="bg-foreground text-background p-8">
              <div className="text-background/70 font-semibold tracking-wider text-sm uppercase mb-2 flex items-center gap-2">
                <Wallet className="w-5 h-5" /> Buying Power (Cash)
              </div>
              <div className="text-5xl font-display font-bold tracking-tight mb-6">{formatMoney(cash)}</div>

              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-background/20">
                <div>
                  <div className="text-background/60 text-sm mb-1">Total Account Value</div>
                  <div className="text-xl font-bold">~{formatMoney(estimatedTotal)}</div>
                </div>
                <div>
                  <div className="text-background/60 text-sm mb-1">Total Return</div>
                  <div className={cn(
                    "text-xl font-bold",
                    totalReturn >= 0 ? "text-primary" : "text-red-400"
                  )}>
                    {totalReturn >= 0 ? '+' : ''}{formatMoney(totalReturn)}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              <h3 className="font-display font-bold text-xl mb-4">Your Positions</h3>
              {positions.length === 0 ? (
                <div className="text-center py-12 px-4 bg-secondary/30 rounded-2xl border-2 border-dashed border-border text-muted-foreground">
                  <BarChart2 className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p className="font-medium">You don't own any stocks yet.</p>
                  <p className="text-sm mt-1">Use the search panel to make your first trade.</p>
                </div>
              ) : (
                <div className="border border-border/50 rounded-2xl overflow-hidden bg-card">
                  {positions.map(p => (
                    <PositionRow
                      key={p.ticker}
                      ticker={p.ticker}
                      shares={p.shares}
                      avgPrice={p.averageBuyPrice}
                      onTrade={(t) => {
                        setSearchInput(t);
                        setActiveTicker(t);
                        setTradeAction('sell');
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Trade Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-card rounded-3xl border border-border shadow-md p-6 sm:p-8">
            <h2 className="text-2xl font-display font-bold mb-6">Make a Trade</h2>

            <form onSubmit={handleSearch} className="relative mb-8">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Ticker or company name..."
                className="block w-full pl-10 pr-4 sm:pr-20 py-3 border-2 border-border rounded-xl bg-secondary/20 focus:bg-background focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all outline-none"
              />
              <button
                type="submit"
                className="hidden sm:block absolute inset-y-2 right-2 px-3 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors"
              >
                Look up
              </button>
            </form>

            {quoteLoading && (
              <div className="py-12 text-center text-muted-foreground">
                <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-2" />
                Loading price...
              </div>
            )}

            {quote && (
              <div className="animate-in fade-in zoom-in-95 duration-300">
                <div className="flex justify-between items-start mb-6 pb-6 border-b border-border/50">
                  <div>
                    <h3 className="font-bold text-2xl tracking-tight">{quote.ticker}</h3>
                    <p className="text-muted-foreground text-sm line-clamp-1">{quote.companyName}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-display font-bold text-3xl">{formatMoney(quote.price)}</div>
                    <div className={cn(
                      "text-sm font-bold flex items-center justify-end gap-1",
                      quote.change >= 0 ? "text-primary" : "text-destructive"
                    )}>
                      {quote.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      {formatPercent(quote.changePercent)}
                    </div>
                  </div>
                </div>

                <div className="flex bg-secondary p-1 rounded-xl mb-6">
                  <button
                    onClick={() => setTradeAction('buy')}
                    className={cn(
                      "flex-1 py-2 text-sm font-bold rounded-lg transition-all",
                      tradeAction === 'buy' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Buy
                  </button>
                  <button
                    onClick={() => setTradeAction('sell')}
                    className={cn(
                      "flex-1 py-2 text-sm font-bold rounded-lg transition-all",
                      tradeAction === 'sell' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Sell
                  </button>
                </div>

                <div className="space-y-4 mb-8">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Number of Shares</label>
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={sharesInput}
                      onChange={(e) => setSharesInput(e.target.value)}
                      className="w-full p-3 text-lg font-bold border-2 border-border rounded-xl focus:ring-4 focus:ring-primary/20 outline-none"
                    />
                  </div>

                  <div className="flex justify-between items-center p-4 bg-secondary/50 rounded-xl">
                    <span className="text-muted-foreground font-medium">Estimated Total</span>
                    <span className="font-bold text-xl">{formatMoney((parseFloat(sharesInput) || 0) * quote.price)}</span>
                  </div>
                </div>

                <button
                  onClick={handleTrade}
                  className={cn(
                    "w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg transition-all active:scale-[0.98]",
                    tradeAction === 'buy'
                      ? "bg-primary hover:bg-primary/90 shadow-primary/25"
                      : "bg-blue-500 hover:bg-blue-600 shadow-blue-500/25"
                  )}
                >
                  {tradeAction === 'buy' ? 'Submit Buy Order' : 'Submit Sell Order'}
                </button>

                {tradeAction === 'sell' && (
                  <p className="text-center text-sm text-muted-foreground mt-3">
                    You own {positions.find(p => p.ticker === quote.ticker)?.shares || 0} shares
                  </p>
                )}
              </div>
            )}

            {!quote && !quoteLoading && activeTicker && (
              <div className="py-8 text-center text-destructive bg-destructive/10 rounded-xl border border-destructive/20">
                Could not find stock "{activeTicker}". Try a ticker like AAPL.
              </div>
            )}

            {!quote && !activeTicker && (
              <div className="py-12 text-center text-muted-foreground opacity-50">
                <SearchIcon className="w-12 h-12 mx-auto mb-2" />
                Search a stock to start trading
              </div>
            )}

          </div>
        </div>
      </div>
    </Layout>
  );
}
