import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  House,
  PaperPlaneTilt,
  DownloadSimple,
  Wallet,
  DotsThree,
  ChartLine,
  ClockCounterClockwise,
  User,
  CaretRight,
  Briefcase,
  CurrencyCircleDollar,
  ChartPieSlice,
} from '@phosphor-icons/react'
import { authService } from '@/lib/auth'
import { User as UserType, Card as CardType, Transaction, Contact } from '@/lib/types'
import { motion } from 'framer-motion'
import { AddCardDialog } from './AddCardDialog'
import { IncomeHistory } from './IncomeHistory'
import { PaymentsHistory } from './PaymentsHistory'
import { CardManagement } from './CardManagement'
import { Portfolio } from './Portfolio'

interface DashboardProps {
  onLogout: () => void
}

type View = 'home' | 'income' | 'payments' | 'profile' | 'cards' | 'portfolio'

interface DashboardContentProps {
  user: UserType
  onLogout: () => void
}

function DashboardContent({ user, onLogout }: DashboardContentProps) {
  const [view, setView] = useState<View>('home')
  const [cards] = useKV<CardType[]>(`cards_${user.id}`, [])
  const [transactions] = useKV<Transaction[]>(`transactions_${user.id}`, [])
  const [contacts] = useKV<Contact[]>(`contacts_${user.id}`, [])
  const [showAddCard, setShowAddCard] = useState(false)
  const [linkedCardPreview, setLinkedCardPreview] = useState<CardType | null>(null)

  const cardPreviewStyles: Record<CardType['cardType'], { bg: string; label: string; text: string }> = {
    visa: {
      bg: 'bg-gradient-to-br from-blue-700 to-blue-950',
      label: 'VISA',
      text: 'text-white',
    },
    mastercard: {
      bg: 'bg-gradient-to-br from-zinc-800 to-black',
      label: 'Mastercard',
      text: 'text-white',
    },
    amex: {
      bg: 'bg-gradient-to-br from-sky-500 to-blue-700',
      label: 'AMERICAN EXPRESS',
      text: 'text-white',
    },
    discover: {
      bg: 'bg-gradient-to-br from-zinc-100 to-zinc-300',
      label: 'DISCOVER',
      text: 'text-zinc-900',
    },
  }

  const primaryCard = cards?.find(card => card.isPrimary) || cards?.[0]

  // Clear preview when cards are loaded from KV (the saved card will be shown)
  useEffect(() => {
    if (cards && cards.length > 0) {
      setLinkedCardPreview(null)
    }
  }, [cards])

  return (
    <div className="min-h-screen bg-background">
      {view === 'home' && (
        <div className="max-w-md mx-auto pb-24 pt-8 px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                    {user.name
                      .split(' ')
                      .map(n => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm text-muted-foreground">Hello {user.name.split(' ')[0]},</p>
                  <h2 className="text-xl font-display font-bold">Welcome back</h2>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => setView('profile')}
              >
                <User size={24} />
              </Button>
            </div>

            {primaryCard ? (
              <Card className="bg-primary text-primary-foreground p-6 rounded-3xl border-0 shadow-lg relative overflow-hidden">
                <div className="absolute top-4 right-4 w-12 h-12 bg-white/10 rounded-lg"></div>
                <div className="absolute top-8 right-8 w-16 h-16 bg-white/5 rounded-lg"></div>

                <div className="relative z-10">
                  <p className="text-sm opacity-80 mb-1">Available Balance</p>
                  <h3 className="text-4xl font-display font-bold tabular-nums mb-4">
                    ${primaryCard.balance.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </h3>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold tracking-wider">•••• {primaryCard.lastFour}</p>
                    <p className="text-sm opacity-80">
                      EX {primaryCard.expiryMonth}/{primaryCard.expiryYear.slice(-2)}
                    </p>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="text-xs font-bold tracking-widest">
                      {primaryCard.cardType.toUpperCase()}
                    </div>
                  </div>
                </div>
              </Card>
            ) : linkedCardPreview ? (
              <Card className={`p-6 rounded-3xl relative overflow-hidden ${linkedCardPreview.isPrimary ? 'bg-primary text-primary-foreground border-0 shadow-lg' : 'bg-card'}`}>
                <div className="relative z-10 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold tracking-widest opacity-80">{linkedCardPreview.cardType.toUpperCase()}</span>
                        {linkedCardPreview.isPrimary && (
                          <div className="rounded-full px-2 py-0 bg-secondary text-secondary-foreground text-xs">Primary</div>
                        )}
                      </div>
                      <p className="text-sm font-semibold tracking-wider">•••• {linkedCardPreview.lastFour}</p>
                    </div>
                    <p className="text-xs">{linkedCardPreview.expiryMonth}/{linkedCardPreview.expiryYear}</p>
                  </div>

                  <div className="absolute top-4 right-4 w-1/3 max-w-[160px] min-w-[100px] rounded-lg shadow-md overflow-hidden">
                    <div className={`${cardPreviewStyles[linkedCardPreview.cardType].bg} relative w-full`}>
                      <div className="pb-[62%]" />
                      <div className="absolute inset-0 flex items-end justify-between p-2">
                        <div className="flex items-center">
                          {linkedCardPreview.cardType === 'mastercard' ? (
                            <>
                              <span className="h-4 w-4 rounded-full bg-red-600" />
                              <span className="-ml-1 h-4 w-4 rounded-full bg-amber-500/90" />
                            </>
                          ) : (
                            <span className="h-3 w-5 rounded-sm bg-white/30" />
                          )}
                        </div>
                        <span className={`text-[9px] leading-none font-bold tracking-wide ${cardPreviewStyles[linkedCardPreview.cardType].text}`}>{cardPreviewStyles[linkedCardPreview.cardType].label}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ) : (
              <Card
                className="bg-muted p-6 rounded-3xl border-2 border-dashed border-border cursor-pointer hover:bg-muted/60 transition-colors"
                onClick={() => setShowAddCard(true)}
              >
                <div className="text-center py-8">
                  <CurrencyCircleDollar size={48} className="mx-auto mb-3 text-muted-foreground" />
                  <p className="font-semibold mb-1">No Card Linked</p>
                  <p className="text-sm text-muted-foreground">Tap to add your first card</p>
                </div>
              </Card>
            )}

            <div className="grid grid-cols-4 gap-3">
              <Button
                variant="ghost"
                className="flex-col h-auto py-4 px-2 gap-2 rounded-2xl bg-mint-light/30 hover:bg-mint-light/50"
              >
                <div className="w-12 h-12 rounded-full bg-mint flex items-center justify-center">
                  <PaperPlaneTilt size={24} weight="fill" className="text-primary" />
                </div>
                <span className="text-xs font-medium">Send</span>
              </Button>

              <Button
                variant="ghost"
                className="flex-col h-auto py-4 px-2 gap-2 rounded-2xl bg-mint-light/30 hover:bg-mint-light/50"
              >
                <div className="w-12 h-12 rounded-full bg-mint flex items-center justify-center">
                  <DownloadSimple size={24} weight="fill" className="text-primary" />
                </div>
                <span className="text-xs font-medium">Request</span>
              </Button>

              <Button
                variant="ghost"
                className="flex-col h-auto py-4 px-2 gap-2 rounded-2xl bg-peach-light/50 hover:bg-peach-light/70"
              >
                <div className="w-12 h-12 rounded-full bg-peach flex items-center justify-center">
                  <Wallet size={24} weight="fill" className="text-primary" />
                </div>
                <span className="text-xs font-medium">E-Wallet</span>
              </Button>

              <Button
                variant="ghost"
                className="flex-col h-auto py-4 px-2 gap-2 rounded-2xl bg-peach-light/50 hover:bg-peach-light/70"
              >
                <div className="w-12 h-12 rounded-full bg-peach flex items-center justify-center">
                  <DotsThree size={24} weight="bold" className="text-primary" />
                </div>
                <span className="text-xs font-medium">More</span>
              </Button>
            </div>

            {contacts && contacts.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display font-semibold text-lg">Sent to</h3>
                  <Button variant="ghost" size="sm" className="text-xs">
                    View All <CaretRight size={16} className="ml-1" />
                  </Button>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {contacts.map(contact => (
                    <div key={contact.id} className="flex flex-col items-center gap-2 min-w-[70px]">
                      <Avatar className="w-14 h-14 border-2 border-border">
                        <AvatarFallback className="bg-secondary text-secondary-foreground">
                          {contact.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-medium text-center line-clamp-1">{contact.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-semibold text-lg">Activities</h3>
                <span className="text-xs text-muted-foreground">Today</span>
              </div>
              <Card className="rounded-2xl">
                <ScrollArea className="max-h-[300px]">
                  {transactions && transactions.length > 0 ? (
                    <div className="p-4 space-y-3">
                      {transactions.slice(0, 5).map(transaction => (
                        <div key={transaction.id} className="flex items-center justify-between py-2">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                transaction.type === 'income' ? 'bg-mint-light' : 'bg-destructive/10'
                              }`}
                            >
                              <Briefcase size={20} weight="fill" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">{transaction.title}</p>
                              <p className="text-xs text-muted-foreground">{transaction.category}</p>
                            </div>
                          </div>
                          <p
                            className={`font-semibold tabular-nums ${
                              transaction.type === 'income' ? 'text-foreground' : 'text-destructive'
                            }`}
                          >
                            {transaction.type === 'income' ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-muted-foreground">
                      <p>No recent activities</p>
                    </div>
                  )}
                </ScrollArea>
              </Card>
            </div>
          </motion.div>
        </div>
      )}

      {view === 'income' && <IncomeHistory onBack={() => setView('home')} userId={user.id} />}
      {view === 'payments' && <PaymentsHistory onBack={() => setView('home')} userId={user.id} />}
      {view === 'portfolio' && <Portfolio onBack={() => setView('home')} userId={user.id} />}
      {view === 'cards' && (
        <CardManagement
          onBack={() => setView('home')}
          userId={user.id}
          onAddCard={() => setShowAddCard(true)}
        />
      )}

      {view === 'profile' && (
        <div className="max-w-md mx-auto pb-24 pt-8 px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-display font-bold">Profile</h2>
            <Button variant="ghost" size="icon" onClick={() => setView('home')}>
              <CaretRight size={24} className="rotate-180" />
            </Button>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col items-center gap-4">
              <Avatar className="w-24 h-24">
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-semibold">
                  {user.name
                    .split(' ')
                    .map(n => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h3 className="text-xl font-display font-bold">{user.name}</h3>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
            </div>

            <Card className="p-4 rounded-2xl space-y-3">
              <Button
                variant="ghost"
                className="w-full justify-start text-left h-auto py-3"
                onClick={() => setView('cards')}
              >
                <CurrencyCircleDollar size={24} className="mr-3" />
                <div>
                  <p className="font-semibold">Manage Cards</p>
                  <p className="text-xs text-muted-foreground">
                    {cards && cards.length > 0
                      ? `${cards.length} card${cards.length > 1 ? 's' : ''} linked`
                      : 'No cards linked'}
                  </p>
                </div>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-left text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={onLogout}
              >
                Sign Out
              </Button>
            </Card>
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="max-w-md mx-auto px-6 py-4">
          <div className="flex items-center justify-around">
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-full ${view === 'home' ? 'bg-mint text-primary' : ''}`}
              onClick={() => setView('home')}
            >
              <House size={24} weight={view === 'home' ? 'fill' : 'regular'} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-full ${view === 'income' ? 'bg-mint text-primary' : ''}`}
              onClick={() => setView('income')}
            >
              <ChartLine size={24} weight={view === 'income' ? 'fill' : 'regular'} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-full ${view === 'payments' ? 'bg-mint text-primary' : ''}`}
              onClick={() => setView('payments')}
            >
              <ClockCounterClockwise size={24} weight={view === 'payments' ? 'fill' : 'regular'} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-full ${view === 'portfolio' ? 'bg-mint text-primary' : ''}`}
              onClick={() => setView('portfolio')}
            >
              <ChartPieSlice size={24} weight={view === 'portfolio' ? 'fill' : 'regular'} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-full ${view === 'profile' ? 'bg-mint text-primary' : ''}`}
              onClick={() => setView('profile')}
            >
              <User size={24} weight={view === 'profile' ? 'fill' : 'regular'} />
            </Button>
          </div>
        </div>
      </div>

      <AddCardDialog
        open={showAddCard}
        onOpenChange={setShowAddCard}
        userId={user.id}
        onCardLinked={(card) => setLinkedCardPreview(card)}
      />
    </div>
  )
}

export function Dashboard({ onLogout }: DashboardProps) {
  const [user, setUser] = useState<UserType | null>(null)

  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = async () => {
    const currentUser = await authService.getCurrentUser()
    setUser(currentUser)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  return <DashboardContent key={user.id} user={user} onLogout={onLogout} />
}
