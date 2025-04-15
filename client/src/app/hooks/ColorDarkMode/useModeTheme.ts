import { useColorMode } from '@chakra-ui/react';

export function useModeTheme() {
  const { colorMode, toggleColorMode } = useColorMode();
  const isDarkMode = colorMode === 'dark';
  const isLightMode = colorMode === 'light';

  const grayColor = '#282828';
  const grayBlackColor = '#1C1C1C';
  const whiteColor = '#FFFFFF';
  const blackColor = '#000000';
  const shadowBlackColor = '#474747';
  const grayMediumColor = '#626262';
  const blackCowColor = '#6B6B6B';
  const grayLightBoderColor = '0.3px solid #2B2B2B';
  const grayBoderColor = '0.3px solid #D0D0D0';
  const borderWhite = '0.5px solid #FFFFFF';
  const borderBlack = '0.5px solid #242424';
  const communityColor = '#242424';
  const darkGreyColorBg = '#FFFAF9';
  const darkGreyColor = '#F8F8F8';
  const bgGrayDark = '#F5F5F5';
  const lightGray = '#FAFAFA';

  const bgGrayColor = isDarkMode ? grayBlackColor : bgGrayDark;
  const bgGray = isDarkMode ? grayBlackColor : lightGray;
  const bgColor = isDarkMode ? grayColor : whiteColor;
  const bgColorBlackWhite = isDarkMode ? grayBlackColor : whiteColor;
  const bgColorGray = isDarkMode ? grayBlackColor : 'none';
  const bgColorWhite = isDarkMode ? whiteColor : 'none';
  const bgColorDarkGrey = isDarkMode ? grayColor : darkGreyColor;
  const textColor = isDarkMode ? whiteColor : blackColor;
  const textColorGray = isDarkMode ? whiteColor : shadowBlackColor;
  const textCommunityColor = isDarkMode ? whiteColor : communityColor;
  const textColorGrayLight = isDarkMode ? whiteColor : grayMediumColor;
  const boderColor = isDarkMode ? whiteColor : blackCowColor;
  const boderColorGray = isDarkMode ? grayLightBoderColor : grayBoderColor;
  const borderBlackWhite = isDarkMode ? borderWhite : borderBlack;

  return {
    isLightMode,
    isDarkMode,
    bgColor,
    bgColorBlackWhite,
    bgColorGray,
    bgColorDarkGrey,
    textColor,
    textColorGray,
    textCommunityColor,
    textColorGrayLight,
    boderColor,
    boderColorGray,
    borderBlackWhite,
    borderBlack,
    borderWhite,
    bgColorWhite,
    whiteColor,
    darkGreyColor,
    toggleColorMode,
    bgGray,
    darkGreyColorBg,
    bgGrayColor,
    colorMode,
  };
}
