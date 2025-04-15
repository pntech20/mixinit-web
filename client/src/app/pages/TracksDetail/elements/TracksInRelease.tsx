import { Box, SimpleGrid, Stack } from '@chakra-ui/react';
import Empty from 'app/components/Empty';
import ReleaseItem from 'app/components/ReleaseItem';
import SkeletonItem from 'app/components/SkeletonItem';
import { generateArray } from 'app/helpers/functions';
import { Release } from 'app/models';

interface TracksInReleaseProps {
  releases?: Release[];
}

export function TracksInRelease({ releases }: TracksInReleaseProps) {
  return (
    <Box mt="20px">
      {releases ? (
        releases.length > 0 ? (
          <Box>
            <Box mt="20px">
              <SimpleGrid
                p="5px"
                gridGap="10px"
                rowGap="15px"
                columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
              >
                {releases?.map((item, index) => (
                  <ReleaseItem release={item} key={index} />
                ))}
              </SimpleGrid>
            </Box>
          </Box>
        ) : (
          <Empty />
        )
      ) : (
        <Stack mt="20px">
          <SimpleGrid
            p="5px"
            gridGap="10px"
            rowGap="15px"
            columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
          >
            {generateArray(4).map(item => (
              <SkeletonItem borderRadius="10px" key={item} />
            ))}
          </SimpleGrid>
        </Stack>
      )}
    </Box>
  );
}
