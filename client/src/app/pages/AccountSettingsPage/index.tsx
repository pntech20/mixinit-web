import {
  Box,
  Button,
  Flex,
  Image,
  Spacer,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import EditProfile from 'app/components/EditProfile';
import { useProfile } from 'app/hooks/Profile/useProfile';
import { useMediaScreen } from 'app/hooks/mediaScreen/useMediaScreen';
import { useRef } from 'react';
import PlaceholderBgDefault from 'app/assets/placeholders/avatar.jpeg';
import OfficialContributor from 'app/assets/banners/official-contributor.jpg';
import { useSelector } from 'react-redux';
import { selectAuth } from '../Login/slice/selectors';
import { useTranslation } from 'react-i18next';
import './styles.scss';
import { Ads } from 'app/components/Ads';
import { BannerListLabel } from 'app/components/BannerListLabel';
import Crate from 'app/components/Crate';

interface Props {}

export function AccountSettingsPage(props: Props) {
  const fileInputRef = useRef<any>(null);
  const fileInputBgRef = useRef<any>(null);
  const { isLargerThan992, isLargerThan780 } = useMediaScreen();
  const refAvatar = useRef<any>(null);
  const replaceColor = useColorModeValue('#000', '#fff');
  const { userDetail } = useSelector(selectAuth);
  const { t } = useTranslation();

  const { fileChangeAvatar, isUploadAvatar, isUploadBg, fileChangeBg } =
    useProfile();
  return (
    <Box>
      <Box bg="#f3f3f3" mb="10px" pb="10px" borderRadius="5px">
        <Ads />
        <Flex
          w="100%"
          flexDirection={isLargerThan992 ? 'row' : 'column'}
          gridGap="15px"
        >
          <Box w={isLargerThan992 ? '50%' : '100%'}>
            <BannerListLabel />
          </Box>
          <Box w={isLargerThan992 ? '50%' : '100%'}>
            <Crate />
          </Box>
        </Flex>
      </Box>
      <>
        <Box>
          <Flex
            className="container-img"
            position="relative"
            mt={isLargerThan992 ? '0px' : isLargerThan780 ? '40px' : '0px'}
          >
            <Box
              position="relative"
              width="25%"
              height={`${refAvatar?.current?.offsetWidth / 4}px`}
            >
              <Image
                backgroundColor="#000"
                opacity={isUploadAvatar ? 0.2 : 1}
                className="img-avatar"
                src={userDetail?.avatar || PlaceholderBgDefault}
              />
              {!isUploadAvatar && (
                <Box
                  position="absolute"
                  bottom="5px"
                  right="5px"
                  cursor="pointer"
                  filter="invert(1)"
                >
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={event => fileChangeAvatar(event)}
                    hidden
                  />
                  {/* <AiFillCamera
                        fontSize="40px"
                        onClick={() => fileInputRef.current.click()}
                      /> */}
                </Box>
              )}
            </Box>

            <Flex
              flexDirection="column-reverse"
              width="75%"
              height={`${refAvatar?.current?.offsetWidth / 4}px`}
              bgPosition="center"
              bgRepeat="no-repeat"
              backgroundSize="100% 100%"
              backgroundImage={userDetail?.cover || OfficialContributor}
              opacity={isUploadBg ? 0.2 : 1}
            >
              {!isUploadBg && (
                <Box
                  position="absolute"
                  bottom="5px"
                  right="5px"
                  cursor="pointer"
                  filter="invert(1)"
                >
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputBgRef}
                    onChange={event => fileChangeBg(event)}
                    hidden
                  />
                </Box>
              )}
            </Flex>
          </Flex>
        </Box>
        <Box>
          <Flex>
            <Box fontSize="14px" mt={2}>
              <Button
                onClick={() => fileInputRef.current.click()}
                fontWeight="700"
                bg="none"
                h={0}
                _hover={{ bg: 'none' }}
                p={0}
                disabled={isUploadAvatar}
                color={replaceColor}
              >
                Replace Image
              </Button>
              <Flex>
                <Text fontWeight="500">{t('myRelease.addImageDes')}</Text>
                <Text as="span" color="red">
                  *
                </Text>
              </Flex>
            </Box>
            <Spacer />
            {/* <Box fontSize="14px" mt={2}>
                  <Button
                    onClick={() => fileInputBgRef.current.click()}
                    fontWeight="700"
                    bg="none"
                    h={0}
                    _hover={{ bg: 'none' }}
                    p={0}
                    textAlign="right"
                    opacity={isUploadBg ? 0.2 : 1}
                    color={replaceColor}
                  >
                    Replace Image
                  </Button>
                </Box> */}
          </Flex>
        </Box>
      </>
      <Box ref={refAvatar}></Box>
      <EditProfile />
    </Box>
  );
}
