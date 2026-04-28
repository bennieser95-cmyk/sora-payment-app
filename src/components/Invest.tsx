import { useEffect, useMemo, useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import {
  CaretLeft,
  MagnifyingGlass,
  ArrowsClockwise,
  TrendUp,
  Key,
} from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

interface InvestProps {
  onBack: () => void
  userId: string
}

interface FinazonTicker {
  asset_type: string
  cik: string
  composite_figi: string
  currency: string
  lei: string
  mic: string
  security: string
  share_figi: string
  ticker: string
}

interface FinazonResponse {
  data?: FinazonTicker[]
  meta?: {
    pagination?: {
      page: number
      per_page: number
    }
  }
}

export function Invest({ onBack, userId }: InvestProps) {
  const [apiKey, setApiKey] = useKV<string>(`finazon_api_key_${userId}`, '')
  const [apiKeyInput, setApiKeyInput] = useState('')
  const [tickers, setTickers] = useState<FinazonTicker[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchTickers = async (key: string) => {
    if (!key) return
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(
        `https://api.finazon.io/latest/finazon/us_stocks_essential/tickers?page_size=1000&apikey=${encodeURIComponent(
          key,
        )}`,
      )
      if (!response.ok) {
        throw new Error(`Request failed (${response.status})`)
      }
      const json: FinazonResponse = await response.json()
      setTickers(json.data ?? [])
      setLastUpdated(new Date())
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load stocks'
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (apiKey) {
      fetchTickers(apiKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return tickers
    return tickers.filter(
      t =>
        t.ticker.toLowerCase().includes(q) ||
        t.security.toLowerCase().includes(q),
    )
  }, [tickers, search])

  const handleSaveKey = () => {
    const trimmed = apiKeyInput.trim()
    if (!trimmed) {
      toast.error('Please enter your Finazon API key')
      return
    }
    setApiKey(trimmed)
    setApiKeyInput('')
    toast.success('API key saved')
  }

  const handleClearKey = () => {
    setApiKey('')
    setTickers([])
    setLastUpdated(null)
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-md mx-auto pt-8 px-6">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-4 mb-2">
            <Button variant="ghost" size="icon" className="rounded-full" onClick={onBack}>
              <CaretLeft size={24} />
            </Button>
            <div className="flex-1">
              <h2 className="text-2xl font-display font-bold">Invest</h2>
              <p className="text-xs text-muted-foreground">Live US stocks via Finazon</p>
            </div>
            {apiKey && (
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => fetchTickers(apiKey)}
                disabled={loading}
                aria-label="Refresh"
              >
                <ArrowsClockwise size={20} className={loading ? 'animate-spin' : ''} />
              </Button>
            )}
          </div>

          {!apiKey ? (
            <Card className="p-6 rounded-3xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-mint flex items-center justify-center">
                  <Key size={22} weight="fill" className="text-primary" />
                </div>
                <div>
                  <h3 className="font-display font-semibold">Connect Finazon</h3>
                  <p className="text-xs text-muted-foreground">
                    Enter your API key to load live stock data
                  </p>
                </div>
              </div>
              <Input
                type="password"
                placeholder="Finazon API key"
                value={apiKeyInput}
                onChange={e => setApiKeyInput(e.target.value)}
                className="rounded-2xl h-12"
              />
              <Button
                className="w-full rounded-full h-12"
                onClick={handleSaveKey}
                disabled={!apiKeyInput.trim()}
              >
                Save & Load Stocks
              </Button>
              <p className="text-[11px] text-muted-foreground break-all">
                Endpoint: https://api.finazon.io/latest/finazon/us_stocks_essential/tickers?page_size=1000&apikey=api_key
              </p>
            </Card>
          ) : (
            <>
              <Card className="p-6 rounded-3xl bg-gradient-to-br from-mint-light/40 to-mint-light/10">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">US Stocks Essential</p>
                  <TrendUp size={20} weight="fill" className="text-primary" />
                </div>
                <h3 className="text-4xl font-display font-bold tabular-nums">
                  {tickers.length.toLocaleString()}
                  <span className="text-lg font-medium text-muted-foreground ml-2">tickers</span>
                </h3>
                {lastUpdated && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Updated {lastUpdated.toLocaleTimeString()}
                  </p>
                )}
              </Card>

              <div className="relative">
                <MagnifyingGlass
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  placeholder="Search ticker or company"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-11 rounded-full h-12"
                />
              </div>

              {error && (
                <Card className="p-4 rounded-2xl border-destructive/40 bg-destructive/5">
                  <p className="text-sm text-destructive">{error}</p>
                </Card>
              )}

              <Card className="rounded-3xl overflow-hidden">
                <ScrollArea className="h-[460px]">
                  {loading && tickers.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground text-sm">
                      Loading live stocks…
                    </div>
                  ) : filtered.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground text-sm">
                      {tickers.length === 0 ? 'No data yet' : 'No matches'}
                    </div>
                  ) : (
                    <div className="divide-y divide-border">
                      {filtered.map(t => (
                        <div
                          key={`${t.ticker}-${t.composite_figi}`}
                          className="flex items-center justify-between px-5 py-3"
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-semibold tabular-nums">{t.ticker}</p>
                              <Badge variant="secondary" className="text-[10px] uppercase">
                                {t.mic}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground truncate">
                              {t.security}
                            </p>
                          </div>
                          <div className="text-right shrink-0 ml-3">
                            <p className="text-xs font-medium">{t.currency}</p>
                            <p className="text-[10px] text-muted-foreground">
                              {t.asset_type.replace('_', ' ').toLowerCase()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </Card>

              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs text-muted-foreground"
                onClick={handleClearKey}
              >
                Disconnect API key
              </Button>
            </>
          )}
        </motion.div>
      </div>
    </div>
  )
}
