import { Box } from '@chakra-ui/react';
import { usePageCrates } from 'app/hooks/pageCrate/usePageCrate';
import queryString from 'query-string';
import { useEffect } from 'react';
import { useLocation } from 'react-router';

export function PageCrate() {
  const location = useLocation();

  const {
    myTrackCrates = [],
    setValueCrate,
    setColor,
    setCrateId,
    setListCrate,
  } = usePageCrates('', false);

  useEffect(() => {
    const id = queryString.parse(location.search)?.id;
    const rule = myTrackCrates.find(item => item._id === id);
    if (rule) {
      const { name, color, _id, rules } = rule;
      setValueCrate(name);
      setColor(color);
      setCrateId(_id);
      setListCrate(rules);
    }
  }, [
    location.search,
    myTrackCrates,
    setColor,
    setCrateId,
    setListCrate,
    setValueCrate,
  ]);

  return <Box></Box>;
}
