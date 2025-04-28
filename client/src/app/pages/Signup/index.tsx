import {
  Box,
  Button,
  Checkbox,
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
import logoIconLight from 'app/assets/logo/crooklyn-clan-logo-refresh-black.svg';
// import { FacebookLoginBtn } from 'app/components/FacebookLoginBtn';
import { GoogleLoginBtn } from 'app/components/GoogleLoginBtn';
import { HelmetPage } from 'app/components/HelmetPage';
import LabelForm from 'app/components/LabelForm';
import { useSignup } from 'app/hooks/signup/useSignup';
import queryString from 'query-string';
import { memo, useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import styles from './signup.module.scss';
import { selectSignup } from './slice/selectors';
import { setLocalStorage } from 'app/helpers/local-storage';
import { IS_REDIRECT_URL } from 'app/constants';
import { DropboxLoginBtn } from 'app/components/DropboxLoginBtn';

export const Signup = memo(() => {
  const { isLoading } = useSelector(selectSignup);
  const [isChecked, setIsChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const { control, handleSubmit, onSubmit, errors } = useSignup();
  const { search } = useLocation();
  const email = queryString.parse(search)?.email;

  useEffect(() => {
    setLocalStorage(IS_REDIRECT_URL, false);
  }, []);

  return (
    <>
      <HelmetPage title="Signup" />
      <Flex
        bg={useColorModeValue('gray.50', 'gray.800')}
        className={styles.container}
      >
        <Stack
          className={styles.signup}
          spacing={8}
          mx="auto"
          maxW="lg"
          py={12}
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
                  fallbacksrc={logoIconLight}
                  alt="logo"
                />
              </a>
              <Text className={styles.headerText}>Welcome Aboard</Text>
              <Text className={styles.titleText}>
                ATTENTION USERS OF PREVIOUS VERSIONS OF THE MIXINIT You will
                need to make a new account to use V.1. Your old credentials will
                not work. Please sign up for a new account, it’s free and
                required to view the store. Thank you, and sorry for the
                inconvenience.
              </Text>
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
                {/* <FormControl isRequired isInvalid={!!errors?.username?.message}>
                  <LabelForm label="Pick a username (You can never change it)." />
                  <Controller
                    name="username"
                    control={control}
                    render={({ field }) => (
                      <>
                        <Input
                          type="input"
                          placeholder="Enter your name"
                          {...field}
                        />
                        <FormErrorMessage className={styles.errorTxt}>
                          {errors.username?.message}
                        </FormErrorMessage>
                      </>
                    )}
                  />
                </FormControl> */}

                <FormControl isRequired isInvalid={!!errors?.email?.message}>
                  <LabelForm label="What your email? (You can’t change that)." />
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <>
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          _placeholder={{ color: '#d4d4d4' }}
                          disabled={!!email}
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
                  <LabelForm label="Create a password (Make it a good one)." />
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

                <FormControl isRequired isInvalid={!!errors?.password?.message}>
                  <LabelForm label="Type the password again (Just to make sure)." />
                  <Controller
                    name="confirmPassword"
                    control={control}
                    render={({ field }) => (
                      <>
                        <InputGroup>
                          <Input
                            type={showPasswordConfirm ? 'text' : 'password'}
                            placeholder="Enter your password again"
                            _placeholder={{ color: '#d4d4d4' }}
                            {...field}
                          />
                          <InputRightElement>
                            <Button
                              boxShadow="none !important"
                              variant="ghost"
                              size="20px"
                              onClick={() =>
                                setShowPasswordConfirm(
                                  showPassword => !showPassword,
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
                        <Text className={styles.errorTxt}>
                          {errors.confirmPassword?.message}
                        </Text>
                      </>
                    )}
                  />
                </FormControl>

                <Stack spacing={10}>
                  <Stack className={styles.rememberMeCheckbox}>
                    <Flex>
                      <Checkbox onChange={e => setIsChecked(e.target.checked)}>
                        I agree to the
                      </Checkbox>
                      &nbsp;
                      <a
                        href="https://www.crooklynclan.net/terms-of-service"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Text as="span" className={styles.green}>
                          CrooklynClan terms & conditions
                        </Text>
                      </a>
                    </Flex>
                  </Stack>
                  <Button
                    disabled={!isChecked}
                    isLoading={isLoading}
                    type="submit"
                    className={styles.loginBtn}
                  >
                    Create account
                  </Button>
                </Stack>
                <Text
                  color="red"
                  fontWeight={700}
                  fontSize="14px"
                  mt="0px"
                  mb="5px"
                >
                  Your credentials for any previous version of the Mixinit will
                  not work. Please make a new account for V.1 and use those
                  credentials to log in
                </Text>
                <Box className={styles.bottomLinkWidget}>
                  <Link color={'blue.400'} to="/auth/login">
                    Login
                  </Link>
                </Box>
              </Stack>
            </form>
          </Box>
        </Stack>
      </Flex>
    </>
  );
});
