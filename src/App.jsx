import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Zap, FileText, Library, ChevronRight, BarChart3 } from 'lucide-react'
import ROIBuilder from './components/ROIBuilder'
import ROIReport from './components/ROIReport'
import ReportLibrary from './components/ReportLibrary'

const NAV = [
  { id: 'builder', label: 'ROI Builder', icon: Zap },
  { id: 'library', label: 'Report Library', icon: Library },
]

export default function App() {
  const [page, setPage] = useState('builder')
  const [reportData, setReportData] = useState(null)

  const handleGenerate = (data) => {
    setReportData(data)
    setPage('report')
  }

  const handleBack = () => {
    setPage('builder')
    setReportData(null)
  }

  return (
    <div className="flex h-screen bg-zinc-50">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-200 bg-white flex flex-col shrink-0">
        <div className="h-16 px-6 flex items-center border-b border-zinc-100 gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-sm font-semibold text-zinc-900 tracking-tight">ActivateROI</span>
            <p className="text-[10px] text-zinc-400 -mt-0.5">by Census</p>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map((item) => {
            const Icon = item.icon
            const active = page === item.id || (item.id === 'builder' && page === 'report')
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'builder') handleBack()
                  else setPage(item.id)
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${
                  active
                    ? 'text-zinc-900 bg-zinc-100'
                    : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            )
          })}
        </nav>
        <div className="p-4 border-t border-zinc-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-semibold text-indigo-600">
              KP
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-900">Kevin Park</p>
              <p className="text-xs text-zinc-400">Account Executive</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <AnimatePresence mode="wait">
          {page === 'builder' && (
            <motion.div key="builder" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
              <ROIBuilder onGenerate={handleGenerate} />
            </motion.div>
          )}
          {page === 'report' && reportData && (
            <motion.div key="report" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
              <ROIReport data={reportData} onBack={handleBack} />
            </motion.div>
          )}
          {page === 'library' && (
            <motion.div key="library" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
              <ReportLibrary />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
