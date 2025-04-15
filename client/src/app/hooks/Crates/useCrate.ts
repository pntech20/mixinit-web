import { checkExistedCrateName } from 'app/apis/crates';
import { toastError } from 'app/helpers/toast';
import { useCratesSlice } from 'app/pages/PageCrate/slice';
import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';

export const useCrates = () => {
  const dispatch = useDispatch();

  const { actions } = useCratesSlice();

  const [nameCrate, setNameCrate] = useState<string>('');

  const onCreateCrate = useCallback(
    data => {
      dispatch(actions.createsCratesRequest(data));
    },
    [actions, dispatch],
  );

  const onUpdateCrate = useCallback(
    async data => {
      const exist = await checkExistedCrateName(nameCrate, data?._id);
      if (exist) return toastError('Crate name already exited!');
      const payload = {
        ...data,
        showGenres: data?.showGenres?.map(i => i?.value),
        showTags: data?.showTags?.map(i => i?.value),
        showContributors: data?.showContributors?.map(i => i?.value),
        labelId: data?.labelId,
        showTrackKeys: data?.showTrackKeys?.map(i => i?.value),
        name: nameCrate,
        search: data?.search,
        sort: data?.sort,
      };
      dispatch(actions.updateCrateRequest(payload));
    },
    [actions, dispatch, nameCrate],
  );

  const handleSaveCrate = useCallback(
    async filter => {
      if (!nameCrate) {
        return toastError('Please enter crate name');
      }
      const exist = await checkExistedCrateName(nameCrate);
      if (exist) return toastError('Crate name already exited!');
      const data: any = {
        name: nameCrate,
        showGenres: filter?.showGenres?.map(i => i?.value),
        showTags: filter?.showTags?.map(i => i?.value),
        showContributors: filter?.showContributors?.map(i => i?.value),
        showTrackKeys: filter?.showTrackKeys?.map(i => i?.value),
        sort: filter.sort,
        search: filter.search,
      };
      if (filter?.labelId) {
        data.labelId = filter?.labelId;
      }
      onCreateCrate(data);
      setNameCrate('');
    },
    [nameCrate, onCreateCrate],
  );

  return {
    handleSaveCrate,
    onUpdateCrate,
    nameCrate,
    setNameCrate,
  };
};
