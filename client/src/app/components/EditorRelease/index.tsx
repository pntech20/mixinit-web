import { useColorMode } from '@chakra-ui/color-mode';
import { Box, Text } from '@chakra-ui/react';
import classNames from 'classnames';
import { useCallback } from 'react';
import UploaderStepOne from '../Uploader/StepOne';
import styles from './editorRelease.module.scss';
import './index.scss';

import ReleaseInfo from '../ReleaseInfo';

interface EditorReleaseProps {
  changeElement: (e) => void;
  useMyReleaseHook?: any;
  setFilter?: any;
}

const EditorRelease = ({
  changeElement,
  useMyReleaseHook,
  setFilter,
}: EditorReleaseProps) => {
  const {
    idLabel,
    handleChangeReleaseInfo,
    setListFiles,
    setLabelName,
    isShowSelectLabel,
    setIsShowSelectLabel,
    handleSetLabelId,
  } = useMyReleaseHook;

  const { colorMode } = useColorMode();

  const handleDisable = useCallback(
    data => {
      if (data.name === 'All Labels') {
        setIsShowSelectLabel(false);
      }
      handleChangeReleaseInfo('labelId', data._id);
      handleSetLabelId(data._id);
      setLabelName(data.name);
      setListFiles([]);
      setIsShowSelectLabel(true);
    },
    [
      handleChangeReleaseInfo,
      handleSetLabelId,
      setIsShowSelectLabel,
      setLabelName,
      setListFiles,
    ],
  );

  return (
    <Box
      className={classNames(
        styles.editorContainer,
        styles[`editor${colorMode}`],
      )}
      borderRadius="5px"
      height={'calc(100vh - 390px)'}
      overflowY="auto"
    >
      {!isShowSelectLabel && (
        <Box>
          <Text fontWeight="700" pb="6px">
            Select A Label
          </Text>
          <Box pb="15px">
            <UploaderStepOne
              handleDisable={handleDisable}
              isShowMinMaxLabel={false}
              isReleaseEditor
            />
          </Box>
        </Box>
      )}

      {idLabel && (
        <ReleaseInfo
          changeElement={changeElement}
          useMyReleaseHook={useMyReleaseHook}
          setFilter={setFilter}
          isCreateRelease
        />
      )}
    </Box>
  );
};

export default EditorRelease;
