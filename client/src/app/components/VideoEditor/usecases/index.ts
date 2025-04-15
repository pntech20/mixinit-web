import getBlobDuration from 'get-blob-duration';

export const getVideoLength = async blob => {
  return await getBlobDuration(blob);
};

export const secondsToMinutes = seconds => {
  return new Date(seconds * 1000).toISOString().slice(11, 19);
};

export const SCALE = {
  WIDTH: 88,
  HEIGHT: 50,
};

export const getAvgVideoSeconds = (duration, number) => {
  let result: Array<any> = [];
  const avg = duration / number;
  for (let i = 0; i < number; i++) {
    result.push(i * avg);
  }

  return result;
};

export const getFrames = (videoUrl, videoTimes) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const video = document.createElement('video');
    video.preload = 'auto';
    let frames: Array<any> = [];

    video.onloadeddata = async () => {
      canvas.width = SCALE.WIDTH;
      canvas.height = SCALE.HEIGHT;

      for (const item of videoTimes) {
        frames.push(await getVideoFrame(video, canvas, context, item));
      }
      resolve(frames);
    };

    video.src = videoUrl;
    video.load();
  });
};

const getVideoFrame = (video, canvas, context, time) => {
  return new Promise((resolve, reject) => {
    video.onseeked = () => {
      context.drawImage(video, 0, 0, SCALE.WIDTH, SCALE.HEIGHT);
      resolve(canvas.toDataURL());
    };
    video.currentTime = time;
  });
};
