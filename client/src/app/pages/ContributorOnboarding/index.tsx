import { Box } from '@chakra-ui/react';
import {
  ContributorDocument,
  ContributorSetup,
} from 'app/components/ContributorOnboarding';
import { memo, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { selectAuth } from '../Login/slice/selectors';

export const ContributorOnboarding = memo(() => {
  const history = useHistory();

  const { userDetail } = useSelector(selectAuth);

  const [isAgree, setIsAgree] = useState(false);

  const contactRef = useRef<any>(null);
  const [, setshowPopUp] = useState(false);

  function popContactForm() {
    setshowPopUp(true);
    scrollToBottom();
  }
  function scrollToBottom() {
    contactRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  useEffect(() => {
    if (userDetail?.isContributor && !userDetail?.needToConfirmContributor) {
      history.push('/home');
    }
  }, [history, userDetail]);

  return (
    <Box p={{ base: '10px', md: '30px' }}>
      {!isAgree ? (
        <ContributorDocument
          setIsAgree={setIsAgree}
          popContactForm={popContactForm}
        />
      ) : (
        <ContributorSetup contactRef={contactRef} />
      )}
    </Box>
  );
});
