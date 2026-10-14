import Hero from '../components/hero/Hero.jsx'
import CurrentFocus from '../components/sections/CurrentFocus.jsx'
import About from '../components/sections/About.jsx'
import Projects from '../components/sections/Projects.jsx'
import Skills from '../components/sections/Skills.jsx'
import Journey from '../components/sections/Journey.jsx'
import BuildingNow from '../components/sections/BuildingNow.jsx'
import GitHub from '../components/sections/GitHub.jsx'
import Contact from '../components/sections/Contact.jsx'

function Home() {
  return (
    <main className="min-h-screen" id="main-content">
      <Hero />
      <CurrentFocus />
      <About />
      <Projects />
      <Skills />
      <Journey />
      <BuildingNow />
      <GitHub />
      <Contact />
    </main>
  )
}

export default Home
