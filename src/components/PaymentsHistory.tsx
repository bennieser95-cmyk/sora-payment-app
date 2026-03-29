import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CaretLeft, Briefcase, TrendUp } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

interface PaymentsHistoryProps {
  onBack: () => void
  userId: string
}

const samplePayments = [
  {
    id: '1',
    title: 'Salary',
    date: 'June 28, 2020',
    amount: 526,
    color: 'mint',
    icon: Briefcase
  },
  {
    id: '2',
    title: 'Paypal',
    date: 'June 8, 2022',
    amount: 256,
    color: 'lavender',
    icon: TrendUp
  }
]

export function PaymentsHistory({ onBack }: PaymentsHistoryProps) {
  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-md mx-auto pt-8 px-6">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="icon" className="rounded-full" onClick={onBack}>
              <CaretLeft size={24} />
            </Button>
            <h2 className="text-2xl font-display font-bold">Payments History</h2>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {samplePayments.map((payment) => {
              const Icon = payment.icon
              return (
                <Card
                  key={payment.id}
                  className={`p-6 rounded-3xl transition-transform hover:scale-[1.02] cursor-pointer ${
                    payment.color === 'mint' 
                      ? 'bg-gradient-to-br from-mint-light/40 to-mint-light/20' 
                      : 'bg-gradient-to-br from-lavender-light/40 to-lavender-light/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                      payment.color === 'mint' ? 'bg-mint' : 'bg-lavender'
                    }`}>
                      <Icon size={28} weight="fill" className="text-primary" />
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-display font-bold tabular-nums">
                        +${payment.amount}
                      </p>
                      <TrendUp size={20} className="text-mint" weight="bold" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{payment.title}</h3>
                    <p className="text-sm text-muted-foreground">{payment.date}</p>
                  </div>
                </Card>
              )
            })}
          </div>

          <div className="text-center py-8">
            <p className="text-muted-foreground">No more payments to show</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
