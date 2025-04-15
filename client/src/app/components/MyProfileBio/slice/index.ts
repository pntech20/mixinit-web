import { PayloadAction } from '@reduxjs/toolkit';
import { toastSuccess } from 'app/helpers/toast';
import { User } from 'app/models';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { UserInfoSaga } from './saga';
import { GetUserByUsernamePayload, UserInfoState } from './types';

export const initialState: UserInfoState = {
  userDetails: null,
  isLoading: false,
  error: null,
};

const slice = createSlice({
  name: 'userDetails',
  initialState,
  reducers: {
    getUserByUserIdRequest(
      state,
      action: PayloadAction<GetUserByUsernamePayload>,
    ) {
      state.userDetails = null;
      state.isLoading = true;
      state.error = null;
    },
    getUserByUsernameSuccess(state, action: PayloadAction<User>) {
      state.userDetails = action.payload;
      state.isLoading = false;
    },
    getUserByUsernameFailed(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Toggle Followers
    toggleFollowRequest(state, action: PayloadAction<any>) {
      state.error = null;
    },
    toggleFollowSuccess(state, action: PayloadAction<any>) {
      const { id, type } = action.payload;
      const userDetails = { ...state.userDetails };
      let noti = '';
      if (type === 'followInProfile') {
        noti = userDetails.followedByMe ? 'Unfollow' : 'Follow';
        state.userDetails.followedByMe = !userDetails.followedByMe;
      } else {
        state.userDetails.totalFollowings =
          state.userDetails.totalFollowings + 1;
        state.userDetails.follow = [...state.userDetails.follow, id];
        noti = 'Follow';
      }

      toastSuccess(`${noti} success`);
    },
    toggleFollowFailed(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
    toggleBlockUserRequest(state, action: PayloadAction<any>) {
      state.error = null;
    },

    toggleBlockUserSuccess(state, action: PayloadAction<any>) {
      toastSuccess('Success');
      state.userDetails.blockedByMe = !state.userDetails.blockedByMe;
    },

    toggleBlockUserFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
    updateUserInReducer(state, action: PayloadAction<any>) {
      state.userDetails = {
        ...state.userDetails,
        ...action.payload,
      };
    },
  },
});

export const { actions } = slice;
export const actionsAuth = slice.actions;
export const useUserInfoSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: UserInfoSaga });
  return { actions: slice.actions };
};
