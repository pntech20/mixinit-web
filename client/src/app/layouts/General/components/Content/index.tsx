import { Box } from '@chakra-ui/layout';
import { useMediaScreen } from 'app/hooks/mediaScreen/useMediaScreen';
import { useSubscriptions } from 'app/hooks/subscription/useSubscriptions';
import { ReactNode } from 'react';

interface ContentProps {
  children?: ReactNode;
}

export default function Content({ children }: ContentProps) {
  const { subscriptions } = useSubscriptions();
  const { isLargerThan1439, isLargerThan1024 } = useMediaScreen();
  return (
    <Box
      width="100%"
      margin={{
        base: `${
          isLargerThan1439 || (isLargerThan1024 && !subscriptions)
            ? '190px'
            : !isLargerThan1024 && !subscriptions
            ? '105px'
            : !isLargerThan1024 && subscriptions
            ? '150px'
            : '185px'
        }  auto 40px`,
      }}
    >
      {children}
    </Box>
  );
}
