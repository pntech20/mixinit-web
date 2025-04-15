export default class Song {
  constructor(
    public artist = '',
    public title = '',
    public album = '',
    public year = '',
    public albumCover,
    public genre = '',
    public albumArtist = '',
    public beatsPerMinute = 0,
    public key = '',
    public tag = [],
    public beatsPerMinuteEnd = beatsPerMinute,
    public subGenre = '',
    public subGenre2 = '',
  ) {}
}
