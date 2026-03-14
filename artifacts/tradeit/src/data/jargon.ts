export type JargonCategory = 'Basics' | 'Stocks' | 'ETFs' | 'Options' | 'Crypto' | 'Bonds';

export interface Flashcard {
  id: string;
  term: string;
  definition: string;
  category: JargonCategory;
}

export const jargonData: Flashcard[] = [
  // Basics
  { id: '1', category: 'Basics', term: 'Portfolio', definition: 'A fancy word for your collection of investments. If you own 3 stocks and 1 bond, that group is your portfolio.' },
  { id: '2', category: 'Basics', term: 'Bull Market', definition: 'When the stock market is going UP generally. Think of a bull attacking by thrusting its horns UP into the air.' },
  { id: '3', category: 'Basics', term: 'Bear Market', definition: 'When the stock market is going DOWN generally. Think of a bear attacking by swiping its paws DOWN.' },
  { id: '4', category: 'Basics', term: 'Dividend', definition: 'A small cash bonus a company pays you just for owning their stock. It\'s like getting paid to hold on to it.' },
  { id: '5', category: 'Basics', term: 'Volatility', definition: 'How much and how fast a price jumps up and down. High volatility means a bumpy roller coaster ride.' },
  { id: '6', category: 'Basics', term: 'Diversification', definition: 'Not putting all your eggs in one basket. Buying different types of investments so if one crashes, you don\'t lose everything.' },
  
  // Stocks
  { id: '7', category: 'Stocks', term: 'Share/Stock', definition: 'A tiny slice of ownership in a company. If a company is a pizza, a share is one tiny crumb of a slice.' },
  { id: '8', category: 'Stocks', term: 'Ticker Symbol', definition: 'The short abbreviation for a company on the stock market. Apple is AAPL, Microsoft is MSFT.' },
  { id: '9', category: 'Stocks', term: 'Market Cap', definition: 'What the entire company is worth. You calculate it by multiplying the price of one share by all the shares that exist.' },
  { id: '10', category: 'Stocks', term: 'Blue Chip', definition: 'Huge, reliable, well-known companies that have been around forever and make steady money (like Disney or Coca-Cola).' },
  { id: '11', category: 'Stocks', term: 'IPO', definition: 'Initial Public Offering. It\'s the very first day a private company starts selling slices of itself to regular people like us.' },
  { id: '12', category: 'Stocks', term: 'Volume', definition: 'How many shares of a stock were bought and sold that day. High volume means it\'s super popular right now.' },

  // ETFs
  { id: '13', category: 'ETFs', term: 'ETF', definition: 'Exchange Traded Fund. It\'s like a variety pack or a fruit basket of stocks. You buy one ETF, and inside it are tiny pieces of hundreds of companies.' },
  { id: '14', category: 'ETFs', term: 'Index Fund', definition: 'An ETF that just copies a famous list of stocks, like the "Top 500 Companies in America". It runs automatically without a fancy manager.' },
  { id: '15', category: 'ETFs', term: 'S&P 500', definition: 'A famous list of the 500 biggest companies in the US. People use it as the ultimate scorecard to see how the whole economy is doing.' },
  { id: '16', category: 'ETFs', term: 'Expense Ratio', definition: 'The tiny fee you pay every year to the company that built the ETF. If it\'s 0.10%, you pay 10 cents for every $100 you invest.' },
  { id: '17', category: 'ETFs', term: 'Mutual Fund', definition: 'Very similar to an ETF (a basket of stocks), but they only trade once a day at the very end, instead of all day long like normal stocks.' },
  { id: '18', category: 'ETFs', term: 'Sector', definition: 'A specific category of businesses. Tech is a sector, Healthcare is a sector, Energy is a sector.' },

  // Options (Simplified heavily)
  { id: '19', category: 'Options', term: 'Options Contract', definition: 'A coupon that gives you the *choice* (but not the requirement) to buy or sell a stock at a specific price before a certain date.' },
  { id: '20', category: 'Options', term: 'Call Option', definition: 'A bet that a stock will go UP. You buy a coupon letting you buy the stock cheap later, even if the real price skyrockets.' },
  { id: '21', category: 'Options', term: 'Put Option', definition: 'A bet that a stock will go DOWN. You buy a coupon letting you sell the stock for a high price later, even if it crashes.' },
  { id: '22', category: 'Options', term: 'Strike Price', definition: 'The locked-in price written on your option coupon.' },
  { id: '23', category: 'Options', term: 'Expiration Date', definition: 'The day your option coupon expires and becomes worthless. You have to use it or sell it before this day.' },
  { id: '24', category: 'Options', term: 'Premium', definition: 'The price you pay upfront to buy the option coupon in the first place.' }
];

export const jargonCategories: JargonCategory[] = ['Basics', 'Stocks', 'ETFs', 'Options'];
