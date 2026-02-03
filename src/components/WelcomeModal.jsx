import { motion, AnimatePresence } from 'framer-motion'
import { X, Zap, Clock, FileText, TrendingUp, ArrowRight } from 'lucide-react'

export default function WelcomeModal({ open, onClose, onStartTour }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Top gradient bar */}
            <div className="h-1.5 bg-gradient-to-r from-[#0D9488] via-[#89F4EA] to-[#0D9488]" />

            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Content */}
            <div className="px-8 pt-7 pb-2">
              {/* Icon cluster */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0D9488] to-[#89F4EA] flex items-center justify-center shadow-lg shadow-teal-200/40">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-zinc-900 tracking-tight">Welcome to ActivateROI</h2>
                  <p className="text-sm text-zinc-500">by Census</p>
                </div>
              </div>

              <p className="text-sm text-zinc-600 leading-relaxed mb-6">
                Generate professional ROI reports for your prospects in minutes, not hours.
                No more custom spreadsheets — just a guided wizard that builds a compelling
                business case your champion can take to their CFO.
              </p>

              {/* Feature pills */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { icon: Clock, label: '5 min to build', sub: 'vs. 3-5 hours' },
                  { icon: FileText, label: 'Pro reports', sub: 'Consulting quality' },
                  { icon: TrendingUp, label: 'ROI insights', sub: 'Sensitivity analysis' },
                ].map((f) => {
                  const Icon = f.icon
                  return (
                    <div key={f.label} className="flex flex-col items-center text-center p-3 rounded-xl bg-zinc-50 border border-zinc-100">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0D9488]/10 to-[#89F4EA]/20 flex items-center justify-center mb-2">
                        <Icon className="w-4 h-4 text-[#0D9488]" />
                      </div>
                      <p className="text-xs font-semibold text-zinc-900">{f.label}</p>
                      <p className="text-[10px] text-zinc-500">{f.sub}</p>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="px-8 py-5 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
              <button
                onClick={onClose}
                className="text-sm text-zinc-500 hover:text-zinc-700 font-medium transition-colors"
              >
                Skip for now
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { onClose(); onStartTour?.() }}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl border border-zinc-200 text-zinc-700 hover:bg-white hover:border-zinc-300 transition-all"
                >
                  Take a tour
                </button>
                <button
                  onClick={onClose}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-[#0D9488] to-[#10B981] text-white hover:shadow-lg hover:shadow-teal-200/40 active:scale-[0.98] transition-all"
                >
                  Build my first report <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
