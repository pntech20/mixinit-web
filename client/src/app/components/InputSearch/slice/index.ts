import { InputState } from './types';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { inputSaga } from './saga';

export const initialState: InputState = {
  isOnchangeInput: false,
};

const slice = createSlice({
  name: 'input',
  initialState,
  reducers: {
    setIsOnchangeInput(state, action) {
      state.isOnchangeInput = action.payload;
    },
  },
});

export const { actions } = slice;
export const useInputSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: inputSaga });
  return { actions: slice.actions };
};
