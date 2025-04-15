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
  const {
    username,
    avatar,
    slug,
    canUploadToLabels,
    lastUploadEachLabel,
    totalTracksOrReleasesEachLabel,
  } = user;

  const totalTracks = (totalTracksOrReleasesEachLabel || []).find(
    item => item?.labelId === labelId,
  )?.totalTracks;

  const totalReleases = (totalTracksOrReleasesEachLabel || []).find(
    item => item?.labelId === labelId,
  )?.totalReleases;

  const lastUploadTrack = (lastUploadEachLabel || []).find(
    item => item?.labelId === labelId,
  )?.lastUploadTrack;

  const newCanUploadToLabels = canUploadToLabels.filter(item => item?.isActive);

  return (
    <Box className={styles.contributorItem}>
      <Link to={`/contributors/${slug}`}>
        <Image
          src={avatar || PlaceholderBgDefault}
          fallbacksrc={PlaceholderBgDefault}
          height="276px"
          width="100%"
          objectFit="cover"
        />
        <Box className={styles.contributorName}>{username}</Box>
      </Link>
      <Box w="100%" padding="10px" fontSize="12px">
        {lastUploadTrack && (
          <Flex
            justifyContent="space-between"
            alignItems="center"
            lineHeight="22px"
          >
            <Text>Last Upload:</Text>
            <Text fontWeight="600">{formatDate(lastUploadTrack)}</Text>
          </Flex>
        )}
        <Flex
          justifyContent="space-between"
          alignItems="center"
          lineHeight="22px"
        >
          <Text>Total Tracks:</Text>
          <Text fontWeight="600">{totalTracks}</Text>
        </Flex>
        <Flex
          justifyContent="space-between"
          alignItems="center"
          lineHeight="22px"
        >
          <Text>Total Multipacks:</Text>
          <Text fontWeight="600">{totalReleases}</Text>
        </Flex>
        <Flex
          justifyContent="space-between"
          alignItems="center"
          lineHeight="22px"
        >
          <Text>Labels:</Text>
          <Tooltip
            label={
              <Box>
                {newCanUploadToLabels.map((item, idx) => (
                  <Text key={idx}>{item?.name}</Text>
                ))}
              </Box>
            }
          >
            <Text fontWeight="600">{newCanUploadToLabels.length || 0}</Text>
          </Tooltip>
        </Flex>
      </Box>
    </Box>
  );
};

export default CommunityItem;
