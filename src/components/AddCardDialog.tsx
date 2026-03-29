import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card as CardType } from '@/lib/types'
import { toast } from 'sonner'

interface AddCardDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string
}

export function AddCardDialog({ open, onOpenChange, userId }: AddCardDialogProps) {
  const [cards, setCards] = useKV<CardType[]>(`cards_${userId}`, [])
  const [cardType, setCardType] = useState<'visa' | 'mastercard' | 'amex' | 'discover'>('visa')
  const [cardNumber, setCardNumber] = useState('')
  const [cardholderName, setCardholderName] = useState('')
  const [expiryMonth, setExpiryMonth] = useState('')
  const [expiryYear, setExpiryYear] = useState('')
  const [balance, setBalance] = useState('')

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    const chunks = cleaned.match(/.{1,4}/g) || []
    return chunks.join(' ')
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value)
    setCardNumber(formatted)
  }

  const validateExpiryMonth = (value: string) => {
    const num = parseInt(value)
    return value === '' || (num >= 1 && num <= 12)
  }

  const validateExpiryYear = (value: string) => {
    if (value === '') return true
    const currentYear = new Date().getFullYear() % 100
    const num = parseInt(value)
    return num >= currentYear
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateExpiryMonth(expiryMonth)) {
      toast.error('Please enter a valid month (01-12)')
      return
    }

    if (!validateExpiryYear(expiryYear)) {
      toast.error('Card has expired or invalid year')
      return
    }

    const cleanedNumber = cardNumber.replace(/\s/g, '')
    if (cleanedNumber.length < 13 || cleanedNumber.length > 19) {
      toast.error('Please enter a valid card number')
      return
    }

    const lastFour = cleanedNumber.slice(-4)
    const newCard: CardType = {
      id: `card_${Date.now()}`,
      userId,
      cardType,
      lastFour,
      expiryMonth: expiryMonth.padStart(2, '0'),
      expiryYear,
      balance: parseFloat(balance) || 0,
      cardholderName,
      isPrimary: !cards || cards.length === 0
    }

    setCards((current) => [...(current || []), newCard])
    toast.success('Card linked successfully!')
    
    setCardNumber('')
    setCardholderName('')
    setExpiryMonth('')
    setExpiryYear('')
    setBalance('')
    setCardType('visa')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">Link Your Card</DialogTitle>
          <DialogDescription>
            Add your credit or debit card to track your balance
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cardType">Card Type</Label>
            <Select value={cardType} onValueChange={(value: any) => setCardType(value)}>
              <SelectTrigger id="cardType" className="h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="visa">Visa</SelectItem>
                <SelectItem value="mastercard">Mastercard</SelectItem>
                <SelectItem value="amex">American Express</SelectItem>
                <SelectItem value="discover">Discover</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={handleCardNumberChange}
              required
              maxLength={19}
              className="h-12 tabular-nums"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardholderName">Cardholder Name</Label>
            <Input
              id="cardholderName"
              placeholder="John Doe"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value.toUpperCase())}
              required
              className="h-12"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiryMonth">Expiry Month</Label>
              <Input
                id="expiryMonth"
                placeholder="MM"
                value={expiryMonth}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '')
                  if (val === '' || (parseInt(val) >= 0 && parseInt(val) <= 12)) {
                    setExpiryMonth(val)
                  }
                }}
                required
                maxLength={2}
                className="h-12 tabular-nums"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiryYear">Expiry Year</Label>
              <Input
                id="expiryYear"
                placeholder="YY"
                value={expiryYear}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '')
                  setExpiryYear(val)
                }}
                required
                maxLength={2}
                className="h-12 tabular-nums"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="balance">Current Balance</Label>
            <Input
              id="balance"
              type="number"
              placeholder="5000.00"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              required
              step="0.01"
              min="0"
              className="h-12 tabular-nums"
            />
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-full">
              Cancel
            </Button>
            <Button type="submit" className="rounded-full">Link Card</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
