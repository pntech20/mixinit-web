export default class AlbumCover {
  public format: string;
  public dataAsBase64: string;
  public dataAsTagSrc: string;
  public dataAsArrayBuffer: ArrayBuffer;

  constructor(format: string, dataAsBytes: Array<number> | ArrayBuffer) {
    this.format = format;
    this.dataAsArrayBuffer =
      dataAsBytes instanceof ArrayBuffer
        ? dataAsBytes
        : Uint8Array.from(dataAsBytes as Array<number>).buffer;

    this.dataAsBase64 = this._arrayBufferAsBase64(this.dataAsArrayBuffer);
    this.dataAsTagSrc = this._getTagSrc(this.format, this.dataAsBase64);
  }

  private _getTagSrc(fileFormat: string, dataAsBase64: string) {
    return `data:${fileFormat};base64,${btoa(dataAsBase64)}`;
  }

  private _arrayBufferAsBase64(buffer): string {
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;

    let binary = '';
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }

    return binary;
  }
}
