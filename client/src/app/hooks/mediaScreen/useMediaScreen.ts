import { useMediaQuery } from '@chakra-ui/react';

export function useMediaScreen() {
  const [isLargerThan1440] = useMediaQuery('(min-width: 1441px)');
  const [isLargerThan1439] = useMediaQuery('(min-width: 1439px)');
  const [isLargerThan1320] = useMediaQuery('(min-width: 1320px)');
  const [isLargerThan1280] = useMediaQuery('(min-width: 1280px)');
  const [isLargerThan1023] = useMediaQuery('(min-width: 1023px)');
  const [isLargerThan1024] = useMediaQuery('(min-width: 1024px)');
  const [isLargerThan992] = useMediaQuery('(min-width: 992px)');
  const [isLargerThan900] = useMediaQuery('(min-width: 900px)');
  const [isLargerThan800] = useMediaQuery('(min-width: 800px)');
  const [isLargerThan860] = useMediaQuery('(min-width: 860px)');
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const [isLargerThan760] = useMediaQuery('(min-width: 760px)');
  const [isLargerThan600] = useMediaQuery('(min-width: 600px)');
  const [isLargerThan613] = useMediaQuery('(min-width: 613px)');
  const [isLargerThan650] = useMediaQuery('(min-width: 650px)');
  const [isLargerThan865] = useMediaQuery('(min-width: 865px)');
  const [isLargerThan839] = useMediaQuery('(min-width: 839px)');
  const [isLargerThan680] = useMediaQuery('(min-width: 680px)');
  const [isLargerThan780] = useMediaQuery('(min-width: 780px)');
  const [isLargerThan540] = useMediaQuery('(min-width: 540px)');
  const [isLargerThan500] = useMediaQuery('(min-width: 500px)');
  const [isLargerThan522] = useMediaQuery('(min-width: 522px)');
  const [isLargerThan425] = useMediaQuery('(min-width: 425px)');
  const [isLargerThan419] = useMediaQuery('(min-width: 419px)');
  const [isLargerThan475] = useMediaQuery('(min-width: 475px)');
  const [isLargerThan375] = useMediaQuery('(min-width: 376px)');
  const [isSmallerThan500] = useMediaQuery('(max-width: 500px)');
  const [isSmallerThan768] = useMediaQuery('(max-width: 768px)');
  const [isSmallerThan1024] = useMediaQuery('(max-width: 1024px)');
  const [isLargerThan426] = useMediaQuery('(min-width: 426px)');
  const [isLargerThan376] = useMediaQuery('(min-width: 376px)');
  const [isLargerThan321] = useMediaQuery('(min-width: 321px)');
  const [isSmallerThan769] = useMediaQuery('(max-width: 769px)');
  const [isLargerThan769] = useMediaQuery('(min-width: 769px)');
  const [isLargerThan715] = useMediaQuery('(min-width: 715px)');
  return {
    isSmallerThan1024,
    isSmallerThan769,
    isSmallerThan768,
    isSmallerThan500,
    isLargerThan613,
    isLargerThan1440,
    isLargerThan1439,
    isLargerThan1320,
    isLargerThan1280,
    isLargerThan1023,
    isLargerThan1024,
    isLargerThan992,
    isLargerThan900,
    isLargerThan860,
    isLargerThan839,
    isLargerThan800,
    isLargerThan419,
    isLargerThan780,
    isLargerThan769,
    isLargerThan768,
    isLargerThan760,
    isLargerThan715,
    isLargerThan865,
    isLargerThan680,
    isLargerThan650,
    isLargerThan600,
    isLargerThan540,
    isLargerThan500,
    isLargerThan522,
    isLargerThan475,
    isLargerThan426,
    isLargerThan425,
    isLargerThan376,
    isLargerThan375,
    isLargerThan321,
  };
}
