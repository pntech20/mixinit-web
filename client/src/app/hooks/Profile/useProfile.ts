import { yupResolver } from '@hookform/resolvers/yup';
import { ApiUploadS3 } from 'app/apis/uploadS3';
import { IMG_OF_USER, PROFILE_TYPE } from 'app/constants/enum';
import { toastError } from 'app/helpers/toast';
import { useAuthSlice } from 'app/pages/Login/slice';
import { selectAuth } from 'app/pages/Login/slice/selectors';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import { OTHERS_FOLDER_UPLOAD_S3, PHONE_REGEX } from './../../constants/index';

export const useProfile = () => {
  const { t } = useTranslation();

  const {
    userDetail,
    isShowAvatarLoading,
    isShowCoverLoading,
    isShowPromoLoading,
    isLoading,
    isUpdateUserSuccess,
  } = useSelector(selectAuth);

  const [isCountry, setIsCountry] = useState<boolean>(false);

  const { userDetail: userInfo } = useSelector(selectAuth);

  const [showTrackPurchases, setShowTrackPurchases] = useState<boolean>(
    userDetail?.showTrackPurchases,
  );

  const [showMyOwnTracks, setShowMyOwnTracks] = useState<boolean>(
    userDetail?.showMyOwnTracks,
  );

  interface DashboardForm {
    username?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    mobileNumber?: string;
    address?: string;
    streetAddress?: string;
    city?: string;
    country?: string;
    postalCode?: string;
    biography?: string;
    paypalEmail?: string;
    dateOfBirth?: string;
    gender?: string;
    bannerBgColor?: string;
    bannerTextColor?: string;
    twitterUrl?: string;
    youtubeUrl?: string;
    instagramUrl?: string;
    soundcloudUrl?: string;
    mixcloudUrl?: string;
    facebookUrl?: string;
    spotifyUrl?: string;
    hometown?: string;
    currentLocation?: string;
  }

  const path = useMemo(() => {
    return `${OTHERS_FOLDER_UPLOAD_S3}/${userDetail?.username}/profile`;
  }, [userDetail?.username]);

  const dashboardValidate = yup.object().shape({
    mobileNumber: yup
      .string()
      .typeError(t('profile.typeError'))
      .min(9)
      .matches(PHONE_REGEX, t('profile.matchesPhone')),
    firstName: yup.string(),
    paypalEmail: yup.string(),
    lastName: yup.string(),
    country: yup.string(),
    biography: yup.string(),
    dateOfBirth: yup.string(),
    twitterUrl: yup.string(),
    youtubeUrl: yup.string(),
    instagramUrl: yup.string(),
    soundcloudUrl: yup.string(),
    mixcloudUrl: yup.string(),
    facebookUrl: yup.string(),
    spotifyUrl: yup.string(),
  });
  const [listPhotosUrl, setPhotosUrl] = useState<any>(userDetail?.avatar || '');

  const [bannerUrl, setBannerUrl] = useState<any>(userDetail?.cover || '');

  const [imageUploadAvatar, setImageUploadAvatar] = useState<string>(
    userDetail?.avatar || '',
  );
  const [imageUploadCover, setImageUploadCover] = useState<string>(
    userDetail?.cover || '',
  );
  const [imageUploadPromoShot, setImageUploadPromoShot] = useState<string>(
    userDetail?.promoShot || '',
  );
  const [isUploadAvatar, setIsUploadAvatar] = useState<boolean>(false);

  const [isUploadBg, setIsUploadBg] = useState<boolean>(false);

  const { actions } = useAuthSlice();
  const dispatch = useDispatch();

  const [gender, setGender] = useState(userDetail?.gender);

  const [tabIndexProfile, setTabIndexProfile] = useState(PROFILE_TYPE.TRACKS);

  const [yubDateOfBirth, setYubDateOfBirth] = useState<any>();
  const DEFAULT_FILTERS = useMemo(() => {
    return {
      day: {
        label: userDetail?.dateOfBirth?.slice(0, 2),
        value: userDetail?.dateOfBirth?.slice(0, 2),
      },
      month: {
        label: userDetail?.dateOfBirth?.slice(3, 5),
        value: userDetail?.dateOfBirth?.slice(3, 5),
      },
      year: {
        label: userDetail?.dateOfBirth?.slice(6, 10),
        value: userDetail?.dateOfBirth?.slice(6, 10),
      },
    };
  }, [userDetail?.dateOfBirth]);

  const [dayOfBirth, setDayOfBirth] = useState(DEFAULT_FILTERS);
  const dateOfBirth =
    dayOfBirth.day.value +
    '/' +
    dayOfBirth.month.value +
    '/' +
    dayOfBirth.year.value;

  const handleYubDateOfBirth = useCallback(() => {
    const arrayDateOfBirth = dateOfBirth.split('/');
    if (arrayDateOfBirth[1] === '02') {
      if (handleLeapYear(arrayDateOfBirth)) {
        if (Number(arrayDateOfBirth[0]) > 29) {
          return setYubDateOfBirth(t('profile.mustBe29'));
        }
      } else {
        if (Number(arrayDateOfBirth[0]) > 28) {
          return setYubDateOfBirth(t('profile.mustBe28'));
        }
      }
    }
    setYubDateOfBirth(null);
  }, [dateOfBirth, t]);

  const handleLeapYear = arrayDateOfBirth =>
    Number(arrayDateOfBirth[2]) % 4 === 0 ||
    (Number(arrayDateOfBirth[2]) % 400 === 0 &&
      Number(arrayDateOfBirth[2]) % 100 === 0);

  useEffect(() => {
    handleYubDateOfBirth();
  }, [handleYubDateOfBirth, dateOfBirth]);

  const handleChangeFilter = event => {
    const { value } = event.target;
    setGender(value);
  };
  const handleChangeSelect = (event, key) => {
    setDayOfBirth(current => ({
      ...current,
      [key]: event,
    }));
  };
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<DashboardForm>({
    resolver: yupResolver(dashboardValidate),
  });

  const [country, setCountry] = useState(userDetail?.country || '');
  const handleSelectCountry = useCallback(val => {
    setCountry(val);
    if (val !== '') setIsCountry(false);
  }, []);

  const setUpdateUserSuccess = useCallback(async () => {
    dispatch(actions.setUpdateUserSuccess());
  }, [actions, dispatch]);

  const onSubmitColor = useCallback(
    async (dataSubmit: DashboardForm) => {
      const data = {
        ...dataSubmit,
      };
      !yubDateOfBirth && dispatch(actions.updateUserRequest(data));
    },
    [actions, dispatch, yubDateOfBirth],
  );

  const fileChangeAvatar = async event => {
    setIsUploadAvatar(true);
    const file = event.target.files[0];
    const img = new Image();
    if (file.type.startsWith('image/')) {
      img.src = URL.createObjectURL(file);
      img.addEventListener('load', async function () {
        if (img.width !== 1080 || img.height !== 1080) {
          toastError('Image must be 1080x1080 pixels.');
          setIsUploadAvatar(false);
        } else {
          try {
            const result = await ApiUploadS3({
              file,
              path,
            });
            const data = {
              avatar: result?.data,
            };
            dispatch(actions.updateUserRequest(data));
          } catch (error) {
            toastError('Update fail');
          } finally {
            setIsUploadAvatar(false);
          }
        }
      });
    }
  };

  const fileChangeBg = async event => {
    setIsUploadBg(true);
    try {
      const file = event.target.files[0];

      const result = await ApiUploadS3({
        file,
        path,
      });
      const data = {
        cover: result?.data,
      };
      dispatch(actions.updateUserRequest(data));
    } catch (error) {
      toastError('Update fail');
    } finally {
      setIsUploadBg(false);
    }
  };

  const onSubmit = useCallback(
    async (dataSubmit: DashboardForm) => {
      const data = {
        ...dataSubmit,
        gender,
        country,
        dateOfBirth,
        showMyOwnTracks,
        showTrackPurchases,
      };

      !yubDateOfBirth && dispatch(actions.updateUserRequest(data));
    },
    [
      gender,
      country,
      dateOfBirth,
      showMyOwnTracks,
      showTrackPurchases,
      yubDateOfBirth,
      dispatch,
      actions,
    ],
  );

  const dropBannerImg = [
    {
      spinning: isShowCoverLoading,
      isDropZoneProfile: true,
      defaultFile: imageUploadCover,
      passFile: file => passFileCover(file),
      label: t('profile.banner'),
      handleRemoveImage: () => handleRemoveImageCover(),
    },
  ];
  const dropZoneImg = [
    {
      spinning: isShowPromoLoading,
      isDropZoneProfile: true,
      defaultFile: imageUploadPromoShot,
      passFile: () => passFilePromoShot,
      label: t('profile.headShot'),
      handleRemoveImage: () => handleRemoveImagePromoShot(),
    },

    {
      spinning: isShowAvatarLoading,
      isDropZoneProfile: true,
      defaultFile: imageUploadAvatar,
      passFile: file => passFileAvatar(file),
      label: t('profile.logo'),
      handleRemoveImage: () => handleRemoveImageAvatar(),
    },
  ];
  const onAddPhoto = useCallback(
    (file, typeImage) => {
      if (file) {
        // eslint-disable-next-line no-useless-escape
        const specialChars = /[`~!@#$%^&*()_|+\-=?;:'",<>\{\}\[\]\\\/]/gi;

        const imgUser = {
          file: new File([file], file.name.replace(specialChars, ''), {
            type: file.type,
          }),
          path,
          typePic:
            typeImage === IMG_OF_USER.AVATAR
              ? IMG_OF_USER.AVATAR
              : typeImage === IMG_OF_USER.COVER_IMAGE
              ? IMG_OF_USER.COVER_IMAGE
              : IMG_OF_USER.PROMOSHOT_IMAGE,
        };
        dispatch(actions.uploadImgUserRequest(imgUser));
      }
    },
    [actions, dispatch, path],
  );

  const passFileAvatar = useCallback(
    file => {
      setImageUploadAvatar(file);
      onAddPhoto(file, IMG_OF_USER.AVATAR);
    },

    [setImageUploadAvatar, onAddPhoto],
  );

  const handleRemoveImageAvatar = useCallback(() => {
    setImageUploadAvatar('');
  }, []);

  const passFileCover = useCallback(
    file => {
      setImageUploadCover(file);
      onAddPhoto(file, IMG_OF_USER.COVER_IMAGE);
    },
    [setImageUploadCover, onAddPhoto],
  );

  const handleRemoveImageCover = useCallback(() => {
    setImageUploadCover('');
  }, []);

  const passFilePromoShot = useCallback(
    file => {
      setImageUploadPromoShot(file);
      onAddPhoto(file, IMG_OF_USER.PROMOSHOT_IMAGE);
    },
    [setImageUploadPromoShot, onAddPhoto],
  );

  const handleRemoveImagePromoShot = useCallback(() => {
    setImageUploadPromoShot('');
  }, []);

  const socials = [
    {
      idLabel: t('facebookUrl'),
      nameProfile: t('profile.facebookUrl'),
      value: userInfo?.facebookUrl,
      handleChange: '',

      placeholder: t('profile.facebookUrl'),
      isRequired: false,
      type: 'text',
    },
    {
      idLabel: t('instagramUrl'),
      nameProfile: t('profile.instagramUrl'),
      value: userInfo?.instagramUrl,
      handleChange: '',

      placeholder: t('profile.instagramUrl'),
      isRequired: false,
      type: 'text',
    },
    {
      idLabel: t('soundcloudUrl'),
      nameProfile: t('profile.soundcloudUrl'),
      value: userInfo?.soundcloudUrl,
      handleChange: '',

      placeholder: t('profile.soundcloudUrl'),
      isRequired: false,
      type: 'text',
    },
    {
      idLabel: t('mixcloudUrl'),
      nameProfile: t('profile.mixcloudUrl'),
      value: userInfo?.mixcloudUrl,
      handleChange: '',

      placeholder: t('profile.mixcloudUrl'),
      isRequired: false,
      type: 'text',
    },
    {
      idLabel: t('youtubeUrl'),
      nameProfile: t('profile.youtubeUrl'),
      value: userInfo?.youtubeUrl,
      handleChange: '',

      placeholder: t('profile.youtubeUrl'),
      isRequired: false,
      type: 'text',
    },
    {
      idLabel: t('twitterUrl'),
      nameProfile: t('profile.twitterUrl'),
      value: userInfo?.twitterUrl,
      handleChange: '',

      placeholder: t('profile.twitterUrl'),
      isRequired: false,
      type: 'text',
    },
    {
      idLabel: t('spotifyUrl'),
      nameProfile: t('profile.spotifyUrl'),
      value: userInfo?.spotifyUrl,
      handleChange: '',

      placeholder: t('profile.spotifyUrl'),
      isRequired: false,
      type: 'text',
    },
    {
      idLabel: t('twitchUrl'),
      nameProfile: t('profile.twitchUrl'),
      value: userInfo?.twitchUrl,
      handleChange: '',

      placeholder: t('profile.twitchUrl'),
      isRequired: false,
      type: 'text',
    },
  ];

  const biography = [
    {
      idLabel: t('profile.Biography').toLowerCase(),
      nameProfile: t('profile.Biography'),
      value: userInfo?.biography,
      handleChange: '',

      placeholder: t('profile.exampleText'),
      isRequired: false,
      type: 'textarea',
    },
  ];

  const informations = [
    {
      idLabel: t('profile.firstName'),
      nameProfile: t('profile.FirstName'),
      value: userInfo?.firstName,
      handleChange: '',

      placeholder: t('profile.FirstName'),
      isRequired: true,
    },
    {
      idLabel: t('profile.lastName'),
      nameProfile: t('profile.LastName'),
      value: userInfo?.lastName,
      handleChange: '',

      placeholder: t('profile.LastName'),
      isRequired: false,
    },
  ];

  const transactionInformations = useMemo(() => {
    const taxIdentificationNumber = {
      id: 2,
      idLabel: t('profile.taxIdentificationNumber'),
      nameProfile: t('profile.SSNORTAXID'),
      value: userInfo?.taxIdentificationNumber,
      handleChange: '',

      placeholder: t('profile.SSNORTAXID'),
      isRequired: true,
    };
    let restOf = [
      {
        id: 1,
        idLabel: t('profile.paypalEmail'),
        nameProfile: t('profile.paypalEmailTitle'),
        value: userInfo?.paypalEmail,
        handleChange: '',
        isDisable: false,
        placeholder: t('profile.paypalEmailPlaceholder'),
        isRequired: true,
      },
      {
        id: 4,
        idLabel: 'hometown',
        nameProfile: 'Hometown',
        value: userInfo?.hometown,
        handleChange: '',
        placeholder: t('profile.hometown'),
        isRequired: false,
      },
    ];
    if (country === 'United States') {
      restOf = [...restOf, taxIdentificationNumber];
    }
    return restOf;
  }, [
    country,
    t,
    userInfo?.hometown,
    userInfo?.paypalEmail,
    userInfo?.taxIdentificationNumber,
  ]);

  const contacts = [
    {
      idLabel: 'mobileNumber',
      nameProfile: 'Mobile Number',
      value: userInfo?.mobileNumber,
      handleChange: '',
      placeholder: t('profile.Phone'),
      isRequired: true,
      type: 'select',
    },
    {
      idLabel: 'currentLocation',
      nameProfile: 'Current Location',
      value: userInfo?.currentLocation,
      handleChange: '',
      placeholder: t('profile.currentLocation'),
      isRequired: false,
      type: 'input',
    },
  ];

  const countries = [
    {
      idLabel: t('profile.Country').toLowerCase(),
      nameProfile: t('profile.Country'),
      value: userInfo?.country,
      handleChange: '',
      placeholder: t('profile.Country'),
      isRequired: false,
      type: 'country',
    },
  ];

  const sexOptions = [
    { value: 'male', label: t('profile.male') },
    { value: 'female', label: t('profile.female') },
    { value: 'other', label: t('profile.other') },
  ];

  const AddPhoto = useCallback(
    (e, key) => {
      const file = e.target.files[0] || [];
      const photoUrls = URL.createObjectURL(file);
      key === 'avatar' ? setPhotosUrl(photoUrls) : setBannerUrl(photoUrls);
      onAddPhoto(
        file,
        key === 'avatar' ? IMG_OF_USER.AVATAR : IMG_OF_USER.COVER_IMAGE,
      );
    },
    [onAddPhoto],
  );

  return {
    tabIndexProfile,
    setTabIndexProfile,
    sexOptions,
    dropZoneImg,
    informations,
    handleSubmit,
    onSubmit,
    errors,
    dropBannerImg,
    control,
    contacts,
    countries,
    biography,
    userDetail,
    gender,
    socials,
    handleChangeFilter,
    handleSelectCountry,
    country,
    dayOfBirth,
    handleChangeSelect,
    yubDateOfBirth,
    isLoading,
    listPhotosUrl,
    AddPhoto,
    isShowAvatarLoading,
    isShowCoverLoading,
    bannerUrl,
    transactionInformations,
    onSubmitColor,
    setImageUploadCover,
    imageUploadCover,
    passFileCover,
    passFileAvatar,
    isUpdateUserSuccess,
    setUpdateUserSuccess,
    fileChangeAvatar,
    isUploadAvatar,
    fileChangeBg,
    isUploadBg,
    showTrackPurchases,
    setShowTrackPurchases,
    showMyOwnTracks,
    setShowMyOwnTracks,
    setIsCountry,
    isCountry,
  };
};
