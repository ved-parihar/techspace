export type Page = 'Overview' | 'Transactions' | 'Budgets' | 'Analytics' | 'Settings';

export type IconName =
  | 'grid'
  | 'swap'
  | 'wallet'
  | 'chart'
  | 'settings'
  | 'plus'
  | 'search'
  | 'bell'
  | 'arrowUp'
  | 'arrowDown'
  | 'dots'
  | 'coffee'
  | 'home'
  | 'car'
  | 'bag'
  | 'bolt'
  | 'close'
  | 'mail'
  | 'lock'
  | 'eye'
  | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Transaction {
  _id: string;
  user?: string;
  merchant: string;
  category: string;
  amount: number;
  type: 'income' | 'expense';
  icon: IconName;
  color: string;
  date?: string;
  createdAt?: string;
}

export interface Budget {
  _id: string;
  user?: string;
  category: string;
  limit: number;
  spent: number;
  month: number;
  year: number;
  icon: IconName;
  color: string;
}
