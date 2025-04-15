import { Box } from '@chakra-ui/react';
import { useEffect, useRef } from 'react';
import Empty from '../Empty';
import TrackItem from '../TrackItem';
import TrackList from '../TrackList';
import { renderLoadingTracks, renderTrackListItem } from '../TrackUtils/track';
import Pagination from '../Pagination';

export function TracksAndPagination({
  setFilter,
  tracks = [],
  filter,
  itemsRef,
  isShowAllTracks,
  totalPage,
  isLoading,
  isShowExpandedAll = true,
  handleShowAllTrack,
  onHandleClickItemTagGenre,
}: any) {
  const paginationRef: any = useRef(null);

  useEffect(() => {
    itemsRef.current = itemsRef.current.slice(0, tracks.length);
  }, [itemsRef, tracks.length]);

  useEffect(() => {
    if (paginationRef.current) {
      paginationRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [filter.page, filter.pageSize]);

  const renderTracks = () => {
    if (isLoading) {
      return renderLoadingTracks(10);
    }

    if (!tracks.length) return <Empty />;

    const TrackContent = () =>
      (tracks || []).map((track, index) => (
        <TrackItem
          key={track.id}
          index={index + 1}
          refEye={el => (itemsRef.current[index] = el)}
          track={track}
          sort={filter?.sort}
          isShowAllTracks={isShowAllTracks}
          onHandleClickItemTagGenre={onHandleClickItemTagGenre}
        />
      ));

    return <Box>{renderTrackListItem(TrackContent())}</Box>;
  };

  return (
    <Box position={'relative'}>
      <Box ref={paginationRef} position={'absolute'} top="-300px" h="0px" />
      <TrackList
        children={renderTracks()}
        tracks={tracks}
        isShowExpandedAll={isShowExpandedAll}
        handleShowAllTrack={handleShowAllTrack}
      />
      <Pagination totalPage={totalPage} setFilter={setFilter} />
    </Box>
  );
}
