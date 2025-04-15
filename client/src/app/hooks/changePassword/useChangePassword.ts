import { yupResolver } from '@hookform/resolvers/yup';
import { ChangePasswordPayload } from 'app/components/AccountSettings/components/ChangePassword/slice/types';
import { VALIDATE_PASSWORD } from 'app/constants';
import { toastSuccess } from 'app/helpers/toast';
import { messages } from 'app/pages/Login/messages';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import { useChangepasswordSlice } from './../../components/AccountSettings/components/ChangePassword/slice/index';
import { selectChangePassword } from './../../components/AccountSettings/components/ChangePassword/slice/selectors';

interface Props {
  onClose?: () => void;
}

export const useChangePassword = ({ onClose }: Props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { actions } = useChangepasswordSlice();
  const { isLoading, success } = useSelector(selectChangePassword);

  useEffect(() => {
    if (success && onClose) {
      toastSuccess(t('accountSettings.changePassword.success'));
      onClose();
      dispatch(actions.setSuccess());
    }
  }, [actions, dispatch, isLoading, onClose, success, t]);

  const changePasswordValidationSchema = yup.object().shape({
    newPassword: yup
      .string()
      .required()
      .matches(
        VALIDATE_PASSWORD,
        t('accountSettings.changePassword.validatePassword'),
      ),
    currentPassword: yup
      .string()
      .required()
      .matches(
        VALIDATE_PASSWORD,
        t('accountSettings.changePassword.validatePassword'),
      ),
    passwordConfirmation: yup
      .string()
      .label(t(messages.password()))
      .required()
      .oneOf(
        [yup.ref('newPassword'), null],
        t('accountSettings.changePassword.passwordsNotMatch'),
      ),
  });

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<ChangePasswordPayload>({
    resolver: yupResolver(changePasswordValidationSchema),
  });

  const onSubmit = (data: ChangePasswordPayload) => {
    const payload: ChangePasswordPayload = {
      newPassword: data.newPassword,
      currentPassword: data.currentPassword,
      passwordConfirmation: data.passwordConfirmation,
    };

    dispatch(actions.changePassWordRequest(payload));
  };

  return {
    control,
    errors,
    handleSubmit,
    onSubmit,
    isLoading,
    success,
  };
};
