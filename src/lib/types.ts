export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  createdAt: string
}

export interface Card {
  id: string
  userId: string
  cardType: 'visa' | 'mastercard' | 'amex' | 'discover'
  lastFour: string
  expiryMonth: string
  expiryYear: string
  balance: number
  cardholderName: string
  isPrimary?: boolean
}

export interface Transaction {
  id: string
  userId: string
  title: string
  amount: number
  type: 'income' | 'expense'
  category: string
  date: string
  icon?: string
  color?: string
}

export interface Contact {
  id: string
  name: string
  avatar: string
}

export type AssetCategory = 'crypto' | 'stock' | 'etf' | 'securities' | 'other'

export interface PortfolioItem {
  id: string
  userId: string
  name: string
  ticker: string
  category: AssetCategory
  quantity: number
  buyPrice: number
  currentPrice: number
  currency: string
  color?: string
}

export interface AuthData {
  email: string
  password: string
}

export interface Session {
  userId: string
  email: string
  name: string
  isAuthenticated: boolean
}
