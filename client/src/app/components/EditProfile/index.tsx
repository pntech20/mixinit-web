import { useColorMode } from '@chakra-ui/color-mode';
import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  HStack,
  Input,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Radio,
  RadioGroup,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { TYPE_OF_INPUT } from 'app/constants/enum';
import { generateArray } from 'app/helpers/functions';
import { removeLocalStorage } from 'app/helpers/local-storage';
import { toastSuccess } from 'app/helpers/toast';
import { useProfile } from 'app/hooks/Profile/useProfile';
import { usePlayers } from 'app/hooks/player/usePlayers';
import { selectAuth } from 'app/pages/Login/slice/selectors';
import classNames from 'classnames';
import React, { useEffect } from 'react';
import { CountryDropdown } from 'react-country-region-selector';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { days, months, years } from 'utils/formatTime';
import ChangePassword from '../AccountSettings/components/ChangePassword';
import RenderAlertDialog from '../CartButton/RenderAlertDialog';
import SelectInput from '../SelectInput';
import TextInput from '../TextInput';
import TrackItemSkeleton from '../TrackItemSkeleton';
import styles from './styles.module.scss';

export default function EditProfile() {
  const { handleInputFocus, handleInputBlur } = usePlayers();
  const {
    informations,
    transactionInformations,
    errors,
    control,
    contacts,
    biography,
    handleSubmit,
    onSubmit,
    socials,
    handleChangeFilter,
    handleSelectCountry,
    country,
    countries,
    dayOfBirth,
    handleChangeSelect,
    yubDateOfBirth,
    isLoading,
    sexOptions,
    isUpdateUserSuccess,
    setUpdateUserSuccess,
    // showMyOwnTracks,
    // setShowMyOwnTracks,
    // showTrackPurchases,
    // setShowTrackPurchases,
  } = useProfile();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const onOpenChangePass = useDisclosure();

  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  const { colorMode } = useColorMode();

  const { t } = useTranslation();

  const { userDetail: userInfo } = useSelector(selectAuth);
  const isContributor = userInfo?.isContributor;

  useEffect(() => {
    if (isUpdateUserSuccess) toastSuccess('Update successfully!');
    return () => {
      setUpdateUserSuccess();
    };
  }, [isUpdateUserSuccess, setUpdateUserSuccess]);

  if (!userInfo) {
    return (
      <Stack>
        {generateArray(10).map(item => (
          <TrackItemSkeleton key={item} />
        ))}
      </Stack>
    );
  }

  return (
    <Box
      className={classNames(
        styles.editProfile,
        styles[`editProfile${colorMode}`],
      )}
      minWidth="100%"
      margin="auto"
      mt="20px"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack
          direction={['column', 'column', 'column', 'row']}
          spacing="30px"
          maxW="100%"
        >
          <Box w={{ base: 'unset', lg: '50%' }}>
            <Box>
              <Text mb="5px" fontWeight="600" fontSize="16px">
                {t('profile.emailCannot')}
              </Text>
              {userInfo && (
                <Input
                  className={styles.inputProfileDisabled}
                  defaultValue={userInfo?.email}
                  w="100%"
                  isDisabled
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
              )}
            </Box>
            <Box mt="38px">
              <Text mb="5px" fontWeight="600" fontSize="16px">
                {t('profile.userCannot')}
              </Text>
              {userInfo && (
                <Input
                  className={styles.inputProfileDisabled}
                  defaultValue={userInfo?.username}
                  w="100%"
                  isDisabled
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
              )}
            </Box>
            <Box className={styles.inputSection}>
              {userInfo &&
                informations.map((information, i) => (
                  <Box key={i} className={styles.itemInput}>
                    <label
                      className={classNames(styles.bold, styles.mb5)}
                      htmlFor={information.idLabel}
                      style={{ marginTop: '30px' }}
                    >
                      {information.nameProfile}
                    </label>
                    <TextInput
                      type="text"
                      name={information.idLabel}
                      control={control}
                      errors={errors}
                      placeholder={information.placeholder}
                      defaultValue={information.value}
                    />
                  </Box>
                ))}
            </Box>

            <Box className={styles.inputSection}>
              {userInfo &&
                isContributor &&
                transactionInformations.map(information => (
                  <Box key={information.id} className={styles.itemInput}>
                    <label
                      className={classNames(styles.bold, styles.mb5)}
                      htmlFor={information.idLabel}
                      style={{ marginTop: '30px' }}
                    >
                      {information.nameProfile}
                    </label>
                    <TextInput
                      type="text"
                      name={information.idLabel}
                      control={control}
                      errors={errors}
                      placeholder={information.placeholder}
                      disabled={information.isDisable}
                      defaultValue={information.value}
                    />
                  </Box>
                ))}
            </Box>
          </Box>

          {isContributor && (
            <Box w={{ base: 'unset', lg: '50%' }}>
              <Box className={styles.inputSection}>
                {biography.map((information, i) => (
                  <Box
                    key={i}
                    className={classNames(
                      styles.itemInput,
                      styles[`itemInput${colorMode}`],
                    )}
                  >
                    <label
                      className={classNames(styles.bold, styles.mb5)}
                      htmlFor={information.idLabel}
                    >
                      {information.nameProfile}
                    </label>

                    {information.type === TYPE_OF_INPUT.TEXTAREA &&
                      userInfo && (
                        <TextInput
                          type="textarea"
                          name={information.idLabel}
                          control={control}
                          errors={errors}
                          placeholder={information.placeholder}
                          defaultValue={information.value}
                        />
                      )}
                  </Box>
                ))}
              </Box>

              <Box className={styles.inputSection} mt="26px">
                {countries.map((information, i) => (
                  <Box
                    key={i}
                    className={classNames(
                      styles.itemInput,
                      styles[`itemInput${colorMode}`],
                    )}
                  >
                    <label
                      className={classNames(styles.bold, styles.mb5)}
                      htmlFor={information.idLabel}
                    >
                      {information.nameProfile}
                    </label>

                    {information.type === TYPE_OF_INPUT.COUNTRY && userInfo && (
                      <CountryDropdown
                        value={country || userInfo?.country}
                        onChange={handleSelectCountry}
                      />
                    )}
                  </Box>
                ))}
              </Box>

              {isContributor && (
                <Box className={styles.inputSection}>
                  {userInfo &&
                    contacts.map((information, i) => (
                      <Box
                        key={i}
                        className={classNames(
                          styles.itemInput,
                          styles[`itemInput${colorMode}`],
                        )}
                      >
                        <label
                          className={classNames(styles.bold, styles.mb5)}
                          htmlFor={information.idLabel}
                          style={{ marginTop: '32px' }}
                        >
                          {information.nameProfile}
                        </label>
                        {information.type === TYPE_OF_INPUT.SELECT && (
                          <TextInput
                            type="number"
                            name={information.idLabel}
                            control={control}
                            errors={errors}
                            placeholder={information.placeholder}
                            defaultValue={information.value}
                          />
                        )}
                        {information.type === TYPE_OF_INPUT.TEXTAREA && (
                          <TextInput
                            type="textarea"
                            name={information.idLabel}
                            control={control}
                            errors={errors}
                            placeholder={information.placeholder}
                            defaultValue={information.value}
                          />
                        )}
                        {information.type === TYPE_OF_INPUT.COUNTRY && (
                          <CountryDropdown
                            value={country}
                            onChange={handleSelectCountry}
                          />
                        )}
                        {information.type === TYPE_OF_INPUT.INPUT && (
                          <TextInput
                            type="text"
                            name={information.idLabel}
                            control={control}
                            errors={errors}
                            placeholder={information.placeholder}
                            defaultValue={information.value}
                          />
                        )}
                      </Box>
                    ))}
                  <Box
                    className={classNames(
                      styles.itemInputCheckbox,
                      styles.mt15,
                    )}
                    position="relative"
                  >
                    <label
                      className={classNames(styles.bold, styles.mb5)}
                      style={{ marginTop: '38px' }}
                    >
                      {t('profile.gender')}
                    </label>
                    {userInfo && (
                      <RadioGroup
                        className={styles.checkboxOptions}
                        defaultValue={userInfo?.gender}
                      >
                        <HStack
                          gridGap="16px"
                          spacing={{ base: '30px', sm: '60px' }}
                        >
                          {sexOptions.map((item, index) => (
                            <Radio
                              key={index}
                              value={item.value}
                              onChange={handleChangeFilter}
                            >
                              {item.label}
                            </Radio>
                          ))}
                        </HStack>
                      </RadioGroup>
                    )}
                  </Box>
                  <Box className={styles.itemInputSelect}>
                    <label
                      className={classNames(styles.bold, styles.mb5)}
                      style={{ marginTop: '38px', fontWeight: '600' }}
                    >
                      {t('profile.dateOfBirth')}
                    </label>
                    <Box display="flex" justifyContent="space-between">
                      {userInfo && (
                        <Box w="33%">
                          <SelectInput
                            name={t('profile.Month').toLowerCase()}
                            placeholder={t('profile.Month')}
                            options={months.map(key => ({
                              label: key,
                              value: key,
                            }))}
                            className={classNames(
                              styles.slTimeFrame,
                              styles[`slTimeFrame${colorMode}`],
                            )}
                            defaultValue={
                              dayOfBirth.month.value !== 'ef'
                                ? dayOfBirth.month
                                : 'null'
                            }
                            onChange={e =>
                              handleChangeSelect(
                                e,
                                t('profile.Month').toLowerCase(),
                              )
                            }
                            isColorInput
                          />
                        </Box>
                      )}
                      {userInfo && (
                        <Box w="33%">
                          <SelectInput
                            name={t('profile.Day').toLowerCase()}
                            placeholder={t('profile.Day')}
                            options={days.map(key => ({
                              label: key,
                              value: key,
                            }))}
                            className={classNames(
                              styles.slTimeFrame,
                              styles[`slTimeFrame${colorMode}`],
                            )}
                            defaultValue={
                              dayOfBirth.day.value !== 'un'
                                ? dayOfBirth.day
                                : 'null'
                            }
                            onChange={e =>
                              handleChangeSelect(
                                e,
                                t('profile.Day').toLowerCase(),
                              )
                            }
                            isColorInput
                          />
                        </Box>
                      )}
                      {userInfo && (
                        <Box w="33%" h="30px">
                          <SelectInput
                            name={t('profile.Year').toLowerCase()}
                            placeholder={t('profile.Year')}
                            options={years.map(key => ({
                              label: key,
                              value: key,
                            }))}
                            className={classNames(
                              styles.slTimeFrame,
                              styles[`slTimeFrame${colorMode}`],
                            )}
                            defaultValue={
                              dayOfBirth.year.value !== 'ned/'
                                ? dayOfBirth.year
                                : 'null'
                            }
                            onChange={e =>
                              handleChangeSelect(
                                e,
                                t('profile.Year').toLowerCase(),
                              )
                            }
                            isColorInput
                          />
                        </Box>
                      )}
                    </Box>
                    {yubDateOfBirth && <span>{yubDateOfBirth}</span>}
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </Stack>

        {isContributor && (
          <Box mt="64px">
            <Text
              mb="20px"
              fontSize={{ base: '20px', md: '32px' }}
              fontWeight="400"
            >
              Link your social media accounts
            </Text>
            <Grid
              templateColumns="repeat(4, 1fr)"
              gap={6}
              templateRows="repeat(2, 1fr)"
            >
              {userInfo &&
                socials.map((information, i) => (
                  <GridItem key={i} colSpan={{ base: 6, md: 2 }}>
                    <Box className={styles.itemInput}>
                      <label
                        className={classNames(styles.bold, styles.mb5)}
                        htmlFor={information.idLabel}
                      >
                        {information.nameProfile}
                      </label>
                      <TextInput
                        type="text"
                        control={control}
                        errors={errors}
                        name={information.idLabel}
                        placeholder={information.placeholder}
                        defaultValue={information?.value}
                      />
                    </Box>
                  </GridItem>
                ))}
            </Grid>
          </Box>
        )}

        {/* <Flex
          mt="20px"
          align={{ base: 'start', sm: 'center' }}
          justifyContent="flex-end"
          direction={{ base: 'column', sm: 'row' }}
          gridGap={{ base: '10px', sm: '20px' }}
        >
          <Checkbox
            mt="10px"
            isChecked={
              showTrackPurchases === undefined ? false : showTrackPurchases
            }
            onChange={e => setShowTrackPurchases(e.target.checked)}
          >
            <Text fontSize="14px">Show Tracks Purchased</Text>
          </Checkbox>
          <Checkbox
            mt="10px"
            isChecked={showMyOwnTracks === undefined ? true : showMyOwnTracks}
            onChange={e => setShowMyOwnTracks(e.target.checked)}
          >
            <Text fontSize="14px">Show My Own Tracks</Text>
          </Checkbox>
        </Flex> */}

        <Flex
          m="30px 0px"
          flexWrap="wrap"
          gridGap="20px"
          justifyContent="space-between"
          alignItems="center"
        >
          <Flex gridGap="20px">
            <Button
              className={styles.buttonResetWarning}
              cursor="pointer"
              onClick={onOpen}
            >
              Reset warnings
            </Button>

            {!userInfo?.isRegisteredWithFacebook &&
              !userInfo?.isRegisteredWithGoogle &&
              !userInfo?.isRegisteredWithDropbox && (
                <Button
                  className={styles.buttonResetWarning}
                  onClick={onOpenChangePass.onOpen}
                >
                  Change Password
                </Button>
              )}
          </Flex>

          <RenderAlertDialog
            onClick={() => {
              removeLocalStorage('isShowMessageConfirmBuyTrack');
              removeLocalStorage('isShowMessageAdd');
              removeLocalStorage('isShowMessageRemove');
              removeLocalStorage('isShowDownloadSub');
              onClose();
              toastSuccess('Reset successfully!');
            }}
            isOpen={isOpen}
            onClose={onClose}
            title="RESET WARNINGS?"
            content="Are you sure you want to reset all warnings?"
          />
          <Flex gridGap="20px">
            <Button
              className={styles.buttonProfile}
              type="submit"
              isLoading={isLoading}
              loadingText="Submitting"
              disabled={isLoading}
            >
              {t('profile.saveChange')}
            </Button>
          </Flex>
        </Flex>
      </form>

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={onOpenChangePass.isOpen}
        onClose={onOpenChangePass.onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ChangePassword onClose={onOpenChangePass.onClose} />
        </ModalContent>
      </Modal>
    </Box>
  );
}
