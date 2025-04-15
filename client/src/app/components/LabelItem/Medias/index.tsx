import { Box, Center, Flex } from '@chakra-ui/react';
import { Media } from 'app/constants/interface';
import TagButton from '../../TagButton';

interface MediaProps {
  medias?: Array<Media>;
}

const Medias = ({ medias = [] }: MediaProps) => {
  return (
    <Box mt="-60px">
      <Center>
        {medias.map((item, index) => {
          return (
            <Flex key={index} p="5px">
              <TagButton key={index} content={item.content} icon={item.icon} />
            </Flex>
          );
        })}
      </Center>
    </Box>
  );
};

export default Medias;
