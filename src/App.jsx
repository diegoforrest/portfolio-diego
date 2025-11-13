import './App.css'
import { Navbar } from './components/Navbar.jsx'
import { Hero } from './components/Hero.jsx'
import { Projects } from './components/Projects.jsx'
import { Contact } from './components/Contact.jsx'
import { ThemeProvider } from './components/ThemeProvider.jsx'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'  


function App() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <ThemeProvider>
      <div className={`app ${isLoaded ? "loaded" : ""}`}>
        <Navbar />
        <Hero />
        <Projects />
        <Contact />

        <footer>
          <p> &copy; 2025. All rights reserved.</p>
        </footer>
      </div>
    </ThemeProvider>
  );
}

export default App;