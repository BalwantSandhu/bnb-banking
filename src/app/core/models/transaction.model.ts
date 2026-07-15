export type TransactionType = 'deposit' | 'transfer-in' | 'transfer-out';

export interface Transaction {
  id: string;
  accountId: string;
  type: TransactionType;
  amount: number;
  balanceAfter: number;
  description: string;
  timestamp: Date;
}