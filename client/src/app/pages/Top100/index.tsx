import { Box, Flex, Image, Text } from '@chakra-ui/react';
import logoIconBlack from 'app/assets/logo/MIXINIT2.png';
import ReleaseList from 'app/components/ReleaseList';
import { useReleases } from 'app/hooks/releases/useReleases';

export function Top100Page() {
  const { releases = [] } = useReleases();

  return (
    <Box position="relative">
      <Flex alignItems="center" paddingBottom={'20px'}>
        <Image
          h="250px"
          color="#747474"
          src={logoIconBlack}
          ml="16px"
          borderRight="5px solid #6f747d"
          padding={'10px'}
          marginRight={'10px'}
        />
        <Box>
          <Text
            color="white"
            fontSize={'38px'}
            fontWeight={'bold'}
            textTransform={'uppercase'}
          >
            TOP 100
          </Text>
          <Text color="white" fontSize={'18px'} fontWeight={'600'}>
            Our user experience has changed. Please explore the all-new
            Mixinit2.0 and enjoy the DJ tools!
          </Text>
        </Box>
      </Flex>
      <ReleaseList releases={releases} isTop100 />
    </Box>
  );
}
