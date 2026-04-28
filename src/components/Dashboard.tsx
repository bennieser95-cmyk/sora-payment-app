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
  ChartLine,
  ClockCounterClockwise,
  User,
  CaretRight,
  Briefcase,
  CurrencyCircleDollar,
  TrendUp,
} from '@phosphor-icons/react'
import { authService } from '@/lib/auth'
import { User as UserType, Card as CardType, Transaction, Contact } from '@/lib/types'
import { motion } from 'framer-motion'
import { AddCardDialog } from './AddCardDialog'
import { IncomeHistory } from './IncomeHistory'
import { PaymentsHistory } from './PaymentsHistory'
import { CardManagement } from './CardManagement'
import { CardCarousel } from './CardCarousel'
import { Invest } from './Invest'

interface DashboardProps {
  onLogout: () => void
}

type View = 'home' | 'income' | 'payments' | 'profile' | 'cards' | 'invest'

interface DashboardContentProps {
  user: UserType
  onLogout: () => void
}

function DashboardContent({ user, onLogout }: DashboardContentProps) {
  const [view, setView] = useState<View>('home')
  const [transactions] = useKV<Transaction[]>(`transactions_${user.id}`, [])
  const [contacts] = useKV<Contact[]>(`contacts_${user.id}`, [])
  const [cards] = useKV<CardType[]>(`cards_${user.id}`, [])
  const [showAddCard, setShowAddCard] = useState(false)

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

            <CardCarousel userId={user.id} onAddCard={() => setShowAddCard(true)} />

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
                onClick={() => setView('invest')}
              >
                <div className="w-12 h-12 rounded-full bg-peach flex items-center justify-center">
                  <TrendUp size={24} weight="fill" className="text-primary" />
                </div>
                <span className="text-xs font-medium">Invest</span>
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
      {view === 'invest' && <Invest onBack={() => setView('home')} userId={user.id} />}
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
              className={`rounded-full ${view === 'invest' ? 'bg-mint text-primary' : ''}`}
              onClick={() => setView('invest')}
            >
              <TrendUp size={24} weight={view === 'invest' ? 'fill' : 'regular'} />
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
