import { motion } from "framer-motion";
import { useTheme } from "@/components/ui/theme-provider";
import { Settings2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useThemeCustomizerUI } from "./ThemeCustomizerShadcn";
import {
  ThemeToggleButton,
  useThemeTransition,
} from "@/components/ui/theme-toggle-button";

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
  const { theme, setTheme } = useTheme();
  const { openCustomizer } = useThemeCustomizerUI();
  const { startTransition } = useThemeTransition();

  const handleThemeToggle = () => {
    startTransition(() => {
      setTheme(theme === "dark" ? "light" : "dark");
    });
  };

  return (
    <motion.nav
      className="navbar"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Link to="/" className="logo-link">
        <motion.span
          className="logo"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          diego
        </motion.span>
      </Link>

      <motion.ul
        className="nav-theme"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <motion.li
          variants={fadeInUp}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <button className="nav-theme-button" onClick={openCustomizer}>
            <Settings2 size={16} />
          </button>
        </motion.li>
        <motion.li
          variants={fadeInUp}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ThemeToggleButton
            theme={theme}
            variant="circle"
            start="center"
            onClick={handleThemeToggle}
            className="nav-theme-button"
          />
        </motion.li>
      </motion.ul>
    </motion.nav>
  );
};
