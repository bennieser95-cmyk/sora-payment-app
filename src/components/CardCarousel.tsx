import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { useKV } from '@github/spark/hooks'
import { Card as CardType } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Trash, CurrencyCircleDollar } from '@phosphor-icons/react'
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

interface CardCarouselProps {
  userId: string
  onAddCard: () => void
}

const cardStyles: Record<CardType['cardType'], { bg: string; textColor: string; label: string; mutedText: string; btnClass: string }> = {
  visa: {
    bg: 'bg-gradient-to-br from-blue-700 to-blue-950',
    textColor: 'text-white',
    label: 'VISA',
    mutedText: 'text-white/70',
    btnClass: 'text-white/60 hover:text-white hover:bg-white/10',
  },
  mastercard: {
    bg: 'bg-gradient-to-br from-zinc-800 to-black',
    textColor: 'text-white',
    label: 'Mastercard',
    mutedText: 'text-white/70',
    btnClass: 'text-white/60 hover:text-white hover:bg-white/10',
  },
  amex: {
    bg: 'bg-gradient-to-br from-sky-500 to-blue-700',
    textColor: 'text-white',
    label: 'AMERICAN EXPRESS',
    mutedText: 'text-white/70',
    btnClass: 'text-white/60 hover:text-white hover:bg-white/10',
  },
  discover: {
    bg: 'bg-gradient-to-br from-zinc-100 to-zinc-300',
    textColor: 'text-zinc-900',
    label: 'DISCOVER',
    mutedText: 'text-zinc-600',
    btnClass: 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-900/10',
  },
}

export function CardCarousel({ userId, onAddCard }: CardCarouselProps) {
  const [cards, setCards] = useKV<CardType[]>(`cards_${userId}`, [])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [cardToDelete, setCardToDelete] = useState<string | null>(null)

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: 'center',
    dragFree: false,
  })

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    return () => {
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi, onSelect])

  // Scroll to primary card on initial load
  useEffect(() => {
    if (!emblaApi || !cards || cards.length === 0) return
    const primaryIndex = cards.findIndex(c => c.isPrimary)
    if (primaryIndex > 0) {
      emblaApi.scrollTo(primaryIndex, true)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emblaApi])

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

  if (!cards || cards.length === 0) {
    return (
      <div
        className="bg-muted p-6 rounded-3xl border-2 border-dashed border-border cursor-pointer hover:bg-muted/60 transition-colors"
        onClick={onAddCard}
      >
        <div className="text-center py-8">
          <CurrencyCircleDollar size={48} className="mx-auto mb-3 text-muted-foreground" />
          <p className="font-semibold mb-1">No Card Linked</p>
          <p className="text-sm text-muted-foreground">Tap to add your first card</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="overflow-hidden -mx-6" ref={emblaRef}>
        <div className="flex touch-pan-y select-none">
          {cards.map((card) => {
            const style = cardStyles[card.cardType]
            return (
              <div
                key={card.id}
                className="flex-none w-full min-w-0 px-6"
              >
                <div className={`${style.bg} ${style.textColor} p-6 rounded-3xl relative overflow-hidden shadow-lg`}>
                  <div className="absolute top-4 right-4 w-12 h-12 bg-white/10 rounded-lg pointer-events-none" />
                  <div className="absolute top-8 right-8 w-16 h-16 bg-white/5 rounded-lg pointer-events-none" />

                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-1">
                      <p className={`text-sm ${style.mutedText}`}>Available Balance</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`rounded-full w-8 h-8 -mt-1 -mr-2 ${style.btnClass}`}
                        onClick={() => setCardToDelete(card.id)}
                      >
                        <Trash size={16} />
                      </Button>
                    </div>
                    <h3 className="text-4xl font-display font-bold tabular-nums mb-4">
                      ${card.balance.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </h3>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold tracking-wider">•••• {card.lastFour}</p>
                      <p className={`text-sm ${style.mutedText}`}>
                        EX {card.expiryMonth}/{card.expiryYear.slice(-2)}
                      </p>
                    </div>
                    <div className="mt-2">
                      <p className={`text-xs font-bold tracking-widest ${style.mutedText}`}>{style.label}</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {cards.length > 1 && (
        <div className="flex justify-center gap-1.5">
          {cards.map((_, index) => (
            <button
              key={index}
              aria-label={`Go to card ${index + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === selectedIndex ? 'w-4 bg-primary' : 'w-1.5 bg-muted-foreground/30'
              }`}
              onClick={() => emblaApi?.scrollTo(index)}
            />
          ))}
        </div>
      )}

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
