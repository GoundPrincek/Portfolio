import Navbar from './components/navbar/Navbar.jsx'
import Hero from './components/hero/Hero.jsx'
import './App.css'

function App() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Navbar />
      <main id="main-content">
        <Hero />
      </main>
    </>
  )
}

export default App
