import { Box, Image } from '@chakra-ui/react';
import { memo } from 'react';
import ImageBanner from 'app/assets/banners/official-banner.jpeg';

export const Banner = memo(() => {
  return (
    <Box mb="20px">
      <Image borderRadius="8px" alt="banner" src={ImageBanner} />
    </Box>
  );
});
