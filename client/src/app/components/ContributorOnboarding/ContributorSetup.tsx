import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Image as Images,
  Input,
  InputGroup,
  InputRightElement,
  SimpleGrid,
  Text,
  VStack,
} from '@chakra-ui/react';
import './ContributorOnboarding.module.scss';
import { useForm } from 'react-hook-form';

import { useEffect, useRef, useState } from 'react';
import { useProfile } from 'app/hooks/Profile/useProfile';
import PlaceholderBgDefault from 'app/assets/placeholders/avatar.jpeg';
import { useDispatch, useSelector } from 'react-redux';
import { selectAuth } from 'app/pages/Login/slice/selectors';
import { toastError } from 'app/helpers/toast';
import { ApiUploadS3 } from 'app/apis/uploadS3';
import { updateUserContributor } from 'app/apis/auth';
import { useHistory } from 'react-router-dom';
import { OTHERS_FOLDER_UPLOAD_S3, VALIDATE_PASSWORD } from 'app/constants';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import styles from './ContributorOnboarding.module.scss';
import { CountryDropdown } from 'react-country-region-selector';
import { usePlayers } from 'app/hooks/player/usePlayers';
import { useAuthSlice } from 'app/pages/Login/slice';

export default function ContributorSetup({ contactRef }) {
  const { handleInputFocus, handleInputBlur } = usePlayers();
  const {
    handleSubmit,
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const { country, handleSelectCountry, setIsCountry, isCountry } =
    useProfile();
  const { actions } = useAuthSlice();
  const dispatch = useDispatch();
  const checkRequiredCountry = country === '';

  const [dataContributor, setDataContributor] = useState<any>([]);
  const [file, setFile] = useState<any>();
  const [srcImg, setSrcImg] = useState<any>();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const isSocialLogin = localStorage.getItem('isSocialLogin');

  const history = useHistory();

  useEffect(() => {
    watch(value => setDataContributor(value));
  }, [watch]);

  const isEmpty = Object.keys(errors).length === 0;

  const onSubmit = async data => {
    if (!checkRequiredCountry) {
      setIsCountry(false);
      setLoading(true);
      const dataUpdate: any = {};
      const dataSubmit = {
        ...data,
        country: country,
      };
      Object.entries(dataSubmit).forEach(([key, value]) => {
        dataUpdate[key] = value;
      });
      if (file) {
        const res = await ApiUploadS3({
          file,
          path: `${OTHERS_FOLDER_UPLOAD_S3}/${data.username}/profile`,
        });
        dataUpdate['avatar'] = res?.data;
      }

      try {
        const res = await updateUserContributor(dataUpdate);

        if (res) {
          dispatch(actions.updateConfirmContributor(false));
          history.push('/home');
        }
      } catch (error: any) {
        setLoading(false);
        toastError(error?.response?.data?.message);
        console.log({ error });
      }
    } else setIsCountry(true);
  };

  const arrayMedia = [
    {
      label: 'Facebook',
      name: 'facebookUrl',
    },
    {
      label: 'Instagram',
      name: 'instagramUrl',
    },
    {
      label: 'MixCloud',
      name: 'mixcloudUrl',
    },
    {
      label: 'Spotify',
      name: 'spotifyUrl',
    },
    {
      label: 'SoundCloud',
      name: 'soundcloudUrl',
    },
    {
      label: 'TikTok',
      name: 'tiktokUrl',
    },
    {
      label: 'Twitch',
      name: 'twitchUrl',
    },
    {
      label: 'YouTube',
      name: 'youtubeUrl',
    },
    {
      label: 'Your Personal Website',
      name: 'website',
    },
  ];

  const { isUploadAvatar } = useProfile();
  const { userDetail: userInfo } = useSelector(selectAuth);

  useEffect(() => {
    if (userInfo?.email) {
      setValue('email', userInfo.email);
    }

    if (userInfo?.avatar) {
      setValue('image', userInfo.avatar);
    }
  }, [userInfo, setValue]);

  const fileInputRef = useRef<any>(null);

  function getBase64(file) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      setSrcImg(reader.result);
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }

  const ChangeAvatar = event => {
    const file = event.target.files[0];
    const img = new Image();
    if (file.type.startsWith('image/')) {
      img.src = URL.createObjectURL(file);
      img.addEventListener('load', async function () {
        if (img.width !== 1080 || img.height !== 1080) {
          toastError('Image must be 1080x1080 pixels.');
        } else {
          setFile(file);
          setValue('image', file);
          await getBase64(file);
        }
      });
    }
  };

  return (
    <Box>
      <Flex ref={contactRef} pt="120px" mt="-120px">
        <Text
          mb={{ base: '10px', sm: '30px' }}
          fontSize={{ base: '20px', sm: '40px' }}
          fontWeight={800}
          letterSpacing="2px"
        >
          Contributor Setup
        </Text>
      </Flex>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack
          spacing={{ base: 2, sm: 5 }}
          fontSize={{ base: '14px', sm: '16px' }}
          align="stretch"
        >
          <FormControl isInvalid={errors.name}>
            <FormLabel htmlFor="username">
              <span>Contributor Username</span>{' '}
              <Text as="span" color="red">
                *
              </Text>
              <br />
              (Must be unique and cannot be changed. Once a contributor creates
              a username that's the name all of their contributions will be
              listed under)
            </FormLabel>
            <Input
              className={styles.input}
              id="username"
              placeholder=""
              // defaultValue={userInfo.username}
              {...register('username', {
                required: 'This is required',
              })}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            />
            <FormErrorMessage>
              {errors.username && errors.username.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.email}>
            <FormLabel htmlFor="email">
              <span>Email Address</span>{' '}
              <Text as="span" color="red">
                *
              </Text>
            </FormLabel>
            <Input
              className={styles.input}
              id="email"
              placeholder=""
              type="email"
              defaultValue={userInfo?.email}
              {...register('email', {
                required: 'This is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'invalid email address',
                },
              })}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              disabled
            />
            <FormErrorMessage>
              {errors.email && errors.email.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.paypalEmail}>
            <FormLabel htmlFor="paypalEmail">
              <span>Paypal Email Address </span>{' '}
              <Text as="span" color="red">
                *
              </Text>
              <br />
              (You must have a Paypal account in order to be paid by our
              service.)
            </FormLabel>
            <Input
              className={styles.input}
              id="paypalEmail"
              placeholder=""
              type="email"
              defaultValue={userInfo?.paypalEmail}
              {...register('paypalEmail', {
                required: 'This is required',
              })}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            />
            <FormErrorMessage>
              {errors.paypalEmail && errors.paypalEmail.message}
            </FormErrorMessage>
          </FormControl>

          <SimpleGrid columns={{ md: 2 }} gridGap={3}>
            <FormControl isInvalid={errors.firstName}>
              <FormLabel htmlFor="firstName">
                <span>First Name</span>{' '}
                <Text as="span" color="red">
                  *
                </Text>
              </FormLabel>
              <Input
                className={styles.input}
                id="firstName"
                placeholder=""
                defaultValue={userInfo?.firstName}
                {...register('firstName', {
                  required: 'This is required',
                })}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
              <FormErrorMessage>
                {errors.firstName && errors.firstName.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.lastName}>
              <FormLabel htmlFor="lastName">
                <span>Last Name</span>{' '}
                <Text as="span" color="red">
                  *
                </Text>
              </FormLabel>
              <Input
                className={styles.input}
                id="lastName"
                placeholder=""
                defaultValue={userInfo?.lastName}
                {...register('lastName', {
                  required: 'This is required',
                })}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
              <FormErrorMessage>
                {errors.name && errors.name.message}
              </FormErrorMessage>
            </FormControl>
          </SimpleGrid>

          {/* {userInfo && !userInfo.isLoginGoogle && ( */}
          {isSocialLogin === 'false' && (
            <SimpleGrid columns={{ md: 2 }} gridGap={3}>
              <FormControl isInvalid={errors.password}>
                <FormLabel htmlFor="password">
                  <span>Password</span>{' '}
                  <Text as="span" color="red">
                    *
                  </Text>
                </FormLabel>
                <InputGroup>
                  <Input
                    className={styles.input}
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    placeholder=""
                    {...register('password', {
                      pattern: {
                        value: VALIDATE_PASSWORD,
                        message:
                          'Must contains at least one lowercase letter, one uppercase letter, one digit, and consists of at least 8 characters. It also allows special characters like #$@!%&*?',
                      },
                      required: 'This is required',
                    })}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                  />
                  <InputRightElement>
                    <Button
                      className={styles.button}
                      bg="unset"
                      _hover={{ bg: 'unset' }}
                      _active={{ bg: 'unset' }}
                      size="20px"
                      boxShadow="none !important"
                      variant="ghost"
                      onClick={() =>
                        setShowPassword(showPassword => !showPassword)
                      }
                    >
                      {showPassword ? (
                        <AiFillEye size="20px" />
                      ) : (
                        <AiFillEyeInvisible size="20px" />
                      )}
                    </Button>
                  </InputRightElement>
                </InputGroup>

                <FormErrorMessage>
                  {errors.password && errors.password.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors.confirmPassword}>
                <FormLabel htmlFor="confirmPassword">
                  <span>Confirm Password</span>{' '}
                  <Text as="span" color="red">
                    *
                  </Text>
                </FormLabel>
                <InputGroup>
                  <Input
                    className={styles.input}
                    id="confirmPassword"
                    placeholder=""
                    type={showPasswordConfirm ? 'text' : 'password'}
                    {...register('confirmPassword', {
                      required: 'This is required',
                    })}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                  />
                  <InputRightElement>
                    <Button
                      className={styles.button}
                      bg="unset"
                      _hover={{ bg: 'unset' }}
                      _active={{ bg: 'unset' }}
                      size="20px"
                      boxShadow="none !important"
                      variant="ghost"
                      onClick={() =>
                        setShowPasswordConfirm(
                          showPasswordConfirm => !showPasswordConfirm,
                        )
                      }
                    >
                      {showPasswordConfirm ? (
                        <AiFillEye size="20px" />
                      ) : (
                        <AiFillEyeInvisible size="20px" />
                      )}
                    </Button>
                  </InputRightElement>
                </InputGroup>

                <FormErrorMessage>
                  {errors.confirmPassword && errors.confirmPassword.message}
                </FormErrorMessage>
                {dataContributor &&
                  dataContributor.password &&
                  dataContributor.confirmPassword &&
                  dataContributor.password !==
                    dataContributor.confirmPassword && (
                    <Text color="red">
                      Confirm password is different from password
                    </Text>
                  )}
              </FormControl>
            </SimpleGrid>
          )}

          <SimpleGrid columns={{ md: 2 }} gridGap={3}>
            <FormControl isInvalid={errors.mailingAddress}>
              <FormLabel htmlFor="mailingAddress">
                <span>Mailing Address</span>{' '}
                <Text as="span" color="red">
                  *
                </Text>
              </FormLabel>
              <Input
                className={styles.input}
                id="mailingAddress"
                placeholder=""
                defaultValue={userInfo?.mailingAddress}
                {...register('mailingAddress', {
                  required: 'This is required',
                })}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
              <FormErrorMessage>
                {errors.mailingAddress && errors.mailingAddress.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.mobileNumber}>
              <FormLabel htmlFor="mobileNumber">
                <span>Contact Phone #</span>{' '}
                <Text as="span" color="red">
                  *
                </Text>
              </FormLabel>
              <Input
                className={styles.input}
                type="number"
                id="mobileNumber"
                placeholder=""
                defaultValue={userInfo?.mobileNumber}
                {...register('mobileNumber', {
                  required: 'This is required',
                })}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
              <FormErrorMessage>
                {errors.mobileNumber && errors.mobileNumber.message}
              </FormErrorMessage>
            </FormControl>
          </SimpleGrid>

          <FormControl isInvalid={errors.country}>
            <FormLabel htmlFor="country">
              <span>Country Of Residence</span>{' '}
              <Text as="span" color="red">
                *
              </Text>
            </FormLabel>
            <Box
              className={styles.CountryDropdown}
              boxShadow={
                isCountry || (!isEmpty && checkRequiredCountry)
                  ? '0 0 0 1px #E53E3E'
                  : ''
              }
            >
              <CountryDropdown value={country} onChange={handleSelectCountry} />
            </Box>
            {(isCountry || (!isEmpty && checkRequiredCountry)) && (
              <Box className={styles.requiredCountry}>This is required</Box>
            )}
          </FormControl>
          {dataContributor && country === 'United States' && (
            <FormControl isInvalid={errors.taxIdentificationNumber}>
              <FormLabel htmlFor="taxIdentificationNumber">
                <span>SSN# or TAX ID# </span>{' '}
                <Text as="span" color="red">
                  *
                </Text>
              </FormLabel>
              <Input
                className={styles.input}
                id="taxIdentificationNumber"
                placeholder=""
                defaultValue={userInfo?.taxIdentificationNumber}
                {...register('taxIdentificationNumber', {
                  required: 'This is required',
                })}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
              <FormErrorMessage>
                {errors.taxIdentificationNumber &&
                  errors.taxIdentificationNumber.message}
              </FormErrorMessage>
            </FormControl>
          )}

          <FormControl isInvalid={errors.biography}>
            <FormLabel htmlFor="biography">
              <span>Contributor Biography </span>{' '}
              <Text as="span" color="red">
                *
              </Text>
              <br />
              (Tell our clients who you are and what you are all about!)
            </FormLabel>
            <Input
              className={styles.input}
              id="biography"
              placeholder="Put your bio here!"
              defaultValue={userInfo?.biography}
              {...register('biography', {
                required: 'This is required',
              })}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            />
            <FormErrorMessage>
              {errors.biography && errors.biography.message}
            </FormErrorMessage>
          </FormControl>

          <SimpleGrid columns={{ md: 2 }} gridGap={3}>
            <FormControl>
              <FormLabel htmlFor="hometown">
                <span>Hometown</span>
              </FormLabel>
              <Input
                className={styles.input}
                id="hometown"
                defaultValue={userInfo?.hometown}
                {...register('hometown')}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
            </FormControl>

            <FormControl colSpan={2}>
              <FormLabel htmlFor="currentLocation">
                <span>Current Location</span>
              </FormLabel>
              <Input
                className={styles.input}
                id="currentLocation"
                defaultValue={userInfo?.currentLocation}
                {...register('currentLocation')}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
            </FormControl>
          </SimpleGrid>

          <Box>
            <span>Contributor Square Image/Logo</span>{' '}
            <Text as="span" color="red">
              *
            </Text>
            <br />
            (Upload resolution 1080x1080px)
          </Box>

          <Flex alignItems="center">
            <Images
              opacity={isUploadAvatar ? 0.2 : 1}
              className="img-avatar"
              w={{ base: '150px', md: '250px' }}
              h={{ base: '150px', md: '250px' }}
              src={srcImg || userInfo?.avatar || PlaceholderBgDefault}
            />
            <Box cursor="pointer" filter="invert(1)" ml="20px">
              <FormControl isInvalid={errors.image}>
                <FormLabel htmlFor="image"></FormLabel>
                <Input
                  className={styles.input}
                  htmlFor="image"
                  id="image"
                  {...register('image', {
                    required: 'This is required',
                  })}
                  hidden
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={event => ChangeAvatar(event)}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
                <Button
                  className={styles.button}
                  color="unset"
                  fontSize={{ base: '12px', md: '16px' }}
                  p="9px 15px"
                  font
                  onClick={() => fileInputRef.current.click()}
                >
                  UPLOAD/CHANGE
                </Button>
                {errors.image && (
                  <div style={{ color: '#00fffd', fontWeight: 400 }}>
                    {errors.image.message}
                  </div>
                )}
              </FormControl>
            </Box>
          </Flex>
          <FormErrorMessage>
            {errors.image && errors.image.message}
          </FormErrorMessage>

          <Text ml="20px" fontSize="16px">
            <span style={{ fontSize: '20px' }}>Social Media Links</span> <br />
            (Add as many as you can so your fans can find and follow you!)
          </Text>

          {arrayMedia.map((item, index) => (
            <FormControl key={index}>
              <FormLabel>
                <span>{item.label}</span>{' '}
              </FormLabel>
              <Input
                className={styles.input}
                id={item.name}
                defaultValue={userInfo?.[item.name] || ''}
                {...register(`${item.name}`)}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
            </FormControl>
          ))}
        </VStack>
        <Button
          className={styles.button}
          mt={5}
          disabled={isLoading}
          bg="#000000"
          color="white"
          isLoading={isLoading}
          type="submit"
        >
          Submit
        </Button>
      </form>
    </Box>
  );
}
