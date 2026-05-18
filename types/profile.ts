// types/profile.ts

export interface User {
  name: string;
  email: string;
  memberSince: string;
  plan: string;
  tradesPerMonthLimit?: number;
}

export interface Broker {
  name: string;
  connectedAt: string;
  isConnected: boolean;
}
