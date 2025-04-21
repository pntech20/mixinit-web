import { Box, Image, Text } from '@chakra-ui/react';
import { Release } from 'app/models';
import { formatDate } from 'app/utils/date';
import { Link } from 'react-router-dom';
import './styles.scss';
import { formatMoney } from 'app/utils/currency';

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

  const { username } = user;

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
          <Text className="author-section">{username}</Text>
          <Text className="tracks-section">{trackByRelease || 0} Tracks</Text>
          <Text className="price-section">{formatMoney(release.price)}</Text>
        </Box>
      </Box>
      {/* {!isHomePage && (
        <Box>
          <Flex className="release-date">
            <Text>Release Date:</Text>
            <Text>{formatDate(createdAt)}</Text>
          </Flex>
          <Flex
            className="author-section"
            alignItems="center"
            alignContent="center"
          >
            <Box className="avatar">
              {avatar ? (
                <Image
                  width="100%"
                  height="100%"
                  src={avatar}
                  borderRadius="100%"
                />
              ) : (
                <FaUser fontSize={20} />
              )}
            </Box>
            <Text
              className="author"
              cursor="pointer"
              onClick={() => {
                if (user?.role !== Role.ADMIN) {
                  history.push(`/contributors/${slugUser}`);
                }
              }}
            >
              {username}
            </Text>
          </Flex>
          <Text
            cursor="pointer"
            onClick={() => {
              history.push(`/multipacks/${slug}`);
            }}
            className="title"
            h="60px"
          >
            {title}
          </Text>

          <Flex
            bg="#e20000"
            fontSize="12px"
            fontWeight={700}
            color="#fff"
            justifyContent="space-between"
            w="100%"
            h="30px"
          >
            <Flex
              justifyContent="center"
              alignItems="center"
              w="33%"
              h="100%"
              borderRight="1px solid #fff"
            >
              RETAIL
            </Flex>
            <Flex
              justifyContent="center"
              alignItems="center"
              w="33%"
              h="100%"
              borderRight="1px solid #fff"
            >
              TRACKS
            </Flex>
            <Flex justifyContent="center" alignItems="center" w="33%" h="100%">
              SALE
            </Flex>
          </Flex>
          <Flex
            fontSize="12px"
            fontWeight={700}
            justifyContent="space-between"
            w="100%"
            h="30px"
          >
            <Flex
              justifyContent="center"
              alignItems="center"
              w="33%"
              h="100%"
              fontSize="12px"
              fontWeight={700}
              textDecoration="line-through double #e90000"
            >
              {formatMoney(release?.savePrice)}
            </Flex>
            <Flex
              justifyContent="center"
              alignItems="center"
              w="33%"
              h="100%"
              fontSize="12px"
              fontWeight={700}
            >
              {trackByRelease || 0}
            </Flex>
            <Flex justifyContent="center" alignItems="center" w="33%" h="100%">
              <Box className="cart">
                {userId !== release?.userId ? (
                  <Flex
                    justifyContent="center"
                    alignItems="center"
                    h="30px"
                    flex={1}
                  >
                    <CartButton
                      isChartsPage={isChartsPage}
                      updateWishlistStatusForTopRelease={
                        updateWishlistStatusForTopRelease
                      }
                      isRelease
                      release={release}
                    />
                  </Flex>
                ) : (
                  <Flex
                    justifyContent="center"
                    alignItems="center"
                    h="30px"
                    flex={1}
                    color={!isDarkMode ? '#000' : '#fff'}
                  >
                    <Text fontSize="12px" fontWeight={700} textAlign="end">
                      {formatMoney(release.price)}
                    </Text>
                  </Flex>
                )}
              </Box>
            </Flex>
          </Flex>
        </Box>
      )} */}
    </Box>
  );
};

export default ReleaseItem;
