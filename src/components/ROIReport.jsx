import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Download, Share2, TrendingUp, Clock, DollarSign, Shield, Crosshair, Users, Megaphone, Rocket, HeartPulse, Settings } from 'lucide-react'

const ICON_MAP = { Crosshair, Users, Megaphone, Rocket, HeartPulse, Settings }
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'

function AnimatedNumber({ value, prefix = '', suffix = '', decimals = 0 }) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    let start = 0
    const duration = 1000
    const startTime = Date.now()
    const tick = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(eased * value * Math.pow(10, decimals)) / Math.pow(10, decimals))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [value, decimals])
  return (
    <span className="tabular-nums">
      {prefix}{decimals > 0 ? display.toFixed(decimals) : display.toLocaleString()}{suffix}
    </span>
  )
}

export default function ROIReport({ data, onBack }) {
  const { company, industry, warehouse, aeName, selectedCases, scenario, timeSavings, revImpact, churnReduction, dataQuality, totalValue, censusCost, roiRatio, paybackDays, allScenarios } = data

  // Payback chart data
  const paybackData = Array.from({ length: 13 }, (_, i) => ({
    month: i === 0 ? 'Start' : `M${i}`,
    value: Math.round((totalValue / 12) * i),
    cost: censusCost,
    monthNum: i,
  }))

  const paybackMonth = paybackDays / 30

  const categories = [
    { label: 'Operational Efficiency', sublabel: 'Time savings from automation', value: timeSavings, icon: Clock, color: 'indigo' },
    { label: 'Revenue Impact', sublabel: 'Better data → better selling', value: revImpact, icon: TrendingUp, color: 'violet' },
    { label: 'Churn Reduction', sublabel: 'Proactive customer success', value: churnReduction, icon: Shield, color: 'teal' },
    { label: 'Data Quality', sublabel: 'Fewer errors, better compliance', value: dataQuality, icon: DollarSign, color: 'amber' },
  ].filter((c) => c.value > 0)

  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Top bar */}
      <header className="h-16 px-8 flex items-center justify-between border-b border-zinc-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Builder
        </button>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-zinc-200 text-zinc-700 hover:bg-zinc-50 transition-all">
            <Share2 className="w-4 h-4" /> Share
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 transition-all shadow-sm">
            <Download className="w-4 h-4" /> Export PDF
          </button>
        </div>
      </header>

      {/* Report */}
      <div className="max-w-4xl mx-auto py-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl border border-zinc-200 shadow-lg overflow-hidden"
        >
          {/* Report header */}
          <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 px-10 py-8 text-white">
            <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Data Activation ROI Analysis</p>
            <h1 className="text-2xl font-bold mt-1.5">{company}</h1>
            <p className="text-sm text-zinc-400 mt-2">Prepared by {aeName} • {today}</p>
            <div className="flex items-center gap-3 mt-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/10 text-zinc-300">{industry}</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/10 text-zinc-300">{warehouse}</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-400/20 text-indigo-300 capitalize">{scenario}</span>
            </div>
          </div>

          {/* Hero ROI */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="px-10 py-10 border-b border-zinc-100 text-center"
          >
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Projected Annual ROI</p>
            <div className="flex items-baseline justify-center gap-2 mt-3">
              <span className="text-6xl font-extrabold text-zinc-900 tabular-nums">
                <AnimatedNumber value={roiRatio} decimals={1} />
              </span>
              <span className="text-3xl font-bold text-zinc-300">: 1</span>
            </div>
            <p className="text-sm text-zinc-500 mt-3">
              <span className="font-semibold text-zinc-700">${totalValue.toLocaleString()}</span> annual value on{' '}
              <span className="font-semibold text-zinc-700">${censusCost.toLocaleString()}</span> investment
            </p>
          </motion.div>

          {/* Executive summary */}
          <div className="px-10 py-8 border-b border-zinc-100 bg-zinc-50/50">
            <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">Executive Summary</h3>
            <p className="text-sm text-zinc-700 leading-relaxed">
              By implementing Census for data activation, <strong>{company}</strong> is projected to save{' '}
              <strong>${Math.round(timeSavings).toLocaleString()}</strong> in operational costs
              {revImpact > 0 && <>, generate <strong>${Math.round(revImpact).toLocaleString()}</strong> in incremental revenue</>}
              {churnReduction > 0 && <>, reduce churn-related losses by <strong>${Math.round(churnReduction).toLocaleString()}</strong></>}
              , resulting in a total annual value of <strong>${totalValue.toLocaleString()}</strong> against an investment of{' '}
              <strong>${censusCost.toLocaleString()}</strong> — a <strong>{roiRatio.toFixed(1)}:1 ROI</strong> with payback in{' '}
              <strong>{paybackDays} days</strong>.
            </p>
          </div>

          {/* Financial impact */}
          <div className="px-10 py-8 border-b border-zinc-100">
            <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-5">Financial Impact Breakdown</h3>
            <div className="space-y-3">
              {categories.map((cat, i) => {
                const Icon = cat.icon
                const pct = Math.round((cat.value / totalValue) * 100)
                return (
                  <motion.div
                    key={cat.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="flex items-center justify-between py-3 px-4 rounded-xl bg-zinc-50 hover:bg-zinc-100/80 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-indigo-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-zinc-900">{cat.label}</p>
                        <p className="text-xs text-zinc-500">{cat.sublabel}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-1.5 bg-zinc-200 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ delay: 0.6 + i * 0.1, duration: 0.8 }}
                          className="h-full bg-indigo-500 rounded-full"
                        />
                      </div>
                      <span className="text-sm font-semibold text-zinc-900 tabular-nums w-24 text-right">
                        ${Math.round(cat.value).toLocaleString()}
                      </span>
                    </div>
                  </motion.div>
                )
              })}
              {/* Total */}
              <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-indigo-50 border border-indigo-100 mt-2">
                <span className="text-sm font-semibold text-zinc-900">Total Annual Value</span>
                <span className="text-lg font-bold text-indigo-600 tabular-nums">${totalValue.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between py-3 px-4 text-sm">
                <span className="text-zinc-500">Census Annual Investment</span>
                <span className="font-medium text-zinc-600 tabular-nums">−${censusCost.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-emerald-50 border border-emerald-100">
                <span className="text-sm font-semibold text-emerald-800">Net Annual Value</span>
                <span className="text-lg font-bold text-emerald-600 tabular-nums">${(totalValue - censusCost).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Payback timeline */}
          <div className="px-10 py-8 border-b border-zinc-100">
            <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Payback Timeline</h3>
            <p className="text-sm text-zinc-500 mb-6">Cumulative value vs. investment over 12 months</p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={paybackData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="valueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F4F4F5" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#A1A1AA' }} dy={8} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#A1A1AA' }} dx={-8} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#18181B', border: 'none', borderRadius: '8px', padding: '8px 12px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
                    labelStyle={{ color: '#A1A1AA', fontSize: 11, fontWeight: 500, marginBottom: 4 }}
                    itemStyle={{ color: '#FAFAFA', fontSize: 13, fontWeight: 600 }}
                    formatter={(v) => [`$${v.toLocaleString()}`, '']}
                  />
                  <ReferenceLine y={censusCost} stroke="#EF4444" strokeDasharray="6 4" strokeWidth={1.5} label={{ value: `Census Cost: $${censusCost.toLocaleString()}`, position: 'right', fill: '#EF4444', fontSize: 11 }} />
                  <Area type="monotone" dataKey="value" stroke="#6366F1" strokeWidth={2} fill="url(#valueGrad)" animationDuration={1200} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className="bg-indigo-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                Payback in {paybackDays} days
              </div>
            </div>
          </div>

          {/* Use cases */}
          <div className="px-10 py-8 border-b border-zinc-100">
            <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-5">Activated Use Cases</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {selectedCases.map((uc, i) => (
                <motion.div
                  key={uc.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.08 }}
                  className="rounded-xl border border-zinc-200 p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-center gap-2 mb-2">
                    {(() => { const Icon = ICON_MAP[uc.icon]; return Icon ? <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center"><Icon className="w-4 h-4 text-indigo-500" /></div> : null })()}
                    <p className="text-sm font-medium text-zinc-900">{uc.label}</p>
                  </div>
                  <p className="text-xs text-zinc-500 leading-relaxed">{uc.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Sensitivity analysis */}
          <div className="px-10 py-8">
            <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-5">Sensitivity Analysis</h3>
            <div className="grid grid-cols-3 gap-4">
              {['conservative', 'moderate', 'aggressive'].map((s) => {
                const d = allScenarios[s]
                const sel = s === scenario
                return (
                  <div
                    key={s}
                    className={`rounded-xl border-2 p-5 text-center transition-all ${
                      sel ? 'border-indigo-500 bg-indigo-50/30' : 'border-zinc-200'
                    }`}
                  >
                    <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider capitalize">{s}</p>
                    <p className="text-2xl font-bold text-zinc-900 mt-2 tabular-nums">{d.roiRatio.toFixed(1)}:1</p>
                    <p className="text-xs text-zinc-500 mt-1">${(d.totalValue / 1000).toFixed(0)}K/yr</p>
                    <p className="text-xs text-zinc-400 mt-0.5">Day {d.paybackDays} payback</p>
                    {sel && (
                      <span className="inline-block mt-2 text-[10px] font-medium text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full">
                        Selected
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="px-10 py-6 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded bg-indigo-500 flex items-center justify-center">
                <TrendingUp className="w-3 h-3 text-white" />
              </div>
              <span className="text-xs font-medium text-zinc-500">Generated with ActivateROI by Census</span>
            </div>
            <span className="text-xs text-zinc-400">{today}</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
