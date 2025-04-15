import { Box } from '@chakra-ui/react';
import { Banner } from 'app/components/Banner';
import Subscription from 'app/components/Subscription';
import { memo } from 'react';

export const SubscriptionForm = memo(() => {
  return (
    <Box>
      <Box mb="10px">
        <Banner />
      </Box>
      <Subscription />
    </Box>
  );
});
