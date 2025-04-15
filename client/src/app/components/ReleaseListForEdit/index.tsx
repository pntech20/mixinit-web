import { useColorMode } from '@chakra-ui/color-mode';
import {
  Box,
  Button,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Skeleton,
  Stack,
} from '@chakra-ui/react';
import { generateArray } from 'app/helpers/functions';
import { useReleases } from 'app/hooks/releases/useReleases';
import classNames from 'classnames';
import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import Empty from '../Empty';
import ReleaseInfo from '../ReleaseInfo';
import MyReleaseItem from '../myReleaseItem';
import styles from './releaseListForEdit.module.scss';
import { useSelector } from 'react-redux';
import { selectSliceTracks } from 'app/pages/Tracks/slice/selectors';
import Pagination from '../Pagination';

interface EditorReleaseProps {
  changeElement: (e) => void;
  useMyReleaseHook?: any;
  setFilter?: any;
}

const ReleaseListForEdit = ({
  changeElement,
  useMyReleaseHook,
  setFilter,
}: EditorReleaseProps) => {
  const location: any = useLocation();
  const { isStateRelease, handleSetLabelId } = useMyReleaseHook;

  const { checkHideAndHiddenMyTrack } = useSelector(selectSliceTracks);

  const {
    releases,
    onGetReleases,
    isLoading,
    totalPage,
    setFilter: setFilterRelease,
    onDeleteRelease,
    isDeleteReleaseSuccess,
    handShowModalDeleteRelease,
    isShowModalDeleteRelease,
  } = useReleases();

  const [releaseId, setReleaseId] = useState('');

  const handleDeleteRelease = useCallback(
    id => {
      handShowModalDeleteRelease(true);
      setReleaseId(id);
    },
    [handShowModalDeleteRelease],
  );

  const { colorMode } = useColorMode();

  useEffect(() => {
    onGetReleases();
  }, [onGetReleases, checkHideAndHiddenMyTrack]);

  const renderUILoadMore = useCallback(
    () => (
      <Stack mt="10px">
        {generateArray(2).map((item, index) => (
          <Skeleton key={index} height="50px" />
        ))}
      </Stack>
    ),
    [],
  );

  const renderReleases = useCallback(() => {
    if (isLoading) return <Box margin="18px">{renderUILoadMore()}</Box>;
    if (!releases.length) return <Empty />;
    return (
      <Box className={styles.editorRelease}>
        {releases.map(release => (
          <MyReleaseItem
            isShowTooltip
            release={release}
            key={release?._id}
            handleSetLabelId={handleSetLabelId}
            handleDeleteRelease={handleDeleteRelease}
          />
        ))}
      </Box>
    );
  }, [
    handleDeleteRelease,
    handleSetLabelId,
    isLoading,
    releases,
    renderUILoadMore,
  ]);

  return (
    <Box
      className={classNames(
        styles.editorContainer,
        styles[`editor${colorMode}`],
      )}
      borderRadius="5px"
      height={'calc(100vh - 390px)'}
      overflowY="auto"
    >
      {location?.state?.release && isStateRelease ? (
        <>
          <Box onClick={changeElement} className={styles.content}>
            Or Click To Edit A Multipack
          </Box>
          <ReleaseInfo
            changeElement={changeElement}
            useMyReleaseHook={useMyReleaseHook}
            setFilter={setFilter}
          />
        </>
      ) : (
        <Box>
          <Box mt="20px">{renderReleases()}</Box>
          <Box>
            <Pagination totalPage={totalPage} setFilter={setFilterRelease} />
          </Box>
        </Box>
      )}
      <Modal
        isOpen={isShowModalDeleteRelease}
        onClose={() => handShowModalDeleteRelease(false)}
      >
        <ModalContent>
          <ModalHeader>
            Are you sure you want to delete this multipack?
          </ModalHeader>
          <ModalFooter>
            <Button
              isDisabled={isDeleteReleaseSuccess}
              onClick={() => handShowModalDeleteRelease(false)}
            >
              Close
            </Button>
            <Button
              backgroundColor="red"
              onClick={() => onDeleteRelease(releaseId)}
              ml={3}
              isLoading={isDeleteReleaseSuccess}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ReleaseListForEdit;
