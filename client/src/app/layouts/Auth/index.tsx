import { Box } from '@chakra-ui/layout';
import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <Box className="container" height="100vh" overflow="auto">
      {children}
    </Box>
  );
}
