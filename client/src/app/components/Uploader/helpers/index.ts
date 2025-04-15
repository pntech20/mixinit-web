import TagReader from 'jsmediatags';
import FileSelection from '../models/fileSelection';
import AlbumCover from '../models/albumCover';
import Song from '../models/song';

export const convertFilesToSongs = files => {
  const promises: Array<any> = [];
  files.forEach(file => {
    promises.push(
      new Promise((resolve, _) => {
        TagReader.read(file, {
          onSuccess: ({ tags }) => {
            console.log({ tags });

            const {
              artist,
              title,
              album,
              year,
              genre,
              TPE2,
              TBPM,
              picture,
              TDRC,
              comment,
              COMM,
            } = tags;

            const cover = picture
              ? new AlbumCover(picture.format, picture.data)
              : undefined;

            let listTags = [];
            if (comment) {
              const tagsString = comment?.text || '';
              listTags = tagsString?.split(', ');
            } else {
              if (COMM) {
                const tagsString = COMM?.data?.text || '';
                listTags = tagsString?.split(', ');
              }
            }

            let newGenre = '';
            let subGenre = '';
            let subGenre2 = '';
            if (genre) [newGenre, subGenre, subGenre2] = genre?.split(',');

            const song = new Song(
              artist,
              title,
              album,
              year || TDRC?.data,
              cover,
              newGenre?.trim(),
              TPE2?.data || '',
              TBPM?.data || 0,
              tags?.TKEY?.data || '',
              listTags,
              TBPM?.data || 0,
              subGenre?.trim(),
              subGenre2?.trim(),
            );
            const fileSelection = new FileSelection(file, song);
            resolve(fileSelection);
          },
          onError: _ => {
            const newSong = {
              artist: '',
              title: '',
              album: '',
              year: '',
              albumCover: undefined,
              genre: '',
              albumArtist: '',
              beatsPerMinute: 0,
            };
            const song = new Song(
              newSong.artist,
              newSong.title,
              newSong.album,
              newSong.year,
              newSong.albumCover,
              newSong.genre,
              newSong.albumArtist,
              newSong.beatsPerMinute,
            );
            const fileSelection = new FileSelection(file, song);
            resolve(fileSelection);
          },
        });
      }),
    );
  });

  return promises;
};
