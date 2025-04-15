import { Box, Flex, Image, Text } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import PlaceholderBgDefault from 'app/assets/placeholders/avatar.jpeg';

export default function LabelInfo({ item, fontMobile = 'Rubik80sFade' }) {
  const history = useHistory();
  return (
    <Flex alignItems="center">
      <Image
        src={item?.squareImageUrl || item?.avatar || PlaceholderBgDefault}
        h="80px"
        w="80px"
        borderRadius="5px"
        mr="5px"
        onClick={() => history.push(`/labels/${item?.slug}`)}
        cursor="pointer"
      />
      <Box>
        <Text
          fontFamily={{ base: fontMobile, md: 'Rubik80sFade' }}
          fontSize={{ base: '20px', sm: '25px', md: '30px' }}
          fontWeight={800}
          lineHeight={{ base: '24px', sm: '31px', md: '36px' }}
          onClick={() => history.push(`/labels/${item?.slug}`)}
          cursor="pointer"
        >
          {item?.name || item?.username}
        </Text>
        <Flex gridGap={{ base: '4px', md: '12px' }}>
          <Text
            fontSize={{ base: '10px', sm: '12px' }}
            fontWeight={600}
            lineHeight="12px"
          >
            TRACKS: {item?.numberTracks ?? item?.totalTracks}
          </Text>
          <Text
            fontSize={{ base: '10px', sm: '12px' }}
            fontWeight={600}
            lineHeight="12px"
          >
            MULTIPACKS: {item?.numberReleases ?? item?.totalReleases}
          </Text>
        </Flex>
      </Box>
    </Flex>
  );
}
