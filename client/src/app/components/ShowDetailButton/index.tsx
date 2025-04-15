import { Box } from '@chakra-ui/react';
import { useModeTheme } from 'app/hooks/ColorDarkMode/useModeTheme';
import { useMediaScreen } from 'app/hooks/mediaScreen/useMediaScreen';
import ShowMini from '../../assets/svgs/ShowMini';

interface Props {
  className?: string;
  onClick?: any;
  display?: string;
  color?: string;
}

export default function ShowDetailButton({ display, onClick, color }: Props) {
  const { textColor } = useModeTheme();
  const { isLargerThan650 } = useMediaScreen();

  return (
    <Box
      display={display}
      onClick={onClick}
      padding={isLargerThan650 ? '0 0 11px 14px' : '0px'}
    >
      <Box
        width="16px"
        height="12px"
        borderRadius="50%"
        display="flex"
        alignItems="center"
        justifyContent="center"
        cursor="pointer"
      >
        <ShowMini color={textColor} />
      </Box>
    </Box>
  );
}
