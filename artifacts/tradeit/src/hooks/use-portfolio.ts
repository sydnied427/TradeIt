import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface PortfolioPosition {
  ticker: string;
  shares: number;
  averageBuyPrice: number;
}

interface PortfolioState {
  cash: number;
  positions: PortfolioPosition[];
  buyStock: (ticker: string, shares: number, price: number) => void;
  sellStock: (ticker: string, shares: number, price: number) => void;
  resetPortfolio: () => void;
}

const INITIAL_CASH = 10000;

export const usePortfolio = create<PortfolioState>()(
  persist(
    (set, get) => ({
      cash: INITIAL_CASH,
      positions: [],

      buyStock: (ticker: string, shares: number, price: number) => {
        const cost = shares * price;
        const currentCash = get().cash;
        
        if (cost > currentCash) return; // Cannot afford

        set((state) => {
          const existingPosIndex = state.positions.findIndex(p => p.ticker === ticker);
          let newPositions = [...state.positions];

          if (existingPosIndex >= 0) {
            // Average up/down
            const pos = newPositions[existingPosIndex];
            const totalValueBefore = pos.shares * pos.averageBuyPrice;
            const newTotalShares = pos.shares + shares;
            const newAveragePrice = (totalValueBefore + cost) / newTotalShares;
            
            newPositions[existingPosIndex] = {
              ...pos,
              shares: newTotalShares,
              averageBuyPrice: newAveragePrice
            };
          } else {
            // New position
            newPositions.push({
              ticker,
              shares,
              averageBuyPrice: price
            });
          }

          return {
            cash: state.cash - cost,
            positions: newPositions
          };
        });
      },

      sellStock: (ticker: string, shares: number, price: number) => {
        set((state) => {
          const existingPosIndex = state.positions.findIndex(p => p.ticker === ticker);
          if (existingPosIndex < 0) return state; // Don't own it

          const pos = state.positions[existingPosIndex];
          if (pos.shares < shares) return state; // Can't sell more than you own

          let newPositions = [...state.positions];
          if (pos.shares === shares) {
            // Sold everything
            newPositions.splice(existingPosIndex, 1);
          } else {
            // Sold partial
            newPositions[existingPosIndex] = {
              ...pos,
              shares: pos.shares - shares
            };
          }

          return {
            cash: state.cash + (shares * price),
            positions: newPositions
          };
        });
      },

      resetPortfolio: () => {
        set({ cash: INITIAL_CASH, positions: [] });
      }
    }),
    {
      name: 'tradeit-portfolio',
    }
  )
);
