import { Box, Flex } from '@chakra-ui/react';
import styles from './cart.module.scss';
import { useModeTheme } from 'app/hooks/ColorDarkMode/useModeTheme';
import { useMediaScreen } from 'app/hooks/mediaScreen/useMediaScreen';

interface Props {
  tracksCart?: any;
  releasesCart?: any;
  discountTrack?: number;
  discountRelease?: number;
  title?: string;
  text?: string;
  isReleases?: boolean;
  isTracks?: boolean;
}

export default function Total({
  tracksCart,
  releasesCart,
  discountTrack = 0,
  discountRelease = 0,
  title,
  text,
  isReleases = false,
  isTracks = false,
}: Props) {
  const { isLightMode } = useModeTheme();
  let totalPrice = 0;
  for (let i = 0; i < (tracksCart || releasesCart).length; i++) {
    totalPrice += !isReleases
      ? tracksCart[i].track.price
      : releasesCart[i].release.price;
  }
  const totalPriceAfterFee = totalPrice;
  const totalPriceAfterDiscount =
    totalPriceAfterFee *
    (1 - +(!isReleases ? discountTrack : discountRelease) / 100);
  const totalSave = totalPrice - totalPriceAfterDiscount;

  const { isLargerThan800, isLargerThan500 } = useMediaScreen();

  return (
    <Box
      direction="row"
      className={styles.content}
      display={
        (tracksCart || releasesCart).length > 0
          ? isLargerThan800
            ? 'flex'
            : 'block'
          : 'none'
      }
      bg={isLightMode ? '#fff' : '#5A5A5A'}
    >
      <Flex
        gridGap="10px"
        alignItems={isLargerThan500 ? 'center' : 'end'}
        w="100%"
        direction={isLargerThan500 ? 'row' : 'column'}
      >
        <Box minW="160px" textAlign={isLargerThan500 ? 'left' : 'right'}>
          {title}: {(tracksCart || releasesCart).length || 0}
        </Box>
        {((isReleases && discountRelease !== 0) ||
          (!isReleases && discountTrack !== 0)) && (
          <Box color="#008820" ml={isLargerThan800 ? '0px' : 'auto'}>
            {!isReleases ? discountTrack : discountRelease}% DISCOUNT APPLIED
          </Box>
        )}
      </Flex>
      <Flex
        gridGap="10px"
        alignItems={isLargerThan500 ? 'center' : 'end'}
        ml="auto"
        mt={isLargerThan800 ? '0px' : '10px'}
        direction={isLargerThan500 ? 'row' : 'column'}
      >
        <Box
          minW={isTracks ? '170px' : '125px'}
          textAlign={isLargerThan500 ? 'left' : 'right'}
        >
          {text}: ${totalPrice.toFixed(2)}
        </Box>
        <Box
          minW="105px"
          color="#008820"
          ml={isLargerThan800 ? '0px' : 'auto'}
          textAlign={isLargerThan500 ? 'left' : 'right'}
        >
          SAVE ${totalSave.toFixed(2)}
        </Box>
        <Box
          minWidth="125px"
          color="#008820"
          textAlign={isLargerThan500 ? 'left' : 'right'}
          whiteSpace="nowrap"
        >
          YOU PAY: ${totalPriceAfterDiscount.toFixed(2)}
        </Box>
      </Flex>
    </Box>
  );
}
