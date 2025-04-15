export const cursorConfig = {
  // The color of the cursor.
  color: 'white',
  // Hide the cursor when the mouse leaves the waveform.
  hideOnBlur: true,
  // The width of the cursor.
  width: '2px',
  // 	Show the time on the cursor.
  showTime: true,
  // The opacity of the cursor.
  opacity: '1',
  // An object with custom styles which are applied to the cursor time element.
  customShowTimeStyle: {
    'margin-left': '5px',
    padding: '1px 7px 3px 7px',
    'border-radius': '0.3em',
    'background-color': 'white',
    color: 'black',
  },
  // An object with custom styles which are applied to the cursor element.
  // customStyle: {
  //   // The cursor doesn't center to the mouse so we shift it.
  //   'margin-left': '13.5px',
  // },
};

export default cursorConfig;
