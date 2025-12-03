import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards, Navigation } from "swiper/modules";
import {
  ChevronLeft,
  ChevronRight,
  Shuffle,
  SportsEsports,
  SportsEsportsOutlined,
} from "@mui/icons-material";
import { motion } from "framer-motion";

import "swiper/css";
import "swiper/css/effect-cards";

export const GameCarousel = ({ games }) => {
  const swiperRef = useRef(null);
  const [isShuffling, setIsShuffling] = useState(false);
  const [gameOrder, setGameOrder] = useState(games);

  const shuffleGames = async () => {
    if (isShuffling) return;
    setIsShuffling(true);

    // Loading delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const shuffled = [...games].sort(() => Math.random() - 0.5);
    setGameOrder(shuffled);

    // Reset to first slide
    if (swiperRef.current) {
      swiperRef.current.slideToLoop(0, 0);
    }

    await new Promise((resolve) => setTimeout(resolve, 200));
    setIsShuffling(false);
  };

  return (
    <div className="game-carousel-container">
      <div className="game-carousel-header">
        <h3 className="bento-title">
          <SportsEsportsOutlined sx={{ fontSize: 20 }} />
          Games I Play
        </h3>
        <div className="game-nav-buttons">
          <motion.button
            className="bento-btn bento-btn-icon"
            onClick={() => swiperRef.current?.slidePrev()}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            disabled={isShuffling}
            aria-label="Previous game"
          >
            <ChevronLeft sx={{ fontSize: 18 }} />
          </motion.button>
          <motion.button
            className="bento-btn bento-btn-icon"
            onClick={shuffleGames}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            disabled={isShuffling}
            aria-label="Shuffle games"
          >
            {isShuffling ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
              >
                <Shuffle sx={{ fontSize: 14 }} />
              </motion.div>
            ) : (
              <Shuffle sx={{ fontSize: 14 }} />
            )}
          </motion.button>
          <motion.button
            className="bento-btn bento-btn-icon"
            onClick={() => swiperRef.current?.slideNext()}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            disabled={isShuffling}
            aria-label="Next game"
          >
            <ChevronRight sx={{ fontSize: 18 }} />
          </motion.button>
        </div>
      </div>

      {/* Cards container */}
      <div className="game-cards-container">
        <Swiper
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          effect="cards"
          grabCursor={true}
          modules={[EffectCards, Navigation]}
          className="game-swiper"
          cardsEffect={{
            slideShadows: false,
            perSlideOffset: 8,
            perSlideRotate: 4,
          }}
          loop={true}
        >
          {gameOrder.map((game, index) => (
            <SwiperSlide
              key={`${game.title}-${index}`}
              className="game-swiper-slide"
            >
              <div
                className="game-stack-card"
                style={{ background: game.color }}
              >
                <div className="game-stack-image">
                  <img src={game.image} alt={game.title} draggable="false" />
                </div>
                <div className="game-stack-info">
                  <span className="game-stack-title">
                    {game.emoji} {game.title}
                  </span>
                  <p className="game-stack-description">{game.description}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};
