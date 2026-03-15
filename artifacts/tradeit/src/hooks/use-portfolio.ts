import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface PortfolioPosition {
  ticker: string;
  shares: number;
  averageBuyPrice: number;
}

interface PortfolioState {
  cash: number;
  startingBalance: number;
  hasConfigured: boolean;
  positions: PortfolioPosition[];
  buyStock: (ticker: string, shares: number, price: number) => void;
  sellStock: (ticker: string, shares: number, price: number) => void;
  resetPortfolio: () => void;
  configurePortfolio: (balance: number) => void;
}

export const usePortfolio = create<PortfolioState>()(
  persist(
    (set, get) => ({
      cash: 10000,
      startingBalance: 10000,
      hasConfigured: false,
      positions: [],

      configurePortfolio: (balance: number) => {
        set({ cash: balance, startingBalance: balance, positions: [], hasConfigured: true });
      },

      buyStock: (ticker: string, shares: number, price: number) => {
        const cost = shares * price;
        const currentCash = get().cash;

        if (cost > currentCash) return;

        set((state) => {
          const existingPosIndex = state.positions.findIndex(p => p.ticker === ticker);
          let newPositions = [...state.positions];

          if (existingPosIndex >= 0) {
            const pos = newPositions[existingPosIndex];
            const totalValueBefore = pos.shares * pos.averageBuyPrice;
            const newTotalShares = pos.shares + shares;
            const newAveragePrice = (totalValueBefore + cost) / newTotalShares;
            newPositions[existingPosIndex] = { ...pos, shares: newTotalShares, averageBuyPrice: newAveragePrice };
          } else {
            newPositions.push({ ticker, shares, averageBuyPrice: price });
          }

          return { cash: state.cash - cost, positions: newPositions };
        });
      },

      sellStock: (ticker: string, shares: number, price: number) => {
        set((state) => {
          const existingPosIndex = state.positions.findIndex(p => p.ticker === ticker);
          if (existingPosIndex < 0) return state;

          const pos = state.positions[existingPosIndex];
          if (pos.shares < shares) return state;

          let newPositions = [...state.positions];
          if (pos.shares === shares) {
            newPositions.splice(existingPosIndex, 1);
          } else {
            newPositions[existingPosIndex] = { ...pos, shares: pos.shares - shares };
          }

          return { cash: state.cash + (shares * price), positions: newPositions };
        });
      },

      resetPortfolio: () => {
        set((state) => ({ cash: state.startingBalance, positions: [], hasConfigured: false }));
      }
    }),
    {
      name: 'tradeit-portfolio',
    }
  )
);
