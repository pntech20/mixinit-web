import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { confirmVerifyEmail } from 'app/apis/auth/users';
import logoIconLight from 'app/assets/logo/MIXINIT2.png';
// import { FacebookLoginBtn } from 'app/components/FacebookLoginBtn';
import { GoogleLoginBtn } from 'app/components/GoogleLoginBtn';
import { HelmetPage } from 'app/components/HelmetPage';
import LabelForm from 'app/components/LabelForm';
import { useLoginForm } from 'app/hooks/login/useLoginForm';
import queryString from 'query-string';
import { memo, useCallback, useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { useDispatch } from 'react-redux';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { useSignupSlice } from '../Signup/slice';
import styles from './login.module.scss';
import { setLocalStorage } from 'app/helpers/local-storage';
import { IS_REDIRECT_URL } from 'app/constants';
import { DropboxLoginBtn } from 'app/components/DropboxLoginBtn';
import { useDropboxAuthentication } from 'app/hooks/dropbox/useDropboxAuthentication';
import { toastError, toastSuccess } from 'app/helpers/toast';

export const Login = memo(() => {
  const [showPassword, setShowPassword] = useState(false);
  const { control, handleSubmit, onSubmit, errors, isLoading } = useLoginForm();
  const { search } = useLocation();
  const query = queryString.parse(search);
  const { handleSuccess } = useDropboxAuthentication();
  const [token, setToken] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get('code');
    if (authCode) {
      handleSuccess(authCode);
    }
  }, [handleSuccess]);

  useEffect(() => {
    setLocalStorage(IS_REDIRECT_URL, false);
  }, []);

  const handleConfirmVerifyEmail = useCallback(async () => {
    const data = {
      token: query?.token,
    };
    if (query && query?.token && query?.token !== token) {
      const res = await confirmVerifyEmail(data);
      if (res?.response?.status === 400) {
        toastError(res.response.data.message);
      } else {
        setToken(String(query?.token));
        toastSuccess('Verified email Successfully!');
      }
    }
  }, [query, token]);

  useEffect(() => {
    handleConfirmVerifyEmail();
  }, [handleConfirmVerifyEmail]);

  const dispatch = useDispatch();
  const { actions } = useSignupSlice();
  const history = useHistory();

  const SignupButton = useCallback(async () => {
    await dispatch(actions.setSignupSuccess());
    history.push('/auth/signup');
  }, [actions, dispatch, history]);

  return (
    <>
      <HelmetPage title="Login" />
      <Flex
        bg={useColorModeValue('gray.50', 'gray.800')}
        className={styles.container}
      >
        <Stack
          spacing={8}
          mx="auto"
          maxW="lg"
          py={12}
          w="420px"
          px={6}
          maxWidth={420}
        >
          <Box
            rounded="lg"
            bg={useColorModeValue('white', 'gray.700')}
            boxShadow="lg"
            p={6}
          >
            <Box className={styles.headerWidget}>
              <a
                href="https://www.crooklynclan.net/"
                rel="noreferrer"
                target="_blank"
              >
                <Image
                  display="inline"
                  width={120}
                  src={logoIconLight}
                  alt="logo"
                  fallbacksrc={logoIconLight}
                />
              </a>
              <Text className={styles.headerText}>Login</Text>
            </Box>

            <GoogleLoginBtn />
            <DropboxLoginBtn />
            {/* <FacebookLoginBtn /> */}

            <Text className={styles.chooseOptionTxt}>
              or continue with email:
            </Text>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className={styles.formWidget}
            >
              <Stack spacing={4}>
                <FormControl isRequired isInvalid={!!errors?.email?.message}>
                  <LabelForm label="Email address" />
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <>
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          _placeholder={{ color: '#d4d4d4' }}
                          {...field}
                        />
                        <FormErrorMessage className={styles.errorTxt}>
                          {errors.email?.message}
                        </FormErrorMessage>
                      </>
                    )}
                  />
                </FormControl>

                <FormControl isRequired isInvalid={!!errors?.password?.message}>
                  <LabelForm label="Password" />
                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <>
                        <InputGroup>
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            _placeholder={{ color: '#d4d4d4' }}
                            {...field}
                          />
                          <InputRightElement>
                            <Button
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
                        <FormErrorMessage className={styles.errorTxt}>
                          {errors.password?.message}
                        </FormErrorMessage>
                      </>
                    )}
                  />
                </FormControl>

                <Stack spacing={10}>
                  {/* <Stack className={styles.rememberMeCheckbox}>
                    <Checkbox>Remember me</Checkbox>
                  </Stack> */}
                  <Button
                    type="submit"
                    className={styles.loginBtn}
                    isLoading={isLoading}
                  >
                    Login
                  </Button>
                </Stack>
              </Stack>

              <Text
                fontSize="14px"
                color="red"
                fontWeight={700}
                mt="5px"
                mb="5px"
              >
                Your credentials for any previous version of the Mixinit will
                not work. Please make a new account for V.1 and use those
                credentials to log in
              </Text>

              <Box className={styles.bottomLinkWidget}>
                <Box cursor="pointer" onClick={SignupButton}>
                  Signup
                </Box>

                <Link color={'blue.400'} to="/auth/forgot-password">
                  Forgot password?
                </Link>
              </Box>
            </form>
          </Box>
        </Stack>
      </Flex>
    </>
  );
});
