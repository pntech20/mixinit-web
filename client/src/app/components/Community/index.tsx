import { Box, Flex, Image, Text, Tooltip } from '@chakra-ui/react';
import PlaceholderBgDefault from 'app/assets/placeholders/avatar.jpeg';
import { User } from 'app/models';
import { Link } from 'react-router-dom';
import styles from './community.module.scss';
import { formatDate } from 'app/utils/date';

interface CommunityItemProps {
  user: User;
  labelId?: string;
}

const CommunityItem = ({ user, labelId }: CommunityItemProps) => {
  const { username, avatar, slug } = user;

  return (
    <Box textAlign={'center'}>
      <Link to={`/contributors/${slug}`}>
        <Box className={styles.contributorItem}>
          <Image
            src={avatar || PlaceholderBgDefault}
            fallbacksrc={PlaceholderBgDefault}
            height="276px"
            width="100%"
            objectFit="cover"
            borderRadius={'9px'}
          />
        </Box>
        <Text
          fontSize={'20px'}
          fontWeight={'bold'}
          color={'white'}
          marginTop={'10px'}
          marginBottom={'20px'}
        >
          {username}
        </Text>
      </Link>
    </Box>
  );
};

export default CommunityItem;
