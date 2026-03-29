import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Card as CardType } from '@/lib/types'
import { CaretRight, Star, Trash, Plus } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useState } from 'react'

interface CardManagementProps {
  onBack: () => void
  userId: string
  onAddCard: () => void
}

export function CardManagement({ onBack, userId, onAddCard }: CardManagementProps) {
  const [cards, setCards] = useKV<CardType[]>(`cards_${userId}`, [])
  const [cardToDelete, setCardToDelete] = useState<string | null>(null)

  const handleSetPrimary = (cardId: string) => {
    setCards((currentCards) => {
      if (!currentCards) return []
      return currentCards.map(card => ({
        ...card,
        isPrimary: card.id === cardId
      }))
    })
    toast.success('Primary card updated')
  }

  const handleDeleteCard = (cardId: string) => {
    setCards((currentCards) => {
      if (!currentCards) return []
      const filtered = currentCards.filter(card => card.id !== cardId)
      if (filtered.length > 0 && !filtered.some(c => c.isPrimary)) {
        filtered[0].isPrimary = true
      }
      return filtered
    })
    toast.success('Card removed')
    setCardToDelete(null)
  }

  const getCardIcon = (type: string) => {
    switch (type) {
      case 'visa':
        return 'VISA'
      case 'mastercard':
        return 'MC'
      case 'amex':
        return 'AMEX'
      case 'discover':
        return 'DISC'
      default:
        return type.toUpperCase()
    }
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-md mx-auto px-6 pt-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="rounded-full" onClick={onBack}>
              <CaretRight size={24} className="rotate-180" />
            </Button>
            <h2 className="text-2xl font-display font-bold">My Cards</h2>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {cards && cards.length > 0 ? (
            <>
              {cards.map((card, index) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`p-6 rounded-3xl relative overflow-hidden ${
                    card.isPrimary 
                      ? 'bg-primary text-primary-foreground border-0 shadow-lg' 
                      : 'bg-card hover:shadow-md transition-shadow'
                  }`}>
                    {card.isPrimary && (
                      <div className="absolute top-4 right-4 w-12 h-12 bg-white/10 rounded-lg"></div>
                    )}
                    {card.isPrimary && (
                      <div className="absolute top-8 right-8 w-16 h-16 bg-white/5 rounded-lg"></div>
                    )}
                    
                    <div className="relative z-10 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold tracking-widest opacity-80">
                              {getCardIcon(card.cardType)}
                            </span>
                            {card.isPrimary && (
                              <Badge variant="secondary" className="rounded-full px-2 py-0">
                                <Star size={12} weight="fill" className="mr-1" />
                                Primary
                              </Badge>
                            )}
                          </div>
                          <p className={`text-sm font-semibold tracking-wider ${card.isPrimary ? '' : 'text-muted-foreground'}`}>
                            •••• {card.lastFour}
                          </p>
                        </div>
                        <p className={`text-xs ${card.isPrimary ? 'opacity-80' : 'text-muted-foreground'}`}>
                          {card.expiryMonth}/{card.expiryYear}
                        </p>
                      </div>

                      <div>
                        <p className={`text-xs mb-1 ${card.isPrimary ? 'opacity-80' : 'text-muted-foreground'}`}>
                          Available Balance
                        </p>
                        <h3 className="text-3xl font-display font-bold tabular-nums">
                          ${card.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </h3>
                      </div>

                      <div>
                        <p className={`text-xs uppercase tracking-wide ${card.isPrimary ? 'opacity-70' : 'text-muted-foreground'}`}>
                          {card.cardholderName}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        {!card.isPrimary && (
                          <Button
                            variant={card.isPrimary ? "secondary" : "outline"}
                            size="sm"
                            className="rounded-full"
                            onClick={() => handleSetPrimary(card.id)}
                          >
                            <Star size={16} className="mr-1" />
                            Set as Primary
                          </Button>
                        )}
                        <Button
                          variant={card.isPrimary ? "secondary" : "outline"}
                          size="sm"
                          className="rounded-full"
                          onClick={() => setCardToDelete(card.id)}
                        >
                          <Trash size={16} className="mr-1" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}

              <Button
                variant="outline"
                className="w-full h-14 rounded-3xl border-2 border-dashed hover:bg-muted/50"
                onClick={onAddCard}
              >
                <Plus size={24} className="mr-2" weight="bold" />
                Add Another Card
              </Button>
            </>
          ) : (
            <Card className="p-12 text-center rounded-3xl border-2 border-dashed">
              <p className="text-muted-foreground mb-4">No cards linked yet</p>
              <Button onClick={onAddCard} className="rounded-full">
                <Plus size={20} className="mr-2" weight="bold" />
                Link Your First Card
              </Button>
            </Card>
          )}
        </motion.div>
      </div>

      <AlertDialog open={!!cardToDelete} onOpenChange={() => setCardToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Card</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this card? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => cardToDelete && handleDeleteCard(cardToDelete)}>
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
