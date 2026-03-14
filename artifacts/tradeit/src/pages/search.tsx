import { useState } from "react";
import { Layout } from "@/components/layout";
import { useGetStockQuote, useGetTrendingStocks } from "@workspace/api-client-react";
import { Search as SearchIcon, TrendingUp, TrendingDown, Building2, AlertCircle } from "lucide-react";
import { formatMoney, formatPercent, cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function Search() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");

  // We use a small delay manually or just search on enter to save API calls
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setDebouncedTerm(searchTerm.trim().toUpperCase());
    }
  };

  const { data: trendingData, isLoading: trendingLoading } = useGetTrendingStocks();
  const { data: searchData, isLoading: searchLoading, error: searchError } = useGetStockQuote(
    { ticker: debouncedTerm },
    { query: { enabled: !!debouncedTerm, retry: false } }
  );

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Search Header */}
        <div className="text-center space-y-6">
          <h1 className="text-3xl sm:text-4xl font-display font-bold">Search Companies</h1>
          <form onSubmit={handleSearch} className="relative max-w-xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <SearchIcon className="h-6 w-6 text-muted-foreground" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Enter ticker (e.g. AAPL) or company name..."
              className="block w-full pl-12 pr-4 py-4 sm:text-lg border-2 border-border rounded-2xl bg-card focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all outline-none"
            />
            <button 
              type="submit"
              className="absolute inset-y-2 right-2 px-6 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        {/* Search Results */}
        {debouncedTerm && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {searchLoading && (
              <div className="p-12 text-center text-muted-foreground flex flex-col items-center">
                <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
                Searching Wall Street...
              </div>
            )}

            {searchError && (
              <div className="p-8 bg-destructive/10 text-destructive rounded-2xl border border-destructive/20 flex flex-col items-center text-center">
                <AlertCircle className="w-12 h-12 mb-3 opacity-80" />
                <h3 className="text-lg font-bold">We couldn't find that stock.</h3>
                <p className="opacity-80">Make sure you entered a valid ticker symbol (like MSFT or AMZN).</p>
              </div>
            )}

            {searchData && (
              <div className="bg-card rounded-3xl border border-border shadow-lg overflow-hidden">
                <div className="p-6 sm:p-8 border-b border-border/50 bg-gradient-to-b from-secondary/50 to-transparent">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-foreground text-background rounded-lg font-bold text-sm tracking-wider">
                          {searchData.ticker}
                        </span>
                        <span className="text-muted-foreground font-medium">{searchData.sector || 'Public Company'}</span>
                      </div>
                      <h2 className="text-3xl font-display font-bold">{searchData.companyName}</h2>
                    </div>
                    <div className="text-left sm:text-right">
                      <div className="text-4xl font-display font-extrabold">{formatMoney(searchData.price)}</div>
                      <div className={cn(
                        "flex items-center gap-1 font-semibold text-lg justify-start sm:justify-end mt-1",
                        searchData.change >= 0 ? "text-primary" : "text-destructive"
                      )}>
                        {searchData.change >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                        {searchData.change >= 0 ? '+' : ''}{formatMoney(searchData.change)} ({formatPercent(searchData.changePercent)})
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-2 space-y-4">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-muted-foreground" /> What they do
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-lg">
                      {searchData.description}
                    </p>
                  </div>
                  
                  <div className="space-y-6 bg-secondary/30 p-6 rounded-2xl">
                    <div>
                      <div className="text-sm text-muted-foreground font-medium mb-1">Market Cap</div>
                      <div className="text-xl font-bold">{searchData.marketCap || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground font-medium mb-1">Volume</div>
                      <div className="text-xl font-bold">{searchData.volume || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground font-medium mb-1">52-Week Range</div>
                      <div className="text-lg font-bold">
                        {searchData.low52w ? formatMoney(searchData.low52w) : 'N/A'} - {searchData.high52w ? formatMoney(searchData.high52w) : 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Trending Section */}
        {!debouncedTerm && (
          <div className="pt-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-display font-bold">Trending Today</h2>
            </div>

            {trendingLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-32 bg-secondary/50 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : trendingData?.stocks && trendingData.stocks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {trendingData.stocks.map((stock, i) => (
                  <motion.button
                    key={stock.ticker}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => {
                      setSearchTerm(stock.ticker);
                      setDebouncedTerm(stock.ticker);
                    }}
                    className="bg-card p-5 rounded-2xl border border-border shadow-sm hover:shadow-md hover:border-primary/30 transition-all text-left group"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="font-bold text-lg">{stock.ticker}</div>
                      <div className={cn(
                        "px-2 py-1 rounded-md text-xs font-bold",
                        stock.changePercent >= 0 ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
                      )}>
                        {stock.changePercent >= 0 ? '+' : ''}{formatPercent(stock.changePercent)}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground line-clamp-1 mb-2 group-hover:text-foreground transition-colors">{stock.companyName}</div>
                    <div className="font-display font-extrabold text-xl">{formatMoney(stock.price)}</div>
                  </motion.button>
                ))}
              </div>
            ) : (
              <div className="text-center p-8 bg-secondary/50 rounded-2xl text-muted-foreground">
                Trending data unavailable right now.
              </div>
            )}
          </div>
        )}

      </div>
    </Layout>
  );
}
