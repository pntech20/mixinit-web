import { Box, Center, Flex, Input } from '@chakra-ui/react';
import { DEFAULT_PAGE_SIZE } from 'app/constants';
import { useModeTheme } from 'app/hooks/ColorDarkMode/useModeTheme';
import { useTrackSlice } from 'app/pages/Tracks/slice';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { HiOutlineArrowSmLeft, HiOutlineArrowSmRight } from 'react-icons/hi';
import { useHistory, useLocation } from 'react-router-dom';

interface Props {
  totalPage: number;
  setFilter?: (value: any) => void;
}

export default function Pagination({ totalPage, setFilter }: Props) {
  const { pathname } = useLocation();
  const location: any = useLocation();
  const history = useHistory();
  const timeoutRef = useRef<any>(null);
  const { isDarkMode } = useModeTheme();
  const [page, setPage] = useState<number>(1);
  const [resultsPerPage, setResultsPerPage] =
    useState<number>(DEFAULT_PAGE_SIZE);

  const isLabelDetailPage = pathname.includes('/labels/');
  const isTrackPage = pathname.includes('/tracks');

  const resultsPerPageLocalStorage = localStorage.getItem('resultsPerPage');

  const dispatch = useDispatch();
  const { actions } = useTrackSlice();

  const handleOnchangePage = useCallback(
    (e: any) => {
      let numberPage = +e?.target?.value;

      setPage(+numberPage);
      if (timeoutRef) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(async () => {
        if (numberPage < 1 || numberPage > totalPage) {
          setPage(numberPage < 1 ? 1 : totalPage);
          setFilter &&
            setFilter(current => ({
              ...current,
              page: numberPage < 1 ? 1 : totalPage,
            }));
        } else {
          setFilter &&
            setFilter(current => ({
              ...current,
              page: numberPage,
            }));
        }
      }, 1500);
    },
    [setFilter, totalPage],
  );

  const handleNextPrevPage = useCallback(
    (number: number) => {
      if ((page > 1 && number < 0) || (page < totalPage && number > 0)) {
        setFilter &&
          setFilter(current => ({
            ...current,
            page: page + number,
          }));
        setPage(page + number);
      }
    },
    [page, setFilter, totalPage],
  );

  const optionPerPage = [
    { label: 20, value: 20 },
    { label: 50, value: 50 },
    { label: 100, value: 100 },
  ];

  const handlePageSize = useCallback(
    (value: number) => {
      if (value !== resultsPerPage) {
        setResultsPerPage(value);
        setPage(1);
        setFilter &&
          setFilter(current => ({
            ...current,
            pageSize: value,
            page: 1,
          }));
        dispatch(actions.changeResultsPerPage(value));
        localStorage.setItem('resultsPerPage', String(value));
      }
    },
    [actions, dispatch, resultsPerPage, setFilter],
  );

  useEffect(() => {
    if (resultsPerPageLocalStorage) {
      setResultsPerPage(+resultsPerPageLocalStorage);
      dispatch(actions.changeResultsPerPage(+resultsPerPageLocalStorage));
    }
  }, [actions, dispatch, resultsPerPageLocalStorage, setFilter]);

  useEffect(() => {
    const { dataRange } = location.state || {};
    if (dataRange && isLabelDetailPage) {
      setResultsPerPage(100);
      setPage(1);
      setFilter &&
        setFilter(current => ({
          ...current,
          pageSize: 100,
          page: 1,
        }));
      dispatch(actions.changeResultsPerPage(100));
      history.replace({
        ...location,
        state: undefined,
      });
    }
  }, [actions, dispatch, history, isLabelDetailPage, location, setFilter]);

  useEffect(() => {
    if (location.state?.date && location.state?.key && isTrackPage) {
      const { date, value, label, key } = location.state;
      setFilter &&
        setFilter(current => ({
          ...current,
          pageSize: 100,
          page: 1,
          sort: date,
          [key]: [
            {
              label,
              value,
            },
          ],
        }));
      dispatch(actions.changeResultsPerPage(100));
      setResultsPerPage(100);
      setPage(1);
    }
  }, [actions, dispatch, isTrackPage, location.state, setFilter]);

  return (
    <Box
      display={'flex'}
      justifyContent={'space-between'}
      gridGap={2}
      alignItems={'center'}
    >
      <Box
        display={{ base: 'block', sm: 'flex' }}
        alignItems={'center'}
        fontSize={14}
        fontWeight={400}
        gridGap={2}
        color={'white'}
      >
        <Box fontSize={{ base: 12, sm: 14 }}>Results per page</Box>
        <Flex alignItems={'center'} fontSize={14} fontWeight={400} gridGap={2}>
          {optionPerPage.map((data, index) => (
            <Center
              border={`1px solid ${!isDarkMode ? '#CBD5E0' : '#4A5568'}`}
              w="34px"
              h="34px"
              borderRadius={'50%'}
              _hover={{ color: data.value !== resultsPerPage && '#5c94e8' }}
              cursor={data.value === resultsPerPage ? 'no-drop' : 'pointer'}
              key={index}
              onClick={() => handlePageSize(data.value)}
              bg={resultsPerPage === data.value ? '#B4BABC' : ''}
            >
              {data.label}
            </Center>
          ))}
        </Flex>
      </Box>
      <Box
        display={'flex'}
        alignItems={'center'}
        gridGap={2}
        justifyContent={'end'}
        mt={3}
      >
        <Center
          w="34px"
          h="34px"
          borderRadius="50%"
          cursor={page === 1 ? 'no-drop' : 'pointer'}
          onClick={() => handleNextPrevPage(-1)}
          bg={!isDarkMode ? 'white' : '#1A202C'}
          color={!isDarkMode ? 'black' : 'white'}
          _hover={{ color: page !== 1 && '#5c94e8' }}
          border={`1px solid ${!isDarkMode ? '#CBD5E0' : '#4A5568'}`}
        >
          <HiOutlineArrowSmLeft size="22" color="##4A5568" />
        </Center>
        <Input
          value={page}
          onChange={handleOnchangePage}
          h="34px"
          w="60px"
          fontSize={14}
          fontWeight={400}
          textAlign={'center'}
          type="number"
          color={'white'}
        />
        <Box fontSize={14} fontWeight={400} color={'white'}>
          of {totalPage}
        </Box>
        <Center
          w="34px"
          h="34px"
          borderRadius={'50%'}
          onClick={() => handleNextPrevPage(1)}
          cursor={page === totalPage ? 'no-drop' : 'pointer'}
          bg={!isDarkMode ? 'white' : '#1A202C'}
          color={!isDarkMode ? 'black' : 'white'}
          _hover={{ color: page !== totalPage && '#5c94e8' }}
          border={`1px solid ${!isDarkMode ? '#CBD5E0' : '#4A5568'}`}
        >
          <HiOutlineArrowSmRight size="22" color="##4A5568" />
        </Center>
      </Box>
    </Box>
  );
}
