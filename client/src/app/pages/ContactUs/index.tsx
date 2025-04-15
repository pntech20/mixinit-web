import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Input,
  Select,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { createQuestion } from 'app/apis/questions';
import { HelmetPage } from 'app/components/HelmetPage';
import { PageHeaderContext } from 'app/contexts/PageHeaderContext';
import { toastError, toastSuccess } from 'app/helpers/toast';
import { useModeTheme } from 'app/hooks/ColorDarkMode/useModeTheme';
import { usePlayers } from 'app/hooks/player/usePlayers';
import { renderDraftToHtml } from 'app/utils/renderDraftToHtml';
import { useCallback, useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { selectAuth } from '../Login/slice/selectors';
import { Ads } from 'app/components/Ads';
import { BannerListLabel } from 'app/components/BannerListLabel';
import Crate from 'app/components/Crate';
import { useMediaScreen } from 'app/hooks/mediaScreen/useMediaScreen';

export function ContactUsPage() {
  const { pageHeader }: any = useContext(PageHeaderContext);
  const { isDarkMode } = useModeTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { handleInputFocus, handleInputBlur } = usePlayers();
  const { userDetail } = useSelector(selectAuth);
  const { isLargerThan992 } = useMediaScreen();

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm();
  const dataSelectReason = [
    {
      label: `General Inquiry`,
      value: 'General_Inquiry',
    },
    {
      label: `Subscription Applicant`,
      value: 'Subscription_Applicant',
    },
    {
      label: `Contributor Applicant`,
      value: 'Contributor_Applicant',
    },
    {
      label: `Advertise / Promote Music`,
      value: 'Advertise_Promote_Music',
    },
    {
      label: `Report A Bug/Issue`,
      value: 'Report_A_Bug/Issue',
    },
  ];

  const onSend = useCallback(
    async newData => {
      try {
        const data = { ...newData, emailAddress: userDetail?.email };
        setIsSubmitting(true);
        const res: any = await createQuestion({
          data,
        });
        if (res?.data?.success) {
          toastSuccess('Successfully!');
        }
      } catch (error) {
        toastError('Something wrong!');
      } finally {
        setIsSubmitting(false);
        reset();
      }
    },
    [reset, userDetail?.email],
  );

  const onSubmit = async data => {
    onSend(data);
  };
  return (
    <Box>
      <HelmetPage title="Contact Us" />
      <Box bg="#f3f3f3" mb="10px" borderRadius="5px">
        <Ads />
        <Flex
          w="100%"
          flexDirection={isLargerThan992 ? 'row' : 'column'}
          gridGap="15px"
        >
          <Box w={isLargerThan992 ? '50%' : '100%'}>
            <BannerListLabel />
          </Box>
          <Box w={isLargerThan992 ? '50%' : '100%'}>
            <Crate />
          </Box>
        </Flex>
      </Box>
      {pageHeader?.contactUs && (
        <Box
          mb="20px"
          className={
            isDarkMode ? 'pageTopHeaderDarkMode' : 'pageTopHeaderLightMode'
          }
        >
          {renderDraftToHtml(pageHeader?.contactUs)}
        </Box>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={errors.reason} mt="10px">
          <Text mb="5px" lineHeight="16px" fontWeight="700">
            * YOUR REASON FOR CONTACTING US
          </Text>
          <Select
            w="100%"
            bg="#020202"
            color="#fff"
            id="reason"
            {...register('reason', {
              required: 'This is required',
            })}
            placeholder="Select One"
            _placeholder={{ color: '#fff' }}
          >
            {dataSelectReason.map(op => (
              <option key={op.value} value={op.label}>
                {op.label}
              </option>
            ))}
          </Select>
          <FormErrorMessage>
            {errors.reason && errors.reason.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.fullName} mt="10px">
          <Text mb="5px" lineHeight="16px" fontWeight="700">
            * FULL NAME
          </Text>
          <Input
            borderColor="#7a7a7a"
            id="fullName"
            {...register('fullName', {
              required: 'This is required',
            })}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
          />
          <FormErrorMessage>
            {errors.fullName && errors.fullName.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.content} mt="10px">
          <Text mb="5px" lineHeight="16px" fontWeight="700">
            * HOW CAN WE HELP YOU?
          </Text>
          <Textarea
            _placeholder={{ color: '#242424' }}
            _dark={{ _placeholder: { color: '#d4d4d4' } }}
            placeholder="How can we help you?"
            rows={5}
            borderColor="#7a7a7a"
            id="content"
            {...register('content', {
              required: 'This is required',
            })}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
          />
          <FormErrorMessage>
            {errors.content && errors.content.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.fullName} mt="10px">
          <Text mb="5px" lineHeight="16px" fontWeight="700">
            IMAGE URL OR VIDEO URL
          </Text>
          <Input
            borderColor="#7a7a7a"
            id="urlVieoOrImage"
            {...register('urlVieoOrImage')}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
          />
          <FormErrorMessage>
            {errors.urlVieoOrImage && errors.urlVieoOrImage.message}
          </FormErrorMessage>
        </FormControl>

        <Button
          isLoading={isSubmitting}
          mt="20px"
          bgColor="black"
          color="white"
          _hover={{ bgColor: 'black' }}
          type="submit"
        >
          Submit
        </Button>
      </form>
    </Box>
  );
}
