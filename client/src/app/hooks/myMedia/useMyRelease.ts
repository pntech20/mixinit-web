import { ApiUploadS3 } from 'app/apis/uploadS3';
import { OPTION_DISCOUNT } from 'app/constants/enum';
import { toastError } from 'app/helpers/toast';
import { useReleasesSlice } from 'app/pages/Releases/slice';
import { selectSliceReleases } from 'app/pages/Releases/slice/selectors';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useDrop } from 'react-dnd';
import { selectAuth } from 'app/pages/Login/slice/selectors';
import { getReleasePricingByLabelId } from 'app/apis/sections';
import { checkExistedTitleRelease } from 'app/apis/releases/release';

const initRealeaseInfo = {
  title: '',
  description: '',
  status: 'publish',
  labelId: '',
  price: '',
  maxNumTracks: undefined,
  releaseOption: undefined,
};
export const useMyRelease = ({ setFilter }: any) => {
  const dispatch = useDispatch();
  const { actions } = useReleasesSlice();
  const { listFiles, isStateRelease } = useSelector(selectSliceReleases);
  const { userDetail: userInfo } = useSelector(selectAuth);
  const [idLabel, setIdLabel] = useState('');
  const [optionReleasePricing, setOptionReleasePricing] = useState<any>([]);
  const [isShowSelectLabel, setIsShowSelectLabel] = useState(false);

  const handleGetReleasePricingByLabelId = useCallback(async idLabel => {
    const res = await getReleasePricingByLabelId(idLabel);
    setOptionReleasePricing(res?.releasesPricing);
  }, []);

  const handleSetLabelId = useCallback(
    value => {
      setIdLabel(value);
      setFilter(prev => ({
        ...prev,
        labelId: value,
        page: 1,
      }));
    },
    [setFilter, setIdLabel],
  );

  const setListFiles = useCallback(
    props => {
      dispatch(actions.setListFile(props));
    },
    [actions, dispatch],
  );
  const [imageUpload, setImageUpload] = useState<any>('');
  const [releaseId, setReleaseId] = useState<string>('');
  const [labelIdSelected, setLabelIdSelected] = useState<string>('');
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const [isLoadingAction, setLoadingAction] = useState<boolean>(false);
  const [labelName, setLabelName] = useState<any>('');
  const [releasePricing, setReleasePricing] = useState<any>();

  const { t } = useTranslation();
  const handleRemoveRelease = releaseId => {
    const filterListMeta = listFiles.filter(
      release => release._id !== releaseId,
    );
    setListFiles(filterListMeta);
  };
  const [releaseInfo, setReleaseInfo] = useState<any>(initRealeaseInfo);

  useEffect(() => {
    if (idLabel || releaseInfo.labelId) {
      handleGetReleasePricingByLabelId(idLabel || releaseInfo.labelId);
    }
  }, [handleGetReleasePricingByLabelId, idLabel, releaseInfo.labelId]);

  useEffect(() => {
    if (releaseInfo.releaseOption) {
      const releasePricing = optionReleasePricing.find(
        o => o._id === releaseInfo.releaseOption,
      );
      setReleasePricing(releasePricing);
      // setReleaseInfo(prev => ({
      //   ...prev,
      //   price: releasePricing?.minPrice,
      // }));
    }
  }, [optionReleasePricing, releaseInfo.releaseOption]);

  const resetRelease = useCallback(() => {
    setImageUpload('');
    setReleaseInfo(initRealeaseInfo);
    setListFiles([]);
  }, [setListFiles]);

  const onCreateRelease = useCallback(
    data => {
      dispatch(actions.createReleaseRequest(data));
      resetRelease();
    },
    [actions, dispatch, resetRelease],
  );

  const onEditRelease = useCallback(
    data => {
      dispatch(actions.updateReleaseRequest(data));
    },
    [actions, dispatch],
  );

  const isValidRelease = useCallback(
    releaseInfo => {
      const { title, description, status, releaseOption } = releaseInfo;
      return (
        title &&
        description &&
        status &&
        imageUpload &&
        listFiles.length &&
        releaseOption
      );
    },
    [imageUpload, listFiles.length],
  );

  const isCheckReleaseInfo = !!isValidRelease(releaseInfo);

  const handleSaveRelease = useCallback(
    async idLabel => {
      const { title, description, status, price, releaseOption } = releaseInfo;

      if (!isValidRelease(releaseInfo)) {
        setIsConfirmed(true);
        return toastError(t('myRelease.validateRelease'));
      }
      if (listFiles.length < 2) {
        setIsConfirmed(true);
        return toastError('Release must have more than one track');
      }
      const existTitle = await checkExistedTitleRelease(title);
      if (existTitle) return toastError('Multipack title already exited!');

      setLoadingAction(true);
      try {
        const result = await ApiUploadS3({
          file: imageUpload,
          path: `${labelName}/${userInfo?.username}/releases`,
        });
        const data = {
          title,
          description,
          price: Number(price),
          maxNumTracks: listFiles.length,
          artwork: result?.data,
          tracks: listFiles.map(file => file._id),
          status,
          labelId: idLabel,
          releaseOptionId: releaseOption,
        };
        onCreateRelease(data);
        setLoadingAction(false);
        handleSetLabelId('');
      } catch (error) {
        setLoadingAction(false);
        return toastError('Something went wrong!');
      }
    },
    [
      handleSetLabelId,
      imageUpload,
      isValidRelease,
      labelName,
      listFiles,
      onCreateRelease,
      releaseInfo,
      t,
      userInfo?.username,
    ],
  );

  const handleEditRelease = useCallback(async () => {
    const { title, description, status, maxNumTracks, price, releaseOption } =
      releaseInfo;
    if (!isValidRelease(releaseInfo)) {
      return toastError(t('myRelease.validateRelease'));
    }
    if (listFiles.length < 2) {
      return toastError('Release must have more than one track');
    }
    const existTitle = await checkExistedTitleRelease(title, releaseId);
    if (existTitle) return toastError('Multipack title already exited!');
    setLoadingAction(true);
    let artwork = '';
    if (typeof imageUpload === 'string') {
      artwork = imageUpload;
    } else {
      try {
        const result = await ApiUploadS3({
          file: imageUpload,
          path: `${labelName}/${userInfo?.username}/releases`,
        });
        artwork = result?.data;
      } catch (error) {
        setLoadingAction(false);
        return toastError('Something went wrong!');
      }
    }
    const dataUpdate = {
      releaseId,
      data: {
        title,
        description,
        artwork,
        tracks: listFiles.map(file => file._id),
        status,
        maxNumTracks,
        price,
        releaseOptionId: releaseOption,
      },
    };
    onEditRelease(dataUpdate);
  }, [
    imageUpload,
    isValidRelease,
    labelName,
    listFiles,
    onEditRelease,
    releaseId,
    releaseInfo,
    t,
    userInfo?.username,
  ]);

  const handleChangeReleaseInfo = useCallback(
    (field, value) => {
      setReleaseInfo({
        ...releaseInfo,
        [field]: value,
      });
    },
    [releaseInfo],
  );

  const passFile = useCallback(
    file => {
      setImageUpload(file);
    },
    [setImageUpload],
  );

  const handleRemoveImage = useCallback(() => {
    setImageUpload('');
  }, []);

  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: 'ITEM',
    drop: (monitor: any) => {
      setListFiles(pre => {
        const listTrackUnique = monitor.fields.filter(
          track => !pre.includes(track),
        );
        return [...pre, ...listTrackUnique];
      });
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));
  const isActive = canDrop && isOver;

  const optionDiscount = [
    { label: OPTION_DISCOUNT.DISCOUNT10, value: OPTION_DISCOUNT.NUMBER10 },
    { label: OPTION_DISCOUNT.DISCOUNT15, value: OPTION_DISCOUNT.NUMBER15 },
    { label: OPTION_DISCOUNT.DISCOUNT20, value: OPTION_DISCOUNT.NUMBER20 },
    { label: OPTION_DISCOUNT.DISCOUNT25, value: OPTION_DISCOUNT.NUMBER25 },
    { label: OPTION_DISCOUNT.DISCOUNT30, value: OPTION_DISCOUNT.NUMBER30 },
    { label: OPTION_DISCOUNT.DISCOUNT35, value: OPTION_DISCOUNT.NUMBER35 },
    { label: OPTION_DISCOUNT.DISCOUNT40, value: OPTION_DISCOUNT.NUMBER40 },
    { label: OPTION_DISCOUNT.DISCOUNT45, value: OPTION_DISCOUNT.NUMBER45 },
    { label: OPTION_DISCOUNT.DISCOUNT50, value: OPTION_DISCOUNT.NUMBER50 },
    { label: OPTION_DISCOUNT.DISCOUNT55, value: OPTION_DISCOUNT.NUMBER55 },
    { label: OPTION_DISCOUNT.DISCOUNT60, value: OPTION_DISCOUNT.NUMBER60 },
    { label: OPTION_DISCOUNT.DISCOUNT65, value: OPTION_DISCOUNT.NUMBER65 },
    { label: OPTION_DISCOUNT.DISCOUNT70, value: OPTION_DISCOUNT.NUMBER70 },
    { label: OPTION_DISCOUNT.DISCOUNT75, value: OPTION_DISCOUNT.NUMBER75 },
  ];

  return {
    listFiles,
    releaseInfo,
    imageUpload,
    setListFiles,
    setImageUpload,
    setReleaseInfo,
    setReleaseId,
    handleChangeReleaseInfo,
    releaseId,
    handleSaveRelease,
    handleEditRelease,
    passFile,
    handleRemoveImage,
    handleRemoveRelease,
    setIsConfirmed,
    canDrop,
    drop,
    isActive,
    isConfirmed,
    isLoadingAction,
    setLoadingAction,
    optionDiscount,
    resetRelease,
    initRealeaseInfo,
    labelIdSelected,
    setLabelIdSelected,
    isCheckReleaseInfo,
    setLabelName,
    setIdLabel,
    idLabel,
    optionReleasePricing,
    releasePricing,
    isStateRelease,
    isShowSelectLabel,
    setIsShowSelectLabel,
    handleSetLabelId,
  };
};
