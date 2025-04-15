import { Box, Flex, Text } from '@chakra-ui/react';
import { useUserDetail } from 'app/hooks/Community/userInfo';
import { useTranslation } from 'react-i18next';
import { MdMusicNote } from 'react-icons/md';
import { RiFileMusicFill, RiFolderMusicFill } from 'react-icons/ri';
import TagButton from '../TagButton';
import styles from './myProfileBio.module.scss';

const MyProfileBio = () => {
  const { t } = useTranslation();

  const { userDetails } = useUserDetail();

  const renderTags = (data: any = []) => {
    return data.map(item => <TagButton key={item._id} content={item.name} />);
  };

  return (
    <Box className={styles.bioContainer}>
      <Flex justifyContent={{ base: 'center', sm: 'flex-start' }}>
        <Box mr="20px" className={styles.totalItem}>
          <MdMusicNote size={22} color="#ED7358" />
          <Text fontSize="12px" fontWeight="600">
            {t('bio.tracks')} {userDetails?.totalTracks || 0}
          </Text>
        </Box>

        <Box mr="20px" className={styles.totalItem}>
          <RiFileMusicFill size={22} color="#ED7358" />
          <Text fontSize="12px" fontWeight="600">
            {t('bio.release')} {userDetails?.totalReleases || 0}
          </Text>
        </Box>

        <Box className={styles.totalItem}>
          <RiFolderMusicFill size={22} color="#ED7358" />
          <Text fontSize="12px" fontWeight="600">
            {t('bio.playlist')} {userDetails?.totalPlaylists || 0}
          </Text>
        </Box>
      </Flex>

      <Flex mt="20px" alignItems="center">
        <Text mr="70px" fontSize="14px">
          {t('bio.country')}
        </Text>
        <Text fontSize="16px" fontWeight="600">
          {userDetails?.country}
        </Text>
      </Flex>
      <Box mt="20px">
        <Text fontSize="14px" textDecoration="underline" fontWeight="600">
          {t('bio.label')}
        </Text>
        {renderTags(userDetails?.label)}
      </Box>
      <Box mt="20px">
        <Text fontSize="14px" textDecoration="underline" fontWeight="600">
          {t('bio.genre')}
        </Text>
        {renderTags(userDetails?.genres)}
      </Box>
      <Box mt="20px">
        <Text fontSize="14px" textDecoration="underline" fontWeight="600">
          {t('bio.tag')}
        </Text>
        {renderTags(userDetails?.tag)}
      </Box>
      <Text mt="20px" fontSize="14px">
        {userDetails?.biography}
      </Text>
    </Box>
  );
};

export default MyProfileBio;
