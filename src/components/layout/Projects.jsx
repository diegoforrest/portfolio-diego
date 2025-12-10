import { motion } from "framer-motion";
import { GitHub, LaunchOutlined } from "@mui/icons-material";
import { Icon } from "../common";

const projects = [
  {
    id: 1,
    title: "PaddyScan",
    description:
      "A mobile application for offline image-based detection of rice disease detection",
    image: "./images/paddyscan.png",
    tags: [
      { name: "Flutter", icon: "flutter", color: "#02569B" },
      { name: "Dart", icon: "dart", color: "#0175C2" },
      { name: "Python", icon: "python", color: "#3776AB" },
      { name: "TensorFlow", icon: "tensorflow", color: "#FF6F00" },
    ],
    github: "https://github.com/diegoforrest/PaddyScan",
  },
  {
    id: 2,
    title: "TaskHive",
    description:
      "A Lightweight task manager that helps users work from idea to done without unnecessary complexity. Focus on what matters priorities, progress, and quick reviews.",
    image: "./images/taskhive.png",
    tags: [
      { name: "Next.js", icon: "nextjs", color: "#000000" },
      { name: "Nest.js", icon: "nestjs", color: "#E0234E" },
      { name: "Node.js", icon: "nodejs", color: "#339933" },
      { name: "Tailwind CSS", icon: "tailwind", color: "#06B6D4" },
      { name: "TypeScript", icon: "typescript", color: "#3178C6" },
      { name: "MySQL", icon: "mysql", color: "#4479A1" },
    ],
    github: "https://github.com/diegoforrest/taskhive-management-tool",
    live: "https://taskhive-webapp.vercel.app",
  },
  {
    id: 3,
    title: "Personal Portfolio",
    description:
      "Personal portfolio website showcasing projects, skills, and experience with interactive UI and responsive design.",
    image: "./images/portfolio.png",
    tags: [
      { name: "React", icon: "react", color: "#61DAFB" },
      { name: "JavaScript", icon: "javascript", color: "#F7DF1E" },
      { name: "CSS3", icon: "css3", color: "#1572B6" },
      { name: "Framer Motion", icon: "framer", color: "#0055FF" },
      { name: "Tailwind CSS", icon: "tailwind", color: "#06B6D4" },
    ],
    github: "https://github.com/diegoforrest/portfolio-diego",
  },
];

const STACK_TOP = 50;
const STACK_OFFSET = 50; // offset for each stacked card to show a bit of the previous one
const CARD_SPACING = 0;

const ProjectCard = ({ project, index, total }) => {
  return (
    <motion.div
      style={{
        position: "sticky",
        top: `${STACK_TOP + index * STACK_OFFSET}px`,
        marginBottom: index < total - 1 ? `${CARD_SPACING}px` : "0",
        zIndex: index,
      }}
      className="project-card-stack"
    >
      <div className="project-card-inner">
        <div className="project-content-section">
          <h3 className="project-title">{project.title}</h3>

          <div className="project-divider"></div>

          <p className="project-description">{project.description}</p>

          <div className="project-tech-stack">
            {project.tags.map((tag, i) => (
              <span key={i} className="tech-tag">
                <Icon
                  name={tag.icon}
                  className="tech-icon"
                  style={{ color: tag.color }}
                />
                {tag.name}
              </span>
            ))}
          </div>

          <div className="project-actions">
            <motion.a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
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
                className="btn btn-secondary"
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
            A few projects that represent where I started, what I’ve learned,
            and where I’m heading next.
          </p>
        </motion.div>

        <div className="projects-stack-container">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              total={projects.length}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
