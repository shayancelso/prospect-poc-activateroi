import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronRight, ChevronLeft, HelpCircle } from 'lucide-react'

const STEPS = [
  {
    target: '[data-tour="step-indicator"]',
    title: 'Progress Tracker',
    body: 'Follow these 5 steps to build a compelling ROI report. Each step builds on the last.',
    preferPosition: 'bottom',
  },
  {
    target: '[data-tour="wizard"]',
    title: 'ROI Builder',
    body: 'This is your workspace. Enter prospect details, select use cases, quantify pain, choose assumptions, then generate a professional report.',
    preferPosition: 'bottom',
    targetInset: true, // only highlight the top portion
  },
  {
    target: '[data-tour="sidebar"]',
    title: 'Navigation',
    body: 'Switch between the ROI Builder and the Report Library. On mobile, tap the hamburger menu to access this.',
    preferPosition: 'right',
    mobileTarget: '[data-tour="step-indicator"]', // fallback on mobile
  },
  {
    target: '[data-tour="user-badge"]',
    title: 'Your Profile',
    body: 'Reports are attributed to you automatically. Share them with prospects or export as PDF.',
    preferPosition: 'top',
    mobileTarget: '[data-tour="step-indicator"]',
  },
]

const TOOLTIP_W = 300
const TOOLTIP_H_EST = 180
const PAD = 12

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val))
}

function computePosition(rect, preferPosition, vw, vh) {
  if (!rect) return { top: vh / 2 - 90, left: vw / 2 - TOOLTIP_W / 2 }

  const isMobile = vw < 768

  // On mobile, always position at bottom of target or center-bottom of screen
  if (isMobile) {
    const top = Math.min(rect.bottom + PAD, vh - TOOLTIP_H_EST - PAD)
    const left = clamp(rect.left + rect.width / 2 - TOOLTIP_W / 2, PAD, vw - TOOLTIP_W - PAD)
    return { top, left }
  }

  // Desktop: try preferred position, fall back if overflows
  const positions = {
    bottom: {
      top: rect.bottom + PAD,
      left: clamp(rect.left + rect.width / 2 - TOOLTIP_W / 2, PAD, vw - TOOLTIP_W - PAD),
    },
    top: {
      top: rect.top - TOOLTIP_H_EST - PAD,
      left: clamp(rect.left + rect.width / 2 - TOOLTIP_W / 2, PAD, vw - TOOLTIP_W - PAD),
    },
    right: {
      top: clamp(rect.top + rect.height / 2 - 80, PAD, vh - TOOLTIP_H_EST - PAD),
      left: Math.min(rect.right + PAD, vw - TOOLTIP_W - PAD),
    },
    left: {
      top: clamp(rect.top + rect.height / 2 - 80, PAD, vh - TOOLTIP_H_EST - PAD),
      left: Math.max(rect.left - TOOLTIP_W - PAD, PAD),
    },
  }

  const pos = positions[preferPosition] || positions.bottom

  // Verify it's in viewport, otherwise fallback to bottom
  if (pos.top < PAD || pos.top + TOOLTIP_H_EST > vh - PAD) {
    return positions.bottom
  }
  return pos
}

function Tooltip({ step, currentStep, total, onNext, onPrev, onClose }) {
  const [pos, setPos] = useState(null)
  const [spotRect, setSpotRect] = useState(null)

  const measure = useCallback(() => {
    const isMobile = window.innerWidth < 1024
    const targetSelector = isMobile && step.mobileTarget ? step.mobileTarget : step.target
    const el = document.querySelector(targetSelector)
    if (!el) {
      // No target found — center tooltip
      setSpotRect(null)
      setPos({ top: window.innerHeight / 2 - 90, left: window.innerWidth / 2 - TOOLTIP_W / 2 })
      return
    }
    const rect = el.getBoundingClientRect()

    // For large elements, only spotlight the top 120px
    const displayRect = step.targetInset
      ? { top: rect.top, left: rect.left, width: rect.width, height: Math.min(rect.height, 120), bottom: rect.top + Math.min(rect.height, 120), right: rect.right }
      : rect

    setSpotRect(displayRect)
    setPos(computePosition(displayRect, step.preferPosition, window.innerWidth, window.innerHeight))
  }, [step])

  useEffect(() => {
    measure()
    const onResize = () => measure()
    window.addEventListener('resize', onResize)
    window.addEventListener('scroll', onResize, true)
    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('scroll', onResize, true)
    }
  }, [measure])

  if (!pos) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[60] pointer-events-auto" onClick={onClose}>
        {/* Dark overlay with cutout via clip-path or box-shadow */}
        <div className="absolute inset-0 bg-black/35" />
      </div>

      {/* Spotlight cutout */}
      {spotRect && (
        <div
          className="fixed rounded-xl ring-4 ring-[#89F4EA]/40 pointer-events-none z-[61] transition-all duration-300"
          style={{
            top: spotRect.top - 4,
            left: spotRect.left - 4,
            width: spotRect.width + 8,
            height: spotRect.height + 8,
            backgroundColor: 'transparent',
          }}
        />
      )}

      {/* Tooltip */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        transition={{ duration: 0.2 }}
        className="fixed z-[70] bg-white rounded-xl shadow-2xl border border-zinc-200 overflow-hidden pointer-events-auto"
        style={{ top: pos.top, left: pos.left, width: TOOLTIP_W }}
        onClick={(e) => e.stopPropagation()}
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
      const t = setTimeout(() => setReady(true), 250)
      return () => clearTimeout(t)
    } else {
      setReady(false)
    }
  }, [active])

  if (!active || !ready) return null

  return (
    <AnimatePresence mode="wait">
      <Tooltip
        key={step}
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
