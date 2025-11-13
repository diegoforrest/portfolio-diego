import { motion } from 'framer-motion';
import { Github, Linkedin, FileText } from 'lucide-react';

export const Hero = () => {
    return (
        <section className="hero">
            <div className="hero-content">
                <motion.h1 
                    className="hero-title"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    Diego Forrest <br />Cruz
                </motion.h1>

                <motion.div 
                    className="hero-badge"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="badge-dot"></span>
                    Software Engineer | Front-End Developer
                </motion.div>
                
                <motion.p 
                    className="hero-description"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    Passionate about creating beautiful, responsive web applications. 
                    Specialized in React, modern JavaScript, and user-centric design. 
                    Let's build something amazing together.
                </motion.p>
                
                <motion.div 
                    className="hero-buttons"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    <a href="#resume" className="btn btn-primary">
                        <FileText size={18} />
                        Resume
                    </a>
                    <a href="https://linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                        <Linkedin size={18} />
                        LinkedIn
                    </a>
                    <a href="https://github.com/yourprofile" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                        <Github size={18} />
                        GitHub
                    </a>
                </motion.div>
            </div>

            <motion.div 
                className="hero-image"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                {/* Add your image here */}
                <div style={{
                    width: '400px',
                    height: '400px',
                    background: 'rgba(99, 91, 255, 0.1)',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px dashed rgba(99, 91, 255, 0.3)',
                    color: 'var(--light-text)'
                }}>
                    Your Image Here
                </div>
            </motion.div>
        </section>
    );
};