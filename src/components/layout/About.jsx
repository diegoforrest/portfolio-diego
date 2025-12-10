import { motion } from "framer-motion";
import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  lazy,
  Suspense,
} from "react";
import {
  Coffee,
  DirectionsRun,
  Headset,
  MovieFilter,
  Shuffle,
  SportsBasketball,
  TrackChanges,
  Movie,
  DoNotStep,
  SportsEsports,
  Autorenew,
} from "@mui/icons-material";
import { TechToolbox } from "../features/about";
import { AlbumCarousel, GameCarousel, FilmSkeleton } from "../features/media";
import { GitHubSkeleton } from "../features/github";

// Lazy load the heavy GitHub heatmap component
const GitHubContributions = lazy(() =>
  import("../features/github").then((module) => ({
    default: module.GitHubContributions,
  }))
);

const films = [
  {
    title: "Breaking Bad",
    image: "/films/breakingbad.png",
  },
  {
    title: "Blue Lock",
    image: "/films/bluelock.png",
  },
  {
    title: "50 First Dates",
    image: "/films/firstdate.png",
  },
  {
    title: "Game Of Thrones",
    image: "/films/got.png",
  },
  {
    title: "Haikyu!!",
    image: "/films/haikyuu.png",
  },
  {
    title: "Hunter x Hunter",
    image: "/films/hxh.png",
  },
  {
    title: "Naruto",
    image: "/films/naruto.png",
  },
  {
    title: "One Piece",
    image: "/films/op.png",
  },
  {
    title: "Peaky Blinders",
    image: "/films/peaky.png",
  },
  {
    title: "Shameless",
    image: "/films/shameless.png",
  },
  {
    title: "Teen Wolf",
    image: "/films/teenwolf.png",
  },
  {
    title: "Vampire Diaries",
    image: "/films/vamp.png",
  },
  {
    title: "Vikings",
    image: "/films/vikings.png",
  },
  {
    title: "White Chicks",
    image: "/films/whitechic.png",
  },
  {
    title: "Witcher",
    image: "/films/witcher.png",
  },
  {
    title: "You",
    image: "/films/you.png",
  },
];

const games = [
  {
    title: "Dota Devotee",
    image: "/games/dota.png",
    description:
      "I've played Dota 2 for years. It's chaotic, punishing, and I keep coming back for more.",
    color: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
  },
  {
    title: "Counter-Strike 2",
    image: "/games/csgo.png",
    description:
      "From CS:GO to CS2, the tactical shooter that never gets old. Rush B, anyone?",
    color: "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)",
  },
  {
    title: "Valorant",
    image: "/games/valorant.png",
    description:
      "When I want tactical shooting with abilities. The agent gameplay keeps it fresh.",
    color: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  },
  {
    title: "GTA V",
    image: "/games/gta.png",
    description:
      "Los Santos is my second home. Chaos, heists, and endless possibilities.",
    color: "linear-gradient(135deg, #00b894 0%, #00cec9 100%)",
  },
  {
    title: "NBA 2k",
    image: "/games/nba.png",
    description:
      "My go-to for basketball action. Building dynasties and breaking ankles.",
    color: "linear-gradient(135deg, #fd79a8 0%, #fdcb6e 100%)",
  },
  {
    title: "Red Dead Redemption 2",
    image: "/games/rdr.png",
    description:
      "The most beautiful game I've ever played. Arthur Morgan's story hits different.",
    color: "linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%)",
  },
  {
    title: "Rust",
    image: "/games/rust.png",
    description:
      "Survival at its finest. Trust no one, build everything, lose it all.",
    color: "linear-gradient(135deg, #fab1a0 0%, #ff7675 100%)",
  },
  {
    title: "For Honor",
    image: "/games/forhonor.png",
    description:
      "Medieval combat with Vikings, Knights, and Samurai. Honor, steel, and epic duels.",
    color: "linear-gradient(135deg, #636e72 0%, #2d3436 100%)",
  },
  {
    title: "Rainbow 6 Siege",
    image: "/games/r6.png",
    description:
      "Tactical team shooter where every wall is destructible and strategy is everything.",
    color: "linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)",
  },
  {
    title: "PUBG: Battlegrounds",
    image: "/games/pubg.png",
    description:
      "The original battle royale. Drop in, loot up, and be the last one standing.",
    color: "linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%)",
  },
  {
    title: "R.E.P.O.",
    image: "/games/repo.png",
    description:
      "Intense extraction shooter. Get in, grab the loot, and make it out alive.",
    color: "linear-gradient(135deg, #55efc4 0%, #00b894 100%)",
  },
];

const albums = [
  {
    title: "SUGAR",
    artist: "BROCKHAMPTON",
    image: "/albums/sugar.png",
    spotifyUrl:
      "https://open.spotify.com/track/6U0FIYXCQ3TGrk4tFpLrEA?si=e52685bf93a243b9",
  },
  {
    title: "Yvette",
    artist: "Vedo",
    image: "/albums/yvette.png",
    spotifyUrl:
      "https://open.spotify.com/track/2dPERaR67UjUmksgkPGXD3?si=17347e03a0a6485c",
  },
  {
    title: "Love to Dream",
    artist: "Doja Cat",
    image: "/albums/lovetodream.png",
    spotifyUrl:
      "https://open.spotify.com/track/6Q9IUoBTNLHgBib1FSFGbj?si=0549cc2cf1ba4ea7",
  },
  {
    title: "Coming Back",
    artist: "J.Tajor",
    image: "/albums/comingback.png",
    spotifyUrl:
      "https://open.spotify.com/track/2EvkvOTeQfPAVIXDO98qV1?si=73fc0db7f98b4291",
  },
  {
    title: "Folded",
    artist: "Kehlani",
    image: "/albums/folded.png",
    spotifyUrl:
      "https://open.spotify.com/track/0bxPRWprUVpQK0UFcddkrA?si=ea35038ae4f54836",
  },
  {
    title: "BLEACH",
    artist: "BROCKHAMPTON",
    image: "/albums/bleach.png",
    spotifyUrl:
      "https://open.spotify.com/track/0dWOFwdXrbBUYqD9DLsoyK?si=43dd68fa0f5d4679",
  },
  {
    title: "Ride",
    artist: "Aaron May",
    image: "/albums/ride.png",
    spotifyUrl:
      "https://open.spotify.com/track/2Mm9FCqnjH9k6JfOvr3Hg7?si=3fba7ea16a744e64",
  },
  {
    title: "The Fight is Over",
    artist: "Urbandub",
    image: "/albums/fightisover.png",
    spotifyUrl:
      "https://open.spotify.com/track/5ettB3H684D7vmYtxB4nJS?si=d65f8188775042d1",
  },
  {
    title: "I wanted you",
    artist: "INA",
    image: "/albums/iwantedyou.png",
    spotifyUrl:
      "https://open.spotify.com/track/0Z8zCIj5S8XOTl7eMQH2VK?si=64022add7dd64206",
  },
  {
    title: "No Scrubs",
    artist: "TLC",
    image: "/albums/noscrubs.png",
    spotifyUrl:
      "https://open.spotify.com/track/1KGi9sZVMeszgZOWivFpxs?si=ff0e43b86b794faf",
  },
  {
    title: "Overboard",
    artist: "Justin Bieber ft Jessica Jarrell",
    image: "/albums/overboard.png",
    spotifyUrl:
      "https://open.spotify.com/track/1tzkJMX3gNjnpcHdLD0pM3?si=dad6279160754e2e",
  },
  {
    title: "Next to you",
    artist: "Chris Brown ft Justin Bieber",
    image: "/albums/nexttoyou.png",
    spotifyUrl:
      "https://open.spotify.com/track/7gd01LMH2gBcoDngSt8sq9?si=495f70c297354cb6",
  },
];

const hobbies = [
  { name: "Coffee", icon: Coffee },
  { name: "Films", icon: Movie },
  { name: "Music", icon: Headset },
  { name: "Animes", icon: MovieFilter },
  { name: "Dota 2", icon: SportsEsports },
  { name: "CSGO", icon: SportsEsports },
  { name: "Running", icon: DirectionsRun },
  { name: "Basketball", icon: SportsBasketball },
  { name: "Billiards", icon: TrackChanges },
  { name: "Sneakers", icon: DoNotStep },
];

export const About = () => {
  const [filmOrder, setFilmOrder] = useState(films);
  const [isShuffling, setIsShuffling] = useState(false);

  // Only show 3 films at a time
  const visibleFilms = filmOrder.slice(0, 3);

  const shuffleFilms = async () => {
    if (isShuffling) return;
    setIsShuffling(true);

    await new Promise((resolve) => setTimeout(resolve, 600));

    const shuffled = [...films].sort(() => Math.random() - 0.5);
    setFilmOrder(shuffled);

    await new Promise((resolve) => setTimeout(resolve, 200));
    setIsShuffling(false);
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
            Dive into my world from tech stack and education to games, music,
            films, and the hobbies that fuel my creativity
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
            <img
              src="/images/pfp.png"
              alt="Diego Forrest Cruz"
              loading="lazy"
            />
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
              My journey in the world of CODES began with a deep curiosity for
              how digital experiences are brought to life. From those early
              moments of discovery to the skills I’ve cultivated today, I’ve
              learned to transform ideas into clean, engaging, and intuitive
              interfaces. I’ve dedicated myself to building projects that blend
              thoughtful design with purposeful functionality, creating
              experiences that feel seamless and meaningful. Let’s craft
              something remarkable together.
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
            <h3 className="bento-title">Education</h3>
            <div className="education-content">
              <div className="education-item">
                <div className="education-header">
                  <img
                    src="/images/dlsud.png"
                    alt="DLSUD"
                    className="education-logo"
                    loading="lazy"
                  />
                  <div>
                    <h4>Bachelor of Science in Computer Engineering</h4>
                    <p className="education-school">
                      De La Salle University - Dasmariñas
                    </p>
                  </div>
                </div>
                <p className="education-year">2021 - 2025</p>
              </div>
              <div className="education-item">
                <div className="education-header">
                  <img
                    src="/images/dlsud.png"
                    alt="DLSUD"
                    className="education-logo"
                    loading="lazy"
                  />
                  <div>
                    <h4>Senior High School</h4>
                    <p className="education-school">
                      De La Salle University - Dasmariñas
                    </p>
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
            <h3 className="bento-title bento-title-center">Tech Stack</h3>
            <TechToolbox />
          </motion.div>

          {/* Beyond box */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="bento-card beyond-card"
          >
            <h3 className="bento-title">Beyond The Code</h3>
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
                    <IconComponent
                      className="hobby-icon"
                      sx={{ fontSize: 20 }}
                    />
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
              <h3 className="bento-title">
                Binged & Loved
                <img
                  src="/icons/popcorn.svg"
                  alt="popcorn"
                  className="bento-title-icon"
                  loading="lazy"
                />
              </h3>
            </div>
            <div className="films-content">
              <div className="film-stack">
                {isShuffling
                  ? Array.from({ length: 3 }).map((_, index) => (
                      <FilmSkeleton key={`skeleton-${index}`} index={index} />
                    ))
                  : visibleFilms.map((film, index) => {
                      const rotations = [-15, 0, 12];
                      const scales = [0.9, 1, 0.9];
                      return (
                        <motion.div
                          key={film.title}
                          className={`film-card film-${index}`}
                          initial={{
                            opacity: 0,
                            scale: 0.8,
                            rotate: rotations[index],
                          }}
                          animate={{
                            opacity: 1,
                            scale: scales[index],
                            rotate: rotations[index],
                          }}
                          whileHover={{ rotate: 0, scale: 1.05 }}
                          transition={{ duration: 0.3 }}
                          style={{ position: "absolute" }}
                        >
                          <img
                            src={film.image}
                            alt={film.title}
                            draggable="false"
                            loading="lazy"
                          />
                          <div className="film-overlay">
                            <span className="film-title">{film.title}</span>
                          </div>
                        </motion.div>
                      );
                    })}
              </div>
              <motion.button
                className="bento-btn"
                onClick={shuffleFilms}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isShuffling}
              >
                {isShuffling ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <Autorenew sx={{ fontSize: 18 }} />
                  </motion.div>
                ) : (
                  <Shuffle sx={{ fontSize: 18 }} />
                )}
                <span>Shuffle</span>
              </motion.button>
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
            <GameCarousel games={games} />
          </motion.div>

          {/* Music Box */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            viewport={{ once: true }}
            className="bento-card music-card"
          >
            <AlbumCarousel albums={albums} />
          </motion.div>

          {/* GitHub Contributions */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.37 }}
            viewport={{ once: true }}
            className="bento-card github-card"
          >
            <div className="github-card-header">
              <h3 className="bento-title">GitHub Activity</h3>
              <span className="github-badge">Last 6 Months</span>
            </div>
            <Suspense fallback={<GitHubSkeleton />}>
              <GitHubContributions />
            </Suspense>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
