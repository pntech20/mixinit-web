import { Box } from '@chakra-ui/react';
import ReleaseList from 'app/components/ReleaseList';
import { useReleases } from 'app/hooks/releases/useReleases';
import { useTracks } from 'app/hooks/tracks/useTracks';
import { useCallback, useEffect } from 'react';
import ItemsDragLayer from '../MediaUploads/ItemsDragLayer';

interface Props {
  inMyMedia?: boolean;
}
export function MyReleases({ inMyMedia = true }: Props) {
  const { releases = [] } = useReleases();
  const { onGetTracks } = useTracks();

  useEffect(() => {
    onGetTracks();
  }, [onGetTracks]);

  const renderTab = useCallback(() => {
    return <ReleaseList releases={releases} inMyMedia={inMyMedia} />;
  }, [inMyMedia, releases]);

  return (
    <Box>
      <ItemsDragLayer />
      {renderTab()}
    </Box>
  );
}
