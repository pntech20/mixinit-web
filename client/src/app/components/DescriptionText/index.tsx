import { Text } from '@chakra-ui/layout';
import styles from './description.module.scss';

interface Props {
  text: string;
  className?: string;
}

export default function DescriptionText(props: Props) {
  const { text, className } = props;

  return (
    <Text
      fontSize="16px"
      lineHeight="22px"
      marginBottom="20px"
      className={(styles.descriptionText, className)}
      fontWeight="300"
    >
      {text}
    </Text>
  );
}
