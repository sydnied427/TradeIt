import { Router, type IRouter } from "express";
import {
  GetStockQuoteQueryParams,
  GetStockQuoteResponse,
  GetTrendingStocksResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

const TRENDING_TICKERS = [
  "AAPL", "MSFT", "NVDA", "TSLA", "AMZN",
  "GOOGL", "META", "AMD", "PLTR", "SPY",
];

const COMPANY_DESCRIPTIONS: Record<string, string> = {
  AAPL: "Apple makes iPhones, MacBooks, and the App Store. They're one of the most valuable companies on Earth.",
  MSFT: "Microsoft makes Windows, Xbox, and Azure cloud services. They also own LinkedIn and GitHub.",
  NVDA: "NVIDIA makes the special computer chips (GPUs) used for gaming and AI. Basically the engine behind most AI tools.",
  TSLA: "Tesla makes electric cars and energy products. Elon Musk runs it. They're also building robots and solar panels.",
  AMZN: "Amazon started as an online bookstore and now delivers almost everything. They also run AWS, the internet's biggest cloud service.",
  GOOGL: "Google's parent company. They run Google Search, YouTube, Gmail, and Android. They make most of their money from ads.",
  META: "Meta owns Facebook, Instagram, and WhatsApp. They're betting big on virtual reality and the 'metaverse.'",
  AMD: "AMD makes computer processors that compete with Intel and NVIDIA. Popular in gaming PCs and data centers.",
  PLTR: "Palantir builds data analysis software used by governments and big companies to find patterns in huge amounts of information.",
  SPY: "This isn't a single company — it's an ETF (a basket) that tracks the 500 biggest US companies. If the US economy does well, this goes up.",
  JPM: "JPMorgan Chase is one of America's largest banks. They handle loans, investments, and banking for millions of people.",
  V: "Visa is the payment network that processes billions of card transactions worldwide. They make money every time you swipe your card.",
  WMT: "Walmart is the world's largest retailer by revenue. They sell almost everything at low prices, mostly in physical stores.",
  DIS: "Disney owns Marvel, Star Wars, Pixar, ESPN, and Disney+. They make movies, run theme parks, and stream shows.",
  NFLX: "Netflix is the biggest streaming service in the world with over 260 million subscribers watching movies and TV shows.",
};

async function getYahooFinance() {
  const { default: YahooFinanceClass } = await import("yahoo-finance2");
  return new (YahooFinanceClass as any)({ suppressNotices: ["yahooSurvey"] });
}

router.get("/stocks/quote", async (req, res) => {
  const query = GetStockQuoteQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: "Invalid ticker parameter" });
    return;
  }

  const ticker = query.data.ticker.toUpperCase().trim();

  try {
    const yf = await getYahooFinance();

    const [quote, summaryResult] = await Promise.allSettled([
      yf.quote(ticker),
      yf.quoteSummary(ticker, { modules: ["summaryProfile", "summaryDetail"] }),
    ]);

    if (quote.status === "rejected") {
      res.status(404).json({ error: `Could not find stock: ${ticker}` });
      return;
    }

    const q = quote.value;
    const profile = summaryResult.status === "fulfilled" ? summaryResult.value.summaryProfile : null;
    const detail = summaryResult.status === "fulfilled" ? summaryResult.value.summaryDetail : null;

    const description =
      COMPANY_DESCRIPTIONS[ticker] ||
      ((profile as any)?.longBusinessSummary?.split(". ").slice(0, 2).join(". ") + ".") ||
      `${q.shortName || ticker} is a publicly traded company on the stock market.`;

    const formatMarketCap = (cap?: number | null): string => {
      if (!cap) return "N/A";
      if (cap >= 1e12) return `$${(cap / 1e12).toFixed(2)}T`;
      if (cap >= 1e9) return `$${(cap / 1e9).toFixed(2)}B`;
      if (cap >= 1e6) return `$${(cap / 1e6).toFixed(2)}M`;
      return `$${cap.toLocaleString()}`;
    };

    const formatVolume = (vol?: number | null): string => {
      if (!vol) return "N/A";
      if (vol >= 1e9) return `${(vol / 1e9).toFixed(2)}B`;
      if (vol >= 1e6) return `${(vol / 1e6).toFixed(2)}M`;
      if (vol >= 1e3) return `${(vol / 1e3).toFixed(0)}K`;
      return vol.toString();
    };

    const data = GetStockQuoteResponse.parse({
      ticker: q.symbol || ticker,
      companyName: q.longName || q.shortName || ticker,
      price: q.regularMarketPrice ?? 0,
      change: q.regularMarketChange ?? 0,
      changePercent: q.regularMarketChangePercent ?? 0,
      marketCap: formatMarketCap(q.marketCap),
      volume: formatVolume(q.regularMarketVolume),
      description,
      sector: (profile as any)?.sector || q.sector || "Unknown",
      high52w: (detail as any)?.fiftyTwoWeekHigh ?? q.fiftyTwoWeekHigh ?? 0,
      low52w: (detail as any)?.fiftyTwoWeekLow ?? q.fiftyTwoWeekLow ?? 0,
    });

    res.json(data);
  } catch (err) {
    console.error("Error fetching stock quote:", err);
    res.status(500).json({ error: "Failed to fetch stock data. Please try again." });
  }
});

router.get("/stocks/trending", async (_req, res) => {
  try {
    const yf = await getYahooFinance();

    const results = await Promise.allSettled(
      TRENDING_TICKERS.map((ticker) => yf.quote(ticker))
    );

    const stocks = results
      .filter((r): r is PromiseFulfilledResult<any> => r.status === "fulfilled")
      .map((r) => ({
        ticker: r.value.symbol,
        companyName: r.value.shortName || r.value.longName || r.value.symbol,
        price: r.value.regularMarketPrice ?? 0,
        changePercent: r.value.regularMarketChangePercent ?? 0,
      }));

    const data = GetTrendingStocksResponse.parse({ stocks });
    res.json(data);
  } catch (err) {
    console.error("Error fetching trending stocks:", err);
    res.status(500).json({ error: "Failed to fetch trending stocks." });
  }
});

export default router;
