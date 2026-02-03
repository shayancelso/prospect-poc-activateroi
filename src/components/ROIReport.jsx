import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Download, Share2, TrendingUp, Clock, DollarSign, Shield, Crosshair, Users, Megaphone, Rocket, HeartPulse, Settings } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'

const ICON_MAP = { Crosshair, Users, Megaphone, Rocket, HeartPulse, Settings }

function AnimatedNumber({ value, prefix = '', suffix = '', decimals = 0 }) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    let raf
    const duration = 1200
    const start = Date.now()
    const tick = () => {
      const p = Math.min((Date.now() - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setDisplay(Math.round(eased * value * Math.pow(10, decimals)) / Math.pow(10, decimals))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value, decimals])
  return (
    <span className="tabular-nums">
      {prefix}{decimals > 0 ? display.toFixed(decimals) : display.toLocaleString()}{suffix}
    </span>
  )
}

export default function ROIReport({ data, onBack }) {
  const { company, industry, warehouse, aeName, selectedCases, scenario, timeSavings, revImpact, churnReduction, dataQuality, totalValue, censusCost, roiRatio, paybackDays, allScenarios } = data

  const paybackData = Array.from({ length: 13 }, (_, i) => ({
    month: i === 0 ? 'Start' : `M${i}`,
    value: Math.round((totalValue / 12) * i),
    cost: censusCost,
  }))

  const categories = [
    { label: 'Operational Efficiency', sub: 'Time savings from automation', value: timeSavings, icon: Clock },
    { label: 'Revenue Impact', sub: 'Better data drives better selling', value: revImpact, icon: TrendingUp },
    { label: 'Churn Reduction', sub: 'Proactive customer success', value: churnReduction, icon: Shield },
    { label: 'Data Quality', sub: 'Fewer errors, better compliance', value: dataQuality, icon: DollarSign },
  ].filter((c) => c.value > 0)

  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Top bar */}
      <header className="h-14 px-8 flex items-center justify-between border-b border-zinc-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Builder
        </button>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl border border-zinc-200 text-zinc-700 hover:bg-zinc-50 transition-all">
            <Share2 className="w-4 h-4" /> Share
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 transition-all shadow-sm">
            <Download className="w-4 h-4" /> Export PDF
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto py-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="bg-white rounded-2xl border border-zinc-200/80 shadow-xl shadow-zinc-200/40 overflow-hidden"
        >
          {/* Report header with Census gradient */}
          <div className="relative overflow-hidden">
            <div className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 px-10 py-9 text-white">
              {/* Decorative circles */}
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#89F4EA]/5 -translate-y-1/2 translate-x-1/4" />
              <div className="absolute bottom-0 left-20 w-32 h-32 rounded-full bg-[#0D9488]/10 translate-y-1/2" />

              <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#89F4EA]" />
                  <p className="text-xs font-semibold text-[#89F4EA] uppercase tracking-widest">Data Activation ROI Analysis</p>
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight">{company}</h1>
                <p className="text-sm text-zinc-400 mt-2">Prepared by {aeName} · {today}</p>
                <div className="flex items-center gap-2 mt-4">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-white/10 text-zinc-300 backdrop-blur-sm">{industry}</span>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-white/10 text-zinc-300 backdrop-blur-sm">{warehouse}</span>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-[#89F4EA]/15 text-[#89F4EA] capitalize">{scenario}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Hero ROI */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="px-10 py-10 border-b border-zinc-100 text-center relative"
          >
            {/* Subtle glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#89F4EA]/5 to-transparent pointer-events-none" />
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest relative">Projected Annual ROI</p>
            <div className="flex items-baseline justify-center gap-2 mt-3 relative">
              <span className="text-7xl font-black text-gradient-census">
                <AnimatedNumber value={roiRatio} decimals={1} />
              </span>
              <span className="text-3xl font-bold text-zinc-300">: 1</span>
            </div>
            <p className="text-sm text-zinc-500 mt-3 relative">
              <span className="font-bold text-zinc-700">${totalValue.toLocaleString()}</span> annual value on{' '}
              <span className="font-bold text-zinc-700">${censusCost.toLocaleString()}</span> investment
            </p>
          </motion.div>

          {/* Executive summary */}
          <div className="px-10 py-7 border-b border-zinc-100">
            <h3 className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-3">Executive Summary</h3>
            <p className="text-sm text-zinc-600 leading-relaxed">
              By implementing Census for data activation, <strong className="text-zinc-800">{company}</strong> is projected to save{' '}
              <strong className="text-zinc-800">${Math.round(timeSavings).toLocaleString()}</strong> in operational costs
              {revImpact > 0 && <>, generate <strong className="text-zinc-800">${Math.round(revImpact).toLocaleString()}</strong> in incremental revenue</>}
              {churnReduction > 0 && <>, reduce churn-related losses by <strong className="text-zinc-800">${Math.round(churnReduction).toLocaleString()}</strong></>}
              , resulting in a total annual value of <strong className="text-zinc-800">${totalValue.toLocaleString()}</strong> — a{' '}
              <strong className="text-[#0D9488]">{roiRatio.toFixed(1)}:1 ROI</strong> with payback in{' '}
              <strong className="text-[#0D9488]">{paybackDays} days</strong>.
            </p>
          </div>

          {/* Financial impact */}
          <div className="px-10 py-8 border-b border-zinc-100">
            <h3 className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-6">Financial Impact</h3>
            <div className="space-y-3">
              {categories.map((cat, i) => {
                const Icon = cat.icon
                const pct = Math.round((cat.value / totalValue) * 100)
                return (
                  <motion.div
                    key={cat.label}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.1, ease: 'easeOut' }}
                    className="flex items-center justify-between py-3.5 px-5 rounded-xl bg-zinc-50/80 border border-zinc-100 hover:border-zinc-200 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#0D9488]/10 to-[#89F4EA]/15 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-[#0D9488]" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-zinc-900">{cat.label}</p>
                        <p className="text-xs text-zinc-500">{cat.sub}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-5">
                      <div className="w-28 h-2 bg-zinc-200 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ delay: 0.6 + i * 0.1, duration: 0.8, ease: 'easeOut' }}
                          className="h-full bg-gradient-to-r from-[#0D9488] to-[#89F4EA] rounded-full"
                        />
                      </div>
                      <span className="text-sm font-bold text-zinc-900 tabular-nums w-28 text-right">
                        ${Math.round(cat.value).toLocaleString()}
                      </span>
                    </div>
                  </motion.div>
                )
              })}
              {/* Total */}
              <div className="flex items-center justify-between py-4 px-5 rounded-xl bg-gradient-to-r from-[#0D9488] to-[#10B981] text-white mt-3">
                <span className="text-sm font-bold">Total Annual Value</span>
                <span className="text-xl font-extrabold tabular-nums">${totalValue.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between py-3 px-5 text-sm">
                <span className="text-zinc-500">Census Annual Investment</span>
                <span className="font-semibold text-zinc-600 tabular-nums">-${censusCost.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between py-3.5 px-5 rounded-xl bg-emerald-50 border border-emerald-200/60">
                <span className="text-sm font-bold text-emerald-800">Net Annual Value</span>
                <span className="text-lg font-extrabold text-emerald-600 tabular-nums">${(totalValue - censusCost).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Payback timeline */}
          <div className="px-10 py-8 border-b border-zinc-100">
            <h3 className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-1">Payback Timeline</h3>
            <p className="text-sm text-zinc-500 mb-6">Cumulative value vs. investment over 12 months</p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={paybackData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="valueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0D9488" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#89F4EA" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F4F4F5" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#A1A1AA', fontFamily: 'Inter' }} dy={8} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#A1A1AA', fontFamily: 'Inter' }} dx={-8} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#18181B', border: 'none', borderRadius: '10px', padding: '10px 14px', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}
                    labelStyle={{ color: '#A1A1AA', fontSize: 11, fontWeight: 500, marginBottom: 4 }}
                    itemStyle={{ color: '#FAFAFA', fontSize: 13, fontWeight: 600 }}
                    formatter={(v) => [`$${v.toLocaleString()}`, '']}
                  />
                  <ReferenceLine y={censusCost} stroke="#EF4444" strokeDasharray="6 4" strokeWidth={1.5} label={{ value: `Census: $${censusCost.toLocaleString()}`, position: 'right', fill: '#EF4444', fontSize: 11 }} />
                  <Area type="monotone" dataKey="value" stroke="#0D9488" strokeWidth={2.5} fill="url(#valueGrad)" animationDuration={1500} animationEasing="ease-out" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center mt-5">
              <div className="bg-gradient-to-r from-[#0D9488] to-[#10B981] text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-md shadow-teal-200/30">
                Payback in {paybackDays} days
              </div>
            </div>
          </div>

          {/* Use cases */}
          <div className="px-10 py-8 border-b border-zinc-100">
            <h3 className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-5">Activated Use Cases</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selectedCases.map((uc, i) => {
                const Icon = ICON_MAP[uc.icon]
                return (
                  <motion.div
                    key={uc.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.07 }}
                    className="rounded-xl border border-zinc-200/80 p-4 hover:shadow-sm hover:border-zinc-300 transition-all flex items-start gap-3"
                  >
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#0D9488]/10 to-[#89F4EA]/15 flex items-center justify-center shrink-0">
                      {Icon && <Icon className="w-4 h-4 text-[#0D9488]" />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-zinc-900">{uc.label}</p>
                      <p className="text-xs text-zinc-500 leading-relaxed mt-0.5">{uc.description}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Sensitivity analysis */}
          <div className="px-10 py-8">
            <h3 className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-5">Sensitivity Analysis</h3>
            <div className="grid grid-cols-3 gap-4">
              {['conservative', 'moderate', 'aggressive'].map((s) => {
                const d = allScenarios[s]
                const sel = s === scenario
                return (
                  <div
                    key={s}
                    className={`rounded-xl border-2 p-5 text-center transition-all ${
                      sel ? 'border-[#0D9488] bg-gradient-to-b from-[#89F4EA]/8 to-transparent shadow-md shadow-teal-100/20' : 'border-zinc-200'
                    }`}
                  >
                    <p className={`text-xs font-semibold uppercase tracking-wider capitalize ${sel ? 'text-[#0D9488]' : 'text-zinc-400'}`}>{s}</p>
                    <p className="text-2xl font-extrabold text-zinc-900 mt-2 tabular-nums">{d.roiRatio.toFixed(1)}<span className="text-zinc-400 text-base">:1</span></p>
                    <p className="text-xs text-zinc-500 mt-1">${(d.totalValue / 1000).toFixed(0)}K/yr</p>
                    <p className="text-xs text-zinc-400 mt-0.5">Day {d.paybackDays} payback</p>
                    {sel && (
                      <span className="inline-block mt-2.5 text-[10px] font-bold text-[#065F56] bg-[#89F4EA]/20 px-2.5 py-0.5 rounded-full">
                        Selected
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="px-10 py-5 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#0D9488] to-[#89F4EA] flex items-center justify-center">
                <TrendingUp className="w-3 h-3 text-white" />
              </div>
              <span className="text-xs font-medium text-zinc-400">Generated with ActivateROI · Census</span>
            </div>
            <span className="text-xs text-zinc-400">{today}</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
