import { useColorMode } from '@chakra-ui/color-mode';
import update from 'immutability-helper';
import { useCallback } from 'react';
import './ListTracks.scss';
import { SampleDropDrap } from './SampleDropDrap';
import { Flex } from '@chakra-ui/react';
interface ListTracksProps {
  listClaimSamples: any;
  removeSample: (e) => void;
  setListClaimSamples: (tracks) => void;
  isEdit?: boolean;
}

const ListSamples = ({
  listClaimSamples,
  removeSample,
  setListClaimSamples,
}: ListTracksProps) => {
  const { colorMode } = useColorMode();
  const removeItem = id => {
    removeSample(id);
  };

  const moveCard = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      setListClaimSamples(
        update(listClaimSamples, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, listClaimSamples[dragIndex] as any],
          ],
        }),
      );
    },
    [listClaimSamples, setListClaimSamples],
  );

  return (
    <Flex
      flexDirection="column"
      gridGap="10px"
      className={`list-tracks list-tracks-${colorMode}`}
    >
      {listClaimSamples?.map((item, index) => (
        <SampleDropDrap
          key={item._id}
          index={index}
          id={item._id}
          moveCard={moveCard}
          removeSample={removeItem}
          sample={item}
        />
      ))}
    </Flex>
  );
};

export default ListSamples;
