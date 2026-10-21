import { Autopilot } from './components/Autopilot'
import { Clients } from './components/Clients'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import './App.css'

export function App() {
  return (
    <main className="home">
      <div className="home__hero">
        <Header />
        <Hero />
      </div>
      <Clients />
      <Autopilot />
    </main>
  )
}
