import { Box, Text } from '@chakra-ui/react';
import { useModeTheme } from 'app/hooks/ColorDarkMode/useModeTheme';

export const BannerTopTrack = ({ text, title = ' TOP 20 TRACKS' }: any) => {
  const { isLightMode } = useModeTheme();

  return (
    <Box
      mb="10px"
      borderRadius="5px"
      bg={isLightMode ? '#f8f8f8' : 'none'}
      p="10px"
    >
      <Text fontSize={30} lineHeight="25px" fontFamily="RubikDoodleShadow">
        {title}
      </Text>
      <Text fontSize={20} lineHeight="25px" fontWeight={700} mb="20px">
        {text}
      </Text>
    </Box>
  );
};
