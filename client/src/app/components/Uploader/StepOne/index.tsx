import { Box, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import SelectInput from 'app/components/SelectInput';
import { selectAuth } from 'app/pages/Login/slice/selectors';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import dateTimeService from 'app/services/datetime.service';

interface UploaderStepOneProps {
  handleDisable: (value) => void;
  valueLabelSelected?: any;
  isEdit?: boolean;
  isShowMinMaxLabel?: boolean;
  isReleaseEditor?: boolean;
}

const UploaderStepOne = ({
  handleDisable,
  valueLabelSelected,
  isEdit,
  isShowMinMaxLabel = true,
  isReleaseEditor = false,
}: UploaderStepOneProps) => {
  const { t } = useTranslation();

  const {
    userDetail: { canUploadToLabels = [], totalUploadedToAllLabel },
  } = useSelector(selectAuth);

  const formatOptionLabel = ({
    name,
    maxUpload = 0,
    minUpload = 0,
    uploaded = 0,
    totalUploaded = 0,
  }) => (
    <Flex
      flexWrap="wrap"
      justifyContent="space-between"
      p={isShowMinMaxLabel ? '10px' : '10px 0px'}
      borderRadius="10px"
    >
      <Text
        minW="200px"
        className="color"
        fontSize={isShowMinMaxLabel ? '14px' : '12px'}
        fontWeight="600"
      >
        Label: {name}
      </Text>
      {isShowMinMaxLabel && (
        <Text fontSize="14px" fontWeight="600">
          Min/Max: {minUpload}/{maxUpload}
        </Text>
      )}
      <Text fontSize={isShowMinMaxLabel ? '14px' : '12px'} fontWeight="600">
        Tracks: {isShowMinMaxLabel ? uploaded : totalUploaded}
      </Text>
    </Flex>
  );
  const NoOptionsMessage = props => {
    return (
      <Box
        backgroundColor={useColorModeValue('#fff', '#000')}
        marginBottom="-3px"
        padding="10px"
      >
        <Text
          color={useColorModeValue('#000', '#fff')}
          fontSize="14px"
          textAlign="center"
        >
          Now, you don't have any labels to upload track
        </Text>
      </Box>
    );
  };

  const renderSelectLabels = useCallback(() => {
    const newCanUploadToLabels = [
      {
        name: 'All Labels',
        labelId: '',
        _id: '',
        totalUploaded: totalUploadedToAllLabel,
      },
      ...canUploadToLabels,
    ];

    return (isReleaseEditor ? newCanUploadToLabels : canUploadToLabels)?.map(
      value => {
        return {
          ...value,
          value: value._id,
        };
      },
    );
  }, [canUploadToLabels, isReleaseEditor, totalUploadedToAllLabel]);

  return (
    <Box
      flexWrap="wrap"
      p={isReleaseEditor ? '0px' : '15px'}
      className="step-one"
      maxWidth={isReleaseEditor ? '100%' : '640px'}
      margin="0 auto"
    >
      <SelectInput
        options={renderSelectLabels()}
        isDisable={isEdit}
        value={valueLabelSelected}
        formatOptionLabel={formatOptionLabel}
        placeholder={
          isReleaseEditor ? (
            'All Labels'
          ) : (
            <Flex justifyContent="space-between" align="center">
              <Text>{t('uploader.select')}</Text>
              <Text>{dateTimeService.currentMonthYear()}</Text>
            </Flex>
          )
        }
        onChange={value => {
          handleDisable(value);
        }}
        NoOptionsMessage={NoOptionsMessage}
        customComponent={true}
        isColorInput
        isSearchable={false}
      />
    </Box>
  );
};

export default UploaderStepOne;
