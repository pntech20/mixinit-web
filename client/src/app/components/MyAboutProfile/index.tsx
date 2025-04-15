import { Box, Flex, Image, Text, useColorModeValue } from '@chakra-ui/react';
import { useMemo } from 'react';
import './styles.scss';
import FBIcon from 'app/assets/icons/fb-icon.png';
import InstagramIcon from 'app/assets/icons/instagram-icon.png';
import TwitterIcon from 'app/assets/icons/twitter-icon.png';
import SoundCloudIcon from 'app/assets/icons/sound-cloud-icon.png';
import YoutubeIcon from 'app/assets/icons/youtube-icon.png';
import MixCloudIcon from 'app/assets/icons/link-url-icon.png';
import MixIcon from 'app/assets/icons/mix-icon.svg';
import GoogleIcon from 'app/assets/icons/google-icon.svg';
import TopTracks from '../TopTracks';

export function AboutProfile({ userDetails }: any) {
  const listSocial = useMemo(() => {
    return [
      {
        id: 1,
        icon: FBIcon,
        link: userDetails?.facebookUrl,
      },
      {
        id: 2,
        icon: InstagramIcon,
        link: userDetails?.instagramUrl,
      },
      {
        id: 3,
        icon: TwitterIcon,
        link: userDetails?.twitterUrl,
      },
      {
        id: 4,
        icon: SoundCloudIcon,
        link: userDetails?.soundcloudUrl,
      },
      {
        id: 5,
        icon: YoutubeIcon,
        link: userDetails?.youtubeUrl,
      },
      {
        id: 6,
        icon: MixCloudIcon,
        link: userDetails?.mixcloudUrl,
      },
      {
        id: 7,
        icon: MixIcon,
        link: userDetails?.twitchUrl,
      },
      {
        id: 8,
        icon: GoogleIcon,
        link: userDetails?.spotifyUrl,
      },
    ];
  }, [
    userDetails?.facebookUrl,
    userDetails?.instagramUrl,
    userDetails?.mixcloudUrl,
    userDetails?.soundcloudUrl,
    userDetails?.spotifyUrl,
    userDetails?.twitchUrl,
    userDetails?.twitterUrl,
    userDetails?.youtubeUrl,
  ]);

  const filter = useColorModeValue('unset', 'invert(1)');

  return (
    <Box>
      <Text className="username" mb="10px">
        {userDetails?.username}
      </Text>
      <Flex gridGap="8px" mb="20px">
        {userDetails &&
          listSocial.map(
            i =>
              i.link && (
                <a
                  href={
                    i?.link
                      ? (i?.link).includes('http')
                        ? i.link
                        : `https://${i.link}`
                      : '#'
                  }
                  rel="noreferrer"
                  target={i?.link ? '_blank' : ''}
                  key={i.id}
                >
                  <Image
                    filter={filter}
                    width="25px"
                    height="25px"
                    src={i.icon}
                  />
                </a>
              ),
          )}
      </Flex>
      {userDetails?.hometown && (
        <>
          <Text color="#8b8b8b" fontSize="12px" lineHeight="15px">
            Hometown:
          </Text>
          <Text fontSize="20px" fontWeight={700} mb="10px">
            {userDetails?.hometown}
          </Text>
        </>
      )}

      {userDetails?.currentLocation && (
        <>
          <Text color="#8b8b8b" fontSize="12px" lineHeight="15px">
            Current Location:
          </Text>
          <Text fontSize="20px" fontWeight={700} mb="10px">
            {userDetails?.currentLocation}
          </Text>
        </>
      )}

      {userDetails?.biography && (
        <>
          <Text color="#8b8b8b" fontSize="12px" lineHeight="15px">
            Biography:
          </Text>
          <Text
            className="biography"
            dangerouslySetInnerHTML={{ __html: userDetails?.biography }}
          />
        </>
      )}

      <Box mt="20px">
        {userDetails?._id && <TopTracks contributorId={userDetails?._id} />}
      </Box>
    </Box>
  );
}
