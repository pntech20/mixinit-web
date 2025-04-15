import { PayloadAction } from '@reduxjs/toolkit';
import { Track } from 'app/models';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { PlayerSaga } from './saga';
import { PlayerAudioState } from './types';

export const initialState: PlayerAudioState = {
  audioList: [],
  playingTrackId: '',
  playingTrack: null,
  isAudioPlay: false,
  isPlaying: false,
  waveSurfer: null,
  waveSurferVideo: null,
  isShowVideoTrack: false,
  isLoadedSuccessVideoTrack: false,
  isUseInput: false,
};

const slice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    selectAudio(state, action: PayloadAction<Track>) {
      state.audioList = [...state.audioList, action.payload];
    },
    setPlayingTrackId(state, action: PayloadAction<string>) {
      state.playingTrackId = action.payload;
    },
    removeAudioList(state) {
      state.isPlaying = false;
      state.audioList = [];
      state.isAudioPlay = false;
      state.playingTrack = null;
    },
    setAudioList(state, action: PayloadAction<Track[]>) {
      state.audioList = action.payload;
    },
    setIsAudioPlay(state, action: PayloadAction<boolean>) {
      state.isAudioPlay = action.payload;
      if (!action.payload) {
        state.isPlaying = false;
        state.audioList = [];
        state.playingTrack = null;
      }
    },
    setPlayingTrack(state, action: PayloadAction<Track>) {
      state.playingTrack = action.payload;
    },
    setIsPlaying(state, action: PayloadAction<any>) {
      const isPlaying = action.payload;
      state.isPlaying = isPlaying;
    },
    setWaveSurfer(state, action) {
      state.waveSurfer = action.payload;
    },
    setWaveSurferVideo(state, action) {
      state.waveSurferVideo = action.payload;
    },
    setShowVideoTrack(state, action) {
      state.isShowVideoTrack = action.payload;
    },
    setLoadedSuccessVideoTrack(state, action) {
      state.isLoadedSuccessVideoTrack = action.payload;
    },

    setIsUseInput(state, action) {
      state.isUseInput = action.payload;
    },
  },
});

export const { actions } = slice;
export const actionsPlayerAudios = slice.actions;
export const usePlayerSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: PlayerSaga });
  return { actions: slice.actions };
};
