import { yupResolver } from '@hookform/resolvers/yup';
import { VALIDATE_PASSWORD } from 'app/constants';
import { useForgotPasswordSlice } from 'app/pages/ForgotPassword/slice';
import { selectForgotPassword } from 'app/pages/ForgotPassword/slice/selectors';
import { ResetPasswordPayload } from 'app/pages/ForgotPassword/slice/types';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';

interface IResetPasswordFormInput {
  password: string;
  passwordConfirmation: string;
  token: string;
}

export const useResetPasswordForm = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { actions } = useForgotPasswordSlice();
  const { isLoading, resetPasswordSuccess } = useSelector(selectForgotPassword);

  const ResetPasswordValidationSchema = yup.object().shape({
    password: yup
      .string()
      .required()
      .matches(VALIDATE_PASSWORD, t('signUp.validatePassword')),
    passwordConfirmation: yup
      .string()
      .required()
      .oneOf([yup.ref('password'), null], t('resetPassword.passwordsNotMatch')),
  });

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<IResetPasswordFormInput>({
    resolver: yupResolver(ResetPasswordValidationSchema),
  });

  const onSubmit = (data: IResetPasswordFormInput) => {
    const { password, passwordConfirmation, token } = data;
    const payload: ResetPasswordPayload = {
      password,
      passwordConfirmation,
      token,
    };
    dispatch(actions.resetPasswordRequest(payload));
  };

  return {
    control,
    errors,
    handleSubmit,
    onSubmit,
    isLoading,
    resetPasswordSuccess,
  };
};
