import { Button } from '@chakra-ui/button';
import classNames from 'classnames';
import { Component } from 'react';
import ReactDOM from 'react-dom';
import { FaPause, FaPlay } from 'react-icons/fa';
import LoadingOverlay from 'react-loading-overlay';
import WaveSurfer from 'wavesurfer.js';
import CursorPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.cursor.min.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions.min.js';
import styles from './audioPlayer.module.scss';
import cursorConfig from './config/cursorConfig';
import waveConfig from './config/waveConfig';
import React from 'react';

type Props = {
  blobToPlay: any;
  onCut: Function;
  secondsPlay: number;
  isEdit?: boolean;
  isCutting?: boolean;
  isShowCuttingRegion?: boolean;
  setPreviewStartAt?: Function;
  setPreviewEndAt?: Function;
  previewEndAtCurrent?: number;
  previewStartAtCurrent?: number;
};
type State = {
  /** Is the song currently playing. */
  isPlaying: boolean;
  /** * Start time of the region to cut. */
  cutStart: number;
  /** Original start time of the region (used when user presses 'Cancel'). */
  originalCutStart: number;
  /** End time of the region to cut. */
  cutEnd: number;
  /** Original end time of the region (used when user presses 'Cancel'). */
  originalCutEnd: number;
  /** Should the song be cut with a fade in. */
  addFadeIn: boolean;
  /** Should the song be cut with a fade out. */
  addFadeOut: boolean;
  /** The main library for displaying the audio wave. */
  waveSurfer?: WaveSurfer;
  /** Marks whether the regions were moved. */
  wasRegionChanged: boolean;
};

export default class AudioPlayers extends Component<Props, State> {
  private readonly WAVEFORM_CONTAINER: string = 'waveform';
  private readonly REGION_COLOR: string = 'rgba(0, 123, 255, 0.48)';
  private waveformRef: React.RefObject<HTMLDivElement>;
  private isVisible: boolean = true;
  private isInitialized: boolean = false;

  constructor(props: Props) {
    super(props);
    this.waveformRef = React.createRef();
    this.state = {
      isPlaying: false,
      originalCutStart: NaN,
      originalCutEnd: NaN,
      cutStart: NaN,
      cutEnd: NaN,
      addFadeIn: false,
      addFadeOut: false,
      wasRegionChanged: false,
    };
  }

  /** Generate and show the audio wave. */
  componentDidMount() {
    this.initializeWaveSurfer();
  }

  componentWillUnmount = () => {
    this.cleanupWaveSurfer();
  };

  componentDidUpdate = (prevProps: Props, prevState: State) => {
    // Only reinitialize if blobToPlay changes
    if (prevProps.blobToPlay !== this.props.blobToPlay) {
      this.cleanupWaveSurfer();
      this.initializeWaveSurfer();
    }

    // Handle seconds play changes
    if (prevProps.secondsPlay !== this.props.secondsPlay) {
      this.setState({
        cutStart: 0,
        cutEnd: this.props.secondsPlay,
      });

      const { waveSurfer } = this.state;
      if (this.props.isShowCuttingRegion && waveSurfer) {
        const newRegion = this.recreateRegion(
          waveSurfer,
          0,
          this.props.secondsPlay,
        );

        if (this.state.isPlaying) {
          newRegion.play();
        }
      }
      this.props.onCut(0, this.props.secondsPlay);
    }

    // Handle cutting state changes
    if (prevProps.isCutting !== this.props.isCutting) {
      if (this.props.isCutting) {
        if (this.state.isPlaying) {
          this.handleClickTogglePlay();
        }
      }
    }
  };

  private cleanupWaveSurfer = () => {
    const { waveSurfer } = this.state;
    if (waveSurfer) {
      waveSurfer.destroy();
      this.setState({ waveSurfer: undefined });
      this.isInitialized = false;
    }
  };

  private initializeWaveSurfer = () => {
    if (this.isInitialized) return;

    const { blobToPlay, isEdit = false } = this.props;

    if (!this.waveformRef.current) return;

    const waveSurfer = WaveSurfer.create({
      container: this.waveformRef.current,
      ...waveConfig,
      plugins: [
        CursorPlugin.create({ ...cursorConfig }),
        RegionsPlugin.create(),
      ],
    });

    waveSurfer.on('ready', () => {
      this.onWaveSurferReady(waveSurfer);
      this.isInitialized = true;
    });
    waveSurfer.on('finish', () => this.onSongFinishedPlaying());
    isEdit ? waveSurfer.load(blobToPlay) : waveSurfer.loadBlob(blobToPlay);
  };

  /**
   * Start listening to region events.
   * Draw the region itself.
   */
  onWaveSurferReady = (waveSurfer: WaveSurfer) => {
    waveSurfer.on('region-created', this.onCropRegionCreated);
    waveSurfer.on('region-updated', this.onCropRegionUpdated);
    waveSurfer.on('region-update-end', this.onCropRegionUpdateEnd);

    let cutStart: number;
    let cutEnd: number;
    const { secondsPlay } = this.props;
    // const duration = waveSurfer.getDuration();

    // if (duration > 40) {
    //   cutStart = 20;
    //   cutEnd = duration - 20;
    // } else {
    //   cutStart = 0;
    //   cutEnd = duration;
    // }
    cutStart = 0;
    cutEnd = secondsPlay;
    const { previewEndAtCurrent, previewStartAtCurrent } = this.props;
    if (
      previewEndAtCurrent &&
      previewStartAtCurrent &&
      Math.floor(previewEndAtCurrent) - secondsPlay ===
        Math.floor(previewStartAtCurrent)
    ) {
      cutEnd = previewEndAtCurrent;
      cutStart = previewEndAtCurrent - secondsPlay;
    }

    this.setState({
      waveSurfer,
      cutStart,
      cutEnd: cutStart + secondsPlay,
      originalCutStart: cutStart,
      originalCutEnd: cutEnd,
    });
    if (this.props.setPreviewEndAt) {
      this.props.setPreviewEndAt(cutStart + secondsPlay);
    }
    if (this.props.setPreviewStartAt) {
      this.props.setPreviewStartAt(cutStart);
    }
    this.recreateRegion(
      waveSurfer,
      cutStart,
      this.state.cutStart + secondsPlay,
    );
  };

  onCropRegionCreated = (params: any) => {
    // Remove region's 'title' attribute showing the region's duration.
    params.element.attributes.title.value = '';
  };

  /**
   * Called when the draggable area has been moved.
   * Recreate region if starting end overlaps the ending.
   */
  onCropRegionUpdated = (params: any) => {
    const { start, end } = params;
    const { cutStart, cutEnd, waveSurfer, isPlaying } = this.state;

    if (!waveSurfer) return;

    // Remove region's 'title' attribute showing the region's duration.
    params.element.attributes.title.value = '';

    // Check if one end of the region was dragged over the other one
    if (Math.abs(start - end) > 0.25) {
      return;
    }

    // Recreate region from last know valid positions
    const newRegion = this.recreateRegion(waveSurfer, cutStart, cutEnd);

    if (isPlaying) {
      newRegion.play();
    }

    this.setState({
      waveSurfer,
    });
  };

  /**
   * Called when the region has finished moving (drag/expand/shrink).
   */
  onCropRegionUpdateEnd = (params: any) => {
    const regionStart = params.start;
    const regionEnd = params.end;

    const { isPlaying, waveSurfer, cutStart } = this.state;

    if (!waveSurfer) return;

    const region = regionStart !== cutStart ? regionStart : regionEnd;
    if (isPlaying) {
      waveSurfer.play(region);
    }

    this.setState({
      cutStart: regionStart,
      cutEnd: regionEnd,
      wasRegionChanged: true,
    });
    if (this.props.setPreviewEndAt) {
      this.props.setPreviewEndAt(regionEnd);
    }
    if (this.props.setPreviewStartAt) {
      this.props.setPreviewStartAt(regionStart);
    }
    this.props.onCut(regionStart, regionEnd);
  };

  /**
   * Recreate the region to given time stamps.
   * @returns The newly created region.
   */
  recreateRegion = (
    waveSurfer: WaveSurfer,
    startTime: number,
    endTime: number,
  ): WaveSurfer => {
    waveSurfer.clearRegions();

    return waveSurfer.addRegion({
      start: startTime,
      end: endTime,
      color: this.REGION_COLOR,
      loop: true,
    });
  };

  onSongFinishedPlaying = () => {
    this.setState({
      isPlaying: false,
    });
  };

  /**
   * Play or pause the audio playback.
   */
  handleClickTogglePlay = () => {
    const { waveSurfer, isPlaying } = this.state;

    if (!waveSurfer) return;

    if (isPlaying) {
      waveSurfer.pause();
    } else {
      waveSurfer.play();
    }

    this.setState({ isPlaying: !isPlaying });
  };

  render() {
    const { waveSurfer, isPlaying } = this.state;
    const isLoading = waveSurfer ? false : true;
    const toggleIcon = isPlaying ? <FaPause /> : <FaPlay />;
    return (
      <LoadingOverlay
        className="loading-spinner"
        active={isLoading}
        text="Generating audio wave.."
        spinner={true}
        fadeSpeed={200}
      >
        <div
          className={classNames('row mzt-row-waveform', {
            [styles.mztRowWaveform]: isLoading,
          })}
        >
          <div className="col">
            <div className="row">
              <div className="col">
                <div
                  ref={this.waveformRef}
                  className={this.WAVEFORM_CONTAINER}
                />
              </div>
            </div>
            <div className="row justify-content-center">
              {/* Play/pause the song */}
              <Button
                color="#000000"
                onClick={this.handleClickTogglePlay}
                margin="20px 0"
              >
                {toggleIcon}
              </Button>
            </div>
          </div>
        </div>
      </LoadingOverlay>
    );
  }
}
