import { useColorMode } from '@chakra-ui/color-mode';
import { Box } from '@chakra-ui/layout';
import IconArrow from 'app/assets/svgs/IconArrow';
import IconArrowPrev from 'app/assets/svgs/IconArrowPrev';
import { FunctionComponent, ReactNode, useState } from 'react';
import Slider from 'react-slick';
import './SlickCommon.scss';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
interface SlickCommonProps {
  settings: any;
  children: ReactNode;
  isSlider?: boolean;
}

const SlickCommon: FunctionComponent<SlickCommonProps> = props => {
  const { settings, children, isSlider = true } = props;
  const [slider, setSlider] = useState<any>('');
  const { colorMode } = useColorMode();
  const handleClickNext = () => {
    if (isSlider) slider.slickNext();
  };
  const handleClickPrev = () => {
    if (isSlider) slider.slickPrev();
  };
  const rendernArrow = () => {
    return (
      <>
        <Box className="icon-arrow" onClick={handleClickNext}>
          <IconArrow color={colorMode === 'dark' ? 'white' : 'black'} />
        </Box>
        <Box className="icon-arrow icon-arrow-prev" onClick={handleClickPrev}>
          <IconArrowPrev color={colorMode === 'dark' ? 'white' : 'black'} />
        </Box>
      </>
    );
  };

  return (
    <Box>
      {rendernArrow()}
      <Slider
        id="slider"
        ref={c => setSlider(c)}
        {...settings}
        className={`slider-${colorMode}`}
      >
        {children}
      </Slider>
    </Box>
  );
};

export default SlickCommon;
