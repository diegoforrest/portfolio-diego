import { motion } from 'framer-motion';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Coffee, DirectionsRun, Headset, MovieFilter, Shuffle, SportsBasketball, TrackChanges, Movie, SportsEsports, LaunchOutlined, ChevronLeft, ChevronRight } from '@mui/icons-material';
import * as Tooltip from '@radix-ui/react-tooltip';
import { TechToolbox } from './TechToolbox';

const ContributionDay = ({ day, index }) => {
  const getColorForLevel = useCallback((level) => {
    return ['#1a1a2e', '#667eea33', '#667eea66', '#667eea99', '#667eea'][level];
  }, []);

  const formatDate = useCallback((date) =>
    new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), []);

  if (!day.date) {
    return <div key={index} style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: 'transparent' }} />;
  }

  return (
    <Tooltip.Provider key={index}>
      <Tooltip.Root delayDuration={0}>
        <Tooltip.Trigger asChild>
          <div
            style={{ 
              width: '10px', 
              height: '10px', 
              borderRadius: '2px', 
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
    if (!contributions.length) return { weeks: [], isEmpty: true };

    const weeks = [];
    let currentWeek = [];

    const firstDay = new Date(contributions[0].date).getDay();
    for (let i = 0; i < firstDay; i++) {
      currentWeek.push({ date: '', count: 0, level: 0 });
    }

    contributions.forEach(day => {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        weeks.push([...currentWeek]);
        currentWeek = [];
      }
    });

    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push({ date: '', count: 0, level: 0 });
      }
      weeks.push(currentWeek);
    }

    return { weeks, isEmpty: false };
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
        const days = allDays.slice(-182); // 6 months

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

  const renderWeeks = useCallback(() => {
    if (isLoading) {
      return (
        <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap' }}>
          {Array.from({ length: 50 }).map((_, i) => (
            <div key={i} style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: '#1a1a2e' }} />
          ))}
        </div>
      );
    }

    if (processedData.isEmpty) {
      return <div style={{ color: 'var(--light-text)', fontSize: '0.875rem', textAlign: 'center', padding: '20px 0' }}>No contribution data available</div>;
    }

    return (
      <div style={{ width: '100%', overflowX: 'auto' }}>
        <div style={{ display: 'flex', gap: '3px', minWidth: 'max-content' }}>
          {processedData.weeks.map((week, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              {week.map((day, j) => (
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ fontSize: '0.875rem', color: 'var(--light-text)' }}>
          <span style={{ fontWeight: '600', color: 'var(--text-color)', fontSize: '1.25rem' }}>{totalContributions}</span>
          <div style={{ fontSize: '0.75rem', marginTop: '2px' }}>Total contributions</div>
        </div>
        <div style={{ fontSize: '0.875rem', color: 'var(--light-text)', textAlign: 'right' }}>
          <span style={{ fontWeight: '600', color: 'var(--text-color)', fontSize: '1.25rem' }}>{streak}</span>
          <div style={{ fontSize: '0.75rem', marginTop: '2px' }}>Day streak</div>
        </div>
      </div>
      <div style={{ flex: 1, marginBottom: '12px' }}>{renderWeeks()}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--light-text)' }}>
        <span>{contributions.length > 0 ? new Date(contributions[0].date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Failed to fetch API'}</span>
        <span>{contributions.length > 0 ? new Date(contributions[contributions.length - 1].date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Failed to fetch API'}</span>
      </div>
    </div>
  );
};


const films = [
  {
    title: 'Nausicaä of the Valley of the Wind',
    image: 'https://image.tmdb.org/t/p/w500/jW7XzfRunHdKgbkw07qfcGcEpUG.jpg',
    year: '1984'
  },
  {
    title: 'Princess Mononoke',
    image: 'https://image.tmdb.org/t/p/w500/jHWmNr7m544fJ8eItsfNk8fs2Ed.jpg',
    year: '1997'
  },
  {
    title: 'Spider-Man: Into the Spider-Verse',
    image: 'https://image.tmdb.org/t/p/w500/iiZZdoQBEYBv6id8su7ImL0oCbD.jpg',
    year: '2018'
  }
];

const games = [
  {
    title: 'Dota 2',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota2_social.jpg'
  },
  {
    title: 'CS:GO',
    image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/730/header.jpg'
  },
  {
    title: 'Valorant',
    image: 'https://cmsassets.rgpub.io/sanity/images/dsfx7636/news/4a0767c445b55a96ca967f8fb8c9af4c600d4054-1920x1080.jpg'
  },
  {
    title: 'League of Legends',
    image: 'https://cmsassets.rgpub.io/sanity/images/dsfx7636/news/bf0138469dd2e5393c0c98f7e8e4f4c28c1f56a2-1920x1080.jpg'
  },
  {
    title: 'Apex Legends',
    image: 'https://cdn1.epicgames.com/offer/55978b50e5bb44b08b0c09f3313cda6e/EGS_ApexLegends_RespawnEntertainment_S1_2560x1440-e8c615b7c45fbd1e1948ee0b72eb6703'
  }
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

  const shuffleFilms = () => {
    const shuffled = [...filmOrder].sort(() => Math.random() - 0.5);
    setFilmOrder(shuffled);
  };

  const nextGame = () => {
    setCurrentGameIndex((prev) => (prev + 1) % games.length);
  };

  const prevGame = () => {
    setCurrentGameIndex((prev) => (prev - 1 + games.length) % games.length);
  };

  const shuffleGames = () => {
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
            <h1>Diego Forrest Cruz</h1>
            <p>
            My journey in the world of front-end development began with a deep curiosity for how digital experiences are brought to life.
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
            <h3 className="bento-card-title">Tech Stack</h3>
            <TechToolbox />
          </motion.div>

          {/* My Favorite Films */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="bento-card films-card"
          >
            <h3 className="bento-card-title">My Favorite Films</h3>
            <div className="films-content">
              <div className="film-stack">
                {filmOrder.map((film, index) => (
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
                      <span className="film-year">{film.year}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
              <motion.button
                className="shuffle-btn"
                onClick={shuffleFilms}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Shuffle sx={{ fontSize: 18 }} />
                <span>Shuffle</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Games I Play */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.32 }}
            viewport={{ once: true }}
            className="bento-card games-card"
          >
            <h3 className="bento-card-title">Games I Play</h3>
            <div className="games-content">
              <motion.div
                key={currentGameIndex}
                className="game-image-container"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <img 
                  src={games[currentGameIndex].image} 
                  alt={games[currentGameIndex].title}
                  className="game-image"
                />
                <div className="game-overlay">
                  <span className="game-title">{games[currentGameIndex].title}</span>
                </div>
              </motion.div>
              <div className="games-controls">
                <motion.button
                  className="game-nav-btn"
                  onClick={prevGame}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Previous game"
                >
                  <ChevronLeft sx={{ fontSize: 24 }} />
                </motion.button>
                <motion.button
                  className="shuffle-btn game-shuffle"
                  onClick={shuffleGames}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
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
                  <ChevronRight sx={{ fontSize: 24 }} />
                </motion.button>
              </div>
            </div>
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
              <motion.a
                href="https://github.com/diegoforrest"
                target="_blank"
                rel="noopener noreferrer"
                className="github-profile-icon"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Open GitHub profile"
              >
                <LaunchOutlined sx={{ fontSize: 18 }} />
              </motion.a>
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
