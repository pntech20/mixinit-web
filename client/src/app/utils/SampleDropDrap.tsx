import { Box, Flex } from '@chakra-ui/react';
import type { Identifier, XYCoord } from 'dnd-core';
import type { FC } from 'react';
import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

import { SmallCloseIcon } from '@chakra-ui/icons';
import { ItemTypes } from './ItemTypes';
import './ListTracks.scss';

export interface CardProps {
  id: any;
  sample: any;
  index: number;
  moveCard: (dragIndex: number, hoverIndex: number) => void;
  removeSample: (id: string) => void;
}

interface DragItem {
  index: number;
  id: string;
  type: string;
}

export const SampleDropDrap: FC<CardProps> = ({
  id,
  index,
  removeSample,
  sample,
  moveCard,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: ItemTypes.CARD,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      const clientOffset = monitor.getClientOffset();

      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveCard(dragIndex, hoverIndex);

      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: () => {
      return { id, index };
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));
  return (
    <Flex
      ref={ref}
      opacity={opacity}
      data-handler-id={handlerId}
      cursor="move"
      padding="5px"
      bg="#5c94e8"
      gridGap="10px"
      position="relative"
    >
      <Box mr="10px">
        <p>{sample.track}</p>
        <a
          href={sample.originalTrackUrl}
          target="_blank"
          rel="noreferrer"
          style={{ color: 'blue' }}
        >
          {sample.originalTrackUrl}
        </a>
      </Box>
      <SmallCloseIcon
        position="absolute"
        right={0}
        top={0}
        cursor="pointer"
        onClick={() => removeSample(sample._id)}
      />
    </Flex>
  );
};
