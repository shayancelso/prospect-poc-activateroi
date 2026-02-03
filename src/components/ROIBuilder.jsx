import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'
import { USE_CASES, INDUSTRIES, WAREHOUSES, CURRENT_STATES, COMPANY_SIZES, INDUSTRY_BENCHMARKS } from '../data'

const STEPS = [
  { label: 'Prospect Profile' },
  { label: 'Use Cases' },
  { label: 'Quantify Pain' },
  { label: 'Assumptions' },
  { label: 'Generate' },
]

export default function ROIBuilder({ onGenerate }) {
  const [step, setStep] = useState(0)
  const [profile, setProfile] = useState({
    company: '',
    industry: 'SaaS',
    size: '201-500',
    warehouse: 'Snowflake',
    currentState: 'Manual CSV exports',
  })
  const [selectedCases, setSelectedCases] = useState([])
  const [pain, setPain] = useState({
    hoursPerWeek: 15,
    peopleInvolved: 3,
    hourlyCost: 100,
    dataIssueFrequency: 'Weekly',
    revenueLost: 50000,
  })
  const [scenario, setScenario] = useState('moderate')
  const [aeName] = useState('Kevin Park')

  const toggleCase = (id) => {
    setSelectedCases((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    )
  }

  const bench = INDUSTRY_BENCHMARKS[profile.industry] || INDUSTRY_BENCHMARKS.Other

  const computeROI = (scenarioType) => {
    const multipliers = { conservative: 0.6, moderate: 1, aggressive: 1.5 }
    const m = multipliers[scenarioType]
    const timeSavings = pain.hoursPerWeek * pain.hourlyCost * 52 * m
    const revImpact = pain.revenueLost * (bench.revImpact / 100) * m * selectedCases.length
    const churnReduction = selectedCases.includes('health_scoring') ? 180000 * m : 0
    const dataQuality = 45000 * m
    const totalValue = timeSavings + revImpact + churnReduction + dataQuality
    const censusCost = profile.size === '5000+' ? 96000 : profile.size === '1000-5000' ? 72000 : profile.size === '501-1000' ? 48000 : 36000
    const roiRatio = totalValue / censusCost
    const paybackDays = Math.round((censusCost / totalValue) * 365)
    return { timeSavings, revImpact, churnReduction, dataQuality, totalValue, censusCost, roiRatio, paybackDays }
  }

  const handleGenerate = () => {
    const roi = computeROI(scenario)
    onGenerate({
      ...profile,
      aeName,
      selectedCases: selectedCases.map((id) => USE_CASES.find((u) => u.id === id)),
      pain,
      scenario,
      ...roi,
      allScenarios: {
        conservative: computeROI('conservative'),
        moderate: computeROI('moderate'),
        aggressive: computeROI('aggressive'),
      },
    })
  }

  const canNext = () => {
    if (step === 0) return profile.company.length > 0
    if (step === 1) return selectedCases.length > 0
    return true
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="h-16 px-8 flex items-center justify-between border-b border-zinc-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <span>ROI Builder</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-zinc-900 font-medium">{STEPS[step].label}</span>
        </div>
      </header>

      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2 py-8 bg-white border-b border-zinc-50">
        {STEPS.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300 ${
                  i < step
                    ? 'bg-indigo-500 text-white'
                    : i === step
                    ? 'bg-indigo-500 text-white ring-4 ring-indigo-100'
                    : 'bg-zinc-100 text-zinc-400'
                }`}
              >
                {i < step ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`text-sm hidden sm:block ${i <= step ? 'text-zinc-900 font-medium' : 'text-zinc-400'}`}>
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`w-8 lg:w-12 h-0.5 mx-1 transition-colors duration-300 ${i < step ? 'bg-indigo-500' : 'bg-zinc-200'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 flex items-start justify-center px-4 py-10">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl border border-zinc-200 p-8 shadow-sm"
            >
              {step === 0 && <StepProfile profile={profile} setProfile={setProfile} />}
              {step === 1 && <StepUseCases selectedCases={selectedCases} toggleCase={toggleCase} />}
              {step === 2 && <StepPain pain={pain} setPain={setPain} />}
              {step === 3 && <StepAssumptions scenario={scenario} setScenario={setScenario} computeROI={computeROI} />}
              {step === 4 && <StepReview profile={profile} selectedCases={selectedCases} pain={pain} scenario={scenario} computeROI={computeROI} />}
            </motion.div>
          </AnimatePresence>

          {/* Nav buttons */}
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
                step === 0 ? 'invisible' : 'text-zinc-600 hover:bg-zinc-100'
              }`}
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            {step < 4 ? (
              <button
                onClick={() => setStep((s) => Math.min(4, s + 1))}
                disabled={!canNext()}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 active:scale-[0.98] transition-all duration-150 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleGenerate}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 active:scale-[0.98] transition-all duration-150 shadow-sm"
              >
                <Sparkles className="w-4 h-4" /> Generate ROI Report
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function StepProfile({ profile, setProfile }) {
  const set = (k, v) => setProfile((p) => ({ ...p, [k]: v }))
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-zinc-900 tracking-tight">Prospect Profile</h2>
        <p className="text-sm text-zinc-500 mt-1">Tell us about the company you're building this ROI report for.</p>
      </div>
      <Field label="Company Name">
        <input
          value={profile.company}
          onChange={(e) => set('company', e.target.value)}
          placeholder="e.g. Acme Corp"
          className="w-full rounded-lg border border-zinc-200 h-10 px-3 text-sm placeholder:text-zinc-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
        />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Industry">
          <Select value={profile.industry} onChange={(v) => set('industry', v)} options={INDUSTRIES} />
        </Field>
        <Field label="Company Size">
          <Select value={profile.size} onChange={(v) => set('size', v)} options={COMPANY_SIZES} />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Data Warehouse">
          <Select value={profile.warehouse} onChange={(v) => set('warehouse', v)} options={WAREHOUSES} />
        </Field>
        <Field label="Current Data Movement">
          <Select value={profile.currentState} onChange={(v) => set('currentState', v)} options={CURRENT_STATES} />
        </Field>
      </div>
    </div>
  )
}

function StepUseCases({ selectedCases, toggleCase }) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-zinc-900 tracking-tight">Select Use Cases</h2>
        <p className="text-sm text-zinc-500 mt-1">Which data activation use cases apply to this prospect?</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {USE_CASES.map((uc) => {
          const sel = selectedCases.includes(uc.id)
          return (
            <button
              key={uc.id}
              onClick={() => toggleCase(uc.id)}
              className={`text-left rounded-xl border-2 p-4 transition-all duration-200 ${
                sel
                  ? 'border-indigo-500 bg-indigo-50/40 shadow-sm'
                  : 'border-zinc-200 hover:border-zinc-300 hover:shadow-sm'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center mt-0.5 transition-all ${
                    sel ? 'bg-indigo-500 border-indigo-500' : 'border-zinc-300'
                  }`}
                >
                  {sel && <Check className="w-3 h-3 text-white" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-900 flex items-center gap-2">
                    <span>{uc.icon}</span> {uc.label}
                  </p>
                  <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{uc.description}</p>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function StepPain({ pain, setPain }) {
  const set = (k, v) => setPain((p) => ({ ...p, [k]: v }))
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-zinc-900 tracking-tight">Quantify Current Pain</h2>
        <p className="text-sm text-zinc-500 mt-1">Help us understand the cost of the status quo.</p>
      </div>
      <Slider label="Hours per week on manual data exports" value={pain.hoursPerWeek} onChange={(v) => set('hoursPerWeek', v)} min={1} max={40} suffix=" hrs" />
      <Slider label="People involved in manual processes" value={pain.peopleInvolved} onChange={(v) => set('peopleInvolved', v)} min={1} max={20} suffix="" />
      <Field label="Average hourly cost of these people">
        <div className="flex gap-2">
          {[50, 75, 100, 125, 150].map((v) => (
            <button
              key={v}
              onClick={() => set('hourlyCost', v)}
              className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                pain.hourlyCost === v
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-zinc-200 text-zinc-600 hover:border-zinc-300'
              }`}
            >
              ${v}
            </button>
          ))}
        </div>
      </Field>
      <Field label="How often do data quality issues cause problems?">
        <div className="flex gap-2">
          {['Daily', 'Weekly', 'Monthly', 'Rarely'].map((v) => (
            <button
              key={v}
              onClick={() => set('dataIssueFrequency', v)}
              className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                pain.dataIssueFrequency === v
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-zinc-200 text-zinc-600 hover:border-zinc-300'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </Field>
      <Slider
        label="Estimated annual revenue lost due to stale/missing data"
        value={pain.revenueLost}
        onChange={(v) => set('revenueLost', v)}
        min={10000}
        max={500000}
        step={10000}
        prefix="$"
        format={(v) => v.toLocaleString()}
      />
    </div>
  )
}

function StepAssumptions({ scenario, setScenario, computeROI }) {
  const scenarios = [
    { key: 'conservative', label: 'Conservative', color: 'zinc' },
    { key: 'moderate', label: 'Moderate', color: 'indigo' },
    { key: 'aggressive', label: 'Aggressive', color: 'emerald' },
  ]
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-zinc-900 tracking-tight">Value Assumptions</h2>
        <p className="text-sm text-zinc-500 mt-1">Choose a scenario based on how confident you are in the value projections.</p>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {scenarios.map((s) => {
          const roi = computeROI(s.key)
          const sel = scenario === s.key
          return (
            <button
              key={s.key}
              onClick={() => setScenario(s.key)}
              className={`rounded-xl border-2 p-5 text-center transition-all duration-200 ${
                sel ? 'border-indigo-500 bg-indigo-50/30 shadow-sm' : 'border-zinc-200 hover:border-zinc-300'
              }`}
            >
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{s.label}</p>
              <p className="text-2xl font-bold text-zinc-900 mt-2 tabular-nums">{roi.roiRatio.toFixed(1)}:1</p>
              <p className="text-xs text-zinc-500 mt-1">${(roi.totalValue / 1000).toFixed(0)}K/yr value</p>
              <p className="text-xs text-zinc-400 mt-0.5">Day {roi.paybackDays} payback</p>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function StepReview({ profile, selectedCases, pain, scenario, computeROI }) {
  const roi = computeROI(scenario)
  const cases = selectedCases.map((id) => USE_CASES.find((u) => u.id === id))
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-zinc-900 tracking-tight">Review & Generate</h2>
        <p className="text-sm text-zinc-500 mt-1">Confirm the details below, then generate your professional ROI report.</p>
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="bg-zinc-50 rounded-lg p-4 space-y-2">
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Company</p>
          <p className="font-medium text-zinc-900">{profile.company}</p>
          <p className="text-zinc-500">{profile.industry} • {profile.size} employees</p>
        </div>
        <div className="bg-zinc-50 rounded-lg p-4 space-y-2">
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Infrastructure</p>
          <p className="font-medium text-zinc-900">{profile.warehouse}</p>
          <p className="text-zinc-500">{profile.currentState}</p>
        </div>
      </div>
      <div className="bg-zinc-50 rounded-lg p-4">
        <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Use Cases ({cases.length})</p>
        <div className="flex flex-wrap gap-2">
          {cases.map((c) => (
            <span key={c.id} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
              {c.icon} {c.label}
            </span>
          ))}
        </div>
      </div>
      <div className="bg-indigo-50/50 rounded-lg p-4 border border-indigo-100">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Total Value</p>
            <p className="text-xl font-bold text-zinc-900 tabular-nums mt-1">${(roi.totalValue / 1000).toFixed(0)}K</p>
          </div>
          <div>
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">ROI Ratio</p>
            <p className="text-xl font-bold text-indigo-600 tabular-nums mt-1">{roi.roiRatio.toFixed(1)}:1</p>
          </div>
          <div>
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Payback</p>
            <p className="text-xl font-bold text-zinc-900 tabular-nums mt-1">Day {roi.paybackDays}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Shared components
function Field({ label, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-zinc-700">{label}</label>
      {children}
    </div>
  )
}

function Select({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-zinc-200 h-10 px-3 text-sm bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all appearance-none"
    >
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  )
}

function Slider({ label, value, onChange, min, max, step = 1, prefix = '', suffix = '', format }) {
  const display = format ? format(value) : value
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <label className="text-sm font-medium text-zinc-700">{label}</label>
        <span className="text-sm font-semibold text-indigo-600 tabular-nums">
          {prefix}{display}{suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-zinc-200 rounded-full appearance-none cursor-pointer accent-indigo-500 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-500 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer"
      />
      <div className="flex justify-between text-[10px] text-zinc-400">
        <span>{prefix}{format ? format(min) : min}{suffix}</span>
        <span>{prefix}{format ? format(max) : max}{suffix}</span>
      </div>
    </div>
  )
}
