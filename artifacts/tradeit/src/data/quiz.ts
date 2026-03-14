import { JargonCategory } from './jargon';

export interface QuizQuestion {
  id: string;
  level: 1 | 2 | 3;
  category: JargonCategory;
  question: string;
  options: string[];
  correctIndex: number;
  hint: string;
}

export const quizData: QuizQuestion[] = [
  // LEVEL 1 (Basics)
  { id: 'q1', level: 1, category: 'Basics', question: 'When the overall stock market is going UP, what animal do we name it after?', options: ['A Bull', 'A Bear', 'A Lion', 'An Eagle'], correctIndex: 0, hint: 'Think of an animal that thrusts its horns UP.' },
  { id: 'q2', level: 1, category: 'Stocks', question: 'What do we call a tiny slice of ownership in a company?', options: ['A Coupon', 'A Token', 'A Share', 'A Fraction'], correctIndex: 2, hint: 'You are "sharing" ownership with others.' },
  { id: 'q3', level: 1, category: 'Basics', question: 'What is a "Ticker Symbol"?', options: ['A clock on Wall Street', 'A short abbreviation for a company (like AAPL)', 'The sound a trade makes', 'A warning that a stock will crash'], correctIndex: 1, hint: 'It\'s used to quickly identify a company.' },
  { id: 'q4', level: 1, category: 'Basics', question: 'What does "Diversification" mean?', options: ['Selling all your stocks', 'Only buying the most expensive stocks', 'Not putting all your eggs in one basket', 'Trading very fast'], correctIndex: 2, hint: 'It protects you if one single thing fails.' },
  { id: 'q5', level: 1, category: 'Basics', question: 'When a company pays you a small cash bonus just for owning their stock, what is it called?', options: ['A Salary', 'A Dividend', 'A Tip', 'A Refund'], correctIndex: 1, hint: 'It starts with a D and sounds like "divide".' },
  
  // LEVEL 2
  { id: 'q6', level: 2, category: 'Basics', question: 'What is a "Bear Market"?', options: ['A market where prices are going up fast', 'A market where everyone is sleeping', 'A market where prices are generally falling', 'A market only for animal products'], correctIndex: 2, hint: 'Think of an animal swiping its paws DOWN.' },
  { id: 'q7', level: 2, category: 'ETFs', question: 'What is an ETF?', options: ['Extra Trading Fee', 'Exchange Traded Fund (a basket of stocks)', 'Electronic Transfer Format', 'Early Trading Friday'], correctIndex: 1, hint: 'It\'s a variety pack of investments.' },
  { id: 'q8', level: 2, category: 'Stocks', question: 'What does "Market Cap" tell you?', options: ['The maximum price a stock can reach', 'How much the entire company is worth', 'The cap on how many shares you can buy', 'The hat the CEO wears'], correctIndex: 1, hint: 'It measures the total size/value of the business.' },
  { id: 'q9', level: 2, category: 'Stocks', question: 'What is an IPO?', options: ['Internal Profit Organization', 'Initial Public Offering (a company\'s first day on the market)', 'Investing Portfolio Option', 'Income Producing Object'], correctIndex: 1, hint: 'It\'s when a private company becomes "Public".' },
  { id: 'q10', level: 2, category: 'ETFs', question: 'What is the S&P 500?', options: ['The 500 worst stocks', 'A car race', 'A famous list of the 500 biggest US companies', 'A fee you pay your broker'], correctIndex: 2, hint: 'It\'s the ultimate scorecard for the US economy.' },

  // LEVEL 3
  { id: 'q11', level: 3, category: 'Stocks', question: 'What are "Blue Chip" stocks?', options: ['Stocks related to poker', 'Cheap, risky penny stocks', 'Huge, reliable, well-known companies', 'Companies that make computer chips'], correctIndex: 2, hint: 'Think of massive companies like Disney or Microsoft.' },
  { id: 'q12', level: 3, category: 'Options', question: 'If you buy a "Call Option", what are you betting will happen?', options: ['The stock price will go UP', 'The stock price will go DOWN', 'The stock price will stay exactly the same', 'The company will go bankrupt'], correctIndex: 0, hint: 'You want the right to buy it cheap later when it is expensive.' },
  { id: 'q13', level: 3, category: 'Options', question: 'If you buy a "Put Option", what are you betting will happen?', options: ['The stock price will go UP', 'The stock price will go DOWN', 'The stock price will stay exactly the same', 'The company will pay a dividend'], correctIndex: 1, hint: 'You want the right to sell it high later when it has crashed.' },
  { id: 'q14', level: 3, category: 'ETFs', question: 'What is an "Expense Ratio"?', options: ['How much you spend on coffee', 'The fee you pay to buy a single stock', 'The tiny yearly fee to the company that built an ETF', 'The tax on your profits'], correctIndex: 2, hint: 'It\'s the cost of having someone manage the "basket" for you.' },
  { id: 'q15', level: 3, category: 'Options', question: 'What is the "Premium" in options trading?', options: ['The VIP customer service line', 'The highest price the stock reached', 'The upfront price you pay to buy the option coupon', 'The profit you make at the end'], correctIndex: 2, hint: 'It\'s the cost of entry to get the contract.' }
];
