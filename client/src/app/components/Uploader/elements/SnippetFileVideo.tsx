import { Box } from '@chakra-ui/react';
import VideoEditor from 'app/components/VideoEditor';
import React, { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

interface CreateASnippetProps {
  track: any;
  setPreviewStartAt: (value: number) => void;
  setPreviewEndAt: (value: number) => void;
}

function SnippetFileVideo({
  track,
  setPreviewStartAt,
  setPreviewEndAt,
}: CreateASnippetProps) {
  const { t } = useTranslation();
  const [isCutting, setCutting] = useState(false);

  const receiveTimeSelected = useCallback(
    async data => {
      setCutting(true);
      const { startTime, endTime } = data;
      setPreviewStartAt(startTime);
      setPreviewEndAt(endTime);
      setCutting(false);
      toast.success(t('uploader.successSaveSnippet'));
    },
    [setPreviewEndAt, setPreviewStartAt, t],
  );

  return (
    <Box>
      <VideoEditor
        src={track}
        // file={track}
        isCutting={isCutting}
        passTimeSelected={receiveTimeSelected}
      />
    </Box>
  );
}

export default React.memo(SnippetFileVideo);
