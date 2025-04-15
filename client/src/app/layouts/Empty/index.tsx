import { Box } from '@chakra-ui/layout';
import { ReactNode } from 'react';

interface EmptyLayoutProps {
  children: ReactNode;
}

export default function Empty({ children }: EmptyLayoutProps) {
  return (
    <Box className="container" height="100vh" overflow="auto">
      {children}
    </Box>
  );
}
