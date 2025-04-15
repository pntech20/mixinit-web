import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import * as yup from 'yup';
import { VALIDATE_PASSWORD } from 'app/constants';
import { selectSignup } from 'app/pages/Signup/slice/selectors';
import { useSignupSlice } from 'app/pages/Signup/slice';
import { SignupPayload } from 'app/pages/Signup/slice/types';
import queryString from 'query-string';

interface SignupFormInput {
  email: string;
  password: string;
  confirmPassword: string;
}

export const useSignup = () => {
  const { search } = useLocation();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { actions } = useSignupSlice();
  const { isLoading, signupSuccess } = useSelector(selectSignup);
  const history = useHistory();

  useEffect(() => {
    if (signupSuccess) {
      history.push('/auth/login');
    }
  }, [history, signupSuccess]);

  const loginValidationSchema = yup.object().shape({
    // username: yup.string().required().min(3).max(15),
    email: yup.string().label(t('Email')).required().email(),
    password: yup
      .string()
      .required()
      .matches(VALIDATE_PASSWORD, t('signUp.validatePassword')),
    confirmPassword: yup
      .string()
      .required('Please Enter Confirm Password')
      .matches(VALIDATE_PASSWORD, t('signUp.validatePassword'))
      .when('password', (password, field) =>
        password
          ? field.oneOf([yup.ref('password')], 'Confirm Password Not Match')
          : field,
      ),
  });

  const { email } = queryString.parse(search);

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<SignupFormInput>({
    resolver: yupResolver(loginValidationSchema),
    defaultValues: {
      email: email ? String(email)?.replaceAll(' ', '+') : '',
    },
  });

  const onSubmit = (data: SignupFormInput) => {
    const { email, password, confirmPassword } = data;
    const payload: SignupPayload = {
      email,
      password,
      confirmPassword,
    };
    dispatch(actions.signupRequest(payload));
  };

  return {
    control,
    errors,
    handleSubmit,
    onSubmit,
    isLoading,
  };
};
