import { Box, Text, Tooltip } from '@chakra-ui/react';
import type { Identifier, XYCoord } from 'dnd-core';
import type { FC } from 'react';
import { useMemo, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { FaPlayCircle, FaPauseCircle } from 'react-icons/fa';
import { IoMdCloseCircle } from 'react-icons/io';

import { ItemTypes } from './ItemTypes';
import './ListTracks.scss';
import { usePlayers } from 'app/hooks/player/usePlayers';
import { Track } from 'app/models';

export interface CardProps {
  id: any;
  text: string;
  artist: string;
  track: Track;
  index: number;
  moveCard: (dragIndex: number, hoverIndex: number) => void;
  removeItem: (id: string) => void;
  isEdit?: boolean;
}

interface DragItem {
  index: number;
  id: string;
  type: string;
}

export const Card: FC<CardProps> = ({
  id,
  text,
  artist,
  index,
  moveCard,
  removeItem,
  isEdit = false,
  track,
}) => {
  const {
    handlePlayOrPause,
    isPlaying: isPlayingTrack,
    playingTrack,
    handlePlayPause,
  } = usePlayers();

  const isPlaying = useMemo(() => {
    return playingTrack?._id === id;
  }, [id, playingTrack?._id]);

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

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
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
    <Box
      className="item-track"
      ref={ref}
      opacity={opacity}
      data-handler-id={handlerId}
      cursor="move"
    >
      <Text mr="5px">{+index + 1}.</Text>
      <Box
        w="30px"
        h="30px"
        cursor="pointer"
        onClick={() => {
          if (isPlaying && isPlayingTrack) {
            handlePlayPause(playingTrack);
          } else {
            if (isPlaying) {
              handlePlayPause(playingTrack);
            } else {
              handlePlayOrPause(track);
            }
          }
        }}
      >
        {isPlaying && isPlayingTrack ? (
          <FaPauseCircle size={30} />
        ) : (
          <FaPlayCircle size={30} />
        )}
      </Box>
      <Box className="text-track" mx="5px">
        <Tooltip label={text}>
          <p className="text-track__title">{text}</p>
        </Tooltip>
        <Tooltip label={artist}>
          <p className="text-track__artist">{artist}</p>
        </Tooltip>
      </Box>
      {!isEdit && (
        <Box ml="auto">
          <IoMdCloseCircle
            size={20}
            className="remove-track"
            onClick={() => removeItem(id)}
          />
        </Box>
      )}
    </Box>
  );
};
