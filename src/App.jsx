import './App.css'
import { Navbar } from './components/Navbar.jsx'
import { Hero } from './components/Hero.jsx'
import { Projects } from './components/Projects.jsx'
import { Contact } from './components/Contact.jsx'
import { Footer } from './components/Footer.jsx'
import { ThemeProvider } from '@/components/ui/theme-provider'
import { ThemeCustomizerProvider } from './components/ThemeCustomizerProvider.jsx'
import { ThemeCustomizer } from './components/ThemeCustomizerShadcn.jsx'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'    
import { About } from './components/About.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'



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
    <ThemeProvider defaultTheme="dark" storageKey="portfolio-theme">
      <ThemeCustomizerProvider>
        <BrowserRouter>
          <ThemeCustomizer>
            <div className={`app ${isLoaded ? "loaded" : ""}`}>
              <Navbar />
              <Routes>
                <Route path="/" element={
                  <>
                    <Hero />
                    <Projects />
                    <About />
                    <Footer />
                  </>
                } />
                <Route path="/contact" element={<Contact />} />
              </Routes>
            </div>
          </ThemeCustomizer>
        </BrowserRouter>
      </ThemeCustomizerProvider>
    </ThemeProvider>
  );
}

export default App;