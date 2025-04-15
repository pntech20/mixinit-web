import { Box, Flex } from '@chakra-ui/react';
import { HelmetPage } from 'app/components/HelmetPage';
import PackageSubscriptions from 'app/components/PackageSubscriptions';
import { PageHeaderContext } from 'app/contexts/PageHeaderContext';
import { useModeTheme } from 'app/hooks/ColorDarkMode/useModeTheme';
import axiosService from 'app/services/axios.service';
import { renderDraftToHtml } from 'app/utils/renderDraftToHtml';
import { path } from 'ramda';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './styles.scss';
import { Ads } from 'app/components/Ads';
import { BannerListLabel } from 'app/components/BannerListLabel';
import Crate from 'app/components/Crate';
import { useMediaScreen } from 'app/hooks/mediaScreen/useMediaScreen';

export function Services() {
  const { pageHeader }: any = useContext(PageHeaderContext);
  const { isDarkMode } = useModeTheme();
  const { isLargerThan992 } = useMediaScreen();

  const [dataSubAppId, setDataSubAppId] = useState<any>();

  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const subAppId = searchParams.get('subAppId');

  localStorage.removeItem('subApp');
  localStorage.removeItem('services');

  const BASE_SUBAPPID_URL = '/v1/subscription-applications';

  const handeGetSubAppId = useCallback(async () => {
    const response = await axiosService.get(`${BASE_SUBAPPID_URL}/${subAppId}`);
    setDataSubAppId(path(['data', 'data'], response));
  }, [subAppId]);

  useEffect(() => {
    if (subAppId) {
      handeGetSubAppId();
    }
  }, [handeGetSubAppId, subAppId]);

  return (
    <Box>
      <HelmetPage title="Services" />
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
      {pageHeader?.subscription && (
        <Box
          mb="20px"
          className={
            isDarkMode ? 'pageTopHeaderDarkMode' : 'pageTopHeaderLightMode'
          }
        >
          {renderDraftToHtml(pageHeader?.subscription)}
        </Box>
      )}
      <Box mt="20px">
        <PackageSubscriptions dataSubAppId={dataSubAppId} />
      </Box>
    </Box>
  );
}
