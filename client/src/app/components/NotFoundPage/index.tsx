import { Button } from '@chakra-ui/button';
import { useColorMode } from '@chakra-ui/color-mode';
import { Image } from '@chakra-ui/image';
import { Box, Heading, Text } from '@chakra-ui/layout';
import NotFoundImg from 'app/assets/images/common/404.svg';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import MotionBox from '../MotionBox';
import styles from './index.module.scss';

export function NotFoundPage() {
  const { colorMode } = useColorMode();

  return (
    <>
      <Helmet>
        <title>404 Page Not Found</title>
        <meta name="description" content="Page not found" />
      </Helmet>
      <Box className={styles.container}>
        <Box className={styles.content}>
          <MotionBox
            animate={{ y: 20 }}
            transition={{
              repeat: Infinity,
              duration: 2,
              repeatType: 'reverse',
            }}
            width={['100%', '70%', '60%', '60%']}
            margin="0 auto"
          >
            <Image
              fallbacksrc={NotFoundImg}
              src={NotFoundImg}
              alt="Error 404 not found Illustration"
            />
          </MotionBox>

          <Box marginY={4}>
            <Heading textAlign="center">Page not Found.</Heading>

            <Box textAlign="center" marginTop={4}>
              <Text mb="4">It&apos;s Okay!</Text>
              <Link to="/">
                <Button
                  backgroundColor={
                    colorMode === 'light' ? 'gray.300' : 'teal.500'
                  }
                >
                  Let&apos;s Head Back
                </Button>
              </Link>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}
