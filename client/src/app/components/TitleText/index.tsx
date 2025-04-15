import { Text } from '@chakra-ui/layout';
import styles from './title.module.scss';

interface Props {
  text: string;
  className?: string;
}

export default function TitleText(props: Props) {
  const { text, className } = props;

  return (
    <Text
      color="#ED7358"
      marginTop="20px"
      marginBottom="20px"
      fontSize="16px"
      fontWeight="700"
      lineHeight="22px"
      className={(styles.titleText, className)}
    >
      {text}
    </Text>
  );
}
