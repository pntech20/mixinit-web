import {
  Box,
  Flex,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text,
} from '@chakra-ui/react';
import { TiDelete } from 'react-icons/ti';
import { DropzoneFile } from 'app/components/DropZoneFile';
import { ItemTagGenre } from 'app/components/ItemTagGenre';
import SelectInput from 'app/components/SelectInput';
import {
  AUDIO,
  AUDIO_TYPE,
  BPM_MAX,
  BPM_MIN,
  VIDEO,
  VIDEO_TYPE,
  YEAR_MIN,
} from 'app/constants';
import { BITRATE_MP3 } from 'app/constants/enum';
import { toastError } from 'app/helpers/toast';
import { useGenres } from 'app/hooks/genres/useGenres';
import { usePlayers } from 'app/hooks/player/usePlayers';
import { useTags } from 'app/hooks/tags/useTags';
import { formatMoney } from 'app/utils/currency';
import getBlobDuration from 'get-blob-duration';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { convertFilesToSongs } from '../helpers';
import styles from './claim.module.scss';

interface TrackInfoProps {
  dataFromStepOne?: any;
  editableSong: any;
  setEditableSong: (data) => void;
  isEdit?: boolean;
}

const sort = items => {
  return [...items].sort(function (a, b) {
    var nameA = a.name.toUpperCase(); // ignore upper and lowercase
    var nameB = b.name.toUpperCase(); // ignore upper and lowercase
    return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
  });
};

export default function TrackInfo({
  editableSong,
  setEditableSong,
  dataFromStepOne,
  isEdit = false,
}: TrackInfoProps) {
  // const { userDetail: userInfo } = useSelector(selectAuth);

  const { handleInputFocus, handleInputBlur } = usePlayers();
  const [fileName, setFileName] = useState('');

  // const [typeFile, setTypeFile] = useState();

  // useEffect(()=>{
  //   let typeFileName = fileName.toLowerCase().includes('DIRTY'.toLowerCase()) ? 'DIRTY file' : 'CLEAN file';
  //   setTypeFile(typeFileName);
  // }, [fileName]);

  const { t } = useTranslation();

  const { tags = [], onGetTags } = useTags();

  const { genres = [], onGetGenres } = useGenres();

  const {
    minPrice = 0,
    maxPrice = 1,
    contributorPricing,
    defaultTrackPrice,
  } = dataFromStepOne;

  const {
    title,
    price,
    artist,
    year,
    bpmStart,
    bpmEnd,
    isClean,
    genre,
    subGenre,
    subGenre2,
    tags: tagsTrack = [],
    type,
    fileNameOriginal,
    fileNameOriginal2,
  } = editableSong;

  const tagsSoft = useMemo(() => {
    return sort(tags);
  }, [tags]);

  useEffect(() => {
    onGetTags();
    onGetGenres();
  }, [onGetTags, onGetGenres]);

  useEffect(() => {
    setFileName(fileNameOriginal2);
  }, [fileNameOriginal2]);

  const handleSongEdit = useCallback(
    (updatedField, updatedValue) => {
      setEditableSong({ ...editableSong, [updatedField]: updatedValue });
    },
    [editableSong, setEditableSong],
  );

  const handleChangeSelect = useCallback(
    async (name, newValue) => {
      handleSongEdit(name, newValue);
    },
    [handleSongEdit],
  );

  // const handleSelectedLabel = useCallback(
  //   async data => {
  //     const isCanUpload = await checkContributorCanUpload(data._id);
  //     if (!isCanUpload) {
  //       toastError(
  //         `You can only upload to ${data.name} max ${data.maxUpload} tracks each month`,
  //       );
  //     } else {
  //       handleChangeSelect('label', {
  //         label: data?.name,
  //         value: data?._id,
  //       });
  //     }
  //   },
  //   [handleChangeSelect],
  // );

  const genreSelect = useMemo(() => {
    return sort(
      genres.filter(
        item => ![subGenre?.value, subGenre2?.value].includes(item._id),
      ),
    );
  }, [genres, subGenre?.value, subGenre2?.value]);

  const subGenreSelect = useMemo(() => {
    return sort(
      genres.filter(
        item => ![genre?.value, subGenre2?.value].includes(item._id),
      ),
    );
  }, [genre?.value, genres, subGenre2?.value]);

  const subGenre2Select = useMemo(() => {
    return sort(
      genres.filter(
        item => ![genre?.value, subGenre?.value].includes(item._id),
      ),
    );
  }, [genre?.value, genres, subGenre?.value]);

  const optionClearOrDirty = useMemo(
    () => [
      { label: t('uploader.clean'), id: 'Green', value: true },
      { label: t('uploader.dirty'), id: 'Red', value: false },
    ],
    [t],
  );

  const isDisableSelect = useMemo(
    () => tagsTrack.length >= 5,
    [tagsTrack.length],
  );

  const handleDeleteTag = tag => {
    const filter = tagsTrack?.filter(
      t => (t?.value || t?._id) !== (tag?.value || tag?._id),
    );
    handleChangeSelect('tags', filter);
  };

  const handleDeleteGenre = () => {
    handleChangeSelect('genre', null);
  };

  const handleDeleteSubGenre = () => {
    handleChangeSelect('subGenre', null);
  };

  const handleDeleteSubGenre2 = () => {
    handleChangeSelect('subGenre2', null);
  };

  const handleChanegIsClean = value => {
    handleChangeSelect('isClean', value);
  };

  // const sectionsOptions = useMemo(() => {
  //   return (userInfo?.canUploadToLabels || [])
  //     ?.map(value => {
  //       return {
  //         ...value,
  //         value: value?._id,
  //         label: value?.name,
  //       };
  //     })
  //     .filter(label => label?._id !== '66fe37f8a94e3e39573cbffb')
  //     .sort(function (a, b) {
  //       return a?.name?.localeCompare(b?.name);
  //     });
  // }, [userInfo?.canUploadToLabels]);

  const handleFilesSelected = useCallback(
    async files => {
      const potentialSongs: any = await convertFilesToSongs(files);
      let promise: any = [];
      for (const [, potentialSong] of potentialSongs.entries()) {
        promise.push(potentialSong);
      }
      const results = await Promise.all(promise);
      for (const item of results) {
        const { file } = item;
        const pattern = fileNameOriginal.toLowerCase().includes('[dirty]')
          ? /\[(CLEAN)\]$/
          : /\[(DIRTY)\]$/;

        const cleanedFilename = file.name.replace(/\.(mp3|mp4)$/, '');

        if (!pattern.test(cleanedFilename)) {
          toastError(
            `${file.name} must end with ${
              fileNameOriginal.toLowerCase().includes('[dirty]')
                ? '[CLEAN]'
                : '[DIRTY]'
            }`,
          );
          continue;
        }

        const durationFile = await getBlobDuration(
          window.URL.createObjectURL(file),
        );
        if (file.type === AUDIO_TYPE) {
          const kbit = file.size / 128; // Calculate bytes to kbit
          const kbps = Math.ceil(Math.round(kbit / durationFile) / 16) * 16;
          if (kbps < BITRATE_MP3.KBPS320) {
            toastError(`${file.name} must be MP3 320kbps`);
            continue; // Skip to the next item if the condition fails
          }
          const maxFileSizeAudio = 320 * 1024 * 1024; // 320MB
          if (file.size > maxFileSizeAudio) {
            toastError(`${file.name} is larger than max size limit 320MB`);
            continue;
          }
        }

        if (file.type === VIDEO_TYPE) {
          const maxFileSizeVideo = 1024 * 1024 * 1024; // 1GB
          if (file.size > maxFileSizeVideo) {
            toastError(`${file.name} is larger than max size limit 1GB`);
            continue;
          }

          // Check the video resolution
          const video = document.createElement('video');
          video.src = window.URL.createObjectURL(file);
          const resolutionError = await new Promise(resolve => {
            video.onloadedmetadata = () => {
              const videoWidth = video.videoWidth;
              const videoHeight = video.videoHeight;
              let error = false;

              // Only allow exact 1080p (1920x1080)
              if (videoWidth !== 1920 || videoHeight !== 1080) {
                error = true;
                toastError(
                  `${file.name} does not meet the exact allowed resolution of 1080p (1920x1080). Your resolution is ${videoWidth}x${videoHeight}.`,
                );
              }
              resolve(error);
            };
          });

          if (resolutionError) continue;
        }

        setFileName(file.name);
        handleSongEdit('file', file);
      }
    },
    [fileNameOriginal, handleSongEdit],
  );

  const renderDropzoneFile = useCallback(() => {
    return (
      <DropzoneFile
        passFile={files => handleFilesSelected(files)}
        type={type === 'audio' ? '.mp3' : 'video/*'}
        accept={type === 'audio' ? AUDIO : VIDEO}
        showTracksBecomeVisibe={false}
      />
    );
  }, [handleFilesSelected, type]);

  return (
    <Box className={styles.trackInfoContainer}>
      <Box marginTop="10px">
        <Box className={styles.trackMetadata}>* REQUIRED</Box>
        <Box display={{ base: 'block', sm: 'flex' }} gridGap="20px">
          <Box width={{ base: '100%', sm: '50%' }}>
            {/* {isEdit && (
              <Box>
                <label>
                  <Text as="span" color="red">
                    *
                  </Text>{' '}
                  Label:
                </label>

                <SelectInput
                  name="label"
                  options={sectionsOptions}
                  value={label}
                  onChange={newValue => handleSelectedLabel(newValue)}
                  isColorInput
                  isDisable={label.value === '66fe37f8a94e3e39573cbffb'}
                />
              </Box>
            )} */}
            <Box mt="10px">
              <label>
                <Text as="span" color="red">
                  *
                </Text>{' '}
                Select Tags (at least 1)
              </label>
              <SelectInput
                isMulti
                name="tags"
                options={tagsSoft.map(tag => ({
                  label: tag.name,
                  value: tag._id,
                }))}
                value={tagsTrack || []}
                isDisable={isDisableSelect}
                onChange={newValue => handleChangeSelect('tags', newValue)}
                placeholder="Select Tags"
                isColorInput
              />
              <Flex gridGap="10px" mt="5px" flexWrap="wrap">
                {tagsTrack?.map((t, index) => (
                  <ItemTagGenre
                    handleDelete={() => {
                      handleDeleteTag(t);
                    }}
                    key={index}
                    value={t?.label || t?.name}
                  />
                ))}
              </Flex>
            </Box>
            <Box className={styles.genre} mt="10px">
              <label>
                <Text as="span" color="red">
                  *
                </Text>{' '}
                {t('uploader.selectGenre')}
              </label>

              <SelectInput
                name="genre"
                options={genreSelect.map(genre => ({
                  label: genre.name,
                  value: genre._id,
                }))}
                value={genre}
                onChange={newValue => handleChangeSelect('genre', newValue)}
                placeholder="Select Genre"
                isColorInput
              />
              <Box mt="5px">
                {genre && (
                  <ItemTagGenre
                    handleDelete={handleDeleteGenre}
                    value={genre?.label}
                    isGenre
                  />
                )}
              </Box>
            </Box>
            <Box className={styles.subGenre} mt="10px">
              <label>{t('uploader.selectSubGenre')}</label>
              <SelectInput
                name="subGenre"
                options={subGenreSelect.map(genre => ({
                  label: genre.name,
                  value: genre._id,
                }))}
                value={subGenre}
                onChange={newValue => handleChangeSelect('subGenre', newValue)}
                placeholder="Select sub-genre"
                isColorInput
              />
            </Box>
            <Box mt="5px">
              {subGenre && (
                <ItemTagGenre
                  handleDelete={handleDeleteSubGenre}
                  value={subGenre?.label}
                  isGenre
                />
              )}
            </Box>
            <Box className={styles.subGenre} mt="10px">
              <label>Select SubGenre 2</label>
              <SelectInput
                name="subGenre2"
                options={subGenre2Select.map(genre => ({
                  label: genre.name,
                  value: genre._id,
                }))}
                value={subGenre2}
                onChange={newValue => handleChangeSelect('subGenre2', newValue)}
                placeholder="Select sub-genre 2"
                isColorInput
              />
            </Box>
            <Box mt="5px">
              {subGenre2 && (
                <ItemTagGenre
                  handleDelete={handleDeleteSubGenre2}
                  value={subGenre2?.label}
                  isGenre
                />
              )}
            </Box>
            <Box mt="30px">
              <label>
                <Text as="span" color="red">
                  *
                </Text>{' '}
                Cost:
                {contributorPricing
                  ? ` (Price from ${formatMoney(minPrice)} to
                ${formatMoney(maxPrice)})`
                  : ` (Price must be ${formatMoney(defaultTrackPrice)})`}
              </label>
              {contributorPricing ? (
                <NumberInput
                  step={1}
                  min={minPrice}
                  max={maxPrice}
                  value={price}
                  onChange={value => handleSongEdit('price', value)}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              ) : (
                <Input type="number" value={defaultTrackPrice} disabled />
              )}
            </Box>
          </Box>
          <Box
            width={{ base: '100%', sm: '50%' }}
            mt={{ base: '20px', sm: '0' }}
          >
            <Box>
              <label>
                <Text as="span" color="red">
                  *
                </Text>{' '}
                Explicit
              </label>
              <Flex mt="5px" gridGap={5}>
                {optionClearOrDirty.map((item, index): any => (
                  <label key={index} className={styles.optionSecond}>
                    <input
                      type="radio"
                      name="colors"
                      id={item.id}
                      value={item.id}
                      checked={isClean === item.value}
                      onClick={() =>
                        isEdit &&
                        isClean !== null &&
                        handleChanegIsClean(item.value)
                      }
                    />
                    <span className={styles.checkmark}>{item.label}</span>
                  </label>
                ))}
                <label className={styles.optionSecond}>
                  <input
                    type="checkbox"
                    disabled={isEdit}
                    onChange={e =>
                      handleChangeSelect(
                        'isClean',
                        e.target.checked
                          ? null
                          : fileNameOriginal.toLowerCase().includes('[clean]')
                          ? true
                          : false,
                      )
                    }
                    checked={isClean === null}
                  />
                  <Flex gridGap="5px" alignItems="center">
                    <span className={styles.checkmark}>
                      {t('uploader.clean&dirty')}
                    </span>
                    <Box
                      className={styles.isClean}
                      backgroundColor={'#1bd32e'}
                    />
                    <Box
                      className={styles.isClean}
                      backgroundColor={'#e41111'}
                    />
                  </Flex>
                </label>
              </Flex>
            </Box>
            {isClean === null && !isEdit && !fileName && renderDropzoneFile()}
            {isClean === null && (
              <Box mt="10px">
                <Flex direction="row" alignItems="center">
                  <label>
                    <Text as="span" color="red" pr="5px">
                      *
                    </Text>
                    {`${
                      title.toLowerCase().includes('[dirty]')
                        ? 'CLEAN File'
                        : 'DIRTY File'
                    }`}
                  </label>
                  <Box
                    marginStart="10px"
                    w="15px"
                    h="15px"
                    borderRadius="50%"
                    bg={`${
                      title.toLowerCase().includes('[dirty]')
                        ? '#1bd32e'
                        : 'red'
                    }`}
                  ></Box>
                </Flex>
                <Flex justifyContent="space-between">
                  <Text pl="10px" fontWeight={500} fontSize="14px" w="85%">
                    {fileName}
                  </Text>
                  {fileName && !isEdit && (
                    <Flex
                      justifyContent="center"
                      alignItems="center"
                      w="15%"
                      h="40px"
                      borderRadius="50%"
                      cursor="pointer"
                      onClick={() => setFileName('')}
                      className={styles.trackInfoIconRemove}
                    >
                      <TiDelete fontSize="40px" color="#ffffff" />
                    </Flex>
                  )}
                </Flex>
              </Box>
            )}

            <Box
              className={styles.ctnTrackInput}
              flexWrap="wrap"
              justifyContent="space-between"
            >
              <Flex>
                <label>
                  <Text as="span" color="red">
                    *
                  </Text>{' '}
                  {t('uploader.trackTitle')}
                </label>
                <Input
                  type="text"
                  placeholder="Title"
                  _placeholder={{ color: '#d4d4d4' }}
                  marginTop="5px"
                  value={title}
                  onChange={e => handleSongEdit('title', e.target.value)}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
              </Flex>
              <Flex>
                <label>
                  <Text as="span" color="red">
                    *
                  </Text>{' '}
                  {t('uploader.trackArtist')}
                </label>
                <Input
                  type="text"
                  placeholder="Artist"
                  _placeholder={{ color: '#d4d4d4' }}
                  marginTop="5px"
                  value={artist}
                  onChange={e => handleSongEdit('artist', e.target.value)}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
              </Flex>
              <Flex>
                <label>
                  <Text as="span" color="red">
                    *
                  </Text>{' '}
                  {t('uploader.year')} ({YEAR_MIN}-{new Date().getFullYear()})
                </label>
                <NumberInput
                  min={YEAR_MIN}
                  max={new Date().getFullYear()}
                  type="number"
                  placeholder={t('uploader.year')}
                  _placeholder={{ color: '#d4d4d4' }}
                  marginTop="5px"
                  value={year || undefined}
                  onChange={value => handleSongEdit('year', value)}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                >
                  <NumberInputField />
                </NumberInput>
              </Flex>
              <Flex>
                <label>
                  <Text as="span" color="red">
                    *
                  </Text>{' '}
                  {t('uploader.BpmStart')} ({BPM_MIN}-{BPM_MAX})
                </label>
                <NumberInput
                  marginTop="5px"
                  placeholder={t('uploader.BpmStart')}
                  _placeholder={{ color: '#d4d4d4' }}
                  step={1}
                  min={BPM_MIN}
                  value={bpmStart}
                  max={BPM_MAX}
                  onChange={value => handleSongEdit('bpmStart', value)}
                >
                  <NumberInputField />
                </NumberInput>
              </Flex>
              <Flex>
                <label>
                  {t('uploader.BpmEnd')} ({BPM_MIN}-{BPM_MAX})
                </label>
                <NumberInput
                  marginTop="5px"
                  placeholder="BPM End"
                  _placeholder={{ color: '#d4d4d4' }}
                  step={1}
                  min={BPM_MIN}
                  value={bpmEnd}
                  max={BPM_MAX}
                  onChange={value => handleSongEdit('bpmEnd', value)}
                >
                  <NumberInputField />
                </NumberInput>
              </Flex>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
