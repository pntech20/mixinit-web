import { Flex, Text } from '@chakra-ui/react';
import { SORT_TYPE } from 'app/constants/enum';
import { useHistory } from 'react-router-dom';

export const TextTop100 = ({ idOrSlug, selectedTime, page, label }: any) => {
  const history = useHistory();

  const handleClick = (page, selectedTime, idOrSlug, label, isTop100) => {
    if (page === 'tracks') {
      history.push({
        pathname: `/tracks`,
        state: isTop100
          ? {
              date: String(selectedTime),
              key: label,
              label,
              value: idOrSlug,
            }
          : {
              date: SORT_TYPE.PUBLISHED_AT_DESC,
              key: label,
              label,
              value: idOrSlug,
            },
      });
    } else {
      history.push({
        pathname: `/${page}/${idOrSlug}`,
        state: isTop100
          ? { dataRange: String(selectedTime) }
          : { newRelease: true },
      });
    }
  };
  return (
    <Flex p="2px 4px" justifyContent="space-between" alignItem="center">
      <Text
        textDecoration="underline"
        cursor="pointer"
        fontSize="12px"
        color="#0073ff"
        onClick={() => handleClick(page, selectedTime, idOrSlug, label, true)}
      >
        VIEW TOP 100
      </Text>
      <Text
        textDecoration="underline"
        fontSize="12px"
        color="#0073ff"
        cursor="pointer"
        onClick={() => handleClick(page, selectedTime, idOrSlug, label, false)}
      >
        VIEW NEW RELEASES
      </Text>
    </Flex>
  );
};
