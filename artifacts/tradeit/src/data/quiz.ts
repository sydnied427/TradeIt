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
  {
    id: 'q1',
    level: 1,
    category: 'Basics',
    question: 'What do we call the market when it is trending upward?',
    options: ['A Bull Market', 'A Bear Market', 'A Lion Market', 'An Eagle Market'],
    correctIndex: 0,
    hint: 'Think of an animal that thrusts its horns UP.'
  },
  {
    id: 'q2',
    level: 1,
    category: 'Stocks',
    question: 'What do we call a tiny slice of ownership in a company?',
    options: ['A Coupon', 'A Token', 'A Share', 'A Fraction'],
    correctIndex: 2,
    hint: 'You are sharing ownership with others.'
  },
  {
    id: 'q3',
    level: 1,
    category: 'Basics',
    question: 'What is a Ticker Symbol?',
    options: ['A clock on Wall Street', 'A short code that identifies a company on the stock market', 'The sound a trade makes', 'A warning that a stock will crash'],
    correctIndex: 1,
    hint: 'It is used to quickly find and identify a company — like AAPL for Apple.'
  },
  {
    id: 'q4',
    level: 1,
    category: 'Basics',
    question: 'What does Diversification mean?',
    options: ['Selling all your stocks', 'Only buying the most expensive stocks', 'Spreading your money across many different investments', 'Trading very fast'],
    correctIndex: 2,
    hint: 'If one stock crashes, the others can cushion the blow. Never put all your eggs in one basket.'
  },
  {
    id: 'q5',
    level: 1,
    category: 'Basics',
    question: 'When a company pays you a small cash bonus just for owning their stock, what is it called?',
    options: ['A Salary', 'A Dividend', 'A Tip', 'A Refund'],
    correctIndex: 1,
    hint: 'It starts with a D and sounds like "divide."'
  },

  // LEVEL 2
  {
    id: 'q6',
    level: 2,
    category: 'Basics',
    question: 'What is a Bear Market?',
    options: ['A market where prices are going up fast', 'A market where everyone is sleeping', 'A market where prices are generally falling', 'A market only for animal products'],
    correctIndex: 2,
    hint: 'Think of an animal swiping its paws DOWN.'
  },
  {
    id: 'q7',
    level: 2,
    category: 'ETFs',
    question: 'What is an ETF?',
    options: ['Extra Trading Fee', 'An Exchange Traded Fund — one investment that holds dozens of different stocks at once', 'Electronic Transfer Format', 'Early Trading Friday'],
    correctIndex: 1,
    hint: 'Think of it like a variety pack — instead of buying one stock, you own a little piece of many.'
  },
  {
    id: 'q8',
    level: 2,
    category: 'Stocks',
    question: 'What does Market Cap tell you?',
    options: ['The maximum price a stock can reach', 'How much the entire company is worth in total', 'The cap on how many shares you can buy', 'The hat the CEO wears'],
    correctIndex: 1,
    hint: 'It measures the total size and value of the whole business.'
  },
  {
    id: 'q9',
    level: 2,
    category: 'Stocks',
    question: 'What is an IPO?',
    options: ['Internal Profit Organization', 'When a private company sells shares to the public for the very first time', 'Investing Portfolio Option', 'Income Producing Object'],
    correctIndex: 1,
    hint: 'It is when a private company becomes "Public" — open for anyone to invest in.'
  },
  {
    id: 'q10',
    level: 2,
    category: 'ETFs',
    question: 'What is the S&P 500?',
    options: ['The 500 worst stocks', 'A car race', 'A famous list tracking the 500 biggest US companies', 'A fee you pay your broker'],
    correctIndex: 2,
    hint: 'It is the ultimate scorecard for the US economy.'
  },

  // LEVEL 3
  {
    id: 'q11',
    level: 3,
    category: 'Stocks',
    question: 'What are Blue Chip stocks?',
    options: ['Stocks related to poker', 'Cheap, risky penny stocks', 'Shares in huge, well-established, and reliable companies', 'Companies that make computer chips'],
    correctIndex: 2,
    hint: 'Think of massive household names like Disney or Microsoft — companies that have been around for decades.'
  },
  {
    id: 'q12',
    level: 3,
    category: 'Options',
    question: 'If you buy a Call Option, what are you betting will happen?',
    options: ['The stock price will go UP', 'The stock price will go DOWN', 'The stock price will stay exactly the same', 'The company will go bankrupt'],
    correctIndex: 0,
    hint: 'You want the right to buy it cheap later when it becomes expensive.'
  },
  {
    id: 'q13',
    level: 3,
    category: 'Options',
    question: 'If you buy a Put Option, what are you betting will happen?',
    options: ['The stock price will go UP', 'The stock price will go DOWN', 'The stock price will stay exactly the same', 'The company will pay a dividend'],
    correctIndex: 1,
    hint: 'You want the right to sell it at a high price even after it crashes.'
  },
  {
    id: 'q14',
    level: 3,
    category: 'ETFs',
    question: 'What is an Expense Ratio?',
    options: ['How much you spend on coffee', 'The fee you pay to buy a single stock', 'A small yearly fee charged by the company that runs an ETF', 'The tax on your profits'],
    correctIndex: 2,
    hint: 'It is the ongoing cost of having someone manage the basket of stocks for you.'
  },
  {
    id: 'q15',
    level: 3,
    category: 'Options',
    question: 'What is the Premium in options trading?',
    options: ['The VIP customer service line', 'The highest price the stock ever reached', 'The upfront price you pay to purchase an options contract', 'The profit you make at the end'],
    correctIndex: 2,
    hint: 'It is the cost of entry — you pay it just to get the contract.'
  }
];
