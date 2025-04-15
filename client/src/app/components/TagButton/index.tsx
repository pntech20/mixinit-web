import { useColorMode } from '@chakra-ui/color-mode';
import { Box, Center, Flex } from '@chakra-ui/react';
import { TracksFilter } from 'app/pages/TracksDetail/slice/types';
import classNames from 'classnames';
import querystring from 'query-string';
import { ReactNode, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import styles from './index.module.scss';

interface TagButtonProps {
  _id?: string;
  content?: string | number;
  className?: string;
  icon?: ReactNode;
  slug?: string;
  type?: string;
  tagOrGenre?: boolean;
  color?: string;
  border?: string;
  textDecorationLine?: string;
  padding?: string;
  backgroundColor?: string;
  fontSize?: string;
  fontWeight?: string;
  margin?: string;
  setFilter?: (a: TracksFilter) => void;
}

export default function TagButton({
  _id,
  className = '',
  content,
  icon,
  slug,
  type,
  tagOrGenre = false,
  color = '#242424',
  border = '0.4px solid #939393',
  textDecorationLine,
  padding = '0 20px 0 0',
  backgroundColor = '#FFFFFF',
  fontSize = '10px',
  fontWeight = '400',
  margin,
  setFilter,
}: TagButtonProps) {
  const { colorMode } = useColorMode();
  const history = useHistory();

  const handleClickTag = useCallback(
    tagId => {
      const params = querystring.parse(window.location.search);
      const filter = {
        ...params,
        bpmFrom: Number(params.bpmFrom),
        bpmTo: Number(params.bpmTo),
        yearFrom: Number(params.yearFrom),
        yearTo: Number(params.yearTo),
        priceFrom: Number(params.priceFrom),
        priceTo: Number(params.priceTo),
        tagId,
        genreId: '',
      };
      setFilter && setFilter(filter);
      history.push(`/tracks?${querystring.stringify(filter)}`);
    },
    [history, setFilter],
  );

  const renderElement = (
    color,
    border,
    textDecorationLine,
    backgroundColor,
  ) => {
    return (
      <Flex
        className={classNames(
          styles.tagBtnWidget,
          styles[colorMode],
          className,
        )}
        color={color}
        borderRadius="10px"
        textDecorationLine={textDecorationLine}
        padding="0 5px"
        backgroundColor={backgroundColor}
        fontSize={fontSize}
        fontWeight={fontWeight}
        border={border}
        alignItems="center"
        m={margin}
        h="18px"
      >
        {icon && <Center className="icon-button">{icon}</Center>}
        {content}
      </Flex>
    );
  };

  return tagOrGenre ? (
    <Box onClick={() => handleClickTag(_id)}>
      {renderElement(color, border, textDecorationLine, backgroundColor)}
    </Box>
  ) : (
    renderElement(color, border, textDecorationLine, backgroundColor)
  );
}
