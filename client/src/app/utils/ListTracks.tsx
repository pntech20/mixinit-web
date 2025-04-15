import { useColorMode } from '@chakra-ui/color-mode';
import { Box } from '@chakra-ui/layout';
import { Track } from 'app/models';
import update from 'immutability-helper';
import { useCallback } from 'react';
import { Card } from './Card';
import './ListTracks.scss';

interface ListTracksProps {
  listFiles: Track[];
  handleRemovePlaylist: (e) => void;
  remove?: (id: string) => void;
  setListFiles: (tracks) => void;
  isEdit?: boolean;
}

const ListTracks = ({
  listFiles,
  handleRemovePlaylist,
  remove,
  setListFiles,
  isEdit = false,
}: ListTracksProps) => {
  const { colorMode } = useColorMode();
  const removeItem = id => {
    handleRemovePlaylist(id);
    remove && remove(id);
  };

  const moveCard = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      setListFiles(
        update(listFiles, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, listFiles[dragIndex] as any],
          ],
        }),
      );
    },
    [listFiles, setListFiles],
  );

  return (
    <Box className={`list-tracks list-tracks-${colorMode}`}>
      {listFiles?.map((item, index) => (
        <Card
          key={item._id}
          index={index}
          id={item._id}
          text={item.title}
          artist={item.artist}
          moveCard={moveCard}
          removeItem={removeItem}
          isEdit={isEdit}
          track={item}
        />
      ))}
    </Box>
  );
};

export default ListTracks;
