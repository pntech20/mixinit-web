import { Box } from '@chakra-ui/layout';
import { useMyRelease } from 'app/hooks/myMedia/useMyRelease';
import { Track } from 'app/models';
import Empty from '../Empty';
import TrackItem from '../TrackItem';
import TrackList from '../TrackList';
import { renderLoadingTracks } from '../TrackUtils/track';
import styles from './mediaUploads.module.scss';
import Pagination from '../Pagination';

interface ListTrackUploadProps {
  isListMyMedia: boolean;
  itemsRef?: any;
  listTracksShow?: Track[];
  idLabel?: string;
  filter?: any;
  handleShowAllTrack: (e) => void;
  currentPage: any;
  totalPage: any;
  setFilter: any;
  isLoading?: boolean;
}

export default function ListTrackUpload({
  itemsRef,
  listTracksShow,
  idLabel,
  filter,
  handleShowAllTrack,
  totalPage,
  setFilter,
  isLoading,
}: ListTrackUploadProps) {
  const { setListFiles, listFiles } = useMyRelease('');

  const addTrackToRelease = field => {
    const checkItem = listFiles.filter(item => item._id !== field._id);
    if (checkItem.length !== listFiles.length) {
      setListFiles(checkItem);
    } else {
      setListFiles([...listFiles, field]);
    }
  };

  const renderTracks = () => {
    if (isLoading) {
      return renderLoadingTracks(10);
    }
    if (!listTracksShow?.length) return <Empty />;

    return listTracksShow?.map((field, index) => {
      return (
        <TrackItem
          key={field._id}
          track={field}
          index={index + 1}
          refEye={el => (itemsRef.current[index] = el)}
          idLabel={idLabel}
          onClick={() => addTrackToRelease(field)}
          isMyTracks
          sort={filter?.sort}
        />
      );
    });
  };

  return (
    <Box>
      <Box className={styles.listTrackUploaderContainer}>
        {listTracksShow && (
          <TrackList
            children={renderTracks()}
            tracks={listTracksShow}
            handleShowAllTrack={() => handleShowAllTrack(itemsRef)}
            isShowExpandedAll={false}
          />
        )}
        <Pagination totalPage={totalPage} setFilter={setFilter} />
      </Box>
    </Box>
  );
}
