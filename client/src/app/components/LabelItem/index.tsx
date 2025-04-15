import { Box, Flex, Img, Text } from '@chakra-ui/react';
import logoIconLight from 'app/assets/logo/crooklyn-clan-logo-refresh-black.svg';
import logoIconBlack from 'app/assets/logo/crooklyn-clan-logo-refresh.png';
import { Section } from 'app/models';
import { formatDate } from 'app/utils/date';
import { useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import styles from './labelItem.module.scss';
import { useModeTheme } from 'app/hooks/ColorDarkMode/useModeTheme';
import queryString from 'query-string';

interface LabelItemProps {
  width?: string;
  label: Section;
  isShowNumberContributor?: boolean;
}

const LabelItem = ({
  label,
  width = '100%',
  isShowNumberContributor = true,
}: LabelItemProps) => {
  const { isLightMode } = useModeTheme();

  const {
    numberTracks,
    numberContributors,
    squareImageUrl,
    name,
    numberReleases,
    numberReleasesOfContributor,
    numberTracksOfContributor,
    lastUploadTrack,
  } = label;
  const { search, pathname } = useLocation();
  const query = queryString.parse(search);

  const history = useHistory();
  const [, , slug] = pathname?.split('/');

  const handleClickLabelItem = useCallback(
    () =>
      !slug
        ? history.push(`/labels/${label?.slug}?tab=1`)
        : history.push({
            pathname: `/contributors/${slug}`,
            search: `?tab=${1}&&labelId=${label?.slug}`,
            state: {
              labelId: label?._id,
            },
          }),
    [history, label?._id, label?.slug, slug],
  );

  return (
    <Box border="1px solid #dfdfdf" borderRadius="5px">
      <Box
        className={styles.labelItem}
        backgroundSize="100% 100%"
        width={width}
        justifyContent="space-between"
        flexDirection="column"
        onClick={handleClickLabelItem}
        position="relative"
      >
        <Img
          className={styles.img}
          src={
            squareImageUrl
              ? squareImageUrl
              : isLightMode
              ? logoIconLight
              : logoIconBlack
          }
          borderTopRadius="5px"
        />
      </Box>
      <Box p="7px">
        <Text
          fontWeight="700"
          lineHeight="18px"
          textAlign="center"
          fontSize="16px"
          mb="10px"
          cursor="pointer"
          onClick={handleClickLabelItem}
        >
          {name}
        </Text>
        {lastUploadTrack && (
          <Flex justify="space-between" className={styles.labelItemText}>
            Last Upload:
            <Text fontWeight={600}>{formatDate(lastUploadTrack)}</Text>
          </Flex>
        )}
        <Flex justify="space-between" className={styles.labelItemText}>
          Tracks:
          <Text fontWeight={600}>
            {Number(query?.tab) === 3
              ? numberTracksOfContributor
              : numberTracks ?? 0}{' '}
          </Text>
        </Flex>
        <Flex justify="space-between" className={styles.labelItemText}>
          Multipacks:
          <Text fontWeight={600}>
            {Number(query?.tab) === 3
              ? numberReleasesOfContributor
              : numberReleases ?? 0}
          </Text>
        </Flex>
        {isShowNumberContributor && (
          <Flex justify="space-between" className={styles.labelItemText}>
            Contributors:
            <Text fontWeight={600}>{numberContributors ?? 0}</Text>
          </Flex>
        )}
      </Box>
    </Box>
  );
};

export default LabelItem;
