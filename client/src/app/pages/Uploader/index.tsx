import { useColorMode } from '@chakra-ui/color-mode';
import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { checkContributorCanUpload } from 'app/apis/sections/sections';
import { HelmetPage } from 'app/components/HelmetPage';
import UploaderStepOne from 'app/components/Uploader/StepOne';
import UploaderStepTwo from 'app/components/Uploader/StepTwo';
import { toastError } from 'app/helpers/toast';
import { useMediaScreen } from 'app/hooks/mediaScreen/useMediaScreen';
import { useSamples } from 'app/hooks/samples/useSamples';
import classNames from 'classnames';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import './styles.scss';
import { formatMoney } from 'app/utils/currency';
import { Ads } from 'app/components/Ads';
import { BannerListLabel } from 'app/components/BannerListLabel';
import Crate from 'app/components/Crate';

const StepOne = ({
  onNext,
  setValueLabelSelected,
  valueLabelSelected,
  setDisable,
  disable,
  isEdit,
}) => {
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);

  const handleDisable = useCallback(
    async data => {
      setDisable(true);
      setValueLabelSelected(data);
      setIsLoading(true);
      const isCanUpload = await checkContributorCanUpload(data?._id);
      setIsLoading(false);
      if (data && isCanUpload) {
        return setDisable(false);
      } else {
        toastError(
          `You can only upload to ${data.name} max ${data.maxUpload} tracks each month`,
        );
      }
    },
    [setDisable, setValueLabelSelected],
  );

  return (
    <Box maxWidth="638px" margin="0 auto">
      <UploaderStepOne
        handleDisable={handleDisable}
        valueLabelSelected={valueLabelSelected}
        isEdit={isEdit}
      />
      <Flex
        w="100%"
        className="button-go-next"
        justifyContent="flex-end"
        alignContent="center"
      >
        <Button
          p="20px 40px"
          colorScheme="blue"
          onClick={onNext}
          isDisabled={disable}
          isLoading={isLoading}
        >
          {t('uploader.next')}
        </Button>
      </Flex>
    </Box>
  );
};

const StepTwo = ({
  dataFromStepOne,
  setValueLabelSelected,
  setTitleStepOne,
  track,
}) => {
  useEffect(() => {
    const dataLabel = dataFromStepOne?.contributorPricing
      ? `${dataFromStepOne.name} (Price from ${formatMoney(
          dataFromStepOne.minPrice,
        )} to ${formatMoney(dataFromStepOne.maxPrice)})`
      : `${dataFromStepOne.name} (Price must be ${formatMoney(
          dataFromStepOne?.defaultTrackPrice,
        )})`;
    setTitleStepOne(dataLabel);
  }, [
    dataFromStepOne?.contributorPricing,
    dataFromStepOne?.defaultTrackPrice,
    dataFromStepOne.maxPrice,
    dataFromStepOne.minPrice,
    dataFromStepOne.name,
    setTitleStepOne,
  ]);
  return (
    <UploaderStepTwo
      dataFromStepOne={dataFromStepOne}
      setValueLabelSelected={setValueLabelSelected}
      track={track}
    />
  );
};

const ONE = 1;
const TWO = 2;

export function Uploader() {
  const { t } = useTranslation();
  const { isLargerThan768, isLargerThan992 } = useMediaScreen();
  const history = useHistory();
  const location: any = useLocation();

  const { onGetSamples } = useSamples();

  const track = location?.state?.track;

  const [valueLabelSelected, setValueLabelSelected] = useState(null);
  const [disable, setDisable] = useState<boolean>(true);
  const [idSelected, setIdSelected] = useState<number>(1);
  const [titleStepOne, setTitleStepOne] = useState<string>(
    t('uploader.selectLabel'),
  );
  const { colorMode } = useColorMode();

  const handleNext = () => {
    setIdSelected(2);
  };

  useEffect(() => {
    window.history.replaceState({}, document.title);
  }, [history]);

  useEffect(() => {
    if (track) {
      onGetSamples();
      setValueLabelSelected(track?.label);
      setDisable(false);
      setIdSelected(2);
    }
  }, [history, onGetSamples, track]);

  const message = t('uploader.message');

  return (
    <>
      <HelmetPage title="Uploader" />
      <Box bg="#f3f3f3" mb="10px" borderRadius="5px">
        <Ads />
        <Flex
          w="100%"
          flexDirection={isLargerThan992 ? 'row' : 'column'}
          gridGap="15px"
        >
          <Box w={isLargerThan992 ? '50%' : '100%'}>
            <BannerListLabel />
          </Box>
          <Box w={isLargerThan992 ? '50%' : '100%'}>
            <Crate />
          </Box>
        </Flex>
      </Box>
      {isLargerThan768 ? (
        <Box className="uploader-page">
          <Box maxWidth="1134px" margin="0 auto">
            <Flex
              justifyContent="center"
              width="70%"
              margin="0 auto"
              marginTop="60px"
            >
              <Box
                className={classNames(`one ${colorMode}`, {
                  active: idSelected === ONE,
                })}
              >
                <Text>01</Text>
              </Box>
              <Box className={`border-center bd-${colorMode}`} />
              <Box
                className={classNames(`one two ${colorMode}`, {
                  active: idSelected === TWO,
                })}
              >
                <Text>02</Text>
              </Box>
            </Flex>
            <Flex
              className="title-step"
              justifyContent="space-between"
              width="70%"
            >
              <Box className="width-154">
                <Text marginTop="25px">{titleStepOne}</Text>
              </Box>
              <Box className="width-154">
                <Text marginTop="25px">{t('uploader.dropZoneTrack')}</Text>
              </Box>
            </Flex>
          </Box>

          {idSelected === 1 && !!!track ? (
            <StepOne
              setValueLabelSelected={setValueLabelSelected}
              valueLabelSelected={valueLabelSelected}
              onNext={handleNext}
              setDisable={setDisable}
              disable={disable}
              isEdit={!!track}
            />
          ) : (
            <StepTwo
              track={track}
              dataFromStepOne={!!track ? track?.label : valueLabelSelected}
              setValueLabelSelected={setValueLabelSelected}
              setTitleStepOne={setTitleStepOne}
            />
          )}
        </Box>
      ) : (
        <Text pt="100px" textAlign="center" fontWeight="500" fontSize="24px">
          {message}
        </Text>
      )}
    </>
  );
}
