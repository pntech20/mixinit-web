import { Box, Flex, Image, Text } from '@chakra-ui/react';
import { memo, useEffect } from 'react';
import { useSections } from 'app/hooks/sections/useSections';
import './styles.scss';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { Section } from 'app/models';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import logoV4 from 'app/assets/images/logo/v4.png';

export const BannerListLabel = memo(() => {
  const { getAllLabels, allLabels } = useSections();
  const history = useHistory();
  const location = useLocation();
  const { pathname } = location;
  const isMultipacksPage = pathname.includes('/multipacks');
  const { slug } = useParams<{ slug: string }>();

  useEffect(() => {
    getAllLabels();
  }, [getAllLabels]);

  const buildUrl = (label: Section, isMultipacksPage: boolean) => {
    if (isMultipacksPage) {
      return {
        pathname: `/multipacks`,
        search: `?labels=${JSON.stringify([
          {
            value: label?._id,
            label: label?.name,
          },
        ])}`,
      };
    }
    return `labels/${label?.slug}?tab=1`;
  };

  // const CustomPrevArrow = props => {
  //   const { className, onClick, style } = props;
  //   return (
  //     <Box
  //       as="button"
  //       className={className}
  //       onClick={onClick}
  //       style={{ ...style, display: 'block', left: '-25px' }}
  //     >
  //       <ChevronLeftIcon w={8} h={8} color="#000" />
  //     </Box>
  //   );
  // };

  // const CustomNextArrow = props => {
  //   const { className, onClick, style } = props;
  //   return (
  //     <Box
  //       as="button"
  //       className={className}
  //       onClick={onClick}
  //       style={{
  //         ...style,
  //         display: 'block',
  //         right: '-25px',
  //       }}
  //     >
  //       <ChevronRightIcon w={8} h={8} color="#000" />
  //     </Box>
  //   );
  // };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 7,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    prevArrow: '',
    nextArrow: '',
    responsive: [
      {
        breakpoint: 500,
        settings: {
          slidesToShow: 3,
        },
      },
    ],
  };

  const regex =
    /^(https:\/\/app\.crooklynclan\.net\/labels|http:\/\/localhost:3000\/labels|https:\/\/cc-fe-stg-c9a6bbef18cc\.herokuapp\.com\/labels)(\/[^/]+)?$/;

  return (
    <Box mb={{ base: '28px', md: '20px', xl: '20px' }}>
      <Flex
        h="50px"
        ml="10px"
        mb="5px"
        fontSize="16px"
        fontWeight={700}
        alignItems="center"
        backgroundImage="linear-gradient(90deg, #000 4%, #fff0 50%)"
      >
        <Image src={logoV4} alt="logo" h="40px" />

        <Text
          style={{ fontFamily: 'ArchivoBlack, sans-serif' }}
          color="#fff"
          fontWeight={700}
        >
          LABELS
        </Text>
      </Flex>
      <Slider {...settings}>
        {[...allLabels, ...allLabels]?.map((label: Section) => (
          <Box key={label?._id} pr="7px" pl="7px">
            <Image
              w="75px"
              h="75px"
              className="label-item"
              onClick={() => {
                const fullUrl = window.location.href;
                history.push(
                  pathname.includes('/contributors') &&
                    fullUrl.split('contributors/')?.[1] !== '' &&
                    slug
                    ? `/contributors/${slug}?tab=1&label=${label?.slug}`
                    : !regex.test(fullUrl)
                    ? buildUrl(label, isMultipacksPage)
                    : `/labels/${label?.slug}?tab=1`,
                );
              }}
              src={label?.squareImageUrl}
            />
          </Box>
        ))}
      </Slider>
    </Box>
  );
});
