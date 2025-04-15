import { toastError } from 'app/helpers/toast';
import { useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import './styles.scss';

interface DropZoneFileProps {
  passFile: (acceptedFiles: any) => void;
  type: string;
  hasTitle?: boolean;
}

function DropZoneFile({ passFile, type, hasTitle }: DropZoneFileProps) {
  const onDrop = useCallback(
    acceptedFiles => {
      if (acceptedFiles.length) {
        passFile(acceptedFiles);
      }
    },
    [passFile],
  );

  const { fileRejections, getRootProps, getInputProps } = useDropzone({
    multiple: true,
    accept: type,
    onDrop,
  });

  useEffect(() => {
    if (fileRejections.length) {
      toastError('File Format Not Supported.');
    }
  }, [fileRejections]);

  return (
    <>
      <div {...getRootProps({ className: 'drop-zone-file drag-zone' })}>
        <input {...getInputProps()} />
      </div>
    </>
  );
}

export default DropZoneFile;
