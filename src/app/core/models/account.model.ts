export type AccountType = 'chequing' | 'savings';

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  createdAt: Date;
}