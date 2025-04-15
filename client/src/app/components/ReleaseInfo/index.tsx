import { useColorMode } from '@chakra-ui/color-mode';
import {
  Box,
  Button,
  Flex,
  Input,
  ListItem,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  Spinner,
  Text,
  Textarea,
  Tooltip,
  UnorderedList,
  useColorModeValue,
} from '@chakra-ui/react';
import { usePlayers } from 'app/hooks/player/usePlayers';
import { useReleases } from 'app/hooks/releases/useReleases';
import ListTracks from 'app/utils/ListTracks';
import { formatMoney } from 'app/utils/currency';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import { useHistory } from 'react-router-dom';
import { DropZoneImage } from '../DropZoneFile';
import styles from './editorRelease.module.scss';
import './index.scss';
import { TiDelete } from 'react-icons/ti';

import {
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
} from '@chakra-ui/react';
import { useSections } from 'app/hooks/sections/useSections';

interface ReleaseInfoProps {
  changeElement: (e) => void;
  useMyReleaseHook?: any;
  setFilter?: any;
  isCreateRelease?: boolean;
}

const ReleaseInfo = ({
  changeElement,
  useMyReleaseHook,
  setFilter,
  isCreateRelease = false,
}: ReleaseInfoProps) => {
  const { handleInputFocus, handleInputBlur } = usePlayers();
  const history = useHistory();
  const { t } = useTranslation();
  const location: any = useLocation();
  const [isShowModalCancelCreateRelease, setIsShowModalCancelCreateRelease] =
    useState(false);

  const { sections = [] } = useSections();

  const {
    isStateRelease,
    idLabel,
    releaseInfo,
    imageUpload,
    handleChangeReleaseInfo,
    handleEditRelease,
    passFile,
    handleRemoveImage,
    isConfirmed,
    handleRemoveRelease,
    isLoadingAction,
    listFiles,
    setListFiles,
    setReleaseInfo,
    setReleaseId,
    setImageUpload,
    isCheckReleaseInfo,
    handleSaveRelease,
    optionReleasePricing,
    releasePricing,
    isLoading,
    setIsShowSelectLabel,
  } = useMyReleaseHook;

  const { onGetAllTrackByReleaseId, releaseTracks } = useReleases();

  const processingFee = 0.05;

  const priceRelease = releaseInfo?.price;

  const priceFee = priceRelease && priceRelease * processingFee;

  const priceSale = priceRelease && priceRelease * (1 - processingFee);

  const percentageOfTokensCanKeep =
    sections.find(s => s?._id === idLabel)?.percentageOfTokensCanKeep || 100;

  const priceEachSale =
    priceSale && (priceSale * percentageOfTokensCanKeep) / 100;

  const isCheckNumberTrack =
    +releasePricing?.minTracks <= +listFiles.length &&
    +listFiles.length <= +releasePricing?.maxTracks;

  const isCheckPriceRelease =
    +releasePricing?.minPrice <= +releaseInfo.price &&
    +releaseInfo.price <= +releasePricing?.maxPrice;

  const { colorMode } = useColorMode();

  useEffect(() => {
    if (location?.state?.release && isStateRelease) {
      const {
        title,
        description,
        status,
        artwork,
        _id,
        maxNumTracks,
        price,
        releaseOptionId,
        label,
      } = location.state?.release;
      setReleaseId(_id);
      setReleaseInfo(current => ({
        ...current,
        title,
        description,
        status,
        labelId: label,
        price,
        maxNumTracks,
        releaseOption: releaseOptionId._id,
      }));
      setImageUpload(artwork);
    } else {
      setListFiles([]);
      setImageUpload('');
      setReleaseInfo({
        title: '',
        description: '',
        status: 'publish',
        labelId: idLabel ? idLabel : '',
        releaseOption: '',
        price: '',
        maxNumTracks: undefined,
      });
    }
  }, [
    history,
    idLabel,
    isStateRelease,
    location,
    location.state?.release,
    setImageUpload,
    setListFiles,
    setReleaseId,
    setReleaseInfo,
  ]);

  const totalPriceOfTrack = listFiles.reduce(
    (total, curr) => total + (Number(curr?.price) ?? 0),
    0,
  );

  useEffect(() => {
    if (location?.state?.release && isStateRelease && releaseTracks) {
      setListFiles(releaseTracks);
    }
  }, [isStateRelease, location?.state?.release, releaseTracks, setListFiles]);

  useEffect(() => {
    if (location?.state?.release && isStateRelease) {
      onGetAllTrackByReleaseId(location?.state?.release?._id);
    }
  }, [
    history,
    isStateRelease,
    location,
    location?.state?.release,
    onGetAllTrackByReleaseId,
    setFilter,
  ]);

  const [sliderValue, setSliderValue] = useState(releasePricing?.minPrice);

  useEffect(() => {
    setSliderValue(releasePricing?.minPrice);
  }, [releasePricing]);

  const bgBreakdown = useColorModeValue('#ebebeb', '#5A5A5A');

  const renderCreateRelease = () => {
    return (
      <Box m="12px">
        {isCreateRelease && (
          <Flex
            justifyContent="flex-end"
            cursor="pointer"
            onClick={() => {
              setIsShowModalCancelCreateRelease(true);
            }}
          >
            <TiDelete size="25px" />
          </Flex>
        )}
        <Box>
          <Box className={styles.title}>
            {t('myRelease.releaseNameTitle')}
            <Text as="span" color="red">
              *
            </Text>
          </Box>
          <Input
            mt="10px"
            placeholder={t('myRelease.releaseNamePlaceholder')}
            _placeholder={{ color: '#d4d4d4' }}
            className={`${
              releaseInfo?.title || !isConfirmed ? '' : 'border-error'
            }`}
            value={releaseInfo?.title}
            onChange={e => handleChangeReleaseInfo('title', e.target.value)}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
          />
        </Box>
        <Box mt="26px">
          <Box className={styles.title}>
            {t('myRelease.releaseDescriptionTitle')}
            <Text as="span" color="red">
              *
            </Text>
          </Box>
          <Textarea
            mt="10px"
            placeholder={t('myRelease.releaseDescriptionPlaceholder')}
            _placeholder={{ color: '#d4d4d4' }}
            className={`${
              releaseInfo?.description || !isConfirmed ? '' : 'border-error'
            }`}
            value={releaseInfo?.description}
            onChange={e =>
              handleChangeReleaseInfo('description', e.target.value)
            }
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
          />
        </Box>
        <Box m="16px 0">
          <Box fontSize="14px">
            <Text fontWeight="600">{t('myRelease.addImageTitle')}</Text>
            <Flex>
              <Text fontWeight="500">{t('myRelease.addImageDes500')}</Text>
              <Text as="span" color="red">
                *
              </Text>
            </Flex>
          </Box>
          <DropZoneImage
            defaultFile={
              typeof imageUpload === 'string'
                ? imageUpload
                : URL.createObjectURL(imageUpload)
            }
            isMyMedia
            isMyMedia500px
            passFile={passFile}
            label={t('myRelease.addImageContent')}
            className={imageUpload || !isConfirmed ? '' : 'border-error'}
            handleRemoveImage={handleRemoveImage}
          />
        </Box>
        <Box mb="20px">
          <Box className={styles.title}>
            {t('myRelease.releaseOption')}
            <Text as="span" color="red">
              *
            </Text>
          </Box>
          <Text fontSize={14}>How many tracks?</Text>
          <Select
            mt="10px"
            placeholder="Please choose"
            _placeholder={{ color: '#d4d4d4' }}
            className={styles.subscriptionSelect}
            value={releaseInfo?.releaseOption}
            onChange={e =>
              handleChangeReleaseInfo('releaseOption', e.target.value)
            }
          >
            {optionReleasePricing.map(item => (
              <option value={item?._id}>{item?.name}</option>
            ))}
          </Select>
        </Box>
        <Box className={styles.dropzoneTracks}>
          <Box fontSize="14px">
            <Box className={styles.title}>
              {t('myRelease.addRelease')}
              <Text as="span" color="red">
                *
              </Text>
            </Box>
            <Text>
              This Multipack option requires a minimum of{' '}
              {releasePricing?.minTracks} tracks with a maximum of{' '}
              {releasePricing?.maxTracks} tracks. Add tracks to the multipack
              using the + icons.
            </Text>
          </Box>
        </Box>
        {listFiles.length > 0 && (
          <ListTracks
            listFiles={listFiles}
            handleRemovePlaylist={handleRemoveRelease}
            setListFiles={setListFiles}
            isEdit
          />
        )}
        {/* {!isCheckNumberTrack && releaseInfo?.releaseOption && (
          <Text color="red" fontSize={14}>
            The number of tracks added must be from {releasePricing?.minTracks}{' '}
            to {releasePricing?.maxTracks} tracks
          </Text>
        )} */}
        {releaseInfo?.releaseOption && releasePricing?.minPrice && (
          <Box mb="20px">
            <Box className={styles.title}>
              Set a price:
              <Text as="span" color="red">
                *
              </Text>
            </Box>
            <Text mb="10px" fontSize={14}>
              (range based on multipack option)
            </Text>
            <Flex
              bg="#EDF2F7"
              border="1px solid #EDF2F7"
              borderRadius="4px"
              mt="15px"
              width="max-content"
              p="4px 10px"
            >
              <Text fontSize={14} fontWeight={600}>
                {location?.state?.release && isStateRelease
                  ? formatMoney(releaseInfo?.price)
                  : formatMoney(sliderValue)}
              </Text>
            </Flex>
            <Flex>
              <Slider
                mt="20px"
                id="slider"
                value={
                  location?.state?.release && isStateRelease
                    ? releaseInfo?.price
                    : sliderValue
                }
                min={releasePricing?.minPrice}
                max={releasePricing?.maxPrice}
                colorScheme="teal"
                onChange={v => {
                  setSliderValue(v);
                  handleChangeReleaseInfo('price', v);
                }}
              >
                <SliderMark
                  value={releasePricing?.minPrice}
                  mt="1"
                  ml="-2.5"
                  fontSize="sm"
                >
                  {formatMoney(releasePricing?.minPrice)}
                </SliderMark>
                <SliderMark
                  value={releasePricing?.maxPrice}
                  mt="1"
                  ml="-40px"
                  fontSize="sm"
                >
                  {formatMoney(releasePricing?.maxPrice)}
                </SliderMark>

                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <Tooltip
                  hasArrow
                  bg="teal.500"
                  color="white"
                  placement="top"
                  isOpen={true}
                >
                  <SliderThumb />
                </Tooltip>
              </Slider>
            </Flex>
          </Box>
        )}

        {/* {!isCheckPriceRelease && releaseInfo?.releaseOption && (
          <Text fontSize={14}>
            The price release must be from{' '}
            {formatMoney(releasePricing?.minPrice)} to{' '}
            {formatMoney(releasePricing?.maxPrice)} tracks
          </Text>
        )} */}
        {isCheckReleaseInfo && isCheckNumberTrack && isCheckPriceRelease && (
          <Box>
            <Text className="textBreakdown" mb="10px" mt="20px">
              You have successfully met the requirement for this multipack.
              Here's the breakdown...
            </Text>

            <Box className="breakdown" bg={bgBreakdown}>
              <Box className="titleBreakdown">Multipack Breakdown:</Box>
              <UnorderedList className="textBreakdown">
                <ListItem>
                  This multipack entitled "<span>{releaseInfo.title}</span>"
                  contains <span>{listFiles.length} tracks</span> and will be
                  sold for the gross retail price of{' '}
                  <span>{formatMoney(priceRelease)}</span>.
                </ListItem>
                <ListItem>
                  The retail cost of the <span>{listFiles.length}</span> tracks
                  in this multipack is{' '}
                  <span>{formatMoney(totalPriceOfTrack)}</span>. A buyer is
                  saving{' '}
                  <span>
                    {formatMoney(
                      Number(totalPriceOfTrack) - Number(releaseInfo?.price) > 0
                        ? Number(totalPriceOfTrack) - Number(releaseInfo?.price)
                        : 0,
                    )}
                  </span>{' '}
                  by purchasing the multipack.
                </ListItem>
                <ListItem>
                  A processing fee is deducted each sale for the payment gateway
                  that’s around <span>5%</span>, so we will use <span>5%</span>{' '}
                  as a rough example making the fee for this multipack{' '}
                  <span>{formatMoney(priceFee)}</span> per sale.
                </ListItem>
                <ListItem>
                  The NET income for each sale of this multipack is{' '}
                  <span>{formatMoney(priceSale)}</span>.
                </ListItem>
                <ListItem>
                  Your split % for this multipack is{' '}
                  <span>{percentageOfTokensCanKeep}%</span>
                </ListItem>
                <ListItem>
                  Your account will be credited{' '}
                  <span>{formatMoney(priceEachSale)}</span> for each sale of
                  this multipack.
                </ListItem>
              </UnorderedList>
            </Box>
          </Box>
        )}
        <Box mt="35px">
          <Button
            size="md"
            height="40px"
            width="100%"
            bgColor="#5C94E8"
            mb="20px"
            color="white"
            onClick={
              location.state?.release && isStateRelease
                ? () => handleEditRelease()
                : () => handleSaveRelease(idLabel)
            }
            disabled={
              !isCheckNumberTrack || !isCheckPriceRelease || !isCheckReleaseInfo
            }
          >
            {isLoadingAction || isLoading ? (
              <Spinner />
            ) : location.state?.release && isStateRelease ? (
              t('myRelease.edit')
            ) : (
              t('myRelease.save')
            )}
          </Button>
        </Box>
      </Box>
    );
  };

  return (
    <Box
      className={classNames(
        styles.editorContainer,
        styles[`editor${colorMode}`],
      )}
    >
      {(idLabel || (location?.state?.release && isStateRelease)) && (
        <Box>{renderCreateRelease()}</Box>
      )}
      <Modal
        isOpen={isShowModalCancelCreateRelease}
        onClose={() => setIsShowModalCancelCreateRelease(false)}
      >
        <ModalContent>
          <ModalHeader>Are you sure you want to cancel this label?</ModalHeader>
          <ModalFooter>
            <Button
              bg="#EDF2F7"
              color="#1A202C"
              onClick={() => setIsShowModalCancelCreateRelease(false)}
            >
              Close
            </Button>
            <Button
              backgroundColor="red"
              onClick={() => {
                setIsShowSelectLabel(false);
                changeElement('');
              }}
              ml={3}
            >
              Yes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ReleaseInfo;
