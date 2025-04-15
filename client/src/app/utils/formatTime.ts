import getBlobDuration from 'get-blob-duration';

export const getDurationFile = async file => {
  try {
    return await getBlobDuration(window.URL.createObjectURL(file));
  } catch (err) {
    return err;
  }
};
