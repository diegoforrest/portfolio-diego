import { motion, useScroll, useTransform } from 'framer-motion';
import { GitHub, LaunchOutlined, ChevronRight, ArrowRightAlt } from '@mui/icons-material';
import { useRef } from 'react';
import { 
  SiReact, 
  SiNodedotjs, 
  SiFirebase, 
  SiOpenai,
  SiNextdotjs,
  SiTypescript,
  SiPostgresql,
  SiChartdotjs,
  SiMui,
  SiMongodb,
  SiTailwindcss,
  SiJavascript,
  SiHtml5,
  SiCss3,
  SiPython,
  SiFlask,
  SiTensorflow,
  SiFramer,
  SiFlutter,
  SiDart,
  SiNestjs,
  SiMysql
} from 'react-icons/si';

const projects = [
  {
    id: 1,
    title: "PaddyScan",
    description: "A mobile application for offline image-based detection of rice disease detection",
    image: "./images/paddyscan.png",
    tags: [
      { name: "Flutter", icon: SiFlutter, color: "#02569B" },
      { name: "Dart", icon: SiDart, color: "#0175C2" },
      { name: "Python", icon: SiPython, color: "#3776AB" },
      { name: "TensorFlow", icon: SiTensorflow, color: "#FF6F00" }
    ],
    github: "https://github.com/diegoforrest/PaddyScan",
  },
  {
    id: 2,
    title: "TaskHive",
    description: "A Lightweight task manager that helps users work from idea to done without unnecessary complexity. Focus on what matters—priorities, progress, and quick reviews.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80",
    tags: [
      { name: "Next.js", icon: SiNextdotjs, color: "#000000" },
      { name: "Nest.js", icon: SiNestjs, color: "#E0234E" },
      { name: "Node.js", icon: SiNodedotjs, color: "#339933" },
      { name: "Tailwind CSS", icon: SiTailwindcss, color: "#06B6D4" },
      { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
      { name: "MySQL", icon: SiMysql, color: "#4479A1" }
    ],
    github: "https://github.com/diegoforrest/taskhive-management-tool",
    live: "https://taskhive-webapp.vercel.app",
  },
  {
    id: 3,
    title: "Personal Portfolio",
    description: "Personal portfolio website showcasing projects, skills, and experience with interactive UI and responsive design.",
    image: "https://images.unsplash.com/photo-1555421689-d68471e189f2?w=800&q=80",
    tags: [
      { name: "React", icon: SiReact, color: "#61DAFB" },
      { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
      { name: "CSS3", icon: SiCss3, color: "#1572B6" },
      { name: "Material-UI", icon: SiMui, color: "#007FFF" },
      { name: "Framer Motion", icon: SiFramer, color: "#0055FF" }
    ],
    github: "https://github.com/diegoforrest/portfolio-diego",
    live: "https://project3.com"
  },
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
        top: `${140 + index * 140}px`,
        zIndex: index + 1
      }}
      className="project-card-stack"
    >
      <div className="project-card-inner">
        <div className="project-content-section">
          <h3 className="project-title">{project.title}</h3>
          
          <div className="project-divider"></div>

          <p className="project-description">{project.description}</p>

          <div className="project-tech-stack">
            {project.tags.map((tag, i) => {
              const IconComponent = tag.icon;
              return (
                <span key={i} className="tech-tag">
                  <IconComponent 
                    className="tech-icon" 
                    style={{ color: tag.color }}
                  />
                  {tag.name}
                </span>
              );
            })}
          </div>

          <div className="project-actions">
            <motion.a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="project-btn project-btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
                <span>GitHub</span>
              <GitHub sx={{ fontSize: 20 }} />
            </motion.a>
            {project.live && (
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
            )}
          </div>
        </div>

        <div className="project-image-section">
          <img
            src={project.image}
            alt={project.title}
            className="project-image"
          />
        </div>
      </div>
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
           A glimpse into the projects I've built as I continue to improve, explore new ideas, and grow as a developer.
          </p>
        </motion.div>

        <div className="projects-stack-container">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        <div className="more-projects-wrap">
          <button className="more-projects-btn" type="button" aria-label="More projects">
            <span>More projects</span>
            <ChevronRight className="icon-default" sx={{ fontSize: 20 }} />
            <ArrowRightAlt className="icon-hover" sx={{ fontSize: 20 }} />
          </button>
        </div>
      </div>
    </section>
  );
};