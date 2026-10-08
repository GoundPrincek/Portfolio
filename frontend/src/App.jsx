import Navbar from './components/navbar/Navbar.jsx'
import Hero from './components/hero/Hero.jsx'
import CurrentFocus from './components/sections/CurrentFocus.jsx'
import About from './components/sections/About.jsx'
import Journey from './components/sections/Journey.jsx'
import Achievements from './components/sections/Achievements.jsx'
import Projects from './components/sections/Projects.jsx'
import Skills from './components/sections/Skills.jsx'
import BuildingNow from './components/sections/BuildingNow.jsx'
import Lessons from './components/sections/Lessons.jsx'
import BeyondCode from './components/sections/BeyondCode.jsx'
import GitHub from './components/sections/GitHub.jsx'
import Contact from './components/sections/Contact.jsx'
import Footer from './components/sections/Footer.jsx'
import './App.css'

function App() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Navbar />
      <main className="min-h-screen" id="main-content">
        <Hero />
        <CurrentFocus />
        <About />
        <Journey />
        <Achievements />
        <Projects />
        <Skills />
        <BuildingNow />
        <Lessons />
        <BeyondCode />
        <GitHub />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export default App
