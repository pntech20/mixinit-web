import { yupResolver } from '@hookform/resolvers/yup';
import { useForgotPasswordSlice } from 'app/pages/ForgotPassword/slice';
import { selectForgotPassword } from 'app/pages/ForgotPassword/slice/selectors';
import { ForgotPasswordPayload } from 'app/pages/ForgotPassword/slice/types';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';

interface IForgotPasswordFormInput {
  email: string;
}

export const useForgotPasswordForm = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { actions } = useForgotPasswordSlice();
  const { isLoading, sentEmailSuccess } = useSelector(selectForgotPassword);

  const loginValidationSchema = yup.object().shape({
    email: yup
      .string()
      .label(t('forgotPassword.emailAdress'))
      .required()
      .email(),
  });

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<IForgotPasswordFormInput>({
    resolver: yupResolver(loginValidationSchema),
  });

  const onSubmit = (data: IForgotPasswordFormInput) => {
    const payload: ForgotPasswordPayload = {
      email: data.email,
    };
    dispatch(actions.forgotPasswordRequest(payload));
  };

  return {
    control,
    errors,
    handleSubmit,
    onSubmit,
    isLoading,
    sentEmailSuccess,
  };
};
