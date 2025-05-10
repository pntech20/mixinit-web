import { Box, Flex, Image, Text } from '@chakra-ui/react';
import { Release } from 'app/models';
import { formatDate } from 'app/utils/date';
import { Link } from 'react-router-dom';
import './styles.scss';
import { formatMoney } from 'app/utils/currency';
import CartButton from '../CartButton';

interface ReleaseItemProps {
  release: Release;
  isChartsPage?: boolean;
  isHomePage?: boolean;
  updateWishlistStatusForTopRelease?: any;
}

const ReleaseItem = ({
  release,
  isChartsPage,
  updateWishlistStatusForTopRelease,
  isHomePage = false,
}: ReleaseItemProps) => {
  const { createdAt, artwork, user, title, trackByRelease, slug } = release;

  const { username, _id: userId, slug: userSlug } = user;

  return (
    <Box border="1px solid #dbdbdb" borderRadius="5px">
      <Box className="img-square-outer">
        <Box className="img-square-inner">
          <Link className="release-hover-text" to={`/multipacks/${slug}`}>
            <Box
              className="release-hover-title"
              fontSize="25px"
              fontWeight="700"
              lineHeight="30px"
            >
              {title}
            </Box>
            <Box
              mt="5px"
              fontSize="17px"
              fontWeight="600"
              color="white"
              cursor="pointer"
              lineHeight="22px"
            >
              {username}
            </Box>
          </Link>

          <Image className="artwork" alt="" src={artwork} />
          <Text className="release-date">{formatDate(createdAt)}</Text>
          <Link to={`/contributors/${userSlug}`}>
            <Text className="author-section">{username}</Text>
          </Link>
          <Link to={`/multipacks/${slug}`}>
            <Text className="tracks-section" cursor={'pointer'}>
              {trackByRelease || 0} Tracks
            </Text>
          </Link>

          <Box className="price-section" h="34px">
            {' '}
            {userId !== release?.userId ? (
              <Box w="100%" h="100%">
                <CartButton
                  isChartsPage={isChartsPage}
                  updateWishlistStatusForTopRelease={
                    updateWishlistStatusForTopRelease
                  }
                  isRelease
                  release={release}
                />
              </Box>
            ) : (
              <Text textAlign="end">{formatMoney(release.price)}</Text>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ReleaseItem;
