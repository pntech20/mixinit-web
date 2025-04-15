import { MY_LIBRARY_TABS, TYPE_SEARCH_OPTION } from './../../constants/enum';
import { DATE_RANGE, SORT_TYPE } from 'app/constants/enum';
import {
  FiltersProps,
  IOption,
  OptionsFiltersProps,
} from 'app/constants/interface';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useCommunity } from '../Community/useCommunity';
import { useGenres } from '../genres/useGenres';
import { useSections } from '../sections/useSections';
import { useTags } from '../tags/useTags';
import { useTracksKeys } from '../trackKeys/useTrackKeys';

export const useFilters = () => {
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const { tags = [] } = useTags();
  const { genres = [] } = useGenres();
  const { sections = [], isLoading: isLoadingSectionOptions } = useSections();
  const { trackKeys = [] } = useTracksKeys();
  const { contributors: users } = useCommunity();

  const tagsOptions = useMemo(() => {
    return ([...tags] || [])
      .sort(function (a, b) {
        return a.name.localeCompare(b.name);
      })
      .map(tag => {
        return { label: tag.name, value: tag._id };
      });
  }, [tags]);

  const genresOptions: Array<OptionsFiltersProps> = useMemo(() => {
    return ([...genres] || [])
      .sort(function (a, b) {
        return a.name.localeCompare(b.name);
      })
      .map(genre => {
        return { label: genre.name, value: genre._id };
      });
  }, [genres]);

  const trackKeysOptions: Array<OptionsFiltersProps> = useMemo(() => {
    return ([...trackKeys] || [])
      .sort(function (a, b) {
        return a.musicKey.localeCompare(b.musicKey);
      })
      .map(trackKey => {
        return {
          label:
            trackKey?.musicKey === 'None' || trackKey?.camelotKey === 'None'
              ? 'None'
              : `${trackKey?.musicKey} / ${trackKey?.camelotKey}`,
          value: trackKey._id,
        };
      });
  }, [trackKeys]);

  const camelotKeysOptions: Array<OptionsFiltersProps> = useMemo(() => {
    return trackKeys.map(trackKey => {
      return { label: trackKey.camelotKey, value: trackKey._id };
    });
  }, [trackKeys]);

  const sectionsOptions: Array<OptionsFiltersProps> = useMemo(() => {
    return ([...sections] || [])
      .sort(function (a, b) {
        return a.name.localeCompare(b.name);
      })
      .map(section => {
        return { label: section.name, value: section._id };
      });
  }, [sections]);

  const usersOptions: Array<IOption> = useMemo(() => {
    return ([...users] || [])
      .sort(function (a, b) {
        return a.username.localeCompare(b.username);
      })
      .map(user => {
        return { label: user.username, value: user._id };
      });
  }, [users]);

  const sortByOptions: IOption[] = useMemo(
    () => [
      {
        label: t('listOptionsSortBy.NewestFirst'),
        value: SORT_TYPE.CREATED_AT_DESC,
      },
      {
        label: 'Top Movers 7 days',
        value: SORT_TYPE.TOP_MOVERS_7,
      },
      {
        label: 'Top Movers 30 days',
        value: SORT_TYPE.TOP_MOVERS_30,
      },
      {
        label: 'Top Movers 90 days',
        value: SORT_TYPE.TOP_MOVERS_90,
      },
      {
        label: 'Top Movers All Time',
        value: SORT_TYPE.TOP_MOVERS_ALL,
      },
      // {
      //   label: t('listOptionsSortBy.OldestFirst'),
      //   value: SORT_TYPE.CREATED_AT_ASC,
      // },
      // {
      //   label: t('listOptionsSortBy.MostPopular'),
      //   value: SORT_TYPE.Most_Popular,
      // },
      {
        label: t('listOptionsSortBy.trackLowHi'),
        value: SORT_TYPE.TRACK_ASC,
      },
      {
        label: t('listOptionsSortBy.trackHiLow'),
        value: SORT_TYPE.TRACK_DESC,
      },
      {
        label: t('listOptionsSortBy.titleLowHi'),
        value: SORT_TYPE.TITLE_ASC,
      },
      {
        label: t('listOptionsSortBy.titleHiLow'),
        value: SORT_TYPE.TITLE_DESC,
      },
      {
        label: t('listOptionsSortBy.priceHiLow'),
        value: SORT_TYPE.PRICE_DESC,
      },
      {
        label: t('listOptionsSortBy.priceLowHi'),
        value: SORT_TYPE.PRICE_ASC,
      },
    ],
    [t],
  );

  const sortByOptionsLabel: IOption[] = useMemo(
    () => [
      {
        label: 'Title(A-Z)',
        value: SORT_TYPE.NAME_ASC,
      },
      {
        label: 'Title(Z-A)',
        value: SORT_TYPE.NAME_DESC,
      },
      // {
      //   label: 'Top Movers 7 days',
      //   value: SORT_TYPE.TOP_MOVERS_7,
      // },
      // {
      //   label: 'Top Movers 30 days',
      //   value: SORT_TYPE.TOP_MOVERS_30,
      // },
      // {
      //   label: 'Top Movers 90 days',
      //   value: SORT_TYPE.TOP_MOVERS_90,
      // },
      // {
      //   label: 'Top Movers All Time',
      //   value: SORT_TYPE.TOP_MOVERS_ALL,
      // },
      // {
      //   label: t('listOptionsSortBy.OldestFirst'),
      //   value: SORT_TYPE.CREATED_AT_ASC,
      // },
    ],
    [],
  );

  const sortByTrackOptions: IOption[] = useMemo(
    () => [
      {
        label: t('listOptionsSortBy.NewestFirst'),
        value: SORT_TYPE.CREATED_AT_DESC,
      },
      {
        label: t('listOptionsSortBy.OldestFirst'),
        value: SORT_TYPE.CREATED_AT_ASC,
      },
      {
        label: t('listOptionsSortBy.mostDl'),
        value: SORT_TYPE.TOTAL_BUYS_DESC,
      },
    ],
    [t],
  );

  const buyTrackOptions: IOption[] = useMemo(
    () => [
      {
        label: 'All purchases',
        value: MY_LIBRARY_TABS.ALL_PURCHASE,
      },
      {
        label: 'Cash purchases',
        value: MY_LIBRARY_TABS.CASH_PURCHASE,
      },
      {
        label: 'Star purchases',
        value: MY_LIBRARY_TABS.STAR_PURCHASE,
      },
      {
        label: 'Subscription purchases',
        value: MY_LIBRARY_TABS.SUBSCRIPTION_PURCHASE,
      },
    ],
    [],
  );

  const sortByTrackOptionsV1: IOption[] = useMemo(
    () => [
      {
        label: t('listOptionsSortBy.NewestFirst'),
        value: SORT_TYPE.PUBLISHED_AT_DESC,
      },
      {
        label: t('listOptionsSortBy.Oldest'),
        value: SORT_TYPE.PUBLISHED_AT_ASC,
      },
      {
        label: 'Top Movers 7 days',
        value: SORT_TYPE.TOP_MOVERS_7,
      },
      {
        label: 'Top Movers 30 days',
        value: SORT_TYPE.TOP_MOVERS_30,
      },
      {
        label: 'Top Movers 90 days',
        value: SORT_TYPE.TOP_MOVERS_90,
      },
      {
        label: 'Top Movers All Time',
        value: SORT_TYPE.TOP_MOVERS_ALL,
      },
      {
        label: 'Most Likes',
        value: SORT_TYPE.TOTAL_LIKES_DESC,
      },
      {
        label: t('listOptionsSortBy.titleLowHi'),
        value: SORT_TYPE.TITLE_ASC,
      },
      {
        label: t('listOptionsSortBy.titleHiLow'),
        value: SORT_TYPE.TITLE_DESC,
      },
      {
        label: t('listOptionsSortBy.musicKeyAZ'),
        value: SORT_TYPE.MUSIC_KEY_ASC,
      },
      {
        label: t('listOptionsSortBy.musicKeyZA'),
        value: SORT_TYPE.MUSIC_KEY_DESC,
      },
      {
        label: t('listOptionsSortBy.camelotKeyAZ'),
        value: SORT_TYPE.CAMELOT_KEY_ASC,
      },
      {
        label: t('listOptionsSortBy.camelotKeyZA'),
        value: SORT_TYPE.CAMELOT_KEY_DESC,
      },
      {
        label: t('listOptionsSortBy.bpm-Hi-Low'),
        value: SORT_TYPE.BPM_DESC,
      },
      {
        label: t('listOptionsSortBy.bpmLow-Hi'),
        value: SORT_TYPE.BPM_ASC,
      },
      {
        label: t('listOptionsSortBy.year-Hi-Low'),
        value: SORT_TYPE.YEAR_DESC,
      },
      {
        label: t('listOptionsSortBy.yearLow-Hi'),
        value: SORT_TYPE.YEAR_ASC,
      },
      // {
      //   label: t('listOptionsSortBy.timeHiLow'),
      //   value: SORT_TYPE.DURATION_DESC,
      // },
      // {
      //   label: t('listOptionsSortBy.timeLowHi'),
      //   value: SORT_TYPE.DURATION_ASC,
      // },
      {
        label: t('listOptionsSortBy.priceHiLow'),
        value: SORT_TYPE.PRICE_DESC,
      },
      {
        label: t('listOptionsSortBy.priceLowHi'),
        value: SORT_TYPE.PRICE_ASC,
      },
    ],
    [t],
  );

  const sortByTrackMyLibraryOptionsV1: IOption[] = useMemo(
    () => [
      {
        label: t('listOptionsSortBy.NewestFirst'),
        value: SORT_TYPE.CREATED_AT_PURCHASE_DESC,
      },
      {
        label: t('listOptionsSortBy.OldestFirst'),
        value: SORT_TYPE.CREATED_AT_PURCHASE_ASC,
      },
      {
        label: t('listOptionsSortBy.titleLowHi'),
        value: SORT_TYPE.TITLE_ASC,
      },
      {
        label: t('listOptionsSortBy.titleHiLow'),
        value: SORT_TYPE.TITLE_DESC,
      },
    ],
    [t],
  );

  const sortByTrackCashOptionsV1: IOption[] = useMemo(
    () => [
      {
        label: t('listOptionsSortBy.NewestFirst'),
        value: SORT_TYPE.CREATED_AT_PURCHASE_DESC,
      },
      {
        label: t('listOptionsSortBy.OldestFirst'),
        value: SORT_TYPE.CREATED_AT_PURCHASE_ASC,
      },
    ],
    [t],
  );

  const timeFrameOptions: IOption[] = useMemo(
    () => [
      {
        label: t('listOptionsTimeFrame.allTime'),
        value: DATE_RANGE.ALL_TIME,
      },
      {
        label: t('listOptionsTimeFrame.last7Days'),
        value: DATE_RANGE.LAST_7_DAYS,
      },
      {
        label: t('listOptionsTimeFrame.last30Days'),
        value: DATE_RANGE.LAST_30_DAYS,
      },
      {
        label: t('listOptionsTimeFrame.last90Days'),
        value: DATE_RANGE.LAST_90_DAYS,
      },
    ],
    [t],
  );

  const searchOptionFillter: IOption[] = useMemo(
    () => [
      {
        label: t('listOptionFillterSong.tracks'),
        value: TYPE_SEARCH_OPTION.TRACKS,
      },
      {
        label: t('listOptionFillterSong.releases'),
        value: TYPE_SEARCH_OPTION.RELEASES,
      },
      {
        label: t('listOptionFillterSong.contributors'),
        value: TYPE_SEARCH_OPTION.CONTRIBUTORS,
      },
      // {
      //   label: t('listOptionFillterSong.playlists'),
      //   value: TYPE_SEARCH_OPTION.PLAYLISTS,
      // },
      {
        label: t('listOptionFillterSong.labels'),
        value: TYPE_SEARCH_OPTION.LABELS,
      },
    ],
    [t],
  );

  const crateOptions: IOption[] = useMemo(
    () => [
      {
        label: t('listOptionsCrate.customOrder'),
        value: 'custom order',
      },
      {
        label: t('listOptionsCrate.newestFirst'),
        value: 'newest first',
      },
      {
        label: t('listOptionsCrate.oldestFirst'),
        value: 'oldest first',
      },
      {
        label: t('listOptionsCrate.az'),
        value: 'a-z',
      },
      {
        label: t('listOptionsCrate.za'),
        value: 'z-a',
      },
    ],
    [t],
  );

  const listOptionsSortByCommunity: IOption[] = useMemo(
    () => [
      {
        label: 'Last Uploaded',
        value: SORT_TYPE.LATEST_UPLOADED_DESC,
      },
      {
        label: 'Top Movers 7 days',
        value: SORT_TYPE.TOP_MOVERS_7,
      },
      {
        label: 'Top Movers 30 days',
        value: SORT_TYPE.TOP_MOVERS_30,
      },
      {
        label: 'Top Movers 90 days',
        value: SORT_TYPE.TOP_MOVERS_90,
      },
      {
        label: 'Top Movers All Time',
        value: SORT_TYPE.TOP_MOVERS_ALL,
      },
      // {
      //   label: t('listOptionsSortBy.OldestFirst'),
      //   value: SORT_TYPE.CREATED_AT_ASC,
      // },
      // {
      //   label: t('listOptionsSortByCommunity.mostTracks'),
      //   value: SORT_TYPE.TOTAL_TRACKS_DESC,
      // },
      // {
      //   label: t('listOptionsSortByCommunity.mostReleases'),
      //   value: SORT_TYPE.TOTAL_RELEASES_DESC,
      // },
      {
        label: t('listOptionsSortByCommunity.usernameAZ'),
        value: SORT_TYPE.USERNAME_ASC,
      },
      {
        label: t('listOptionsSortByCommunity.usernameZA'),
        value: SORT_TYPE.USERNAME_DESC,
      },
    ],
    [t],
  );

  const optionForAll = type => {
    return {
      label: `All ${type}`,
      value: 'all',
    };
  };

  const filters = [
    {
      name: 'showTags',
      opions: tagsOptions,
      label: t('filter.selectTags'),
      multi: true,
      all: 'All Tags',
    },
    {
      name: 'showGenres',
      opions: genresOptions,
      label: t('filter.selectGenres'),
      multi: true,
      all: 'All Genres',
    },
    {
      name: 'showTrackKeys',
      opions: trackKeysOptions,
      label: t('filter.selectKeys'),
      multi: true,
      all: 'All TrackKeys',
    },
    {
      name: 'showSections',
      opions: sectionsOptions,
      label: t('filter.selectLabel'),
      all: 'All Sections',
      multi: false,
    },
    {
      name: 'checkbox',
      multi: false,
    },
  ];

  const listFiltersSelectTrack = useMemo(() => {
    return [
      {
        name: 'showGenres',
        opions: genresOptions,
        label: t('filterV1.genres'),
        multi: true,
        all: 'All',
      },
      // {
      //   name: 'showSubGenres',
      //   opions: genresOptions,
      //   label: t('filterV1.subGenre'),
      //   multi: true,
      //   all: 'All',
      // },
      {
        name: 'showTags',
        opions: tagsOptions,
        label: t('filterV1.tags'),
        multi: true,
        all: 'All',
      },
      {
        name: 'showSections',
        opions: sectionsOptions,
        label: t('filterV1.labels'),
        all: 'All',
        multi: true,
      },
      {
        name: 'showTrackKeys',
        opions: trackKeysOptions,
        label: t('filterV1.keys'),
        multi: true,
        all: 'All',
      },
      {
        name: 'showContributors',
        opions: usersOptions,
        label: t('filterV1.contributors'),
        all: 'All',
        multi: true,
      },
      // {
      //   name: 'checkbox',
      //   multi: false,
      // },
    ];
  }, [
    genresOptions,
    sectionsOptions,
    t,
    tagsOptions,
    trackKeysOptions,
    usersOptions,
  ]);

  const filtersV1 = useMemo(() => {
    const isMyMediaPage = pathname.includes('my-media');
    const isCreatePlaylistPage = pathname.includes('playlists/admin/create');
    const isGenrePage = pathname.includes('genres');
    const isTagPage = pathname.includes('tags');
    const isLabelPage = pathname.includes('labels');
    const isContributorDetailPage = pathname.includes('/contributors/');
    const isReleaseDetailPage = pathname.includes('/multipacks/');
    const isTrackPage = pathname.includes('/tracks');

    if (isTrackPage) {
      listFiltersSelectTrack.splice(2, 1);
    }

    if (isMyMediaPage || isContributorDetailPage || isReleaseDetailPage) {
      listFiltersSelectTrack.splice(4, 1);
    }
    if (isGenrePage) {
      listFiltersSelectTrack.splice(0, 1);
    }
    if (isTagPage) {
      listFiltersSelectTrack.splice(1, 1);
    }
    if (
      isMyMediaPage ||
      isLabelPage ||
      isReleaseDetailPage ||
      isCreatePlaylistPage
    ) {
      listFiltersSelectTrack.splice(2, 1);
    }
    return listFiltersSelectTrack;
  }, [listFiltersSelectTrack, pathname]);

  const filtersCommunity = [
    {
      name: 'sort',
      opions: listOptionsSortByCommunity,
      label: t('filter.sortBy'),
      multi: false,
    },
    {
      name: 'dateRange',
      opions: timeFrameOptions,
      label: t('filter.timeFrame'),
      multi: false,
    },
  ];

  const filtersQuickChart = [
    {
      name: 'dateRange',
      opions: timeFrameOptions,
      label: t('filter.selectATime'),
      multi: false,
    },
    {
      name: 'showGenres',
      opions: [optionForAll('genres'), ...genresOptions],
      label: t('filter.selectAGenre'),
      multi: false,
    },
    {
      name: 'showSection',
      opions: [optionForAll('labels'), ...sectionsOptions],
      label: t('filter.selectALabel'),
      multi: false,
    },
    {
      name: 'showTags',
      opions: [optionForAll('tags'), ...tagsOptions],
      label: t('filter.selectATag'),
      multi: false,
    },
  ];

  const filtersCommonLabels: FiltersProps[] = useMemo(() => {
    return [
      // {
      //   title: 'Genres',
      //   name: 'showGenres',
      //   opions: genresOptions,
      //   label: t('filter.selectGenres'),
      //   multi: true,
      //   all: 'Genres',
      // },
      // {
      //   title: 'Tags',
      //   name: 'showTags',
      //   opions: tagsOptions,
      //   label: t('filter.selectTags'),
      //   multi: true,
      //   all: 'Tags',
      // },
    ];
  }, []);

  const filtersLabels: FiltersProps[] = useMemo(() => {
    const isUserDetailPage = pathname.includes('contributors/');
    return isUserDetailPage
      ? filtersCommonLabels
      : [
          ...filtersCommonLabels,
          {
            title: 'Contributors',
            name: 'showContributors',
            opions: usersOptions,
            label: t('filter.selectContributor'),
            multi: false,
            all: 'Contributors',
          },
        ];
  }, [filtersCommonLabels, pathname, t, usersOptions]);

  const listFiltersReleases: FiltersProps[] = useMemo(() => {
    return [
      {
        title: 'Genres',
        name: 'showGenres',
        opions: genresOptions,
        label: t('filter.selectGenres'),
        multi: true,
        all: 'Genres',
      },
      {
        title: 'Tags',
        name: 'showTags',
        opions: tagsOptions,
        label: t('filter.selectTags'),
        multi: true,
        all: 'Tags',
      },
      {
        title: 'Labels',
        name: 'showSections',
        opions: sectionsOptions,
        label: t('filter.selectLabel'),
        multi: true,
        all: 'Labels',
      },
      {
        title: 'Contributors',
        name: 'showContributors',
        opions: usersOptions,
        label: t('filter.selectContributor'),
        multi: true,
        all: 'Contributors',
      },
    ];
  }, [genresOptions, sectionsOptions, t, tagsOptions, usersOptions]);

  const filtersReleases: any = useMemo(() => {
    const isMyMediaPage = pathname.includes('my-releases');
    const isMultipacksPage =
      pathname.includes('/multipacks') && !pathname.includes('/multipacks/');
    const isLabelPage = pathname.includes('labels');
    const isContributorDetailPage = pathname.includes('/contributors/');

    if (isMyMediaPage || isContributorDetailPage) {
      listFiltersReleases.splice(3, 1);
    }

    if (isLabelPage) {
      listFiltersReleases.splice(2, 1);
    }
    if (isMultipacksPage) {
      listFiltersReleases.splice(3, 1);
    }
    return listFiltersReleases;
  }, [listFiltersReleases, pathname]);

  const filtersPlayList: FiltersProps[] = [
    {
      title: 'Genres',
      name: 'showGenres',
      opions: genresOptions,
      label: t('filter.selectGenres'),
      multi: true,
      all: 'Genres',
    },
    {
      title: 'Tags',
      name: 'showTags',
      opions: tagsOptions,
      label: t('filter.selectTags'),
      multi: true,
      all: 'Tags',
    },
    {
      title: 'Labels',
      name: 'showSections',
      opions: sectionsOptions,
      label: t('filter.selectLabel'),
      multi: true,
      all: 'Labels',
    },
    // {
    //   title: 'Contributors',
    //   name: 'showContributors',
    //   opions: contributorsHavePlaylist,
    //   label: t('filter.selectContributor'),
    //   multi: false,
    //   all: 'All',
    // },
  ];

  const releasesSortByOptions: IOption[] = useMemo(
    () => [
      {
        label: t('listOptionsSortBy.NewestFirst'),
        value: SORT_TYPE.CREATED_AT_DESC,
      },
      {
        label: t('listOptionsSortBy.year-Hi-Low'),
        value: SORT_TYPE.YEAR_DESC,
      },
      {
        label: t('listOptionsSortBy.yearLow-Hi'),
        value: SORT_TYPE.YEAR_ASC,
      },
      {
        label: t('listOptionsSortBy.OldestFirst'),
        value: SORT_TYPE.CREATED_AT_ASC,
      },
    ],
    [t],
  );

  const playlistSortByOptions: IOption[] = useMemo(
    () => [
      {
        label: t('listOptionsSortBy.NewestFirst'),
        value: SORT_TYPE.CREATED_AT_DESC,
      },
      {
        label: t('listOptionsSortBy.OldestFirst'),
        value: SORT_TYPE.CREATED_AT_ASC,
      },
    ],
    [t],
  );

  const [filter, setFilter] = useState({
    dateRange: timeFrameOptions[3],
    showGenres: optionForAll('genres'),
    showSection: optionForAll('labels'),
    showTags: optionForAll('tags'),
  });

  const handleChangeFilter = useCallback(
    (event, key) => {
      setFilter(current => ({
        ...current,
        [key]: event,
      }));
    },
    [setFilter],
  );

  const listTimeFrame = useMemo(
    () => [
      {
        name: `7`,
        value: DATE_RANGE.LAST_7_DAYS,
      },
      {
        name: `30`,
        value: DATE_RANGE.LAST_30_DAYS,
      },
      {
        name: `90`,
        value: DATE_RANGE.LAST_90_DAYS,
      },
      {
        name: 'All Time',
        value: DATE_RANGE.ALL_TIME,
      },
    ],
    [],
  );

  const listTimeTop10Lists = useMemo(
    () => [
      {
        name: `7 days`,
        value: DATE_RANGE.LAST_7_DAYS,
      },
      {
        name: `30 days`,
        value: DATE_RANGE.LAST_30_DAYS,
      },
      {
        name: `90 days`,
        value: DATE_RANGE.LAST_90_DAYS,
      },
      {
        name: 'All-Time',
        value: DATE_RANGE.ALL_TIME,
      },
    ],
    [],
  );

  return {
    sortByOptions,
    sortByTrackOptions,
    sortByTrackOptionsV1,
    filtersV1,
    searchOptionFillter,
    timeFrameOptions,
    crateOptions,
    tagsOptions,
    genresOptions,
    trackKeysOptions,
    sectionsOptions,
    isLoadingSectionOptions,
    filters,
    filtersCommunity,
    listOptionsSortByCommunity,
    filtersQuickChart,
    filtersReleases,
    filtersPlayList,
    releasesSortByOptions,
    sortByOptionsLabel,
    playlistSortByOptions,
    filter,
    setFilter,
    handleChangeFilter,
    listTimeFrame,
    filtersLabels,
    usersOptions,
    camelotKeysOptions,
    listTimeTop10Lists,
    buyTrackOptions,
    sortByTrackMyLibraryOptionsV1,
    sortByTrackCashOptionsV1,
  };
};
