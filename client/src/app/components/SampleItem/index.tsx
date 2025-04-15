import { Flex, Image, Text } from '@chakra-ui/react';
import { Sample } from 'app/models';
import styles from './sampleItem.module.scss';
import IconSpotify from 'app/assets/svgs/spotify1.png';
import IconYoutube from 'app/assets/svgs/youtube.png';

interface Props {
  sample: Sample;
}

const SampleItem = ({ sample }: Props) => {
  const { originalTrackUrl, track, source } = sample;

  return (
    <Flex className={styles.sampleItem} gridGap="7px" alignItems="center">
      <a
        className={styles.sampleItem}
        href={originalTrackUrl}
        target="_blank"
        rel="noreferrer"
      >
        {source === 'youtube' ? (
          <Image bgColor="#fff" className={styles.image} src={IconYoutube} />
        ) : (
          <Image bgColor="#000" className={styles.image} src={IconSpotify} />
        )}
        <Text className={styles.textItem}>{track}</Text>
      </a>
    </Flex>
  );
};

export default SampleItem;
