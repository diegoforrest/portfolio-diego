import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  EffectCoverflow,
  Navigation,
  Autoplay,
  FreeMode,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import { ArrowOutward, MusicNote } from "@mui/icons-material";

export const AlbumCarousel = ({ albums }) => {
  const swiperRef = useRef(null);

  return (
    <div className="album-carousel-wrapper">
      <div className="music-header">
        <h3 className="bento-title">
          Listening To
          <MusicNote sx={{ fontSize: 20 }} />
        </h3>
      </div>
      <div className="album-carousel-main">
        <button
          className="album-nav-btn album-nav-left"
          onClick={() => swiperRef.current?.slidePrev()}
          type="button"
          aria-label="Previous album"
        >
          <svg viewBox="0 0 532 532" width="16" height="16">
            <path
              fill="currentColor"
              d="M355.66 11.354c13.793-13.805 36.208-13.805 50.001 0 13.785 13.804 13.785 36.238 0 50.034L201.22 266l204.442 204.61c13.785 13.805 13.785 36.239 0 50.044-13.793 13.796-36.208 13.796-50.002 0a5994246.277 5994246.277 0 0 0-229.332-229.454 35.065 35.065 0 0 1-10.326-25.126c0-9.2 3.393-18.26 10.326-25.2C172.192 194.973 332.731 34.31 355.66 11.354Z"
            />
          </svg>
        </button>

        <Swiper
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          effect="coverflow"
          grabCursor={true}
          centeredSlides={true}
          slidesPerView="auto"
          loop={true}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          coverflowEffect={{
            rotate: 30,
            stretch: 0,
            depth: 180,
            modifier: 1.5,
            slideShadows: false,
          }}
          modules={[EffectCoverflow, Navigation, Autoplay]}
          className="album-swiper"
        >
          {albums.map((album, index) => (
            <SwiperSlide key={index} className="album-swiper-slide">
              <a
                href={album.spotifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="album-slide-link"
              >
                <img
                  src={album.image}
                  alt={album.title}
                  className="album-image"
                  draggable="false"
                  loading="lazy"
                />
                <div className="album-overlay">
                  <ArrowOutward className="album-icon" />
                  <span className="album-title">{album.title}</span>
                  <span className="album-artist">{album.artist}</span>
                </div>
              </a>
            </SwiperSlide>
          ))}
        </Swiper>

        <button
          className="album-nav-btn album-nav-right"
          onClick={() => swiperRef.current?.slideNext()}
          type="button"
          aria-label="Next album"
        >
          <svg viewBox="0 0 532 532" width="16" height="16">
            <path
              fill="currentColor"
              d="M176.34 520.646c-13.793 13.805-36.208 13.805-50.001 0-13.785-13.804-13.785-36.238 0-50.034L330.78 266 126.34 61.391c-13.785-13.805-13.785-36.239 0-50.044 13.793-13.796 36.208-13.796 50.002 0 22.928 22.947 206.395 206.507 229.332 229.454a35.065 35.065 0 0 1 10.326 25.126c0 9.2-3.393 18.26-10.326 25.2-45.865 45.901-206.404 206.564-229.332 229.52Z"
            />
          </svg>
        </button>
      </div>

      {/* Marquee */}
      <div className="music-marquee">
        <Swiper
          modules={[Autoplay, FreeMode]}
          slidesPerView="auto"
          spaceBetween={20}
          loop={true}
          freeMode={true}
          speed={5000}
          allowTouchMove={false}
          simulateTouch={false}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
            pauseOnMouseEnter: false,
          }}
          className="music-marquee-swiper"
        >
          {[...Array(8)].map((_, index) => (
            <SwiperSlide key={index} style={{ width: "auto" }}>
              <span className="marquee-item">
                <MusicNote sx={{ fontSize: 16 }} /> This Vibe Doesn't End
              </span>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};
