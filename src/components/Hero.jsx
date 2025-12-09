import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowDownward,
  Description,
  GitHub,
  KeyboardArrowDown,
  KeyboardArrowRight,
  LinkedIn,
} from "@mui/icons-material";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { CodeBlock } from "./CodeBlock";

const iconTransformAnimation = {
  initial: { opacity: 0, rotateX: 90 },
  animate: { opacity: 1, rotateX: 0 },
  exit: { opacity: 0, rotateX: -90 },
  transition: { duration: 0.1 },
};

export const Hero = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isContactHovering, setIsContactHovering] = useState(false);

  return (
    <motion.section
      id="home"
      className="hero-section"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <div className="hero-container">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, staggerChildren: 0.1 }}
        >
          <motion.h1
            className="hero-name"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Diego Forrest <br /> Cruz
          </motion.h1>

          <motion.div
            className="hero-badge"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className="hero-badge-dot"></span>
            Software Engineer | Web Developer
          </motion.div>

          <motion.p
            className="hero-desc"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Passionate about building clean, modern, and responsive web
            experiences using React, JavaScript, and Tailwind. I love turning
            ideas into smooth, user-friendly interfaces while continuously
            improving my skills and creativity.
          </motion.p>

          <motion.div
            className="hero-buttons"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <motion.a
              href="#projects"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="btn btn-secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              View My Work
              <AnimatePresence mode="wait">
                {isHovering ? (
                  <motion.div
                    key="arrow"
                    {...iconTransformAnimation}
                    style={{ display: "flex", marginTop: "2px" }}
                  >
                    <ArrowDownward size={16} />
                  </motion.div>
                ) : (
                  <motion.div key="chevron" {...iconTransformAnimation}>
                    <KeyboardArrowDown size={16} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.a>
            <motion.a
              href="https://drive.google.com/file/d/1ZxbI0Jjl3APAb_R1RP5419B4b_bC0Wih/view?usp=drive_link"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              target="_blank"
              className="btn btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Resume
              <Description size={18} />
            </motion.a>
            <Link
              to="/contact"
              className="btn btn-secondary"
              onMouseEnter={() => setIsContactHovering(true)}
              onMouseLeave={() => setIsContactHovering(false)}
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              Contact Me
              {isContactHovering ? (
                <ArrowRight size={18} />
              ) : (
                <KeyboardArrowRight size={18} />
              )}
            </Link>
          </motion.div>

          <motion.div
            className="hero-socials"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <motion.a
              href="https://github.com/diegoforrest"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              target="_blank"
              rel="noopener noreferrer"
              className="social-icons"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.95 }}
            >
              <GitHub sx={{ fontSize: 35 }} />
            </motion.a>
            <motion.a
              href="https://www.linkedin.com/in/diego-forrest-cruz"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              target="_blank"
              rel="noopener noreferrer"
              className="social-icons"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.95 }}
            >
              <LinkedIn sx={{ fontSize: 35 }} />
            </motion.a>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        className="hero-display-code"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <div>
          <CodeBlock
            code={`const aboutMe: DeveloperProfile = {
  IGN: "Diego Forrest Cruz",
  origin: "Bacoor, Philippines — powered by caffeine, Dota2, and VS Code",
  role: "Software Engineer & Web Developer",

  stack: {
    languages: ["JavaScript", "TypeScript", "HTML", "CSS"],
    frameworks: ["React", "Next.js", "TailwindCSS", "Node.js", "NestJS"],
  },

  traits: [
    "Creative problem-solver",
    "Team player with solo game skills",
    "Relentless bug hunter",
    "ADHD-powered focus mode",
  ],

  missionStatement:
    "Crafting seamless, modern web magic and leveling up every single day.",
  availability: "Ready to join epic quests & collaborate on awesome projects!",
};`}
          />
        </div>
      </motion.div>
    </motion.section>
  );
};
