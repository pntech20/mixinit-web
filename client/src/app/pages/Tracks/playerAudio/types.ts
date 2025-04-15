import { Nullable } from 'app/constants/types';
import { Track } from 'app/models';

/* --- STATE --- */
export interface PlayerAudioState {
  audioList: Array<Track>;
  playingTrackId: string;
  playingTrack: Nullable<Track>;
  isAudioPlay: boolean;
  isPlaying: boolean;
  waveSurfer: any;
  waveSurferVideo: any;
  isShowVideoTrack: boolean;
  isLoadedSuccessVideoTrack: boolean;
  isUseInput: boolean;
}

export interface PayloadItemAudioList {
  trackId: string;
  dataUpdate: any;
}
