import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CaretLeft } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

interface IncomeHistoryProps {
  onBack: () => void
  userId: string
}

export function IncomeHistory({ onBack }: IncomeHistoryProps) {
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
            <h2 className="text-2xl font-display font-bold">Income History</h2>
          </div>

          <Tabs defaultValue="income" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-muted p-1 rounded-full h-12">
              <TabsTrigger value="income" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Income
              </TabsTrigger>
              <TabsTrigger value="expenses" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Expenses
              </TabsTrigger>
            </TabsList>

            <TabsContent value="income" className="space-y-6 mt-6">
              <Card className="p-6 rounded-3xl bg-gradient-to-br from-mint-light/30 to-mint-light/10">
                <p className="text-sm text-muted-foreground mb-1">Save This Month</p>
                <h3 className="text-4xl font-display font-bold tabular-nums mb-2">
                  $1852.00 <span className="text-lg font-medium text-muted-foreground">USD</span>
                </h3>
                <p className="text-sm text-mint">
                  Increase of <span className="font-semibold">12%</span> from last month
                </p>
              </Card>

              <Card className="p-6 rounded-3xl">
                <div className="h-64 flex items-end justify-between gap-2">
                  {['April', 'May', 'June', 'July'].map((month, index) => {
                    const heights = [30, 45, 55, 75]
                    return (
                      <div key={month} className="flex-1 flex flex-col items-center gap-2">
                        <div className="flex-1 w-full flex items-end">
                          <div
                            className="w-full bg-gradient-to-t from-mint to-mint-light rounded-t-lg relative"
                            style={{ height: `${heights[index]}%` }}
                          >
                            {index === 3 && (
                              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap">
                                $20,000
                              </div>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">{month}</p>
                      </div>
                    )
                  })}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="expenses" className="space-y-6 mt-6">
              <Card className="p-6 rounded-3xl bg-gradient-to-br from-destructive/10 to-destructive/5">
                <p className="text-sm text-muted-foreground mb-1">Spent This Month</p>
                <h3 className="text-4xl font-display font-bold tabular-nums mb-2">
                  $3240.00 <span className="text-lg font-medium text-muted-foreground">USD</span>
                </h3>
                <p className="text-sm text-destructive">
                  Increase of <span className="font-semibold">8%</span> from last month
                </p>
              </Card>

              <Card className="p-6 rounded-3xl">
                <div className="h-64 flex items-end justify-between gap-2">
                  {['April', 'May', 'June', 'July'].map((month, index) => {
                    const heights = [40, 50, 60, 70]
                    return (
                      <div key={month} className="flex-1 flex flex-col items-center gap-2">
                        <div className="flex-1 w-full flex items-end">
                          <div
                            className="w-full bg-gradient-to-t from-destructive/60 to-destructive/30 rounded-t-lg"
                            style={{ height: `${heights[index]}%` }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">{month}</p>
                      </div>
                    )
                  })}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}
