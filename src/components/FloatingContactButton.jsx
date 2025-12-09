import { motion } from "framer-motion";
import { useState } from "react";
import { Send, Mail } from "@mui/icons-material";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export const FloatingContactButton = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Handle form submission here
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <motion.button
          className="floating-contact-btn"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.3 }}
        >
          <Mail sx={{ fontSize: 24 }} />
        </motion.button>
      </PopoverTrigger>
      <PopoverContent className="contact-popover" align="end" side="top">
        <div className="contact-popover-header">
          <h3 className="contact-popover-title">Get In Touch</h3>
          <p className="contact-popover-subtitle">
            Drop me a message and I'll get back to you soon
          </p>
        </div>

        <form className="contact-popover-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="popover-name">Name</label>
            <input
              type="text"
              id="popover-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="popover-email">Email</label>
            <input
              type="email"
              id="popover-email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your.email@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="popover-message">Message</label>
            <textarea
              id="popover-message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell me about your project or just say hi..."
              rows="4"
              required
            />
          </div>

          <motion.button
            type="submit"
            className="btn btn-primary"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>Send Message</span>
            <Send sx={{ fontSize: 20 }} />
          </motion.button>
        </form>
      </PopoverContent>
    </Popover>
  );
};
