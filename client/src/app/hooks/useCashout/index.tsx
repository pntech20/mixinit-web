import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useCashoutsSlice } from 'app/pages/CashOut/slice';
import { selectSliceCashOuts } from 'app/pages/CashOut/slice/selectors';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const useCashOut = () => {
  const dispatch = useDispatch();

  const {
    requestedCashoutSuccess,
    proceedCashoutSuccess,
    isLoading,
    isLoadingProceed,
  } = useSelector(selectSliceCashOuts);
  const { actions } = useCashoutsSlice();

  const { register, handleSubmit, watch } = useForm();

  const [requestTokens, setRequestTokens] = useState<number>(0);
  const [valueToken, setValueToken] = useState<any>(null);
  const [valueOTP, setValueOTP] = useState<string>('');
  const tokensRef = useRef<any>();

  const requestedCashout = useCallback(
    tokens => {
      dispatch(actions.getCashoutsRequest({ tokens }));
    },
    [actions, dispatch],
  );

  const proceedCashOut = useCallback(
    cashoutOTP => {
      dispatch(actions.getProceedCashOutRequest({ cashoutOTP }));
    },
    [actions, dispatch],
  );

  return {
    requestTokens,
    setRequestTokens,
    tokensRef,
    handleSubmit,
    register,
    watch,
    valueToken,
    setValueToken,
    requestedCashout,
    requestedCashoutSuccess,
    proceedCashOut,
    proceedCashoutSuccess,
    valueOTP,
    setValueOTP,
    isLoading,
    isLoadingProceed,
  };
};
