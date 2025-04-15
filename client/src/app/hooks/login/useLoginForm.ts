import { yupResolver } from '@hookform/resolvers/yup';
import { useAuthSlice } from 'app/pages/Login/slice/index';
import { selectAuth } from 'app/pages/Login/slice/selectors';
import { LoginPayload } from 'app/pages/Login/slice/types';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as yup from 'yup';

interface ILoginFormInput {
  email: string;
  password: string;
  accessToken?: string;
}

export const useLoginForm = () => {
  const dispatch = useDispatch();
  const { actions } = useAuthSlice();
  const { isLoading, isAuthenticated } = useSelector(selectAuth);
  const history = useHistory();

  useEffect(() => {
    if (isAuthenticated) {
      history.push('/');
    }
  }, [history, isAuthenticated]);

  const loginValidationSchema = yup.object().shape({
    email: yup.string().label('Email').required().email(),
    password: yup.string().label('Password').required(),
  });

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<ILoginFormInput>({
    resolver: yupResolver(loginValidationSchema),
  });

  const onSubmit = (data: ILoginFormInput) => {
    const isSocialLogin = false;
    localStorage.setItem('isSocialLogin', JSON.stringify(isSocialLogin));
    const payload: LoginPayload = {
      email: data.email,
      password: data.password,
    };
    dispatch(actions.loginRequest(payload));
  };

  return {
    control,
    errors,
    handleSubmit,
    onSubmit,
    isLoading,
  };
};
