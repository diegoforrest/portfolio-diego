import './App.css'
import { Navbar } from './components/Navbar.jsx'
import { Hero } from './components/Hero.jsx'
import { Projects } from './components/Projects.jsx'
import { Contact } from './components/Contact.jsx'
import { ThemeProvider } from './components/ThemeProvider.jsx'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'    
import { About } from './components/About.jsx'



function App() {
  const [isLoaded, setIsLoaded] = useState(false);

useEffect(() => {
  const originalScrollRestoration = window.history.scrollRestoration;
  
  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual';
  }
  
  window.scrollTo(0, 0);
  setIsLoaded(true);

  return () => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = originalScrollRestoration;
    }
  };
}, []);

  return (
    <ThemeProvider>
      <div className={`app ${isLoaded ? "loaded" : ""}`}>
        <Navbar />
        <Hero />
        <Projects />
        <About />
        <Contact />

        <footer>
          <p> &copy; 2025. All rights reserved.</p>
        </footer>
      </div>
    </ThemeProvider>
  );
}

export default App;