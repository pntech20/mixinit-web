import { useMemo } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Flex,
  Text,
  NumberInput,
  NumberInputField,
  Box,
  Checkbox,
} from '@chakra-ui/react';
import ReactSelect, { components } from 'react-select';
import { BPM_MAX, BPM_MIN, YEAR_MIN } from 'app/constants';
import { SORT_TYPE } from 'app/constants/enum';
import { useModalCrate } from 'app/hooks/ModalCrate/useModalCrate';
import { useMediaScreen } from 'app/hooks/mediaScreen/useMediaScreen';
import { useFilters } from 'app/hooks/filters/userFilters';
import { usePlayers } from 'app/hooks/player/usePlayers';
const CreateCrateModal = ({
  isOpen,
  onClose,
  genres,
  contributors,
  labels,
  tags,
  trackKeys,
}) => {
  const {
    handleMultiSelectChange,
    handleChangeFilter,
    handleCreateCrate,
    payloadCrate,
    isLoading,
    handleUpdateCrate,
  } = useModalCrate(onClose);
  const { handleInputFocus, handleInputBlur } = usePlayers();
  const { sortByTrackOptionsV1 } = useFilters();
  const { isLargerThan650, isLargerThan992 } = useMediaScreen();

  const genresOptions = useMemo(() => {
    return ([...genres] || [])
      .sort((a, b) => a?.name.localeCompare(b?.name))
      .map(genre => ({ label: genre?.name, value: genre?._id }));
  }, [genres]);

  const contributorsOptions = useMemo(() => {
    return ([...contributors] || [])
      .sort((a, b) => a?.username.localeCompare(b?.username))
      .map(contributor => ({
        label: contributor?.username,
        value: contributor?._id,
      }));
  }, [contributors]);

  const labelsOptions = useMemo(() => {
    return [
      {
        label: 'All Labels',
        value: '',
      },
    ].concat(
      ([...labels] || [])
        .sort(function (a, b) {
          return a.name.localeCompare(b.name);
        })
        .map(section => {
          return { label: section.name, value: section._id };
        }),
    );
  }, [labels]);

  const trackKeysOptions = useMemo(() => {
    return ([...trackKeys] || [])
      .sort(function (a, b) {
        return a.musicKey.localeCompare(b.musicKey);
      })
      .map(trackKey => {
        return {
          label:
            trackKey?.musicKey === 'None' || trackKey?.camelotKey === 'None'
              ? 'None'
              : `${trackKey?.musicKey} / ${trackKey?.camelotKey}`,
          value: trackKey._id,
        };
      });
  }, [trackKeys]);

  const tagsOptions = useMemo(() => {
    return ([...tags] || [])
      .sort((a, b) => a?.name.localeCompare(b?.name))
      .map(tag => ({ label: tag?.name, value: tag?._id }));
  }, [tags]);

  const customStyles = {
    control: provided => ({
      ...provided,
      backgroundColor: '#fff',
      color: 'white',
    }),
    menu: provided => ({
      ...provided,
      backgroundColor: 'black',
      color: '#000',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? 'gray' : 'black',
      color: state.isFocused ? 'white' : 'white',
      fontSize: '14px',
    }),
    singleValue: provided => ({
      ...provided,
      color: '#000',
      fontSize: '14px',
    }),
    multiValue: provided => ({
      ...provided,
      backgroundColor: '#d8e2ed',
      color: 'gray',
    }),
    placeholder: provided => ({
      ...provided,
      color: '#000',
      fontSize: '14px',
    }),
  };

  const checkBoxList = [
    {
      label: 'Audio',
      value: 'Audio',
      name: 'showAudio',
      checked: payloadCrate.showAudio,
    },
    {
      label: 'Video',
      value: 'Video',
      name: 'showVideo',
      checked: payloadCrate.showVideo,
    },

    {
      label: 'Clean',
      value: 'Clean',
      isImage: true,
      name: 'clean',
      checked: payloadCrate.clean,
    },
    {
      label: 'Dirty',
      value: 'Dirty',
      name: 'dirty',
      checked: payloadCrate.dirty,
    },
  ];

  const Option = props => (
    <div>
      <components.Option {...props}>
        <Flex alignItems="center">
          {
            <input
              style={{ marginRight: '10px' }}
              type="checkbox"
              checked={props.isSelected}
            />
          }
          <label>{props.label}</label>
        </Flex>
      </components.Option>
    </div>
  );

  const MultiValue = props => (
    <components.MultiValue {...props}>
      <span>{props.data.label}</span>
    </components.MultiValue>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />

      <ModalContent w="1100px" bg="#666" maxW="100%" color="#FFF">
        <ModalHeader
          fontFamily="Rubik80sFade"
          fontSize="44px"
          textAlign="center"
          color="#FFF"
        >
          CRATE EDITOR
        </ModalHeader>
        <Text
          fontSize="22px"
          fontWeight={700}
          textAlign="center"
          p="10px"
          pt="0px"
        >
          Here, you can program some filter settings to make a "Crate". Your
          crates show up at the top of most every page across the entire Mixinit
          for fast access to your most used searches. We've created a few sample
          crates for you to start with, but you can customize your crates how
          they work for you!
        </Text>
        <ModalCloseButton />
        <ModalBody>
          <Flex
            gridGap="10px"
            flexDirection={isLargerThan650 ? 'row' : 'column'}
          >
            <FormControl mb={2}>
              <FormLabel fontSize="14px" fontWeight={400}>
                Show or Hide?
              </FormLabel>
              <Flex w="100%" gridGap="15px">
                {(checkBoxList || []).map((value, index) => {
                  return (
                    <Box key={index}>
                      <Checkbox
                        name={value?.name}
                        h="21px"
                        isChecked={value?.checked}
                        onChange={e =>
                          handleChangeFilter(e.target.name, e.target.checked)
                        }
                      >
                        <Text fontWeight="400" fontSize="11px">
                          {value?.label}
                        </Text>
                      </Checkbox>
                    </Box>
                  );
                })}
              </Flex>
            </FormControl>
            <FormControl mb={2}>
              <FormLabel fontSize="14px" fontWeight={400}>
                Sort By (your default sort)
              </FormLabel>
              <Select
                defaultValue={payloadCrate?.sort || SORT_TYPE.PUBLISHED_AT_DESC}
                bg="#fff"
                color="#000"
                fontSize="14px"
                onChange={event =>
                  handleChangeFilter('sort', event.target.value)
                }
              >
                {sortByTrackOptionsV1.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </FormControl>
            {isLargerThan992 && (
              <FormControl mb={2}>
                <FormLabel fontSize="14px" fontWeight={400}>
                  Contributors (only selected ones will display)
                </FormLabel>
                <ReactSelect
                  isMulti
                  options={contributorsOptions}
                  components={{ Option, MultiValue }}
                  value={(payloadCrate.showContributors || []).map(
                    (value: { _id: any }) =>
                      contributorsOptions.find(
                        option => option.value === value?._id,
                      ),
                  )}
                  hideSelectedOptions={false}
                  closeMenuOnSelect={false}
                  onChange={handleMultiSelectChange('showContributors')}
                  placeholder="All Contributors"
                  styles={customStyles}
                />
              </FormControl>
            )}
          </Flex>
          {!isLargerThan992 && (
            <Flex
              gridGap="10px"
              flexDirection={isLargerThan650 ? 'row' : 'column'}
            >
              <FormControl mb={2}>
                <FormLabel fontSize="14px" fontWeight={400}>
                  Contributors (only selected ones will display)
                </FormLabel>
                <ReactSelect
                  isMulti
                  options={contributorsOptions}
                  components={{ Option, MultiValue }}
                  value={(payloadCrate.showContributors || []).map(
                    (value: { _id: any }) =>
                      contributorsOptions.find(
                        option => option.value === value?._id,
                      ),
                  )}
                  hideSelectedOptions={false}
                  closeMenuOnSelect={false}
                  onChange={handleMultiSelectChange('showContributors')}
                  placeholder="All Contributors"
                  styles={customStyles}
                />
              </FormControl>
              <FormControl mb={2}>
                <FormLabel fontSize="14px" fontWeight={400}>
                  Labels (only selected ones will display)
                </FormLabel>
                <ReactSelect
                  options={labelsOptions}
                  onChange={value =>
                    handleChangeFilter('labelId', value?.value)
                  }
                  placeholder="All Labels"
                  styles={customStyles}
                  value={labelsOptions.find(label => {
                    return (
                      label.value ===
                      (payloadCrate?.labelId?._id || payloadCrate?.labelId)
                    );
                  })}
                />
              </FormControl>
            </Flex>
          )}
          <Flex
            gridGap="10px"
            flexDirection={isLargerThan650 ? 'row' : 'column'}
          >
            {isLargerThan992 && (
              <FormControl mb={2}>
                <FormLabel fontSize="14px" fontWeight={400}>
                  Labels (only selected ones will display)
                </FormLabel>
                <ReactSelect
                  options={labelsOptions}
                  onChange={value =>
                    handleChangeFilter('labelId', value?.value)
                  }
                  placeholder="All Labels"
                  styles={customStyles}
                  value={labelsOptions.find(label => {
                    return (
                      label.value ===
                      (payloadCrate?.labelId?._id || payloadCrate?.labelId)
                    );
                  })}
                />
              </FormControl>
            )}

            <FormControl mb={2}>
              <FormLabel fontSize="14px" fontWeight={400}>
                Genres (only selected ones will display)
              </FormLabel>
              <ReactSelect
                isMulti
                options={genresOptions}
                components={{ Option, MultiValue }}
                value={(payloadCrate.showGenres || []).map(
                  (value: { _id: any }) =>
                    genresOptions.find(option => option?.value === value?._id),
                )}
                onChange={handleMultiSelectChange('showGenres')}
                hideSelectedOptions={false}
                closeMenuOnSelect={false}
                placeholder="All Genres"
                styles={customStyles}
              />
            </FormControl>
            <FormControl mb={2}>
              <FormLabel fontSize="14px" fontWeight={400}>
                Tags (only selected ones will display)
              </FormLabel>
              <ReactSelect
                isMulti
                options={tagsOptions}
                components={{ Option, MultiValue }}
                value={(payloadCrate.showTags || []).map(
                  (value: { _id: any }) =>
                    tagsOptions.find(option => option?.value === value?._id),
                )}
                hideSelectedOptions={false}
                closeMenuOnSelect={false}
                onChange={handleMultiSelectChange('showTags')}
                placeholder="All Tags"
                styles={customStyles}
              />
            </FormControl>
          </Flex>
          <FormControl mb={2}>
            <FormLabel fontSize="14px" fontWeight={400}>
              Add some text (only tracks including the text in the title or
              artist field will display)
            </FormLabel>
            <Input
              placeholder="Enter text to filter..."
              bg="#fff"
              _placeholder={{ opacity: 1, color: '#000' }}
              color="#000"
              fontSize="14px"
              onChange={e => handleChangeFilter('search', e.target.value)}
              value={payloadCrate?.search}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            />
          </FormControl>
          <Flex
            gridGap="10px"
            flexDirection={isLargerThan650 ? 'row' : 'column'}
          >
            <FormControl mb={2}>
              <FormLabel fontSize="14px" fontWeight={400}>
                Tempo range (0 - 220)
              </FormLabel>
              <Flex gridGap="10px">
                <NumberInput
                  borderRadius="6px"
                  bg="#fff"
                  min={BPM_MIN}
                  max={BPM_MAX}
                  onChange={value =>
                    handleChangeFilter('bpmStart', Number(value))
                  }
                  defaultValue={
                    payloadCrate?.bpmStart && Number(payloadCrate?.bpmStart)
                  }
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                >
                  <NumberInputField
                    placeholder="From bpm"
                    _placeholder={{ opacity: 1, color: '#000' }}
                    color="#000"
                    fontSize="14px"
                  />
                </NumberInput>
                <NumberInput
                  borderRadius="6px"
                  bg="#fff"
                  min={BPM_MIN}
                  max={BPM_MAX}
                  onChange={value =>
                    handleChangeFilter('bpmEnd', Number(value))
                  }
                  defaultValue={
                    payloadCrate?.bpmEnd && Number(payloadCrate?.bpmEnd)
                  }
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                >
                  <NumberInputField
                    placeholder="To bpm"
                    _placeholder={{ opacity: 1, color: '#000' }}
                    color="#000"
                    fontSize="14px"
                  />
                </NumberInput>
              </Flex>
            </FormControl>
            <FormControl mb={2}>
              <FormLabel fontSize="14px" fontWeight={400}>
                Release Year Range (1950 - {new Date().getFullYear()})
              </FormLabel>
              <Flex gridGap="10px">
                <NumberInput
                  borderRadius="6px"
                  bg="#fff"
                  min={YEAR_MIN}
                  max={new Date().getFullYear()}
                  onChange={value =>
                    handleChangeFilter('yearFrom', Number(value))
                  }
                  defaultValue={
                    payloadCrate?.yearFrom && Number(payloadCrate?.yearFrom)
                  }
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                >
                  <NumberInputField
                    placeholder="From year"
                    _placeholder={{ opacity: 1, color: '#000' }}
                    color="#000"
                    fontSize="14px"
                  />
                </NumberInput>

                <NumberInput
                  borderRadius="6px"
                  bg="#fff"
                  min={YEAR_MIN}
                  max={new Date().getFullYear()}
                  onChange={value =>
                    handleChangeFilter('yearTo', Number(value))
                  }
                  defaultValue={
                    payloadCrate?.yearTo && Number(payloadCrate?.yearTo)
                  }
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                >
                  <NumberInputField
                    placeholder="To year"
                    _placeholder={{ opacity: 1, color: '#000' }}
                    color="#000"
                    fontSize="14px"
                  />
                </NumberInput>
              </Flex>
            </FormControl>

            {isLargerThan992 && (
              <FormControl mb={2}>
                <FormLabel fontSize="14px" fontWeight={400}>
                  Track Keys
                </FormLabel>
                <ReactSelect
                  isMulti
                  options={trackKeysOptions}
                  components={{ Option, MultiValue }}
                  value={(payloadCrate.showTrackKeys || []).map(value =>
                    trackKeysOptions.find(
                      option => option.value === value?._id,
                    ),
                  )}
                  hideSelectedOptions={false}
                  closeMenuOnSelect={false}
                  onChange={handleMultiSelectChange('showTrackKeys')}
                  placeholder="All Keys"
                  styles={customStyles}
                />
              </FormControl>
            )}
          </Flex>
          {!isLargerThan992 && (
            <FormControl mb={2}>
              <FormLabel fontSize="14px" fontWeight={400}>
                Track Keys
              </FormLabel>
              <ReactSelect
                isMulti
                options={trackKeysOptions}
                components={{ Option, MultiValue }}
                value={(payloadCrate.showTrackKeys || []).map(value =>
                  trackKeysOptions.find(option => option.value === value?._id),
                )}
                hideSelectedOptions={false}
                closeMenuOnSelect={false}
                onChange={handleMultiSelectChange('showTrackKeys')}
                placeholder="All Keys"
                styles={customStyles}
              />
            </FormControl>
          )}
          <FormControl mb={2}>
            <FormLabel fontSize="14px" fontWeight={400}>
              Name Your Crate
            </FormLabel>
            <Flex gridGap="10px">
              <Input
                placeholder="Enter crate name..."
                bg="#fff"
                color="#000"
                _placeholder={{ opacity: 1, color: '#000' }}
                fontSize="14px"
                value={payloadCrate?.name}
                onChange={e => handleChangeFilter('name', e.target.value)}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
              <Button
                variant="unstyled"
                border="1px solid #fff"
                borderRadius="0px"
                isLoading={isLoading}
                w="150px"
                onClick={() =>
                  !payloadCrate?._id ? handleCreateCrate() : handleUpdateCrate()
                }
                display="flex"
              >
                {!isLoading && (
                  <Text>
                    {payloadCrate?._id ? 'Update Crate' : 'Save Crate'}
                  </Text>
                )}
              </Button>
            </Flex>
          </FormControl>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CreateCrateModal;
