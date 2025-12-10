import "./App.css";
import { Navbar } from "./components/layout/Navbar.jsx";
import { Hero } from "./components/layout/Hero.jsx";
import { Projects } from "./components/layout/Projects.jsx";
import { Contact } from "./components/layout/Contact.jsx";
import { Footer } from "./components/layout/Footer.jsx";
import { ThemeProvider, useTheme } from "@/components/ui/theme-provider";
import {
  ThemeCustomizerProvider,
  useThemeCustomizer,
} from "./components/theming/ThemeCustomizerProvider.jsx";
import { ThemeCustomizer } from "./components/theming/ThemeCustomizerShadcn.jsx";
import { useState, useEffect, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import BackgroundRenderer from "./components/backgrounds/BackgroundRenderer.jsx";
import { AboutSkeleton } from "./components/features/about";

// Lazy load the heavy About section with bento grid
const About = lazy(() =>
  import("./components/layout/About.jsx").then((module) => ({
    default: module.About,
  }))
);

function AppContent() {
  const [isLoaded, setIsLoaded] = useState(false);
  const { backgroundType } = useThemeCustomizer();

  useEffect(() => {
    const originalScrollRestoration = window.history.scrollRestoration;

    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    window.scrollTo(0, 0);
    setIsLoaded(true);

    return () => {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = originalScrollRestoration;
      }
    };
  }, []);

  return (
    <BrowserRouter>
      <ThemeCustomizer>
        <div className="darkveil-wrapper">
          <BackgroundRenderer backgroundType={backgroundType} />
        </div>
        <div className={`app ${isLoaded ? "loaded" : ""}`}>
          <Navbar />
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Hero />
                  <Projects />
                  <Suspense fallback={<AboutSkeleton />}>
                    <About />
                  </Suspense>
                  <Footer />
                </>
              }
            />
            <Route
              path="/contact"
              element={
                <>
                  <Contact />
                  <Footer />
                </>
              }
            />
          </Routes>
        </div>
      </ThemeCustomizer>
    </BrowserRouter>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="portfolio-theme">
      <ThemeCustomizerProvider>
        <AppContent />
      </ThemeCustomizerProvider>
    </ThemeProvider>
  );
}

export default App;
