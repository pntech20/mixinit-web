import { setLocalStorage, removeLocalStorage } from 'app/helpers/local-storage';
import { toastError, toastSuccess } from 'app/helpers/toast';
import { useTrackSlice } from 'app/pages/Tracks/slice';
import { selectSliceTracks } from 'app/pages/Tracks/slice/selectors';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGlobalUI } from '../global/useGlobalUI';
import * as trackApis from 'app/apis/track';

export const useUploader = dataFromStepOne => {
  const { onShowLoading, onHideLoading } = useGlobalUI();
  const dispatch = useDispatch();
  const { actions } = useTrackSlice();
  const { myDraftTracks, listTracksUploadedSuccess } =
    useSelector(selectSliceTracks);

  const [listTrackIdsPublish, setListTrackIdsPublish] = useState<any>([]);

  const handlePublishAll = useCallback(async () => {
    setLocalStorage('isPublishAllNow', true);
    let trackIds: any = [];

    for (const track of myDraftTracks) {
      var element = document.getElementById(track?._id);
      if (element) {
        element?.click();
        trackIds.push(track?._id);
      }
    }

    if (!trackIds?.length) {
      removeLocalStorage('isPublishAllNow');
      return toastError('There are no tracks ready to be published');
    } else {
      onShowLoading();
      setListTrackIdsPublish(trackIds);
    }
  }, [myDraftTracks, onShowLoading]);

  const publishTracks = useCallback(
    async trackIds => {
      return await trackApis.publishTracks({
        trackIds: trackIds,
        labelId: dataFromStepOne?._id,
      });
    },
    [dataFromStepOne?._id],
  );

  useEffect(() => {
    if (listTracksUploadedSuccess?.length && listTrackIdsPublish?.length) {
      if (listTracksUploadedSuccess?.length === listTrackIdsPublish?.length) {
        const listTracksUploadedSuccessNew = listTracksUploadedSuccess
          .filter((tr: any) => tr?.status)
          .map((i: any) => i?.id);

        listTracksUploadedSuccessNew.length > 0 &&
          publishTracks(listTracksUploadedSuccessNew);
        toastSuccess('Publish all success');
        listTracksUploadedSuccessNew.length > 0 &&
          dispatch(
            actions.deleteDraftTracks({
              trackIds: listTracksUploadedSuccessNew,
            }),
          );
        dispatch(actions.removeListTracksUploadedSuccess());
        setListTrackIdsPublish([]);
        onHideLoading();
        removeLocalStorage('isPublishAllNow');
        // removeDuplicateAccountingUploader({
        //   labelId: dataFromStepOne?._id,
        // });
      }
    }
  }, [
    actions,
    dataFromStepOne?._id,
    dispatch,
    listTrackIdsPublish,
    listTracksUploadedSuccess,
    onHideLoading,
    publishTracks,
  ]);

  return {
    handlePublishAll,
  };
};
