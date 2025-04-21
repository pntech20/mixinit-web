import { Box, SimpleGrid } from '@chakra-ui/react';
import { generateArray } from 'app/helpers/functions';
import { useCallback } from 'react';
import Empty from '../Empty';
import ReleaseItem from '../ReleaseItem';
import SkeletonItem from '../SkeletonItem';
import { useLocation } from 'react-router-dom';
import Pagination from '../Pagination';

export function ReleasesAndPagination({
  setFilter,
  totalPage,
  isLoading,
  releases,
}: any) {
  const { pathname } = useLocation();

  const isLabelDetailPage = pathname.includes('/labels/');

  const renderUILoadMore = useCallback(
    numberItem => (
      <Box>
        <SimpleGrid
          gridGap="10px"
          rowGap="15px"
          columns={{ base: 1, sm: 2, md: 3, lg: isLabelDetailPage ? 4 : 5 }}
        >
          {generateArray(numberItem).map(item => (
            <SkeletonItem borderRadius="10px" key={item} />
          ))}
        </SimpleGrid>
      </Box>
    ),
    [isLabelDetailPage],
  );

  const renderContent = useCallback(() => {
    if (isLoading) return renderUILoadMore(isLabelDetailPage ? 8 : 10);
    if (!releases.length) return <Empty />;

    return (
      <Box mb="15px">
        <SimpleGrid
          gridGap="10px"
          rowGap="15px"
          columns={{ base: 1, sm: 2, md: 4, lg: 4 }}
        >
          {releases.map((item, idx) => (
            <ReleaseItem key={item._id} release={item} />
          ))}
        </SimpleGrid>
      </Box>
    );
  }, [isLabelDetailPage, isLoading, releases, renderUILoadMore]);

  return (
    <>
      {renderContent()}
      <Pagination totalPage={totalPage} setFilter={setFilter} />
    </>
  );
}
