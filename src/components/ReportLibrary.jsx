import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, ArrowUpDown, FileText, Copy, ExternalLink, TrendingUp, Clock, BarChart3, Award } from 'lucide-react'
import { SAVED_REPORTS } from '../data'

const STATUS_STYLES = {
  Draft: 'bg-zinc-100 text-zinc-600',
  Sent: 'bg-sky-50 text-sky-700 border border-sky-200',
  Presented: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
}

const STAGE_STYLES = {
  Discovery: 'bg-zinc-100 text-zinc-600',
  Proposal: 'bg-amber-50 text-amber-700',
  Negotiation: 'bg-violet-50 text-violet-700',
  'Closed Won': 'bg-emerald-50 text-emerald-700',
}

export default function ReportLibrary() {
  const [search, setSearch] = useState('')
  const [filterIndustry, setFilterIndustry] = useState('All')
  const [sortBy, setSortBy] = useState('created')

  const industries = ['All', ...new Set(SAVED_REPORTS.map((r) => r.industry))]

  let filtered = SAVED_REPORTS.filter((r) => {
    const q = search.toLowerCase()
    const matchSearch = !q || r.prospect.toLowerCase().includes(q) || r.ae.toLowerCase().includes(q) || r.industry.toLowerCase().includes(q)
    const matchIndustry = filterIndustry === 'All' || r.industry === filterIndustry
    return matchSearch && matchIndustry
  })

  if (sortBy === 'roi') filtered.sort((a, b) => b.roiRatio - a.roiRatio)
  else if (sortBy === 'value') filtered.sort((a, b) => b.totalValue - a.totalValue)
  else filtered.sort((a, b) => new Date(b.created) - new Date(a.created))

  const avgROI = (SAVED_REPORTS.reduce((s, r) => s + r.roiRatio, 0) / SAVED_REPORTS.length).toFixed(1)
  const totalValue = SAVED_REPORTS.reduce((s, r) => s + r.totalValue, 0)
  const totalReports = SAVED_REPORTS.length

  const kpis = [
    { label: 'Total Reports', value: totalReports.toString(), sub: 'This quarter', icon: FileText },
    { label: 'Avg ROI Ratio', value: `${avgROI}:1`, sub: 'Across all reports', icon: TrendingUp, accent: true },
    { label: 'Total Value Identified', value: `$${(totalValue / 1e6).toFixed(1)}M`, sub: 'Cumulative', icon: BarChart3 },
    { label: 'Win Rate', value: '67%', sub: 'Reports → Closed Won', icon: Award },
  ]

  return (
    <div className="min-h-screen">
      <header className="h-14 px-8 flex items-center justify-between border-b border-zinc-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-2.5 text-sm">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#0D9488]/10 to-[#89F4EA]/15 flex items-center justify-center">
            <FileText className="w-3.5 h-3.5 text-[#0D9488]" />
          </div>
          <span className="font-semibold text-zinc-900">Report Library</span>
          <span className="text-xs text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-full">{totalReports}</span>
        </div>
      </header>

      <div className="p-8 space-y-6 max-w-[1400px]">
        {/* KPI cards */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
          className="grid grid-cols-4 gap-5"
        >
          {kpis.map((kpi) => {
            const Icon = kpi.icon
            return (
              <motion.div
                key={kpi.label}
                variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } } }}
                className="bg-white rounded-xl border border-zinc-200/80 p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
              >
                <div className="flex items-start justify-between mb-3">
                  <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">{kpi.label}</p>
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0D9488]/10 to-[#89F4EA]/15 flex items-center justify-center opacity-60 group-hover:opacity-100 transition-opacity">
                    <Icon className="w-4 h-4 text-[#0D9488]" />
                  </div>
                </div>
                <p className={`text-3xl font-extrabold tabular-nums ${kpi.accent ? 'text-gradient-census' : 'text-zinc-900'}`}>
                  {kpi.value}
                </p>
                <p className="text-xs text-zinc-400 mt-1">{kpi.sub}</p>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search prospects, AEs, industries..."
              className="w-full pl-9 pr-4 h-10 rounded-xl border border-zinc-200 text-sm placeholder:text-zinc-400 focus:border-[#89F4EA] focus:ring-2 focus:ring-[#89F4EA]/20 outline-none transition-all"
            />
          </div>
          <div className="flex items-center gap-1.5 bg-zinc-100/60 p-1 rounded-xl">
            <Filter className="w-4 h-4 text-zinc-400 ml-2" />
            {industries.map((ind) => (
              <button
                key={ind}
                onClick={() => setFilterIndustry(ind)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filterIndustry === ind
                    ? 'bg-white text-zinc-900 shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-700'
                }`}
              >
                {ind}
              </button>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-1 bg-zinc-100/60 p-1 rounded-xl">
            <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400 ml-2" />
            {[
              { key: 'created', label: 'Recent' },
              { key: 'roi', label: 'ROI' },
              { key: 'value', label: 'Value' },
            ].map((s) => (
              <button
                key={s.key}
                onClick={() => setSortBy(s.key)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  sortBy === s.key ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl border border-zinc-200/80 overflow-hidden shadow-sm"
        >
          <table className="w-full">
            <thead>
              <tr className="bg-zinc-50/80">
                {['Prospect', 'Industry', 'AE', 'Use Cases', 'Total Value', 'ROI', 'Stage', 'Status', ''].map((h) => (
                  <th key={h} className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest h-11 px-4 text-left first:pl-6 last:pr-6">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((report, i) => (
                <motion.tr
                  key={report.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.03 * i }}
                  className="hover:bg-[#89F4EA]/[0.03] transition-colors duration-100 border-b border-zinc-100 last:border-0 group cursor-pointer"
                >
                  <td className="px-4 py-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-zinc-100 to-zinc-50 border border-zinc-200/60 flex items-center justify-center text-xs font-bold text-zinc-500">
                        {report.prospect.charAt(0)}
                      </div>
                      <span className="text-sm font-semibold text-zinc-900 group-hover:text-[#0D9488] transition-colors">{report.prospect}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-xs font-medium text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-md">{report.industry}</span>
                  </td>
                  <td className="px-4 py-4 text-sm text-zinc-600">{report.ae}</td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {report.useCases.slice(0, 2).map((uc) => (
                        <span key={uc} className="text-[10px] font-medium text-[#065F56] bg-[#89F4EA]/15 px-1.5 py-0.5 rounded-md">
                          {uc}
                        </span>
                      ))}
                      {report.useCases.length > 2 && (
                        <span className="text-[10px] font-medium text-zinc-400 bg-zinc-100 px-1.5 py-0.5 rounded-md">
                          +{report.useCases.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm font-bold text-zinc-900 tabular-nums">
                    ${(report.totalValue / 1000).toFixed(0)}K
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm font-extrabold text-[#0D9488] tabular-nums">{report.roiRatio}:1</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${STAGE_STYLES[report.dealStage] || 'bg-zinc-100 text-zinc-600'}`}>
                      {report.dealStage}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium ${STATUS_STYLES[report.status]}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${report.status === 'Draft' ? 'bg-zinc-400' : report.status === 'Sent' ? 'bg-sky-500' : 'bg-emerald-500'}`} />
                      {report.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 pr-6">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                      <button className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600 transition-colors" title="Duplicate">
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600 transition-colors" title="View">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 px-8">
              <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center mb-3">
                <FileText className="w-6 h-6 text-zinc-400" />
              </div>
              <p className="text-sm font-semibold text-zinc-900">No reports found</p>
              <p className="text-xs text-zinc-500 mt-1">Try adjusting your search or filters</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
