const waveConfig = {
  // If specified, draws the waveform in bar mode.
  barWidth: 1,
  // The optional spacing between bars of the wave, if not provided will be calculated in legacy format.
  barGap: 2,
  // Whether to hide the horizontal scrollbar when one would normally be shown.
  hideScrollbar: true,
  // Measured in pixels.
  cursorWidth: 0,
  // The fill color of the waveform after the cursor.
  waveColor: '#d0d0d0', // 'disabled button' gray
  // The fill color of the part of the waveform behind the cursor.
  // When 'progressColor' and 'waveColor' are the same the progress wave is not rendered at all.
  progressColor: 'blue',
  // Number of seconds to skip with the 'skipForward()' and 'skipBackward()' methods.
  skipLength: 5,
  height: 70,
};

export default waveConfig;
