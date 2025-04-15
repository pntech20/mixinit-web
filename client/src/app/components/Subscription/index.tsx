import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  Input,
  Select,
  SimpleGrid,
  Text,
  Textarea,
  useColorModeValue,
} from '@chakra-ui/react';
import styles from './index.module.scss';
import { useForm } from 'react-hook-form';
import { useMemo, useState } from 'react';
import { Country, State } from 'country-state-city';
import { useHistory, useLocation } from 'react-router-dom';
import { updateSubscription } from 'app/apis/subscription ';
import { toastError, toastSuccess } from 'app/helpers/toast';
import { getErrorMsgResponse } from 'app/helpers/messages';
import { usePlayers } from 'app/hooks/player/usePlayers';

const Subscription = () => {
  const { handleInputFocus, handleInputBlur } = usePlayers();

  const {
    handleSubmit,
    watch,
    register,
    formState: { errors },
  } = useForm();

  const watchAllFields = watch();

  const history = useHistory();

  const [isLoading, setLoading] = useState<boolean>(false);

  const onSubmit = async datas => {
    setLoading(true);
    const dataUpdate: any = {};
    Object.entries(datas).forEach(([key, value]) => {
      dataUpdate[key] = value;
    });
    const nameCountry = optionsCountry?.filter(item => {
      return item.isoCode === datas.country && item.name;
    });
    const nameState = optionsStates?.filter(item => {
      return item.isoCode === datas.state && item.name;
    });

    dataUpdate['subscriptionId'] = subscriptionId;
    dataUpdate['zipCode'] = Number(datas.zipCode);
    dataUpdate['country'] = String(nameCountry[0].name);
    dataUpdate['state'] = String(nameState[0].name);

    try {
      await updateSubscription(dataUpdate);
      setLoading(false);
      history.push({
        pathname: `/services`,
        state: true,
      });
      toastSuccess('Admin will approve your request later, please check email');
    } catch (error) {
      setLoading(false);
      const errMsg = getErrorMsgResponse(error);
      toastError(errMsg);
    }
  };
  const optionsCountry = useMemo(() => Country.getAllCountries(), []);
  const optionsStates = useMemo(() => State.getAllStates(), []);

  const index = optionsCountry.findIndex(e => e.isoCode === 'US');
  const defaultValueCountry = optionsCountry[index].isoCode;

  const optionsState = watchAllFields.country
    ? optionsStates.filter(item => {
        return item.countryCode === watchAllFields.country && item;
      })
    : optionsStates;

  const location = useLocation();
  const subscriptionId = location.state;

  const colorSubscriptionText = useColorModeValue('#000', '#fff');
  const bgForm = useColorModeValue('#f3f3f3', '#1a202c');
  const colorForm = useColorModeValue('#333', '#fff');

  return (
    <Box className={styles.subscription}>
      <Box>
        <Box className={styles.subscriptionTitle} color={colorSubscriptionText}>
          Subscription Application Form
        </Box>
        <Text className={styles.subscriptionText}>
          Thank you for your interest in one of our monthly-recurring
          subscriptions. In order to process your application, all fields in the
          following form must be filled out accurately. Review and response time
          will vary but you will generally receive a response within 48 hours.
        </Text>
      </Box>
      <form
        className={styles.formSubscription}
        onSubmit={handleSubmit(onSubmit)}
      >
        <Text className={styles.subscriptionNote}>
          If You Have Already Had A Monthly Recurring Subscription And Are
          Applying For A New One Please Be Sure It's Been 90 Or More Days Since
          Your Last Active Subscription Or Your Application Will Not Show Up In
          Our System.
        </Text>
        <Box>
          <FormControl mb="10px" isInvalid={errors.stageName}>
            <Input
              placeholder="Stage Name"
              _placeholder={{ color: '#d4d4d4' }}
              id="stageName"
              {...register('stageName', {
                required: 'This is required',
              })}
              className={styles.subscriptionInput}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            />
            <FormErrorMessage>
              {errors.stageName && errors.stageName.message}
            </FormErrorMessage>
          </FormControl>

          <SimpleGrid columns={[1, 1, 3, 3]} spacing="10px">
            <FormControl mb="10px" isInvalid={errors.email}>
              <Input
                placeholder="Email Address"
                _placeholder={{ color: '#d4d4d4' }}
                id="email"
                {...register('email', {
                  required: 'This is required',
                })}
                className={styles.subscriptionInput}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
              <FormErrorMessage>
                {errors.email && errors.email.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl mb="10px" isInvalid={errors.firstName}>
              <Input
                placeholder="First Name"
                _placeholder={{ color: '#d4d4d4' }}
                id="firstName"
                {...register('firstName', {
                  required: 'This is required',
                })}
                className={styles.subscriptionInput}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
              <FormErrorMessage>
                {errors.firstName && errors.firstName.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl mb="10px" isInvalid={errors.lastName}>
              <Input
                placeholder="Last Name"
                _placeholder={{ color: '#d4d4d4' }}
                id="lastName"
                {...register('lastName', {
                  required: 'This is required',
                })}
                className={styles.subscriptionInput}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
              <FormErrorMessage>
                {errors.lastName && errors.lastName.message}
              </FormErrorMessage>
            </FormControl>
          </SimpleGrid>

          <FormControl mb="10px" isInvalid={errors.streetAddress}>
            <Input
              placeholder="Street Address"
              _placeholder={{ color: '#d4d4d4' }}
              id="streetAddress"
              {...register('streetAddress', {
                required: 'This is required',
              })}
              className={styles.subscriptionInput}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            />
            <FormErrorMessage>
              {errors.streetAddress && errors.streetAddress.message}
            </FormErrorMessage>
          </FormControl>

          <Flex w="100%" direction={{ base: 'column', md: 'row' }}>
            <FormControl
              mb="10px"
              isInvalid={errors.city}
              w={{ base: '100%', md: '35%' }}
            >
              <Input
                placeholder="City"
                _placeholder={{ color: '#d4d4d4' }}
                id="city"
                {...register('city', {
                  required: 'This is required',
                })}
                className={styles.subscriptionInput}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
              <FormErrorMessage>
                {errors.city && errors.city.message}
              </FormErrorMessage>
            </FormControl>
            <Box
              w={{ base: '100%', md: '30%' }}
              px={{ base: '0px', md: '10px' }}
            >
              <Select
                id="state"
                defaultValue=""
                {...register('state', {
                  required: 'This is required',
                })}
                placeholder="State"
                _placeholder={{ color: '#d4d4d4' }}
                className={styles.subscriptionSelect}
                background={bgForm}
                color={colorForm}
              >
                {optionsState.map(item => (
                  <option value={item.isoCode}>{item.name}</option>
                ))}
              </Select>
            </Box>
            <FormControl
              mb="10px"
              isInvalid={errors.zipCode}
              w={{ base: '100%', md: '35%' }}
            >
              <Input
                placeholder="Zip"
                _placeholder={{ color: '#d4d4d4' }}
                id="zipCode"
                {...register('zipCode', {
                  required: 'This is required',
                })}
                className={styles.subscriptionInput}
                type="number"
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
              <FormErrorMessage>
                {errors.zipCode && errors.zipCode.message}
              </FormErrorMessage>
            </FormControl>
          </Flex>

          <Flex w="100%" direction={{ base: 'column', md: 'row' }}>
            <Box
              w={{ base: '100%', md: '30%' }}
              pr={{ base: '0px', md: '10px' }}
            >
              <Select
                id="country"
                defaultValue={defaultValueCountry}
                {...register('country', {
                  required: 'This is required',
                })}
                placeholder="Country"
                _placeholder={{ color: '#d4d4d4' }}
                className={styles.subscriptionSelect}
                background={bgForm}
                color={colorForm}
              >
                {optionsCountry.map(item => (
                  <option value={item.isoCode}>{item.name}</option>
                ))}
              </Select>
            </Box>
            <FormControl
              mb="10px"
              isInvalid={errors.phoneNumber}
              w={{ base: '100%', md: '70%' }}
            >
              <Input
                placeholder="Phone Number"
                _placeholder={{ color: '#d4d4d4' }}
                id="phoneNumber"
                {...register('phoneNumber', {
                  required: 'This is required',
                })}
                type="number"
                className={styles.subscriptionInput}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
              <FormErrorMessage>
                {errors.phoneNumber && errors.phoneNumber.message}
              </FormErrorMessage>
            </FormControl>
          </Flex>
        </Box>
        <Text className={styles.subscriptionNote}>
          Tell Us About You.. Are You A Mobile DJ, Do You Work In The Clubs, On
          Radio? Be As Detailed As Possible.. Share Links To Your Websites For
          Your DJ Company, Your Social Media Pages, Etc.. Before We Can Give You
          A Monthly Recurring Subscription We Have To Be Sure We Know Who You
          Are.
        </Text>
        <Box>
          <FormControl mb="10px" isInvalid={errors.linkSocialMedia}>
            <Textarea
              placeholder="Include links to your social media profiles, websites, etc.."
              _placeholder={{ color: '#d4d4d4' }}
              rows={2}
              id="linkSocialMedia"
              {...register('linkSocialMedia', {
                required: 'This is required',
              })}
              className={styles.subscriptionInclude}
              background={bgForm}
              color={colorForm}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            />
            <FormErrorMessage>
              {errors.linkSocialMedia && errors.linkSocialMedia.message}
            </FormErrorMessage>
          </FormControl>
        </Box>
        <Text className={styles.subscriptionUnder}>
          UNDER NO CIRCUMSTANCES ARE THE FILES OBTAINED IN THE CROOKLYN CLAN
          VAULT TO BE SOLD OR REDISTRIBUTED WITHOUT THE EXPRESS WRITTEN CONSENT
          OF CROOKLYN CLAN INC. CROOKLYN CLAN RESERVES THE RIGHT TO REVOKE ANY
          MEMBERSHIP, ACCESS POINT, OR SUBSCRIPTION AT ANY TIME AT OUR OWN
          DISCRETION WITHOUT WARNING. IF WE SUSPECT YOU ARE SELLING OR PUBLICLY
          SHARING THE FILES YOU OBTAIN HERE WE WILL ELIMINATE YOUR ACCESS
          PERMANENTLY.
        </Text>
        <Box>
          <FormControl>
            <Checkbox id="certify" {...register('certify')}>
              <Text className={styles.textCheckbox} color={colorForm}>
                I CERTIFY THAT I WILL NOT SELL OR PUBLICLY SHARE THE FILES
                OBTAINED IN THE CROOKLYN CLAN VAULT. I ASSUME FULL
                RESPONSIBILITY RESPONSIBILITY RESPONSIBILITY FOR THE SHARING OR
                REDISTRIBUTION OF THE FILES I CROOKLYN CLAN VAULT.
              </Text>
            </Checkbox>
          </FormControl>
        </Box>
        <Box>
          <Button
            className={styles.submit}
            type="submit"
            disabled={!watchAllFields.certify}
            isLoading={isLoading}
          >
            SUBMIT
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default Subscription;
