import { Box, Image, Text } from '@chakra-ui/react';
import empty from 'app/assets/placeholders/empty.svg';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import styles from './empty.module.scss';

export default function Empty(EmptyProps) {
  const { t } = useTranslation();
  const { text = t('data'), link, color = 'white' } = EmptyProps;

  return (
    <Box
      className={styles.empty}
      display="flex"
      flexDirection="column"
      alignItems="center"
      color={color}
    >
      <Image h="70px" w="70px" src={empty} />
      <Text mt="5px" fontSize="14px">
        {text}
        <Link to={'/uploader'}>
          <Text as="span"> {link}</Text>
        </Link>
      </Text>
    </Box>
  );
}
