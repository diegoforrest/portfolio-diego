import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowDownward,
  ArrowOutward,
  GitHub,
  Instagram,
  KeyboardArrowDown,
  KeyboardArrowRight,
  LinkedIn,
  TextSnippetOutlined,
} from "@mui/icons-material";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { InteractiveGradient } from "./InteractiveGradient";
import { ArrowRight } from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

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
      className="hero"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <InteractiveGradient />
      <div className="hero-container">
        <motion.div
          className="hero-content"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <motion.h1 className="hero-title" variants={fadeInUp}>
            Diego Forrest <br /> Cruz
          </motion.h1>

          <motion.div className="hero-badge" variants={fadeInUp}>
            <span className="badge-dot"></span>
            Software Engineer | Web Developer
          </motion.div>

          <motion.p className="hero-description" variants={fadeInUp}>
            Passionate about building clean, modern, and responsive web
            experiences using React, JavaScript, and Tailwind. I love turning
            ideas into smooth, user-friendly interfaces while continuously
            improving my skills and creativity.
          </motion.p>

          <motion.div className="hero-buttons" variants={staggerContainer}>
            <motion.a
              href="#projects"
              variants={fadeInUp}
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
              variants={fadeInUp}
              target="_blank"
              className="btn btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Resume
              <TextSnippetOutlined size={18} />
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

          <motion.div className="hero-socials" variants={staggerContainer}>
            <motion.a
              href="https://github.com/diegoforrest"
              variants={fadeInUp}
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.95 }}
            >
              <GitHub sx={{ fontSize: 35 }} />
            </motion.a>
            <motion.a
              href="https://www.linkedin.com/in/diego-forrest-cruz"
              variants={fadeInUp}
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.95 }}
            >
              <LinkedIn sx={{ fontSize: 35 }} />
            </motion.a>
            <motion.a
              href="https://www.instagram.com/diegod.666"
              variants={fadeInUp}
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Instagram sx={{ fontSize: 35 }} />
            </motion.a>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        className="hero-code"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <div className="Code-Display">
          <SyntaxHighlighter
            language="typescript"
            customStyle={{
              margin: 0,
              padding: "2rem",
              height: "100%",
              borderRadius: "20px 0 0 20px",
              background: "rgba(30,41,59,1)",
              backdropFilter: "blur(10px)",
            }}
            style={vscDarkPlus}
          >
            {`const aboutMe: DeveloperProfile = {
  codename: "Diego Forrest Cruz",
  origin: "Bacoor, Philippines — somewhere between Dota2 and Vs Code",
  role: "Software Engineer and Web Developer",

  stack: {
    languages: ["JavaScript", "TypeScript", "HTML", "CSS" , "Python" , "PHP"],
    frameworks: ["React", "Next.js", "TailwindCSS" , "Node.js" , "Nest.Js"],
  },

  traits: [
    "UI/UX enthusiast",
    "Passionate Coder",
    "Gamer at heart",
    "Continues Learning",
  ],

  missionStatement:
    "Building smooth, modern interfaces while leveling up every day.",
  availability: "Open for work opportunities!",
};`}
          </SyntaxHighlighter>
        </div>
      </motion.div>
    </motion.section>
  );
};
