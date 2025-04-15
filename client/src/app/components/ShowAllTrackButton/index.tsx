import { Box, Flex } from '@chakra-ui/react';
import { useModeTheme } from 'app/hooks/ColorDarkMode/useModeTheme';
import { useMediaScreen } from 'app/hooks/mediaScreen/useMediaScreen';
import { BsFillEyeSlashFill } from 'react-icons/bs';
import { IoEyeSharp } from 'react-icons/io5';

interface ShowAllTrackButtonProps {
  itemsRef: any;
  isShowAllTracks: any;
  handleShowAllTrack: any;
}

export default function ShowAllTrackButton(props: ShowAllTrackButtonProps) {
  const { itemsRef, isShowAllTracks, handleShowAllTrack } = props;
  const { isLargerThan780, isLargerThan1440, isLargerThan860 } =
    useMediaScreen();
  const { isLightMode } = useModeTheme();

  return (
    <Box
      cursor="pointer"
      position="fixed"
      top={!isLargerThan780 ? '20px!important' : '80px'}
      zIndex="100"
      className="iconEye"
      w="100%"
    >
      <Flex
        w="100%"
        maxW="1440px"
        h="0px"
        bg="red"
        justifyContent={isLargerThan780 ? 'end' : 'start'}
      >
        <Box
          onClick={() => handleShowAllTrack(itemsRef)}
          width="20px"
          mr={isLargerThan1440 ? '0px' : isLargerThan860 ? '40px' : '25px'}
          ml={isLargerThan780 ? '0px' : '153px'}
        >
          {isShowAllTracks ? (
            <BsFillEyeSlashFill
              fontSize="20px"
              color={!isLargerThan780 ? '#000' : '#FFF'}
            />
          ) : (
            <IoEyeSharp
              fontSize="20px"
              className={isLightMode ? 'iconEyeInside' : ''}
              color={!isLargerThan780 && isLightMode ? '#000' : '#FFF'}
            />
          )}
        </Box>
      </Flex>
    </Box>
  );
}
