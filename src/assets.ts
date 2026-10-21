// Static assets exported from Figma (served from /public/assets).
const icon = (name: string) => `/assets/icons/${name}.svg`

export const icons = {
  logoMark: icon('logo-mark'),
  logoWordmark: icon('logo-wordmark'),
  chevronDown: icon('chevron-down'),
  tryFree: icon('try-free'),
  add: icon('add'),
  badgeResearch: icon('badge-research'),
  badgeImproving: icon('badge-improving'),
  badgeAutopilot: icon('badge-autopilot'),
  upload: icon('upload'),
  metricDivider: icon('metric-divider'),
  star: icon('star'),
  resumeLine: icon('resume-line'),
  resumeLineSmall: icon('resume-line-small'),
  scoreRingTrack: icon('score-ring-track'),
  scoreRing: icon('score-ring'),
  scoreChart: icon('score-chart'),
  clientsDivider: icon('clients-divider'),
  scan: icon('scan'),
  checkSquare: icon('check-square'),
  crop: icon('crop'),
  paperPlaneTilt: icon('paper-plane-tilt'),
  chartBar: icon('chart-bar'),
  metricBarKeywords: icon('metric-bar-keywords'),
  metricBarImpact: icon('metric-bar-impact'),
  metricBarFormat: icon('metric-bar-format'),
  keywordFound: icon('keyword-found'),
  keywordPartial: icon('keyword-partial'),
  keywordMissing: icon('keyword-missing'),
} as const

export const logos = {
  companyLogo1: '/assets/logos/company-logo-1.png',
  leanSolutions: '/assets/logos/lean-solutions.png',
  amazon: '/assets/logos/amazon.svg',
  nvidia: '/assets/logos/nvidia.svg',
  google: '/assets/logos/google.png',
  meta: '/assets/logos/meta.svg',
  companyLogo7: '/assets/logos/company-logo-7.png',
} as const

export const images = {
  resumePanelBg: '/assets/images/resume-panel-bg.png',
  contentSectionBg: '/assets/images/content-section-bg.jpg',
} as const
