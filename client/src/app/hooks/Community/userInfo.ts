import { useUserInfoSlice } from 'app/components/MyProfileBio/slice';
import { selectSliceUserInfo } from 'app/components/MyProfileBio/slice/selectors';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const useUserDetail = () => {
  const dispatch = useDispatch();
  const { actions } = useUserInfoSlice();
  const { userDetails, isLoading } = useSelector(selectSliceUserInfo);
  const { actions: actionInfo } = useUserInfoSlice();

  const handleToggleFollowingProfile = useCallback(
    (targetUser, item) => {
      const { id } = targetUser;
      if (item._id === 'block') {
        dispatch(actionInfo.toggleBlockUserRequest({ id }));
      } else
        dispatch(
          actionInfo.toggleFollowRequest({ id, type: 'followInProfile' }),
        );
    },
    [actionInfo, dispatch],
  );

  const onGetUserByUserId = useCallback(
    payload => {
      dispatch(actions.getUserByUserIdRequest(payload));
    },
    [actions, dispatch],
  );

  return {
    onGetUserByUserId,
    userDetails,
    isLoading,
    handleToggleFollowingProfile,
  };
};
