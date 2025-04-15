import {
  Flex,
  Image,
  Text,
  Tooltip,
  useColorModeValue,
} from '@chakra-ui/react';
import personal from 'app/assets/images/background/avatar-user.png';
import { User } from 'app/models';
import { Link, useHistory, useLocation } from 'react-router-dom';
import styles from './contributor.module.scss';
import AvatarDefault from 'app/assets/images/banner/avatar-default.png';
import { Dispatch, SetStateAction, useCallback } from 'react';
import { useModeTheme } from 'app/hooks/ColorDarkMode/useModeTheme';
import { useMediaScreen } from 'app/hooks/mediaScreen/useMediaScreen';
import PlaceholderBgDefault from 'app/assets/placeholders/avatar.jpeg';

interface Top10ItemProps {
  user: User;
  index: number;
  handleChangeFilter?: (event, key, type) => void;
  labelDetail?: any;
  setTabIndex?: Dispatch<SetStateAction<number>>;
  setIsShowFilterTrack?: Dispatch<SetStateAction<boolean>>;
}

const Top10ContributorItem = ({
  user,
  index = 1,
  handleChangeFilter,
  labelDetail,
  setTabIndex,
  setIsShowFilterTrack,
}: Top10ItemProps) => {
  const history = useHistory();
  const { username, avatar = personal, slug, _id } = user;
  const { pathname, search } = useLocation();
  const isLabel = pathname.includes('/labels');
  const { isLightMode } = useModeTheme();
  const { isLargerThan860, isLargerThan600 } = useMediaScreen();

  const setFilterImage = useCallback(() => {
    if (avatar) {
      return 'unset';
    } else {
      if (!isLightMode) {
        return 'invert(1)';
      } else {
        return 'unset';
      }
    }
  }, [avatar, isLightMode]);

  const borderBottomColor = useColorModeValue('#dfdfdf', '#9c9393');

  const handleLabelNavigation = () => {
    const queryParams = new URLSearchParams(search);
    const currentTab = queryParams.get('tab');

    if (setTabIndex) {
      setTabIndex(1);
    }

    if (currentTab !== '1') {
      history.push({
        pathname: `/labels/${labelDetail?.slug}`,
        search: `?tab=1`,
      });
    }
  };

  const handleItemClick = () => {
    if (!isLabel) {
      history.push(`/contributors/${slug}`);
      return;
    }
    if (handleChangeFilter && setIsShowFilterTrack) {
      handleChangeFilter(
        [{ label: username, value: _id }],
        'showContributors',
        'dropdown',
      );
      setIsShowFilterTrack(true);
      handleLabelNavigation();
    }
  };

  return (
    <Flex
      bg={useColorModeValue('#f5f5f5', '')}
      className={styles.topItemChild}
      h="45px"
      alignItems="center"
      padding="10px"
      borderBottom="0.2px solid"
      borderBottomColor={borderBottomColor}
    >
      <Text fontWeight="bold" fontSize="12px" width="18px" textAlign="center">
        {index}
      </Text>
      {!isLabel ? (
        <Link to={`/contributors/${slug}`}>
          <Image
            filter={setFilterImage()}
            objectFit="cover"
            width="20px"
            height="20px"
            src={avatar || PlaceholderBgDefault}
            ml="5px"
            backgroundColor="#000"
            fallbacksrc={AvatarDefault}
          />
        </Link>
      ) : (
        <Image
          filter={setFilterImage()}
          objectFit="cover"
          width="20px"
          height="20px"
          src={avatar || PlaceholderBgDefault}
          ml="5px"
          backgroundColor="#000"
          fallbacksrc={AvatarDefault}
        />
      )}
      <Tooltip hasArrow label={username} aria-label="A tooltip">
        <Text
          cursor="pointer"
          onClick={handleItemClick}
          textColor={useColorModeValue('#333333', '#ffffff')}
          w={isLargerThan860 ? '156px' : isLargerThan600 ? '108px' : '250px'}
          className={styles.userName}
        >
          {username}
        </Text>
      </Tooltip>
    </Flex>
  );
};

export default Top10ContributorItem;
