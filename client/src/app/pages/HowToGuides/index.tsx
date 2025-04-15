import {
  Box,
  Flex,
  Image,
  ListItem,
  Text,
  UnorderedList,
} from '@chakra-ui/react';
import { Banner } from 'app/components/Banner';
import styles from './styles.module.scss';
import Item1 from 'app/assets/images/guides/item-1.png';
import Item2 from 'app/assets/images/guides/item-2.png';
import Item3 from 'app/assets/images/guides/item-3.png';
import { useHistory } from 'react-router-dom';

const trackPrimary = [
  {
    title: 'Track Release Date',
    description: '- The date the track went live on our website.',
  },
  {
    title: 'Track Title',
    description:
      '- The title of the track. Clicking the title will bring you to the Track Detail Page.',
  },
  {
    title: 'Track Artist',
    description: '- The artist of the track.',
  },
  {
    title: 'Track Add To Cart',
    description:
      '- The price for the track. Clicking or pressing "Return/Enter" on your computer keyboard will add the track to your cart.',
  },
  {
    title: 'Track View More',
    description:
      '- Clicking on the eye will open the track showing more details about it.',
  },
];

const trackSecondary = [
  {
    title: 'Track Contributor',
    description: ' - The editor that uploaded the track.',
  },
  {
    title: 'Track Label',
    description: '- The Label the track was uploaded to.',
  },
  {
    title: 'Track BPM ',
    description:
      '- The tempo of the track (BPM End will be present if the track is a bpm transition)',
  },
  {
    title: 'Track Key',
    description: '- The musical key of the track',
  },
  {
    title: 'Track Camelot Key',
    description: '- The Camelot key of the track.',
  },
  {
    title: 'Track Length',
    description: ' - The length of the track in minutes and seconds.',
  },
  {
    title: 'Track Release Year',
    description: '- The original release year of the track.',
  },
  {
    title: 'Track Genre(s)',
    description:
      ' - The genre of the track. (There may be up to 2 genres for the track) Track Genres are blue.',
  },
  {
    title: 'Track Tag(s)',
    description:
      '- Tags used to better identify the track. Track tags are maroon.',
  },
  {
    title: 'Track In Releases',
    description:
      '- A link to show you all the releases the track is available in.',
  },
  {
    title: 'Track Share Button',
    description: ' - Various ways to share the track on other platforms.',
  },
];

const trackTertiary = [
  {
    title: 'Related Tracks ',
    description: ' - Tracks that are related to the current track in some way.',
  },
  {
    title: 'In Releases',
    description: '- Releases you can find the track inside.',
  },
  {
    title: 'Original Works',
    description:
      '- Original tracks used to create the track. (Spotify or YouTube links)',
  },
];

const discountList = [
  '01 - 19 Tracks - 00% No Discount',
  '20 - 39 Tracks - 05% Discount on all tracks in your cart',
  '40 - 59 Tracks - 10% Discount on all tracks in your cart',
  '60 - 79 Tracks - 15% Discount on all tracks in your cart',
  '80 - 99 Tracks - 20% Discount on all tracks in your cart',
  '100 - 119 Tracks - 25% Discount on all tracks in your cart',
  '120 - 139 Tracks - 30% Discount on all tracks in your cart',
  '140 - 159 Tracks - 35% Discount on all tracks in your cart',
  '160 - 179 Tracks - 40% Discount on all tracks in your cart',
  '180 - 199 Tracks - 45% Discount on all tracks in your cart',
  '200 or more Tracks - 50% Discount on all tracks in your cart',
];

const trackList = [
  {
    img: Item1,
    height: '120px',
    list: trackPrimary,
    trackView: 'Closed',
  },
  {
    img: Item2,
    height: '284px',
    list: trackSecondary,
    trackView: 'Opened',
  },
  {
    img: Item3,
    height: '565px',
    list: trackTertiary,
    trackView: 'On Track Page',
  },
];

export function HowToGuidesPage() {
  const history = useHistory();

  return (
    <>
      <Banner />
      <Box className={styles.title}>How It Works</Box>
      <Text className={styles.description}>
        The all new Crooklyn Clan Vault 4.0 has never been easier and more
        rewarding for DJ's! Tracks and Releases are the two product types
        available for purchase. Whether you purchase a Release, or cherry pick
        individual tracks, you eventually end up with just TRACKS to download
        that will go to your "My Library" section. If you purchased a release
        that has 50 tracks inside for $20 you still purchased 50 tracks - you
        simply received a discount on them by purchasing them inside of a
        release because releases are a bunch of tracks for a discounted price
        off the retail cost of tracks if you were to purchase them one at a
        time.
      </Text>
      <Box className={styles.title}>Tracks</Box>
      <Box className={styles.description}>
        Tracks (Audio or Video) are the foundation of the Crooklyn Clan Vault.
        Products are either individual tracks or groups of tracks which are
        called Releases. Both have an automated discounting system in place
        based on the amount of tracks or releases in your cart at the time of
        checkout. More about that in a moment, first lets take a look at
        tracks..
      </Box>
      <Box py="25px">
        {trackList.map((item, idx) => (
          <Box key={idx}>
            <Image
              src={item.img}
              w="100%"
              h={item.height}
              object="cover"
              borderRadius="16px"
            />
            <Box
              textAlign="center"
              mt="6px"
              mb="10px"
              fontSize="11.2px"
              lineHeight="16px"
            >
              Track View ({item.trackView})
            </Box>
            <UnorderedList pl="40px" mb="10px">
              {item.list.map((i, k) => (
                <ListItem key={k}>
                  <Flex color="#333333" gridGap="4px" my="15px">
                    <Text fontWeight="700">{i.title}</Text>
                    <Text>{i.description}</Text>
                  </Flex>
                </ListItem>
              ))}
            </UnorderedList>
          </Box>
        ))}
      </Box>
      <Text className={styles.description} mt="30px">
        For every 20 individual tracks you have in your cart, 5% of the total
        cost of those tracks will be deducted up to 50% off your entire
        individual track purchases! Here's a discount chart to help you make
        sense of it..
      </Text>
      <Box pl="20px" mb="30px">
        {discountList.map((i, k) => (
          <Text key={k} fontSize="15px" fontWeight="700" lineHeight="23px">
            {i}
          </Text>
        ))}
      </Box>
      <Text className={styles.description}>
        So for example if you have 41 tracks in your cart ready to check out,
        you will get a 10% discount on all of them. If you have 39 tracks in
        your cart ready to check out, you will get a 5% discount on all of them.
        When you reach the next tier the discount rate applies to all of the
        individual tracks in your cart.
      </Text>
      <Box className={styles.title}>Discounts Apply Separately</Box>
      <Text className={styles.description}>
        As you shop your cart will automatically apply discounts respectively
        for Tracks and Releases and you can see them applying to your totals in
        real-time, so you never have to worry about discount codes before you
        checkout...
        <br />
        <br />
        <strong>
          A brief example of having a cart with tracks AND releases inside:
        </strong>
        <br />
        <br />
        Your cart has 21 tracks and 11 releases inside. The tracks get 5%
        discount, the releases get 10% discount.
      </Text>
      <Box className={styles.title}>Contributors</Box>
      <Text className={styles.description}>
        Our contributors provide the content you find across the Crooklyn Clan
        Vault. Finding a contributor that makes edits in a way that makes you
        very comfortable playing them will be a game changer for the working DJ.
      </Text>
      <Box className={styles.title}>Labels</Box>
      <Text className={styles.description}>
        Labels can be considered categories. They mainly exist for the purpose
        of segregating contributors and keep clean collections of edits that
        belong together. Some contributors can upload to some labels and not
        others. Every track in our entire database belongs to a Label. An
        example of labels; Audio Vault, Video Vault, i12inch Pool, DJ Mixes,
        etc..
      </Text>
      <Box className={styles.title}>My Library</Box>
      <Text className={styles.description}>
        Our system will let you know if you already purchased something if you
        should try to purchase it again so you don't have to worry about
        duplicate purchases. After your purchases of Tracks and Releases are
        complete, the individual tracks from those purchases go into your "My
        Library" section for you to have access to download or save to your
        Dropbox. Our system will allow up to 5 downloads per track that reside
        in your library without any expiration dates. A download consists of
        either downloading a track to your computer, or to your Dropbox account.
        If you should download a track 5 times and find you still need to
        download that track you will be prompted to contact us and we will do
        our very best to help you, but at our own discretion.
      </Text>
      <Box className={styles.title}>Subscriptions</Box>
      <Text className={styles.description}>
        The ability to subscribe to a monthly plan and download unlimited tracks
        does not exist. There are some subscriptions available from time to time
        but not frequently, and when a subscription becomes available you will
        have to apply for it and we must approve it. Some subscriptions will
        only allow access to certain Labels so be sure to read carefully before
        subscribing. Subscriptions come with download limits, but nothing to
        worry about for a normal DJ getting music for gigs. Limits are in place
        to prevent excessive downloading, abusing, and re-sharing of our
        products. When a subscription is available you will see{' '}
        <span
          onClick={() => history.push(`/services`)}
          className={styles.subscribeLink}
        >
          Subscribe Now
        </span>
        " as an option in the nav bar at the top of the screen.
      </Text>
    </>
  );
}
