import { motion } from "framer-motion";
import { useTheme } from './ThemeProvider';
import {  DarkModeTwoTone, LightModeTwoTone } from "@mui/icons-material";
import { Link } from 'react-router-dom';

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

export const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <motion.nav
      className="navbar"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.a
        href="/"
        className="logo"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        diego
      </motion.a>

      <motion.ul
        className="nav-links"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <motion.li
          variants={fadeInUp}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <a href="#Projects">Projects</a>
        </motion.li>
        <motion.li
          variants={fadeInUp}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link to="/contact">Contact</Link>
        </motion.li>
        <motion.li variants={fadeInUp}
        whileHover={{ scale: 1.3 }}
          whileTap={{ scale: 1 }}>
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === 'light' ? <DarkModeTwoTone size={20} /> : <LightModeTwoTone size={20} />}
          </button>
        </motion.li>
      </motion.ul>
    </motion.nav>
  );
};