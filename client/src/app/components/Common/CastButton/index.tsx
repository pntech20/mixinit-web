import { Button as ChakraButton, TabProps } from '@chakra-ui/react';
import { useModeTheme } from 'app/hooks/ColorDarkMode/useModeTheme';
import classnames from 'classnames';
import { useMemo } from 'react';
import styles from './castButton.module.scss';

interface TabButtonProps extends TabProps {
  text: string;
  selected?: boolean;
  className?: string;
  onClick?: () => void;
}

export default function CastButton(props: TabButtonProps) {
  const { text, className, onClick, selected = false } = props;
  const { isDarkMode } = useModeTheme();

  const colorByMode = useMemo(() => {
    if (isDarkMode) {
      return {
        border: '#FFFFFF',
        background: '#1C1C1C',
      };
    }

    return {
      border: '#242424',
      background: '#F8F8F8',
    };
  }, [isDarkMode]);

  return (
    <ChakraButton
      border={`0.5px solid ${colorByMode.border}`}
      background={colorByMode.background}
      className={classnames(styles.castBtnContainer, className, {
        [styles.btnSelected]: selected,
      })}
      onClick={onClick}
    >
      {text}
    </ChakraButton>
  );
}
