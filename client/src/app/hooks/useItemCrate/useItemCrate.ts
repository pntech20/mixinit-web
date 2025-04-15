import { useTracks } from 'app/hooks/tracks/useTracks';
import { useDisclosure } from '@chakra-ui/react';
import { useCratesSlice } from 'app/pages/PageCrate/slice';
import { selectSliceCrates } from 'app/pages/PageCrate/slice/selector';
import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
// import { useCrates } from '../Crates/useCrate';
import { setLocalStorage } from 'app/helpers/local-storage';
import { useTrackSlice } from 'app/pages/Tracks/slice';

export const useItemCrate = () => {
  const dispatch = useDispatch();
  const { actions } = useCratesSlice();
  const { actions: actionsTrack } = useTrackSlice();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [crateId, setCrateId] = useState<string>('');
  const { myTrackCrates, filterRules } = useSelector(selectSliceCrates);
  const history = useHistory();

  const { initialFilter } = useTracks();
  // const { setNameCrate } = useCrates();
  const yesModalDelete = useCallback(() => {
    dispatch(actions.deleteMyCrateRequest({ crateId: crateId }));
    onClose();
    if (filterRules._id === crateId) {
      dispatch(actions.removeRule(initialFilter));
      // setNameCrate('');
    }
  }, [
    dispatch,
    actions,
    crateId,
    onClose,
    filterRules._id,
    initialFilter,
    // setNameCrate,
  ]);

  const modalDelete = useCallback(
    id => {
      setCrateId(id);
      onOpen();
    },
    [onOpen],
  );

  const handleClickCrate = useCallback(
    crate => {
      setLocalStorage('clean', crate?.clean);
      setLocalStorage('dirty', crate?.dirty);
      dispatch(
        actionsTrack.updateBtnFilters({
          clean: crate?.clean,
          dirty: crate?.dirty,
        }),
      );
      dispatch(
        actions.addRule({
          _id: crate?._id,
          name: crate?.name,
          sort: crate?.sort,
          showTrackKeys: crate?.showTrackKeys?.map(i => ({
            value: i?._id,
            label: i?.name,
          })),
          showContributors: crate?.showContributors?.map(i => ({
            value: i?._id,
            label: i?.name,
          })),
          showTags: crate?.showTags?.map(i => ({
            value: i?._id,
            label: i?.name,
          })),
          showGenres: crate?.showGenres?.map(i => ({
            value: i?._id,
            label: i?.name,
          })),
          bpmStart: crate?.bpmStart || 0,
          bpmEnd: crate?.bpmEnd || 220,
          yearFrom: crate?.yearFrom || 1950,
          yearTo: crate?.yearTo || new Date().getFullYear(),
          showAudio: crate?.showAudio,
          showVideo: crate?.showVideo,
          clean: crate?.clean,
          dirty: crate?.dirty,
          labelId: crate?.labelId?._id,
          search: crate?.search,
        }),
      );
      setTimeout(() => {
        history.push('/tracks');
      }, 100);
    },
    [actions, actionsTrack, dispatch, history],
  );

  const onGetMyCrates = useCallback(
    type => {
      dispatch(actions.getMyCratesRequest({ type }));
    },
    [actions, dispatch],
  );

  return {
    yesModalDelete,
    modalDelete,
    onOpen,
    onClose,
    handleClickCrate,
    onGetMyCrates,
    isOpen,
    myTrackCrates,
    filterRules,
  };
};
