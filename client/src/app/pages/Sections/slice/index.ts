import { PayloadAction } from '@reduxjs/toolkit';
import { Section } from 'app/models';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { sectionsSaga } from './saga';
import {
  getLabelDetailPayload,
  GetSectionsPayload,
  MySectionsResponse,
  SectionsState,
} from './types';

export const initialState: SectionsState = {
  section: null,
  sections: [],
  allLabels: [],
  error: null,
  isLoading: false,
  pagination: null,
  sectionDetail: null,
  slug: '',
  sectionId: '',
  mySection: null,
  topLabels: [],
  isLoadingTopLabels: false,
  cacheLabels: {},
};

const slice = createSlice({
  name: 'sections',
  initialState,
  reducers: {
    getSectionsRequest(state, action: PayloadAction<GetSectionsPayload>) {
      state.error = null;
      !action.payload?.filter?.isCacheKey && (state.isLoading = true);
    },

    getSectionsSuccess(
      state,
      action: PayloadAction<{
        data: Array<Section>;
        cacheKey: any;
        isCacheKey: boolean;
      }>,
    ) {
      state.sections = action.payload.data;
      state.isLoading = false;
      !action.payload.isCacheKey &&
        (state.cacheLabels[action.payload.cacheKey] = action.payload.data);
    },
    getSectionsFailed(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
    updateSections(state, action: PayloadAction<any>) {
      state.sections = action.payload;
    },
    getAllLabelsRequest(state) {
      state.allLabels = [];
    },
    getAllLabelsSuccess(state, action: PayloadAction<Array<Section>>) {
      state.allLabels = action.payload;
    },

    getMyLabelRequest(state) {
      state.mySection = null;
      state.error = null;
      state.isLoading = true;
    },
    getMyLabelSuccess(state, action: PayloadAction<MySectionsResponse>) {
      state.mySection = action.payload.mySection;
      state.isLoading = false;
    },
    getMyLabelFailed(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },

    getTopLabelsRequest(state, action: PayloadAction<any>) {
      state.topLabels = [];
      state.error = null;
      state.isLoadingTopLabels = true;
    },
    getTopLabelsSuccess(state, action: PayloadAction<MySectionsResponse>) {
      state.topLabels = action.payload;
      state.isLoadingTopLabels = false;
    },
    getTopLabelsFailed(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isLoadingTopLabels = false;
    },

    //Get Section Detail

    getSectionDetailRequest(
      state,
      action: PayloadAction<getLabelDetailPayload>,
    ) {
      state.error = null;
      state.isLoading = true;
      state.slug = '';
    },
    getSectionDetailSuccess(state, action: PayloadAction<Section>) {
      state.sectionDetail = action.payload;
      state.isLoading = false;
    },
    getSectionDetailFailed(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },

    //update contributor
    updateContributorRequest(state, action) {
      state.error = null;
    },
    updateContributorSuccess(state, action: PayloadAction<Section>) {
      state.mySection = action.payload;
    },
    updateContributorFailed(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
  },
});

export const { actions } = slice;

export const useSectionsSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: sectionsSaga });
  return { actions: slice.actions };
};

/**
 * Example Usage:
 *
 * export function MyComponentNeedingThisSlice() {
 *  const { actions } = useSectionsSlice();
 *
 *  const onButtonClick = (evt) => {
 *    dispatch(actions.someAction());
 *   };
 * }
 */
