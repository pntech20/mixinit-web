import { Box, Flex, Image, Stack, Text } from '@chakra-ui/react';
import { getUserBySlug } from 'app/apis/userInfo';
import PlaceholderBgDefault from 'app/assets/placeholders/avatar.jpeg';
import { ListTracksOwned } from 'app/components/ListTracksOwned';
import { AboutProfile } from 'app/components/MyAboutProfile';
import { useUserInfoSlice } from 'app/components/MyProfileBio/slice';
import { MyProfileLabel } from 'app/components/MyProfileLabel';
import { MyProfileReleases } from 'app/components/MyProfileReleases';
import { MyProfileTracks } from 'app/components/MyProfileTracks';
import { renderLoadingTracks } from 'app/components/TrackUtils/track';
import { selectAuth } from 'app/pages/Login/slice/selectors';
import { default as queryString } from 'query-string';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import './styles.scss';

export function Profile() {
  const queryParameters = new URLSearchParams(window.location.search);
  const edit = queryParameters.get('edit');
  const { actions } = useUserInfoSlice();
  const dispatch = useDispatch();

  const { slug } = useParams<{ slug: string }>();

  const refAvatar = useRef<any>(null);

  const { search } = useLocation();

  const [userDetails, setUserDetails] = useState<any>();

  const { userDetail: userInfo } = useSelector(selectAuth);
  const history = useHistory();
  const [tabIndex, setTabIndex] = useState(1);

  const isContributor = useMemo(() => {
    return userInfo?.isContributor;
  }, [userInfo]);

  const isMyProfile = useMemo(() => {
    return slug === userInfo?.slug;
  }, [slug, userInfo?.slug]);

  const handGetUserByUserId = useCallback(async () => {
    const res: any = await getUserBySlug({ slug });
    dispatch(actions.getUserByUsernameSuccess(res));
    setUserDetails(res);
  }, [actions, dispatch, slug]);

  useEffect(() => {
    handGetUserByUserId();
  }, [handGetUserByUserId]);

  useEffect(() => {
    if (isMyProfile === true && isContributor === false) {
      history.push('/home');
    }
  }, [history, isContributor, isMyProfile]);

  const listTabs = [
    {
      _id: 1,
      content: `MULTIPACKS: ${userDetails?.numberReleases}`,
    },

    {
      _id: 0,
      content: 'BIO',
    },
  ];

  useEffect(() => {
    const query = queryString.parse(search);
    if (query && query.tab) {
      setTabIndex(+query.tab);
    }
  }, [search]);

  const renderTabContent = useCallback(() => {
    switch (tabIndex) {
      case 0:
        return <AboutProfile userDetails={userDetails} />;

      case 1:
        return (
          <MyProfileReleases refWidth={refAvatar} userDetails={userDetails} />
        );

      default:
        break;
    }
  }, [tabIndex, userDetails]);

  const renderListTab = () => {
    return (
      (edit !== 'true' || !isMyProfile) && (
        <Flex>
          {listTabs?.map(i => (
            <Box
              mt="15px"
              cursor="pointer"
              className="tab-item"
              height="max-content"
              onClick={() => {
                setTabIndex(i?._id);
                history.push({
                  pathname: `/contributors/${slug}`,
                  search: `?tab=${i?._id}`,
                });
              }}
              backgroundColor={tabIndex === i?._id ? '#FFF' : '#000'}
              boxShadow={
                tabIndex === i?._id
                  ? '0 2px 5px 1px rgba(0, 0, 0, 0.2)'
                  : 'unset'
              }
            >
              <Text color={tabIndex === i?._id ? '#000' : '#fff'}>
                {i?.content}
              </Text>
            </Box>
          ))}
        </Flex>
      )
    );
  };

  return (
    <Box>
      {userDetails ? (
        <Box className="banner-contributor">
          <Image
            className="banner-contributor-image"
            src={userDetails?.avatar || PlaceholderBgDefault}
          />
        </Box>
      ) : (
        renderLoadingTracks(5)
      )}

      <Box ref={refAvatar}></Box>

      {userDetails && (
        <Stack spacing="24px" w="100%">
          {renderListTab()}
          <Box width="100%">{renderTabContent()}</Box>

          {/* <Box>
              <Top10Genres
                individualType="user"
                individualData={userId}
                name={userDetails?.username}
              />
              <Top10Tags
                individualType="user"
                individualData={userId}
                name={userDetails?.username}
              />
            </Box> */}
        </Stack>
      )}
    </Box>
  );
}
