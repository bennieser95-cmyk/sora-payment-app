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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const lastFour = cardNumber.slice(-4)
    const newCard: CardType = {
      id: `card_${Date.now()}`,
      userId,
      cardType,
      lastFour,
      expiryMonth,
      expiryYear,
      balance: parseFloat(balance) || 0,
      cardholderName
    }

    setCards((current) => [...(current || []), newCard])
    toast.success('Card added successfully!')
    
    setCardNumber('')
    setCardholderName('')
    setExpiryMonth('')
    setExpiryYear('')
    setBalance('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Card</DialogTitle>
          <DialogDescription>
            Link your payment card to manage your finances
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cardType">Card Type</Label>
            <Select value={cardType} onValueChange={(value: any) => setCardType(value)}>
              <SelectTrigger id="cardType">
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
              onChange={(e) => setCardNumber(e.target.value.replace(/\s/g, ''))}
              required
              maxLength={16}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardholderName">Cardholder Name</Label>
            <Input
              id="cardholderName"
              placeholder="John Doe"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiryMonth">Expiry Month</Label>
              <Input
                id="expiryMonth"
                placeholder="MM"
                value={expiryMonth}
                onChange={(e) => setExpiryMonth(e.target.value)}
                required
                maxLength={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiryYear">Expiry Year</Label>
              <Input
                id="expiryYear"
                placeholder="YY"
                value={expiryYear}
                onChange={(e) => setExpiryYear(e.target.value)}
                required
                maxLength={2}
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
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Card</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
