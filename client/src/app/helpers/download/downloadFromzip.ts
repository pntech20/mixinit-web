export default function downloadFromZip(zipData, nameFile) {
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(zipData);
  link.target = '_blank';
  link.download = nameFile;
  link.click();
  document.body.removeChild(link);
}
