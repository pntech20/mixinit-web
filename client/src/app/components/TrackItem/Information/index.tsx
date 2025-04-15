import { Flex, Image, Text } from '@chakra-ui/react';
import { useModeTheme } from 'app/hooks/ColorDarkMode/useModeTheme';
import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { formatTime } from 'utils/formatTime';

interface TrackInformationProps {
  track: any;
}

const TrackInformation = (props: TrackInformationProps) => {
  const { isDarkMode } = useModeTheme();
  const { track } = props;
  const { bpmStart, trackKey, user, label, duration, year } = track;

  const renderInfor = useCallback(
    (img: any, name: string) => {
      return (
        <Flex
          h="30px"
          alignItems="center"
          borderRadius="5px"
          p="10px"
          bg={isDarkMode ? '#1c1c1c' : '#333'}
        >
          <Image
            src={img}
            w="12px"
            h="12px"
            borderRadius="50px"
            alt="avatar"
            mr="5px"
          />
          <Text textColor="#fff" fontSize="12px" p="0 5px">
            {name}
          </Text>
        </Flex>
      );
    },
    [isDarkMode],
  );

  const renderContent = useCallback(
    (title: string, content: string) => {
      return (
        <Flex
          h="30px"
          alignItems="center"
          borderRadius="5px"
          textColor="#fff"
          p="10px"
          bg={isDarkMode ? '#1c1c1c' : '#333'}
        >
          <Text fontSize="12px" fontWeight="500">
            {title}
          </Text>
          <Text fontWeight="500" textColor="#fff" fontSize="12px" p="0 5px">
            {content}
          </Text>
        </Flex>
      );
    },
    [isDarkMode],
  );

  return (
    <>
      <Link to={`/contributors/${user?.slug}`}>
        {renderInfor(user?.avatar, user?.username)}
      </Link>
      <Link to={`/labels/${label?.slug}`}>
        {renderInfor(label?.squareImageUrl, label?.name)}
      </Link>
      {renderContent('BPM:', bpmStart)}
      {renderContent(
        'KEY:',
        trackKey?.musicKey === 'None' || trackKey?.camelotKey === 'None'
          ? 'None'
          : `${trackKey?.musicKey} / ${trackKey?.camelotKey}`,
      )}
      {renderContent('LENGTH:', formatTime(duration || 0, true))}
      {renderContent('YEAR:', year)}
    </>
  );
};

export default TrackInformation;
