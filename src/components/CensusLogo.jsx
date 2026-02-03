export default function CensusLogo({ className = 'h-7' }) {
  return (
    <svg className={className} viewBox="0 0 120 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Census "C" mark */}
      <rect x="0" y="2" width="24" height="24" rx="6" fill="url(#census-grad)" />
      <path d="M16 9.5C15.2 8.5 14 8 12.5 8C10 8 8 10 8 13s2 5 4.5 5c1.5 0 2.7-.5 3.5-1.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      {/* "Census" wordmark */}
      <text x="32" y="20.5" fontFamily="Inter, system-ui, sans-serif" fontWeight="700" fontSize="17" letterSpacing="-0.5" fill="currentColor">
        Census
      </text>
      <defs>
        <linearGradient id="census-grad" x1="0" y1="2" x2="24" y2="26" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0D9488" />
          <stop offset="1" stopColor="#89F4EA" />
        </linearGradient>
      </defs>
    </svg>
  )
}
