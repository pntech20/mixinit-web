import { PayloadAction } from '@reduxjs/toolkit';
import { toastSuccess } from 'app/helpers/toast';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { CratesSaga } from './saga';
import { CreatesState } from './types';
import { SORT_TYPE } from 'app/constants/enum';

export const initialState: CreatesState = {
  error: null,
  crates: [],
  pagination: null,
  isLoading: false,
  myTrackCrates: [],
  filterRules: {},
  isSaveCrate: false,
  valueNameCrate: '',
  isEditCrate: false,
  payloadCrate: {
    name: '',
    sort: SORT_TYPE.PUBLISHED_AT_DESC,
    search: '',
    bpmStart: undefined,
    bpmEnd: undefined,
    yearFrom: undefined,
    yearTo: undefined,
    showGenres: undefined,
    showTags: undefined,
    showContributors: undefined,
    showTrackKeys: undefined,
    labelId: undefined,
    showAudio: true,
    showVideo: true,
    clean: true,
    dirty: true,
  },
};

const slice = createSlice({
  name: 'crates',
  initialState,
  reducers: {
    getCratesRequest(state, action: PayloadAction<any>) {
      state.isLoading = true;
      state.error = null;
      state.pagination = null;
      state.crates = [];
    },
    getCratesSuccess(state, action: PayloadAction<any>) {
      state.crates = action.payload;
      state.isLoading = false;
      state.pagination = action.payload.pagination;
    },
    getCratesFailed(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isLoading = false;
    },
    getMyCratesRequest(state, action: PayloadAction<any>) {
      state.isLoading = true;
      state.error = null;
      state.pagination = null;
    },
    getMyCratesSuccess(state, action: PayloadAction<any>) {
      state.myTrackCrates = action.payload;
      state.isLoading = false;
      state.pagination = action.payload.pagination;
    },
    getMyCratesFailed(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isLoading = false;
    },
    createsCratesRequest(state, action: PayloadAction<any>) {
      state.isLoading = true;
      state.error = null;
      state.pagination = null;
    },
    createsCratesSuccess(state, action: PayloadAction<any>) {
      const newCrate = action.payload;
      state.myTrackCrates.push(newCrate);
      state.isLoading = false;
      toastSuccess('Create Crate Success');
    },
    createsCratesFailed(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isLoading = true;
    },

    updateCrateRequest(state, action: PayloadAction<any>) {
      state.isLoading = false;
    },
    updateCrateSuccess(state, action: PayloadAction<any>) {
      const index = state.myTrackCrates.findIndex(
        crate => crate._id === action.payload._id,
      );
      if (index > -1) state.myTrackCrates[index] = action.payload;
      toastSuccess('Update Crate Success');
    },
    updateCratesFailed(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
    deleteMyCrateRequest(state, action: PayloadAction<any>) {
      state.isLoading = true;
    },
    deleteMyCrateSuccess(state, action: PayloadAction<any>) {
      state.myTrackCrates = state.myTrackCrates.filter(
        crate => crate._id !== action.payload._id,
      );
      toastSuccess('Delete Crate Success');
    },
    deleteMyCratesFailed(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
    addRule(state, action: PayloadAction<any>) {
      state.filterRules = action.payload;
      state.isSaveCrate = true;
      state.isEditCrate = true;
    },
    addString(state, action: PayloadAction<any>) {
      state.valueNameCrate = action.payload;
    },
    removeRule(state, action: PayloadAction<any>) {
      state.filterRules = action.payload;
      state.isSaveCrate = false;
    },

    updatePayloadCrate(state, action: PayloadAction<any>) {
      state.payloadCrate = action.payload;
    },
  },
});
export const { actions } = slice;

export const useCratesSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: CratesSaga });
  return { actions: actions };
};
