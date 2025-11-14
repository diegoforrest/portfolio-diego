import { motion, useScroll, useTransform } from 'framer-motion';
import { GitHub, LaunchOutlined, CheckCircle, EmojiEvents } from '@mui/icons-material';
import { useRef } from 'react';

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

const projects = [
  {
    id: 1,
    title: "Project Name 1",
    description: "A modern web application built with React and Node.js.",
    results: [
      { title: "Built a GenAI-powered inventory management system" },
      { title: "Integrated AI assistant for personalized insights" },
      { title: "Reduced processing time by 60%" }
    ],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    tags: ["React", "Node.js", "MongoDB", "TailwindCSS"],
    github: "https://github.com/yourusername/project1",
    live: "https://project1.com",
  },
  {
    id: 2,
    title: "Project Name 2",
    description: "E-commerce platform with advanced filtering and payment integration.",
    results: [
      { title: "Developed a full-stack e-commerce solution" },
      { title: "Implemented secure payment processing" },
      { title: "Achieved 10k+ monthly active users" }
    ],
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80",
    tags: ["Next.js", "TypeScript", "Stripe", "PostgreSQL"],
    github: "https://github.com/yourusername/project2",
    live: "https://project2.com",
  },
  {
    id: 3,
    title: "Project Name 3",
    description: "Social media dashboard with analytics and real-time notifications.",
    results: [
      { title: "Built real-time analytics dashboard" },
      { title: "Integrated data visualization with Chart.js" },
      { title: "Supported 5k+ concurrent users" }
    ],
    image: "https://images.unsplash.com/photo-1555421689-d68471e189f2?w=800&q=80",
    tags: ["React", "Firebase", "Chart.js", "Material-UI"],
    github: "https://github.com/yourusername/project3",
    live: "https://project3.com"
  },
  {
    id: 4,
    title: "Project Name 4",
    description: "Task management application with real-time collaboration.",
    results: [
      { title: "Developed real-time collaboration features" },
      { title: "Implemented drag-and-drop functionality" },
      { title: "Improved team productivity by 40%" }
    ],
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&q=80",
    tags: ["Vue.js", "Express", "Socket.io", "Redis"],
    github: "https://github.com/yourusername/project4",
    live: "https://project4.com",
  }
];

const ProjectCard = ({ project, index }) => {
  const cardRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "start start"]
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.6, 1]);

  return (
    <motion.div
      ref={cardRef}
      style={{
        scale,
        opacity,
        position: 'sticky',
        top: `${100 + index * 40}px`
        
      }}
      className="project-card-stack"
      variants={staggerContainer}
    >
      <motion.div className="project-card-inner">
        <div className="project-content-section">
          <motion.h3 className="project-title">{project.title}</motion.h3>
          
          <div className="project-divider"></div>

          <ul className="project-results">
            {project.results.map((result, i) => (
              <motion.li
                key={i}
                className="project-result-item"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <CheckCircle className="result-icon" />
                <span>{result.title}</span>
              </motion.li>
            ))}
          </ul>

          <div className="project-actions">
            <motion.a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="project-btn project-btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Source Code</span>
              <GitHub sx={{ fontSize: 20 }} />
            </motion.a>
            <motion.a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="project-btn project-btn-secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Live Demo</span>
              <LaunchOutlined sx={{ fontSize: 20 }} />
            </motion.a>
          </div>

          {project.awards && (
            <div className="project-awards">
              <div className="award-badge">
                <EmojiEvents sx={{ fontSize: 20 }} />
                <span>{project.awards.text}</span>
              </div>
              <div className="award-count">
                <span>{project.awards.count}</span>
              </div>
            </div>
          )}
        </div>

        <div className="project-image-section">
          <div className="project-image-wrapper">
            <img
              src={project.image}
              alt={project.title}
              className="project-image"
            />
            <div className="project-image-overlay">
              <div className="project-tags-overlay">
                {project.tags.map((tag, i) => (
                  <span key={i} className="project-tag-overlay">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const Projects = () => {
  return (
    <section id="projects" className="projects-section">
      <div className="projects-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="projects-header"
        >
          <h2 className="projects-title">Featured Projects</h2>
          <p className="projects-subtitle">
            A collection of projects that showcase my skills and creativity
          </p>
        </motion.div>

        <div className="projects-stack-container">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};