import { selectSliceCrates } from 'app/pages/PageCrate/slice/selector';
import { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useCratesSlice } from 'app/pages/PageCrate/slice';
import { checkExistedCrateName } from 'app/apis/crates';
import { toastError } from 'app/helpers/toast';
import { SORT_TYPE } from 'app/constants/enum';
import { useDisclosure } from '@chakra-ui/react';
import { useTracks } from '../tracks/useTracks';
import { useCrates } from '../Crates/useCrate';

export const useModalCrate = (onClose?: any) => {
  const { myTrackCrates, payloadCrate, filterRules } =
    useSelector(selectSliceCrates);
  const { actions } = useCratesSlice();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    isOpen,
    onOpen,
    onClose: onCloseModalConfirmDeleteCrate,
  } = useDisclosure();
  const [crateId, setCrateId] = useState<string>('');
  const { initialFilter } = useTracks();
  const { setNameCrate } = useCrates();

  const defaulCrate = useMemo(() => {
    return {
      name: '',
      sort: SORT_TYPE.PUBLISHED_AT_DESC,
      search: '',
      bpmStart: null,
      bpmEnd: null,
      yearFrom: null,
      yearTo: null,
      showGenres: undefined,
      showTags: undefined,
      showContributors: undefined,
      showTrackKeys: undefined,
      labelId: undefined,
      showAudio: true,
      showVideo: true,
      clean: true,
      dirty: true,
    };
  }, []);

  const modalDelete = useCallback(
    id => {
      setCrateId(id);
      onOpen();
    },
    [onOpen],
  );

  const handleChange = (key: string, value: any) => {
    dispatch(
      actions.updatePayloadCrate({
        ...payloadCrate,
        [key]: value,
      }),
    );
  };

  const handleEditCrate = payload => {
    dispatch(actions.updatePayloadCrate(payload));
    setIsModalOpen(true);
  };

  const yesModalDelete = useCallback(() => {
    dispatch(actions.deleteMyCrateRequest({ crateId: crateId }));
    onCloseModalConfirmDeleteCrate();
    if (filterRules._id === crateId) {
      dispatch(actions.removeRule(initialFilter));
      setNameCrate('');
    }
  }, [
    dispatch,
    actions,
    crateId,
    onCloseModalConfirmDeleteCrate,
    filterRules._id,
    initialFilter,
    setNameCrate,
  ]);

  const handleShowModalCreateCrate = () => {
    dispatch(actions.updatePayloadCrate(defaulCrate));
    setIsModalOpen(true);
  };

  const handleMultiSelectChange = key => selectedOptions => {
    handleChange(
      key,
      selectedOptions.map(i => {
        return {
          _id: i.value,
        };
      }),
    );
  };

  const handleChangeFilter = (key, value) => {
    handleChange(key, value);
  };

  const handleCreateCrate = async () => {
    if (!payloadCrate?.name) {
      return toastError('Please fill in name your crate!');
    }
    setIsLoading(true);
    const exist = await checkExistedCrateName(
      payloadCrate?.name,
      payloadCrate?._id,
    );
    setIsLoading(false);
    if (exist) return toastError('Crate name already exited!');
    const data: any = {
      ...payloadCrate,
      showGenres: payloadCrate?.showGenres?.map(i => i?._id),
      showTags: payloadCrate?.showTags?.map(i => i?._id),
      showContributors: payloadCrate?.showContributors?.map(i => i?._id),
      showTrackKeys: payloadCrate?.showTrackKeys?.map(i => i?._id),
    };
    dispatch(actions.createsCratesRequest(data));
    onClose();
  };

  const handleUpdateCrate = async () => {
    setIsLoading(true);
    const exist = await checkExistedCrateName(
      payloadCrate?.name,
      payloadCrate?._id,
    );
    setIsLoading(false);
    if (exist) return toastError('Crate name already exited!');
    const payload: any = {
      ...payloadCrate,
      labelId: payloadCrate?.labelId?._id || payloadCrate?.labelId,
      showGenres: payloadCrate?.showGenres?.map(i => i?._id),
      showTags: payloadCrate?.showTags?.map(i => i?._id),
      showContributors: payloadCrate?.showContributors?.map(i => i?._id),
      showTrackKeys: payloadCrate?.showTrackKeys?.map(i => i?._id),
    };
    dispatch(actions.updateCrateRequest(payload));
    onClose();
  };

  return {
    myTrackCrates,
    handleMultiSelectChange,
    handleChangeFilter,
    handleCreateCrate,
    payloadCrate,
    isLoading,
    handleEditCrate,
    isModalOpen,
    setIsModalOpen,
    handleShowModalCreateCrate,
    handleUpdateCrate,
    yesModalDelete,
    modalDelete,
    isOpen,
    onCloseModalConfirmDeleteCrate,
  };
};
