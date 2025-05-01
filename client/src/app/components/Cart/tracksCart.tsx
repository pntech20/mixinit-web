import { Box, Flex } from '@chakra-ui/react';
import { usePlayers } from 'app/hooks/player/usePlayers';
import { useWishlists } from 'app/hooks/wishlist/useWishlists';
import { useState } from 'react';
import { FaPauseCircle, FaPlayCircle } from 'react-icons/fa';
import { RiDeleteBin6Fill } from 'react-icons/ri';
import { useHistory } from 'react-router-dom';
import RenderAlertDialog from '../CartButton/RenderAlertDialog';
import Empty from '../Empty';
import styles from './cart.module.scss';
import { useMediaScreen } from 'app/hooks/mediaScreen/useMediaScreen';
import { formatMoney } from 'app/utils/currency';

interface Props {
  tracksCart?: any;
  setIsCart?: (e: boolean) => void;
  discountTrack?: number;
}

export function TracksCart({ tracksCart, setIsCart, discountTrack }: Props) {
  const { handleRemoveTrackToWishlist, onOpen, isOpen, onClose } =
    useWishlists();
  const history = useHistory();

  const [wish, setwish] = useState<any>();
  const [index, setIndex] = useState<number>();

  const handleDeleteTrack = (item: any) => {
    onOpen();
    setwish(item);
  };
  const isData = tracksCart.length > 0;

  const {
    isPlaying,
    handlePlayOrPause,
    handlePlayPause,
    playingTrack,
    isAudioPlay,
  } = usePlayers();

  const handlePlay = (track, i) => {
    const isOwnerTrack = playingTrack?._id === track._id;
    if (isOwnerTrack && isAudioPlay) {
      handlePlayPause(playingTrack);
    } else {
      handlePlayOrPause(track);
    }
    setIndex(i);
  };

  const handleOnclickTitle = item => {
    history.push({
      pathname: `/tracks/${item.track.slug}`,
      state: { isShowShareTrack: false },
    });
    setIsCart && setIsCart(false);
  };

  const { isLargerThan800 } = useMediaScreen();

  return (
    <Box py="10px" position="relative">
      {isData ? (
        <Box>
          <Box className={styles.tracksCart}>
            {tracksCart.map((item, i) => {
              const savePrice =
                Number(
                  (+item.track.price * Number(discountTrack)) / 100,
                ).toFixed(2) || 0;
              const finalPrice = +item.track.price - +savePrice;

              return (
                <Box key={i} px="10px">
                  <Flex
                    direction={isLargerThan800 ? 'row' : 'column'}
                    alignItems="center"
                    className={styles.itemCart}
                  >
                    <Flex
                      alignItems="center"
                      gridGap="5px"
                      mr="auto"
                      color="#fff"
                    >
                      <Box fontSize={'25px'} fontWeight={'bold'}>
                        #
                      </Box>
                      <Box
                        onClick={() => handlePlay(item.track, i)}
                        cursor="pointer"
                      >
                        {isPlaying && index === i ? (
                          <FaPauseCircle size={30} />
                        ) : (
                          <FaPlayCircle size={30} />
                        )}
                      </Box>
                      <Box
                        onClick={() => handleOnclickTitle(item)}
                        cursor="pointer"
                        _hover={{ color: '#0082F3' }}
                      >
                        <Box mr="auto" marginBottom={'5px'}>
                          {item.track.title}
                        </Box>
                        <Box fontWeight={400} mr="auto">
                          {item.track.artist}
                        </Box>
                      </Box>
                    </Flex>
                    <Flex
                      alignItems="center"
                      ml="auto"
                      mt={isLargerThan800 ? '0px' : '10px'}
                      gridGap="5px"
                      color="#fff"
                    >
                      {/* <Box minW="60px">{formatMoney(item.track.price)}</Box> */}
                      {Number(discountTrack) > 0 && (
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
                        onClick={() => handleDeleteTrack(item)}
                      >
                        <RiDeleteBin6Fill size={20} color="red" />
                      </Box>
                    </Flex>
                  </Flex>
                </Box>
              );
            })}
            <RenderAlertDialog
              onClick={() => handleRemoveTrackToWishlist([wish?.track._id])}
              isOpen={isOpen}
              onClose={onClose}
              title="REMOVE FROM CART?"
              content="Are you sure you want to remove this item from the cart?"
            />
          </Box>
        </Box>
      ) : (
        <Flex minH="200px" w="100%" alignItems="center" justifyContent="center">
          <Empty text="No Data" />
        </Flex>
      )}
    </Box>
  );
}
