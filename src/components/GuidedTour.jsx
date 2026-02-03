import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronRight, ChevronLeft, HelpCircle } from 'lucide-react'

const STEPS = [
  {
    target: '[data-tour="sidebar"]',
    title: 'Navigation',
    body: 'Switch between the ROI Builder to create reports, and the Report Library to browse saved analyses.',
    position: 'right',
  },
  {
    target: '[data-tour="wizard"]',
    title: 'ROI Builder',
    body: 'Walk through 5 simple steps to build a professional ROI report. Start with the prospect profile, select use cases, quantify their pain, choose assumptions, then generate.',
    position: 'bottom',
  },
  {
    target: '[data-tour="step-indicator"]',
    title: 'Progress Tracker',
    body: 'See exactly where you are in the wizard. Each step builds on the last to create a compelling business case.',
    position: 'bottom',
  },
  {
    target: '[data-tour="user-badge"]',
    title: 'Your Profile',
    body: 'Reports are automatically attributed to you. Share them directly with prospects or export as PDF.',
    position: 'right',
  },
]

function getRect(selector) {
  const el = document.querySelector(selector)
  if (!el) return null
  return el.getBoundingClientRect()
}

function Tooltip({ step, currentStep, total, onNext, onPrev, onClose }) {
  const rect = getRect(step.target)
  if (!rect) return null

  const pad = 12
  let style = {}
  const pos = step.position

  if (pos === 'right') {
    style = { top: rect.top + rect.height / 2 - 60, left: rect.right + pad }
  } else if (pos === 'bottom') {
    style = { top: rect.bottom + pad, left: rect.left + rect.width / 2 - 160 }
  } else if (pos === 'left') {
    style = { top: rect.top + rect.height / 2 - 60, right: window.innerWidth - rect.left + pad }
  } else {
    style = { bottom: window.innerHeight - rect.top + pad, left: rect.left + rect.width / 2 - 160 }
  }

  return (
    <>
      {/* Spotlight */}
      <div
        className="fixed rounded-xl ring-4 ring-[#89F4EA]/40 pointer-events-none z-[60] transition-all duration-300"
        style={{
          top: rect.top - 4,
          left: rect.left - 4,
          width: rect.width + 8,
          height: rect.height + 8,
          boxShadow: '0 0 0 9999px rgba(0,0,0,0.35)',
        }}
      />
      {/* Tooltip card */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 6 }}
        transition={{ duration: 0.2 }}
        className="fixed z-[70] w-80 bg-white rounded-xl shadow-2xl border border-zinc-200 overflow-hidden"
        style={style}
      >
        <div className="h-1 bg-gradient-to-r from-[#0D9488] to-[#89F4EA]" />
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h4 className="text-sm font-semibold text-zinc-900">{step.title}</h4>
            <button onClick={onClose} className="p-1 -mt-1 -mr-1 rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-all">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-xs text-zinc-500 leading-relaxed">{step.body}</p>
        </div>
        <div className="px-4 py-3 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
          <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider">
            {currentStep + 1} of {total}
          </span>
          <div className="flex items-center gap-1.5">
            {currentStep > 0 && (
              <button onClick={onPrev} className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-all">
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
            {currentStep < total - 1 ? (
              <button
                onClick={onNext}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-[#0D9488] text-white hover:bg-[#0F766E] transition-all"
              >
                Next <ChevronRight className="w-3 h-3" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[#0D9488] text-white hover:bg-[#0F766E] transition-all"
              >
                Got it!
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </>
  )
}

export default function GuidedTour({ active, onClose }) {
  const [step, setStep] = useState(0)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (active) {
      setStep(0)
      // Small delay to let DOM settle
      const t = setTimeout(() => setReady(true), 200)
      return () => clearTimeout(t)
    } else {
      setReady(false)
    }
  }, [active])

  if (!active || !ready) return null

  return (
    <AnimatePresence>
      <Tooltip
        step={STEPS[step]}
        currentStep={step}
        total={STEPS.length}
        onNext={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
        onPrev={() => setStep((s) => Math.max(0, s - 1))}
        onClose={onClose}
      />
    </AnimatePresence>
  )
}

export function TourTrigger({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-5 right-5 z-40 w-10 h-10 rounded-full bg-white border border-zinc-200 shadow-lg flex items-center justify-center text-zinc-400 hover:text-[#0D9488] hover:border-[#89F4EA]/50 hover:shadow-xl transition-all group"
      title="Take a tour"
    >
      <HelpCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
    </button>
  )
}
