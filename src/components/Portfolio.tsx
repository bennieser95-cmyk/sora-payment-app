import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  CaretLeft,
  TrendUp,
  TrendDown,
  Plus,
  CurrencyBtc,
  ChartLineUp,
  Buildings,
  Vault,
  Coins,
  X,
} from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { PortfolioItem, AssetCategory } from '@/lib/types'
import { v4 as uuidv4 } from 'uuid'

interface PortfolioProps {
  onBack: () => void
  userId: string
}

const DEFAULT_ITEMS: Omit<PortfolioItem, 'id' | 'userId'>[] = [
  { name: 'Bitcoin', ticker: 'BTC', category: 'crypto', quantity: 0.15, buyPrice: 28000, currentPrice: 65400, currency: 'USD', color: 'peach' },
  { name: 'Ethereum', ticker: 'ETH', category: 'crypto', quantity: 1.2, buyPrice: 1800, currentPrice: 3100, currency: 'USD', color: 'lavender' },
  { name: 'MSCI World ETF', ticker: 'EUNL', category: 'etf', quantity: 10, buyPrice: 80, currentPrice: 96.40, currency: 'EUR', color: 'mint' },
  { name: 'S&P 500 ETF', ticker: 'SXR8', category: 'etf', quantity: 5, buyPrice: 450, currentPrice: 533.20, currency: 'EUR', color: 'mint' },
  { name: 'Apple Inc.', ticker: 'AAPL', category: 'stock', quantity: 8, buyPrice: 150, currentPrice: 213.50, currency: 'USD', color: 'lavender' },
  { name: 'NVIDIA Corp.', ticker: 'NVDA', category: 'stock', quantity: 4, buyPrice: 400, currentPrice: 875.00, currency: 'USD', color: 'peach' },
  { name: 'US Treasury 2Y', ticker: 'US2Y', category: 'securities', quantity: 1000, buyPrice: 1, currentPrice: 0.98, currency: 'USD', color: 'mint' },
  { name: 'Corp. Bond ETF', ticker: 'CORP', category: 'securities', quantity: 20, buyPrice: 45, currentPrice: 46.80, currency: 'USD', color: 'lavender' },
]

const CATEGORY_LABELS: Record<AssetCategory, string> = {
  crypto: 'Krypto',
  stock: 'Aktien',
  etf: 'ETF',
  securities: 'Wertpapiere',
  other: 'Sonstige',
}

const CATEGORY_COLORS: Record<AssetCategory, { bg: string; icon: string; dot: string }> = {
  crypto: { bg: 'bg-peach-light/50', icon: 'bg-peach', dot: 'bg-peach' },
  stock: { bg: 'bg-lavender-light/40', icon: 'bg-lavender', dot: 'bg-lavender' },
  etf: { bg: 'bg-mint-light/40', icon: 'bg-mint', dot: 'bg-mint' },
  securities: { bg: 'bg-mint-light/30', icon: 'bg-mint', dot: 'bg-mint' },
  other: { bg: 'bg-muted', icon: 'bg-muted-foreground/20', dot: 'bg-muted-foreground' },
}

function CategoryIcon({ category, size = 20 }: { category: AssetCategory; size?: number }) {
  const props = { size, weight: 'fill' as const, className: 'text-primary' }
  switch (category) {
    case 'crypto': return <CurrencyBtc {...props} />
    case 'stock': return <ChartLineUp {...props} />
    case 'etf': return <TrendUp {...props} />
    case 'securities': return <Vault {...props} />
    default: return <Coins {...props} />
  }
}

function PortfolioItemRow({ item }: { item: PortfolioItem }) {
  const value = item.quantity * item.currentPrice
  const cost = item.quantity * item.buyPrice
  const gain = value - cost
  const gainPct = ((gain / cost) * 100).toFixed(2)
  const isPositive = gain >= 0
  const colors = CATEGORY_COLORS[item.category]

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between py-3"
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colors.icon}`}>
          <CategoryIcon category={item.category} />
        </div>
        <div>
          <p className="font-semibold text-sm">{item.name}</p>
          <p className="text-xs text-muted-foreground">{item.ticker} · {item.quantity} Stk.</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-semibold tabular-nums text-sm">
          {item.currency === 'EUR' ? '€' : '$'}{value.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
        <p className={`text-xs tabular-nums flex items-center justify-end gap-0.5 ${isPositive ? 'text-mint' : 'text-destructive'}`}>
          {isPositive ? <TrendUp size={12} weight="bold" /> : <TrendDown size={12} weight="bold" />}
          {isPositive ? '+' : ''}{gainPct}%
        </p>
      </div>
    </motion.div>
  )
}

const EMPTY_FORM: Omit<PortfolioItem, 'id' | 'userId'> = {
  name: '',
  ticker: '',
  category: 'stock',
  quantity: 0,
  buyPrice: 0,
  currentPrice: 0,
  currency: 'USD',
  color: 'mint',
}

export function Portfolio({ onBack, userId }: PortfolioProps) {
  const [items, setItems] = useKV<PortfolioItem[]>(`portfolio_${userId}`, DEFAULT_ITEMS.map(i => ({ ...i, id: uuidv4(), userId })))
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState<Omit<PortfolioItem, 'id' | 'userId'>>(EMPTY_FORM)

  const totalValue = (items ?? []).reduce((sum, i) => sum + i.quantity * i.currentPrice, 0)
  const totalCost = (items ?? []).reduce((sum, i) => sum + i.quantity * i.buyPrice, 0)
  const totalGain = totalValue - totalCost
  const totalGainPct = totalCost > 0 ? ((totalGain / totalCost) * 100).toFixed(2) : '0.00'
  const isPositive = totalGain >= 0

  const byCategory = (cat: AssetCategory | 'all') =>
    cat === 'all' ? (items ?? []) : (items ?? []).filter(i => i.category === cat)

  function handleAdd() {
    if (!form.name || !form.ticker || form.quantity <= 0) return
    const newItem: PortfolioItem = { ...form, id: uuidv4(), userId }
    setItems([...(items ?? []), newItem])
    setForm(EMPTY_FORM)
    setShowAdd(false)
  }

  function handleRemove(id: string) {
    setItems((items ?? []).filter(i => i.id !== id))
  }

  const allocationData = (['crypto', 'stock', 'etf', 'securities', 'other'] as AssetCategory[]).map(cat => {
    const catValue = (items ?? []).filter(i => i.category === cat).reduce((s, i) => s + i.quantity * i.currentPrice, 0)
    const pct = totalValue > 0 ? (catValue / totalValue) * 100 : 0
    return { cat, pct, value: catValue }
  }).filter(d => d.value > 0)

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-md mx-auto pt-8 px-6">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="rounded-full" onClick={onBack}>
              <CaretLeft size={24} />
            </Button>
            <h2 className="text-2xl font-display font-bold">Portfolio</h2>
          </div>

          {/* Total Value Card */}
          <Card className="bg-primary text-primary-foreground p-6 rounded-3xl border-0 shadow-lg relative overflow-hidden">
            <div className="absolute top-4 right-4 w-14 h-14 bg-white/10 rounded-2xl" />
            <div className="absolute top-8 right-8 w-20 h-20 bg-white/5 rounded-2xl" />
            <div className="relative z-10">
              <p className="text-sm opacity-80 mb-1">Gesamtwert</p>
              <h3 className="text-4xl font-display font-bold tabular-nums mb-2">
                ${totalValue.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
              <div className={`flex items-center gap-1.5 text-sm font-semibold ${isPositive ? 'text-mint' : 'text-destructive'}`}>
                {isPositive ? <TrendUp size={16} weight="bold" /> : <TrendDown size={16} weight="bold" />}
                <span>{isPositive ? '+' : ''}${Math.abs(totalGain).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({isPositive ? '+' : ''}{totalGainPct}%)</span>
              </div>
            </div>
          </Card>

          {/* Allocation Bar */}
          {allocationData.length > 0 && (
            <Card className="p-5 rounded-3xl">
              <p className="text-sm font-semibold mb-3">Allokation</p>
              <div className="flex w-full h-3 rounded-full overflow-hidden gap-0.5">
                {allocationData.map(({ cat, pct }) => (
                  <div
                    key={cat}
                    className={`h-full ${CATEGORY_COLORS[cat].dot} transition-all`}
                    style={{ width: `${pct}%` }}
                  />
                ))}
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3">
                {allocationData.map(({ cat, pct }) => (
                  <div key={cat} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className={`w-2 h-2 rounded-full ${CATEGORY_COLORS[cat].dot}`} />
                    {CATEGORY_LABELS[cat]} {pct.toFixed(0)}%
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Tabs */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-muted p-1 rounded-full h-11">
              {(['all', 'crypto', 'stock', 'etf', 'securities'] as const).map(tab => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="rounded-full text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {tab === 'all' ? 'Alle' : CATEGORY_LABELS[tab]}
                </TabsTrigger>
              ))}
            </TabsList>

            {(['all', 'crypto', 'stock', 'etf', 'securities'] as const).map(tab => (
              <TabsContent key={tab} value={tab} className="mt-4">
                <Card className="rounded-2xl">
                  <ScrollArea className="max-h-[380px]">
                    {byCategory(tab).length > 0 ? (
                      <div className="p-4 space-y-1 divide-y divide-border">
                        {byCategory(tab).map(item => (
                          <div key={item.id} className="relative group">
                            <PortfolioItemRow item={item} />
                            <button
                              onClick={() => handleRemove(item.id)}
                              className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-destructive/10 text-destructive"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center text-muted-foreground">
                        <Buildings size={40} className="mx-auto mb-3 opacity-30" />
                        <p className="text-sm">Keine Positionen vorhanden</p>
                      </div>
                    )}
                  </ScrollArea>
                </Card>
              </TabsContent>
            ))}
          </Tabs>

          {/* Add Button */}
          <Button
            className="w-full h-12 rounded-full font-semibold gap-2"
            onClick={() => setShowAdd(true)}
          >
            <Plus size={20} weight="bold" />
            Position hinzufügen
          </Button>
        </motion.div>
      </div>

      {/* Add Item Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end justify-center" onClick={() => setShowAdd(false)}>
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-card rounded-t-3xl p-6 w-full max-w-md space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-display font-bold">Neue Position</h3>
              <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setShowAdd(false)}>
                <X size={20} />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-xs text-muted-foreground mb-1 block">Name</label>
                <input
                  className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                  placeholder="z. B. Apple Inc."
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Ticker</label>
                <input
                  className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring uppercase"
                  placeholder="AAPL"
                  value={form.ticker}
                  onChange={e => setForm(f => ({ ...f, ticker: e.target.value.toUpperCase() }))}
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Kategorie</label>
                <select
                  className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                  value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value as AssetCategory }))}
                >
                  {(Object.entries(CATEGORY_LABELS) as [AssetCategory, string][]).map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Anzahl / Stk.</label>
                <input
                  type="number"
                  className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                  placeholder="0"
                  min="0"
                  value={form.quantity || ''}
                  onChange={e => setForm(f => ({ ...f, quantity: parseFloat(e.target.value) || 0 }))}
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Kaufpreis</label>
                <input
                  type="number"
                  className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                  placeholder="0.00"
                  min="0"
                  value={form.buyPrice || ''}
                  onChange={e => setForm(f => ({ ...f, buyPrice: parseFloat(e.target.value) || 0 }))}
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Aktueller Kurs</label>
                <input
                  type="number"
                  className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                  placeholder="0.00"
                  min="0"
                  value={form.currentPrice || ''}
                  onChange={e => setForm(f => ({ ...f, currentPrice: parseFloat(e.target.value) || 0 }))}
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Währung</label>
                <select
                  className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                  value={form.currency}
                  onChange={e => setForm(f => ({ ...f, currency: e.target.value }))}
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="CHF">CHF</option>
                </select>
              </div>
            </div>

            <Button
              className="w-full h-12 rounded-full font-semibold mt-2"
              onClick={handleAdd}
              disabled={!form.name || !form.ticker || form.quantity <= 0}
            >
              Hinzufügen
            </Button>
          </motion.div>
        </div>
      )}
    </div>
  )
}
