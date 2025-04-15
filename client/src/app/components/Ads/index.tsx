import { Box, Flex, Image } from '@chakra-ui/react';
import { getListAds } from 'app/apis/ads';
import { memo, useCallback, useEffect, useState } from 'react';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import './styles.scss';
import { getTrackBySlug } from 'app/apis/track';
import { usePlayers } from 'app/hooks/player/usePlayers';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-fade';
import { EffectFade, Navigation, Pagination, Autoplay } from 'swiper/modules';
import { incrementAdClickCount } from 'app/apis/ads/ads';
import { useLocation } from 'react-router-dom';
import { useRef } from 'react';
import 'swiper/css/pagination';

// Import Swiper styles
interface Ad {
  _id: string;
  adsImageUrl: string;
  link: string;
  page: string;
}

export const Ads = memo(() => {
  const [ads, setAds] = useState<Ad[]>([]);
  const location = useLocation();
  const { pathname } = location;
  const swiperRef = useRef<any>(null);
  const handleGetListAds = useCallback(async () => {
    const res = await getListAds();
    setAds(res);
  }, []);

  useEffect(() => {
    handleGetListAds();
  }, [handleGetListAds, pathname]);

  const {
    handlePlayOrPause,
    playingTrack,
    isPlaying: isPlayingTrack,
    handlePlayPause,
    isAudioPlay,
  } = usePlayers();

  const handleIncrementAdClickCount = idAds => {
    incrementAdClickCount(idAds);
  };

  const handleGetTrackBySlug = async (link: string) => {
    const baseUrls = [
      'https://app.crooklynclan.net/',
      'https://cc-fe-stg-c9a6bbef18cc.herokuapp.com/',
      'http://localhost:3000/',
    ];

    const encodedLink = encodeURI(link);
    const matchedBaseUrl = baseUrls.find(url => encodedLink.startsWith(url));

    if (!matchedBaseUrl) {
      throw new Error('Invalid URL');
    }

    const slug = link.replace(matchedBaseUrl, '').split('/')[1];
    const res = await getTrackBySlug(slug);
    const isPlaying = playingTrack?._id === res?._id;
    if (isPlaying && isPlayingTrack) {
      handlePlayPause(playingTrack);
    } else {
      if (isPlaying && isAudioPlay) {
        handlePlayPause(playingTrack);
      } else {
        handlePlayOrPause(res);
      }
    }
  };

  return (
    <Flex justifyContent="center" mb={ads.length > 0 ? '10px' : 0}>
      <Swiper
        ref={swiperRef}
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          // dynamicBullets: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        effect="fade"
        speed={1500}
        slidesPerView={1}
        className="mySwiper"
      >
        {ads.map(item => (
          <SwiperSlide key={item._id}>
            <Box
              onMouseEnter={() => swiperRef.current?.swiper.autoplay.stop()}
              onMouseLeave={() => swiperRef.current?.swiper.autoplay.start()}
            >
              <Image
                borderTopLeftRadius="5px"
                borderTopRightRadius="5px"
                cursor="pointer"
                w="100%"
                h="100%"
                maxH="180px"
                onClick={() => {
                  handleIncrementAdClickCount(item._id);
                  if (
                    item.page === 'tracks' &&
                    !/^(tracks|multipacks|contributors)\?/.test(item.link)
                  ) {
                    handleGetTrackBySlug(item.link);
                  } else {
                    window.open(item.link, '_blank');
                  }
                }}
                src={item.adsImageUrl}
              />
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>
    </Flex>
  );
});
