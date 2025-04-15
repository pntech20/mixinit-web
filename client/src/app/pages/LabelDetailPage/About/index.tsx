import { Box, Text } from '@chakra-ui/react';
import TopTracks from 'app/components/TopTracks';
import { memo } from 'react';

interface Props {
  labelDetail?: any;
}

export const AboutInLabel = memo(({ labelDetail }: Props) => {
  return (
    <Box>
      <Text fontSize="40px" fontWeight={700} lineHeight="60px">
        {labelDetail?.name}
      </Text>
      <Text fontSize="16px">{labelDetail?.biography}</Text>
      <Box mt="20px">
        {labelDetail?._id && <TopTracks labelId={labelDetail?._id} />}
      </Box>
    </Box>
  );
});
