import { Box, Flex } from '@chakra-ui/react';
import { Ads } from 'app/components/Ads';
import { BannerListLabel } from 'app/components/BannerListLabel';
import Crate from 'app/components/Crate';
import { HelmetPage } from 'app/components/HelmetPage';
import ReleaseList from 'app/components/ReleaseList';
import { PageHeaderContext } from 'app/contexts/PageHeaderContext';
import { useModeTheme } from 'app/hooks/ColorDarkMode/useModeTheme';
import { useMediaScreen } from 'app/hooks/mediaScreen/useMediaScreen';
import { useReleases } from 'app/hooks/releases/useReleases';
import { renderDraftToHtml } from 'app/utils/renderDraftToHtml';
import { useContext } from 'react';

export function ReleasesPage() {
  const { pageHeader }: any = useContext(PageHeaderContext);
  const { isDarkMode } = useModeTheme();
  const { isLargerThan992 } = useMediaScreen();

  const { releases = [] } = useReleases();
  return (
    <>
      <HelmetPage title="Multipacks" />
      <Box bg="#f3f3f3" mb="10px" borderRadius="5px">
        <Ads />
        <Flex
          w="100%"
          flexDirection={isLargerThan992 ? 'row' : 'column'}
          gridGap="15px"
        >
          <Box w={isLargerThan992 ? '50%' : '100%'}>
            <BannerListLabel />
          </Box>
          <Box w={isLargerThan992 ? '50%' : '100%'}>
            <Crate />
          </Box>
        </Flex>
      </Box>
      {pageHeader?.release && (
        <Box
          mb="20px"
          className={
            isDarkMode ? 'pageTopHeaderDarkMode' : 'pageTopHeaderLightMode'
          }
        >
          {renderDraftToHtml(pageHeader?.release)}
        </Box>
      )}
      <ReleaseList releases={releases} />
    </>
  );
}
