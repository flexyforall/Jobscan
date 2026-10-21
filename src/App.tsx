import { useCallback, useState } from 'react'

import { Autopilot } from './components/Autopilot'
import { Clients } from './components/Clients'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Loader } from './components/Loader'
import { IntroContext, useRevealOnScroll, type IntroStage } from './intro'
import './App.css'

export function App() {
  const [stage, setStage] = useState<IntroStage>('loading')
  const handleReveal = useCallback(() => setStage((current) => (current === 'loading' ? 'revealing' : current)), [])
  const handleDone = useCallback(() => setStage('done'), [])

  useRevealOnScroll(stage)

  return (
    <IntroContext.Provider value={stage}>
      <main className="home">
        <div className="home__hero">
          <Header />
          <Hero />
        </div>
        <Clients />
        <Autopilot />
      </main>
      {stage !== 'done' && <Loader onReveal={handleReveal} onDone={handleDone} />}
    </IntroContext.Provider>
  )
}
