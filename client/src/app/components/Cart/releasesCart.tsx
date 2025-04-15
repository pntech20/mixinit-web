import { Box, Flex } from '@chakra-ui/react';
import styles from './cart.module.scss';
import { RiDeleteBin6Fill } from 'react-icons/ri';
import { useWishlists } from 'app/hooks/wishlist/useWishlists';
import RenderAlertDialog from '../CartButton/RenderAlertDialog';
import { useState } from 'react';
import Empty from '../Empty';
import { Link } from 'react-router-dom';
import { useMediaScreen } from 'app/hooks/mediaScreen/useMediaScreen';
import { formatMoney } from 'app/utils/currency';

interface Props {
  releasesCart?: any;
  setIsCart?: (e: boolean) => void;
  discountRelease?: number;
}

export function ReleasesCart({
  releasesCart,
  setIsCart,
  discountRelease,
}: Props) {
  const { onOpen, isOpen, onClose, handleRemoveReleaseToMyWishlist } =
    useWishlists();
  const [release, setRelease] = useState<any>();

  const handleDeleteRelease = (item: any) => {
    onOpen();
    setRelease(item);
  };
  const isData = releasesCart.length > 0;
  const { isLargerThan800 } = useMediaScreen();

  return isData ? (
    <Box className={styles.releasesCart} py="10px">
      {releasesCart.map((item, i) => {
        const savePrice =
          Number((+item.release.price * Number(discountRelease)) / 100).toFixed(
            2,
          ) || 0;
        const finalPrice = +item.release.price - +savePrice;
        return (
          <Box key={i} px="10px">
            <Flex
              direction={isLargerThan800 ? 'row' : 'column'}
              alignItems="center"
              className={styles.itemCart}
              color="#fff"
            >
              <Flex mr="auto" alignItems="center" gridGap="5px">
                <Box minW="25px">{i + 1}.</Box>
                <img
                  src={item.release.artwork}
                  alt=""
                  width={50}
                  height={50}
                  style={{ borderRadius: '10px' }}
                />
                <Box>
                  <Link
                    onClick={() => setIsCart && setIsCart(false)}
                    to={`/multipacks/${item.release.slug}`}
                  >
                    <Box>{item.release.title}</Box>
                  </Link>
                  <Box fontSize={12}>{item.release.trackByRelease} Tracks</Box>
                </Box>
              </Flex>
              <Flex
                alignItems="center"
                gridGap="5px"
                ml={isLargerThan800 ? '0px' : 'auto'}
                mt={isLargerThan800 ? '0px' : '10px'}
                color="#fff"
              >
                <Box minW="60px">{formatMoney(item.release.price)}</Box>
                {Number(discountRelease) > 0 && (
                  <>
                    <Box minW="90px" color="#008820">
                      SAVE {formatMoney(+savePrice)}
                    </Box>
                    <Box mx="10px" minW="60px">
                      {formatMoney(finalPrice)}
                    </Box>
                  </>
                )}
                <Box
                  _hover={{ cursor: 'pointer' }}
                  onClick={() => handleDeleteRelease(item.release)}
                >
                  <RiDeleteBin6Fill size={20} color="red" />
                </Box>
              </Flex>
            </Flex>
          </Box>
        );
      })}
      <RenderAlertDialog
        onClick={() => handleRemoveReleaseToMyWishlist([release._id])}
        isOpen={isOpen}
        onClose={onClose}
        title="REMOVE FROM CART?"
        content="Are you sure you want to remove this item from the cart?"
      />
    </Box>
  ) : (
    <Flex
      minH="200px"
      w="100%"
      alignItems="center"
      justifyContent="center"
      py="10px"
    >
      <Empty text="No Data" />
    </Flex>
  );
}
