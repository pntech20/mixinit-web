import { Box } from '@chakra-ui/react';
import { HelmetPage } from 'app/components/HelmetPage';
import { MyReleases } from '../../components/MyReleases';

export function MyReleasesPage() {
  return (
    <Box>
      <HelmetPage title="My Releases" />

      <MyReleases inMyMedia />
    </Box>
  );
}
