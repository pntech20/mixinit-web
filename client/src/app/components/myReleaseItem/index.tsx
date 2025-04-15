import { Box, Flex, Image, Text, Tooltip } from '@chakra-ui/react';
import PlaceholderBgDefault from 'app/assets/placeholders/track-placeholder.svg';
import { Release } from 'app/models';
import { useCallback } from 'react';
import { FaEdit } from 'react-icons/fa';
import { Link, useHistory } from 'react-router-dom';
import { formatDate } from 'utils/date';
import styles from './index.module.scss';
import { useDispatch } from 'react-redux';
import { useReleasesSlice } from 'app/pages/Releases/slice';
import { MdDelete } from 'react-icons/md';

interface MyReleaseItemProps {
  release: Release;
  handleSetLabelId?: any;
  handleDeleteRelease?: any;
  isShowTooltip?: boolean;
}

const MyReleaseItem = ({
  release,
  handleSetLabelId,
  handleDeleteRelease,
  isShowTooltip,
}: MyReleaseItemProps) => {
  const { createdAt, artwork, title, trackByRelease, slug } = release;
  const dispatch = useDispatch();
  const history = useHistory();
  const { actions } = useReleasesSlice();

  const renderReleases = useCallback(() => {
    return (
      <Flex className={styles.releaseItem}>
        <Flex gridGap="5px">
          <Link to={`/multipacks/${slug}`}>
            <Image
              className={styles.avatar}
              src={artwork ?? PlaceholderBgDefault}
            />
          </Link>
          <Box display="grid" alignItems="center" p="4px 0px">
            <Text className={styles.createdRelease}>
              {formatDate(createdAt)}
            </Text>
            {title &&
              (isShowTooltip ? (
                <Tooltip label={title}>
                  <Link to={`/multipacks/${slug}`}>
                    <Text className={styles.titleRelease}>{title}</Text>
                  </Link>
                </Tooltip>
              ) : (
                <Link to={`/multipacks/${slug}`}>
                  <Text className={styles.titleRelease}>{title}</Text>
                </Link>
              ))}
            <Text className={styles.trackByRelease}>
              {trackByRelease} Tracks
            </Text>
          </Box>
        </Flex>
        <Flex alignItems="center" gridGap="5px">
          <Box pt="2px">
            <MdDelete
              cursor="pointer"
              fontSize="20px"
              onClick={() => handleDeleteRelease(release._id)}
            />
          </Box>

          <FaEdit
            onClick={() => {
              history.push({
                state: { release: release },
              });

              dispatch(actions.setIsStateRelease(true));
              handleSetLabelId(release?.label);
            }}
            cursor="pointer"
            fontSize="20px"
          />
        </Flex>
      </Flex>
    );
  }, [
    slug,
    artwork,
    createdAt,
    title,
    isShowTooltip,
    trackByRelease,
    handleDeleteRelease,
    release,
    history,
    dispatch,
    actions,
    handleSetLabelId,
  ]);

  return <Box>{renderReleases()}</Box>;
};

export default MyReleaseItem;
