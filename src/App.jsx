import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Zap, Library } from 'lucide-react'
import CensusLogo from './components/CensusLogo'
import ROIBuilder from './components/ROIBuilder'
import ROIReport from './components/ROIReport'
import ReportLibrary from './components/ReportLibrary'
import WelcomeModal from './components/WelcomeModal'
import GuidedTour, { TourTrigger } from './components/GuidedTour'

const NAV = [
  { id: 'builder', label: 'ROI Builder', icon: Zap },
  { id: 'library', label: 'Report Library', icon: Library },
]

export default function App() {
  const [page, setPage] = useState('builder')
  const [reportData, setReportData] = useState(null)
  const [showWelcome, setShowWelcome] = useState(false)
  const [showTour, setShowTour] = useState(false)

  useEffect(() => {
    const seen = sessionStorage.getItem('activateroi-welcomed')
    if (!seen) {
      setShowWelcome(true)
      sessionStorage.setItem('activateroi-welcomed', '1')
    }
  }, [])

  const handleGenerate = (data) => {
    setReportData(data)
    setPage('report')
  }

  const handleBack = () => {
    setPage('builder')
    setReportData(null)
  }

  return (
    <div className="flex h-screen bg-[#FAFAFA]">
      {/* Sidebar */}
      <aside data-tour="sidebar" className="w-64 border-r border-zinc-200/80 bg-white flex flex-col shrink-0">
        {/* Logo */}
        <div className="h-16 px-5 flex items-center border-b border-zinc-100 gap-3">
          <CensusLogo className="h-7 text-zinc-900" />
        </div>

        {/* Product label */}
        <div className="px-5 pt-5 pb-2">
          <div className="flex items-center gap-2 px-1">
            <div className="w-1.5 h-1.5 rounded-full bg-[#89F4EA]" />
            <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">ActivateROI</span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-1 space-y-0.5">
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
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                  active
                    ? 'text-[#065F56] bg-gradient-to-r from-[#89F4EA]/15 to-[#89F4EA]/5 shadow-sm shadow-teal-100/50'
                    : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-700'
                }`}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                  active ? 'bg-gradient-to-br from-[#0D9488] to-[#89F4EA] shadow-md shadow-teal-200/40' : 'bg-zinc-100'
                }`}>
                  <Icon className={`w-3.5 h-3.5 ${active ? 'text-white' : 'text-zinc-500'}`} />
                </div>
                {item.label}
              </button>
            )
          })}
        </nav>

        {/* User badge */}
        <div data-tour="user-badge" className="p-4 border-t border-zinc-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0D9488] to-[#89F4EA] flex items-center justify-center text-xs font-bold text-white shadow-md shadow-teal-200/30">
              KP
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-900">Kevin Park</p>
              <p className="text-[11px] text-zinc-400">Account Executive</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <AnimatePresence mode="wait">
          {page === 'builder' && (
            <motion.div key="builder" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
              <ROIBuilder onGenerate={handleGenerate} />
            </motion.div>
          )}
          {page === 'report' && reportData && (
            <motion.div key="report" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
              <ROIReport data={reportData} onBack={handleBack} />
            </motion.div>
          )}
          {page === 'library' && (
            <motion.div key="library" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
              <ReportLibrary />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Welcome Modal */}
      <WelcomeModal
        open={showWelcome}
        onClose={() => setShowWelcome(false)}
        onStartTour={() => setTimeout(() => setShowTour(true), 300)}
      />

      {/* Guided Tour */}
      <GuidedTour active={showTour} onClose={() => setShowTour(false)} />
      <TourTrigger onClick={() => setShowTour(true)} />
    </div>
  )
}
