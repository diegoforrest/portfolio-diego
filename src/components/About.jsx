import { motion } from 'framer-motion';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Coffee, DirectionsRun, Headset, MovieFilter, Shuffle, SportsBasketball, TrackChanges, Movie, SportsEsports, LaunchOutlined, ChevronLeft, ChevronRight, RocketLaunch, Whatshot } from '@mui/icons-material';
import * as Tooltip from '@radix-ui/react-tooltip';
import { TechToolbox } from './TechToolbox';

const ContributionDay = ({ day, index }) => {
  const getColorForLevel = useCallback((level) => {
    return ['#1a1a2e', '#667eea33', '#667eea66', '#667eea99', '#667eea'][level];
  }, []);

  const formatDate = useCallback((date) =>
    new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), []);

  if (!day.date) {
    return <div key={index} style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: '#1a1a2e' }} />;
  }

  return (
    <Tooltip.Provider key={index}>
      <Tooltip.Root delayDuration={0}>
        <Tooltip.Trigger asChild>
          <div
            style={{ 
              width: '10px', 
              height: '10px', 
              borderRadius: '3px', 
              backgroundColor: getColorForLevel(day.level),
              cursor: 'pointer',
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          />
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="github-tooltip"
            sideOffset={5}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: '600' }}>{formatDate(day.date)}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--light-text)' }}>{day.count} contributions</div>
            <Tooltip.Arrow className="github-tooltip-arrow" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};

const GitHubContributions = () => {
  const [contributions, setContributions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalContributions, setTotalContributions] = useState(0);
  const [streak, setStreak] = useState(0);

  const processedData = useMemo(() => {
    if (!contributions.length) return { rows: [], isEmpty: true, firstDate: null, lastDate: null };

    // Get the last 182 days (26 weeks) of contributions
    const recentDays = contributions.slice(-182);
    
    if (!recentDays.length) return { rows: [], isEmpty: true, firstDate: null, lastDate: null };
    
    // Create 7 rows (one for each day of the week)
    const rows = [[], [], [], [], [], [], []];
    
    const firstDayOfWeek = new Date(recentDays[0].date).getDay();
    
    // Add empty cells for days before the first contribution (to align the week)
    for (let i = 0; i < firstDayOfWeek; i++) {
      rows[i].push({ date: '', count: 0, level: 0 });
    }
    
    // Fill in the contributions
    recentDays.forEach(day => {
      const dayOfWeek = new Date(day.date).getDay();
      rows[dayOfWeek].push(day);
    });
    
    // Pad rows to have equal length (fill remaining days of current week)
    const maxLength = Math.max(...rows.map(row => row.length));
    rows.forEach(row => {
      while (row.length < maxLength) {
        row.push({ date: '', count: 0, level: 0 });
      }
    });

    // First date is the first actual contribution
    const firstDate = recentDays[0]?.date || null;
    // Last date is the last actual contribution  
    const lastDate = recentDays[recentDays.length - 1]?.date || null;

    return { rows, isEmpty: false, firstDate, lastDate };
  }, [contributions]);

  useEffect(() => {
    let cancelled = false;
    
    const fetchGitHubContributions = async () => {
      if (cancelled) return;
      
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const res = await fetch(`https://github-contributions-api.jogruber.de/v4/diegoforrest?y=last`, {
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!res.ok) throw new Error('Failed to fetch GitHub contributions');

        const data = await res.json();
        if (!data?.contributions || !Array.isArray(data.contributions)) {
          throw new Error('Invalid API format');
        }

        if (cancelled) return;

        const allDays = data.contributions;
        const total = data.total?.lastYear || 0;
        
        // Get all available days - processedData will handle the 182 day slice
        const days = allDays;

        let streakCount = 0, currentStreak = 0;
        const processed = days.map((day) => {
          const count = parseInt(day.count) || 0;
          const level = Math.min(Math.max(0, day.level), 4);
          if (count > 0) {
            currentStreak++;
            streakCount = Math.max(streakCount, currentStreak);
          } else {
            currentStreak = 0;
          }

          return { date: day.date, count, level };
        });

        setContributions(processed);
        setTotalContributions(total);
        setStreak(streakCount);
      } catch (err) {
        if (cancelled) return;
        console.error('GitHub API error:', err);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    const timeoutId = setTimeout(fetchGitHubContributions, 100);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, []);

  const renderGrid = useCallback(() => {
    if (isLoading) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} style={{ display: 'flex', gap: '2px' }}>
              {Array.from({ length: 26 }).map((_, j) => (
                <div key={j} style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: '#1a1a2e' }} />
              ))}
            </div>
          ))}
        </div>
      );
    }

    if (processedData.isEmpty) {
      return <div style={{ color: 'var(--light-text)', fontSize: '0.875rem', textAlign: 'center', padding: '20px 0' }}>No contribution data available</div>;
    }

    return (
      <div style={{ width: '100%', overflowX: 'auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 'max-content' }}>
          {processedData.rows.map((row, i) => (
            <div key={i} style={{ display: 'flex', gap: '2px' }}>
              {row.map((day, j) => (
                <ContributionDay key={`${i}-${j}`} day={day} index={`${i}-${j}`} />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }, [isLoading, processedData]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, marginBottom: '12px' }}>{renderGrid()}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--light-text)' }}>
        <span>{processedData.firstDate ? new Date(processedData.firstDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}</span>
        <span>{processedData.lastDate ? new Date(processedData.lastDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}</span>
      </div>
    </div>
  );
};


const films = [
  {
    title: 'Breaking Bad',
    image: '/films/breakingbad.png'
  },
  {
    title: 'Blue Lock',
    image: '/films/bluelock.png'
  },
  {
    title: '50 First Dates',
    image: '/films/firstdate.png'
  },
  {
    title: 'Game Of Thrones',
    image: '/films/got.png'
  },
  {
    title: 'Haikyu!!',
    image: '/films/haikyuu.png'
  },
  {
    title: 'Hunter x Hunter',
    image: '/films/hxh.png'
  },
  {
    title: 'Naruto',
    image: '/films/naruto.png'
  },
  {
    title: 'One Piece',
    image: '/films/op.png'
  },
  {
    title: 'Peaky Blinders',
    image: '/films/peaky.png'
  },
  {
    title: 'Shameless',
    image: '/films/shameless.png'
  },
  {
    title: 'Teen Wolf',
    image: '/films/teenwolf.png'
  },
  {
    title: 'Vampire Diaries',
    image: '/films/vamp.png'
  },
  {
    title: 'Vikings',
    image: '/films/vikings.png'
  },
  {
    title: 'White Chicks',
    image: '/films/whitechic.png'
  },
  {
    title: 'Witcher',
    image: '/films/witcher.png'
  },
  {
    title: 'You',
    image: '/films/you.png'
  },
];

const games = [
  {
    title: 'Dota Devotee',
    image: '/games/dota.png',
    emoji: '🎮',
    description: "I've played Dota 2 for years. It's chaotic, punishing, and I keep coming back for more.",
    color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    title: 'Counter-Strike 2',
    image: '/games/csgo.png',
    emoji: '🎯',
    description: "From CS:GO to CS2, the tactical shooter that never gets old. Rush B, anyone?",
    color: 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)'
  },
  {
    title: 'Valorant',
    image: '/games/valorant.png',
    emoji: '🔫',
    description: "When I want tactical shooting with abilities. The agent gameplay keeps it fresh.",
    color: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)'
  },
  {
    title: 'GTA V',
    image: '/games/gta.png',
    emoji: '🚗',
    description: "Los Santos is my second home. Chaos, heists, and endless possibilities.",
    color: 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)'
  },
  {
    title: 'NBA 2k',
    image: '/games/nba.png',
    emoji: '🏀',
    description: "My go-to for basketball action. Building dynasties and breaking ankles.",
    color: 'linear-gradient(135deg, #e67e22 0%, #d35400 100%)'
  },
  {
    title: 'Red Dead Redemption 2',
    image: '/games/rdr.png',
    emoji: '🤠',
    description: "The most beautiful game I've ever played. Arthur Morgan's story hits different.",
    color: 'linear-gradient(135deg, #8e44ad 0%, #9b59b6 100%)'
  },
  {
    title: 'Rust',
    image: '/games/rust.png',
    emoji: '🏠',
    description: "Survival at its finest. Trust no one, build everything, lose it all.",
    color: 'linear-gradient(135deg, #c0392b 0%, #e74c3c 100%)'
  }
];

// Stack card colors
const stackColors = [
  'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
  'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)',
  'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)',
  'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
];

const hobbies = [  
  { name: 'Coffee', icon: Coffee },
  { name: 'Films', icon: Movie },
  { name: 'Music', icon: Headset },
  { name: 'Animes', icon: MovieFilter },
  { name: 'Dota 2', icon: SportsEsports },
  { name: 'CSGO', icon: SportsEsports },
  { name: 'Running', icon: DirectionsRun },
  { name: 'Basketball', icon: SportsBasketball },
  { name: 'Billiards', icon: TrackChanges },
];

export const About = () => {
  const [filmOrder, setFilmOrder] = useState(films);
  const [currentGameIndex, setCurrentGameIndex] = useState(0);
  const [flipDirection, setFlipDirection] = useState(1); // 1 for next, -1 for prev

  // Only show 3 films at a time
  const visibleFilms = filmOrder.slice(0, 3);

  const shuffleFilms = () => {
    const shuffled = [...films].sort(() => Math.random() - 0.5);
    setFilmOrder(shuffled);
  };

  const nextGame = () => {
    setFlipDirection(1);
    setCurrentGameIndex((prev) => (prev + 1) % games.length);
  };

  const prevGame = () => {
    setFlipDirection(-1);
    setCurrentGameIndex((prev) => (prev - 1 + games.length) % games.length);
  };

  const shuffleGames = () => {
    setFlipDirection(1);
    const randomIndex = Math.floor(Math.random() * games.length);
    setCurrentGameIndex(randomIndex);
  };

  return (
    <section id="about" className="about-section">
      <div className="about-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="about-header"
        >
          <h2 className="about-title">About Me</h2>
          <p className="about-subtitle">
            A glimpse into my skills, education, and the things that inspire me
          </p>
        </motion.div>

        <div className="bento-grid">
          {/* myself */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="bento-card profile-card"
          >
            <img src="/images/pfp.png" alt="Diego Forrest Cruz" />
          </motion.div>

          {/* Intro*/}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            viewport={{ once: true }}
            className="bento-card intro-card"
          >
            <h1>I'M DIEGO</h1>
            <p>
            My journey in the world of CODES began with a deep curiosity for how digital experiences are brought to life.
            From those early moments of discovery to the skills I’ve cultivated today, I’ve learned to transform ideas into clean, engaging, and intuitive interfaces.
            I’ve dedicated myself to building projects that blend thoughtful design with purposeful functionality, creating experiences that feel seamless and meaningful.
            Let’s craft something remarkable together.
            </p>
          </motion.div>

          {/* Education */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="bento-card education-card"
          >
            <h3 className="bento-card-title">Education</h3>
            <div className="education-content">
              <div className="education-item">
                <div className="education-header">
                  <img src="/images/dlsud.png" alt="DLSUD" className="education-logo" />
                  <div>
                    <h4>Bachelor of Science in Computer Engineering</h4>
                    <p className="education-school">De La Salle University - Dasmariñas</p>
                  </div>
                </div>
                <p className="education-year">2021 - 2025</p>
              </div>
              <div className="education-item">
                <div className="education-header">
                  <img src="/images/dlsud.png" alt="DLSUD" className="education-logo" />
                  <div>
                    <h4>Senior High School</h4>
                    <p className="education-school">De La Salle University - Dasmariñas</p>
                  </div>
                </div>
                <p className="education-year">2019 - 2021</p>
              </div>
            </div>
          </motion.div>

          {/* Tech Stack */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            viewport={{ once: true }}
            className="bento-card tech-stack-card"
          >
            <h3 className="bento-card-title techstack-title">Tech Stack</h3>
            <TechToolbox />
          </motion.div>

          {/* Beyond box */}
          <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="bento-card hobbies-card beyond-card"
          >
            <h3 className="bento-card-title">Beyond The Code</h3> 
            <p className="beyond-subtitle">Explore my interests and hobbies.</p>
            <div className="hobbies-grid">
              {hobbies.map((hobby, index) => {
                const IconComponent = hobby.icon;
                return (
                <motion.div
                key={hobby.name}
                className="hobby-pill"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.03 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -2 }}
                >
                  <IconComponent className="hobby-icon" sx={{ fontSize: 20 }} />
                  <span>{hobby.name}</span>
                  </motion.div>
                  );
                  })}
                  </div>
                  </motion.div>

          {/* My Favorite Films */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.32 }}
            viewport={{ once: true }}
            className="bento-card films-card"
          >
            <div className="films-header">
              <h3 className="bento-card-title">
                <img src="/icons/popcorn.svg" alt="popcorn" style={{ width: 24, height: 20, filter: 'brightness(0) invert(1)' }} />
                Binged & Loved
              </h3>
              <motion.button
                className="shuffle-btn-icon"
                onClick={shuffleFilms}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Shuffle sx={{ fontSize: 20 }} />
              </motion.button>
            </div>
            <div className="films-content">
              <div className="film-stack">
                {visibleFilms.map((film, index) => (
                  <motion.div
                    key={film.title}
                    className={`film-card film-${index}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <img src={film.image} alt={film.title} />
                    <div className="film-overlay">
                      <span className="film-title">{film.title}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Games I Play */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.34 }}
            viewport={{ once: true }}
            className="bento-card games-card"
          >
            <div className="games-header">
              <h3 className="bento-card-title">
                <SportsEsports sx={{ fontSize: 24 }} />
                Games I Play
              </h3>
              <div className="games-nav-buttons">
                <motion.button
                  className="game-nav-btn"
                  onClick={prevGame}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Previous game"
                >
                  <ChevronLeft sx={{ fontSize: 20 }} />
                </motion.button>
                <motion.button
                  className="game-nav-btn"
                  onClick={shuffleGames}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Shuffle games"
                >
                  <Shuffle sx={{ fontSize: 18 }} />
                </motion.button>
                <motion.button
                  className="game-nav-btn"
                  onClick={nextGame}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Next game"
                >
                  <ChevronRight sx={{ fontSize: 20 }} />
                </motion.button>
              </div>
            </div>
            <div className="games-content">
              <div className="game-stack">
                {/* Background cards for stack effect - colors shift based on current index */}
                {stackColors.map((color, i) => (
                  <div 
                    key={i}
                    className={`game-stack-card game-stack-${4 - i}`}
                    style={{ background: stackColors[(currentGameIndex + i + 1) % stackColors.length] }}
                  />
                ))}
                <motion.div
                  key={currentGameIndex}
                  className="game-card-main"
                  style={{ background: games[currentGameIndex].color }}
                  initial={{ 
                    y: 20,
                    opacity: 0,
                    scale: 0.95
                  }}
                  animate={{ 
                    y: 0,
                    opacity: 1,
                    scale: 1
                  }}
                  transition={{ 
                    duration: 0.3,
                    ease: 'easeOut'
                  }}
                >
                  <div className="game-card-image">
                    <img 
                      src={games[currentGameIndex].image} 
                      alt={games[currentGameIndex].title}
                      className="game-image"
                    />
                  </div>
                  <div className="game-card-info">
                    <span className="game-card-title">
                      {games[currentGameIndex].emoji} {games[currentGameIndex].title}
                    </span>
                    <p className="game-card-description">
                      {games[currentGameIndex].description}
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* GitHub Contributions */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            viewport={{ once: true }}
            className="bento-card github-card"
          >
            <div className="github-card-header">
              <h3 className="bento-card-title">GitHub Activity</h3>
              <span className="github-badge">Last 6 Months</span>
            </div>
            <div className="github-content">
              <GitHubContributions />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
