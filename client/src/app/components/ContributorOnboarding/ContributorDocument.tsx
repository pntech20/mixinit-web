import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Image,
  Input,
  Text,
} from '@chakra-ui/react';
import './ContributorOnboarding.module.scss';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import StopImg from '../../assets/images/common/stop.png';
import { useModeTheme } from 'app/hooks/ColorDarkMode/useModeTheme';
import styles from './ContributorOnboarding.module.scss';
import { usePlayers } from 'app/hooks/player/usePlayers';

export default function ContributorDocument({ setIsAgree, popContactForm }) {
  const { isLightMode } = useModeTheme();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const { handleInputFocus, handleInputBlur } = usePlayers();

  const [, setDataName] = useState<any>([]);

  function onSubmit(data) {
    setIsAgree(true);
    setDataName(data);
    popContactForm();
  }

  return (
    <Box maxW="1080px" m="auto">
      <Box bg="#ff0a13" p="10px">
        <Text
          fontSize={{ base: '20px', sm: '40px' }}
          fontWeight={800}
          color="#fff"
          marginBottom="10px"
        >
          Contributor Onboarding
        </Text>
        <Text fontSize={{ base: '16px', sm: '16px' }} color="#fff" mb={2}>
          Please click the link below, read both the Breakdown and Legal tabs,
          then if you agree come back, type your first and last name in the box,
          then click "Agree".
        </Text>
      </Box>
      <Flex w="100%" justifyContent="center">
        <Image w="320px" my="48px" src={StopImg} />
      </Flex>
      <Flex justifyContent="center">
        <Flex
          bg="#ff0a13"
          p="10px"
          w="max-content"
          color="#fff"
          fontWeight={600}
          cursor="pointer"
          onClick={() =>
            window.open(
              'https://www.crooklynclan.net/ccv4-contributor-onboarding',
              '_blank',
            )
          }
        >
          CLICK HERE AND READ THE "BREAKDOWN" AND "LEGAL" SECTIONS
        </Flex>
      </Flex>

      {/* <UnorderedList
        fontSize={{ base: '14px', sm: '16px' }}
        fontWeight={500}
        spacing={{ base: 2, sm: 5 }}
        paddingLeft={{ sm: '16px' }}
        color={isLightMode ? '#333' : '#fff'}
      >
        <ListItem>
          <span>
            ALL WORKS CONTRIBUTED TO THE Mixinit VAULT MUST BE DERIVATIVE
            WORKS.
          </span>
          <br />
          This means, the tracks uploaded should not be the exact version you
          hear on streaming services, or get on the artists albums. We are a
          service for DJ's providing alternate versions of original works
          intended to make the job of being a live DJ easier and more painless.
          Add intros, outros, shorten tracks, acapella in's, out's, etc.. If
          this don't make sense to you we are not sure how you became a
          contributor to begin with! This rule does not apply to original
          productions uploaded by contributors that are producers of original
          music. You may upload your original music to the i12inch Pool label as
          you wish.
        </ListItem>
        <ListItem>
          Tracks and Releases are purchased with <span>real money</span>. Tokens
          are no longer purchased by clients. Real time breakdowns of your
          finances are available to you at all times for review upon making
          quota for each label you are a contributor for respectively.
        </ListItem>
        <ListItem>
          Contributors may create <span>"Releases"</span> from the tracks they
          provide to the service using the <span>"Release Editor"</span>. With
          Releases, the contributor can group tracks that were uploaded to the
          same label, provide custom artwork, and a price that is lower than the
          retail price of the tracks contained in the release if they were
          purchased individually. Create releases to offer discounts to clients
          that are willing to purchase your contributions in bulk. Be creative
          about releases by grouping tracks together that make sense together.
          Experiment and learn what your clients like the most.
        </ListItem>
        <ListItem>
          Our cart offers an automatic discounting system based on the number of
          tracks or releases a client checks out with the cart. Track discounts
          and Release discounts are treated separately. For every 20 tracks a
          client is checking out with they will get a 5% discount off their
          entire order for TRACKS. That discount will not apply to releases. So
          for example, if a client checks out with 61 tracks in their cart they
          are going to get 15% off for the tracks in the cart. The discount for
          releases works similar but for every 5 releases a client checks out
          with they will receive 5% off. So a user checking out with 11 Releases
          will get a 10% discount on them. A user checking out with 22 Tracks
          and 16 releases will get 5% off the tracks, and 15% off the releases.
          This will be reflected in your real time accounting.
        </ListItem>

        <ListItem>
          Each Label has it's own percentage split between the label and the
          contributor for your sales under that label. The formula for paying
          out is 5% off the top for payment processing, then % company / %
          contributor. So for example $100 worth of your tracks sells. From the
          top, $5 comes off for payment processing leaving $95.00. Let's say for
          this example the split between the label and contributor is 50/50. The
          label will get $47.50 and you will get $47.50.
        </ListItem>
        <ListItem>
          Contributors may contribute edits only to the labels they have access
          to as contributors. Each label has a different upload quota and is
          independent of any other label. A label may have set token price per
          track not allowing a contributor to adjust the selling price, and a
          label may also have a range for the selling price and give the
          contributor the option to choose a price within that range to charge
          for a track. The contributor will have this option at the time of
          upload, and in their track editor <span>if it is available.</span>.
        </ListItem>
        <ListItem>
          Contributors must meet the upload quota requirement on a{' '}
          <span>per-label basis</span> to be paid for their sales earned from
          that label in a calendar month. If a contributor does not meet the
          upload quota requirement for a label{' '}
          <span>
            they will not be included in the payout for that label and that
            calendar month
          </span>
          , and earnings for that label and that calendar month will be
          forfeited to the company. What this means is if you are a contributor
          for more than one label, you will need to make the monthly upload
          quota for each label you are a contributor for respectively. So say
          Audio Vault has a 15 upload requirement, and i12inch Pool has a 30
          upload requirement, you will only be part of the payout for the
          accounting period on the labels you made quota. So if you only
          uploaded 29 edits to i12inch your sales for that accounting period are
          forfeited. This is mandatory to keep productivity up and our quotas
          are very reasonable.
        </ListItem>
        <ListItem>
          Contributors will be paid on a monthly basis for their sales from the
          previous month on the first day of the new month.
        </ListItem>

        <ListItem>
          <span>
            A PAYPAL ACCOUNT IN GOOD STANDING IS REQUIRED IN ORDER TO BE PAID.
          </span>{' '}
          Please make sure you have Paypal and it's not limited in any way that
          would prevent you from receiving payments.
        </ListItem>
        <ListItem>
          All US Citizens are required to provide a Social Security Number or
          TAX ID in order to be paid. At the beginning of a new calendar year
          you will receive a 1099 for the income you have made the previous year
          if it amounts to $600 USD or more.
        </ListItem>
      </UnorderedList> */}

      {/* <Box
        color={isLightMode ? '#333' : '#fff'}
        fontSize={{ base: '14px', sm: '16px' }}
        fontWeight={500}
      >
        <Text
          my={{ base: '10px', sm: '48px' }}
          fontSize={{ base: '20px', sm: '30px' }}
          fontWeight={900}
        >
          Legal
        </Text>
        <VStack pt="48px" spacing={{ base: 2, sm: 5 }} align="stretch">
          <Text>
            <span>CONTRIBUTOR/EDITOR LEGAL AGREEMENT</span>
          </Text>
          <Text>
            This agreement describes the legal relationship between you (an
            individual disc jockey, artist, or, in the case where you are
            involved with a band or group, an individual acting as the legal
            representative of your band or group) (“Editor” "Contributor",
            “you”) and Mixinit Inc. (referred to as “Crooklyn”, "we", or
            "us"). By submitting any material or information to Crooklyn, its
            successors, assigns, agents, distributors and licensees, you
            explicitly confirm that you have read, understood, and agreed to the
            following agreement (in addition to the{' '}
            <span>Terms and Conditions</span>
            and <span>Privacy Policy</span> ):
          </Text>
          <Text>
            You been engaged to provide derivative works of various master
            recordings (“Master Recordings”)
          </Text>
          <Text>
            You have been engaged to provide derivative works ("Tracks") of
            various master recordings ("Original Works") embodying the
            performance of various artists (“Artists”), which are to be to be
            released on Crooklyn’s website Crooklynclan.net (the “Site”) in one
            or more of the services ("Services") available.
          </Text>
          <Text>
            As consideration for Editors services in connection with the Tracks,
            provided Editor satisfies the Quota (as defined below), Editor shall
            receive a royalty as outlined and set forth in the “Finances”
            section of the Site{' '}
            <span style={{ fontStyle: 'italic' }}>(“Commission”)</span>.
          </Text>
          <Text>
            Editor will provide audio or video Tracks to one or more of the
            Services available on the Site for a trial period of Ninety (90)
            days. Each Track an Editor uploads to the Site must be new and
            original and must be identified properly using the uploader provided
            on the Site. Each Track successfully uploaded by an Editor will
            count as One (1) Track toward the Editors' monthly quota (“Quota”)
            required for the specific Service the Editor is contributing to on
            the Site .
          </Text>
          <Text>
            <span>Contributor/Editor hereby acknowledges:</span>
          </Text>
          <Text>
            Editor shall be responsible for all costs incurred in connection
            with the Remixed Master, including but not limited to recording and
            mastering costs (if applicable).
          </Text>
          <Text>
            No royalties will be payable to Editor with respect to the Remixed
            Master other than as defined in this agreement.
          </Text>
          <Text>
            The Commission shall be deemed full and complete payment to Editor
            for all of Editor’s services with respect to the Tracks and the
            grants of rights herein. No additional compensation will be due to
            Editor as a result of the use or exploitation of the Tracks .
          </Text>
          <Text>
            <span>
              In the event an Artist, recording label or other party elects to
              be placed on the do not remix (“D.N.R List”) list, Editor shall
              immediately cease and desist from using such material in any
              Tracks and shall refrain from submitting future Tracks containing
              material from the D.N.R List. Notwithstanding the foregoing,
              Editor hereby acknowledges Editor shall frequent the D.N.R. List,
              in Editor’s sole discretion, to insure Editor is in compliance
              with the terms of this Agreement and the terms of the Privacy
              Policy.
            </span>
          </Text>
          <Text>
            Crooklyn is not a signatory to the AF of M or AFTRA or any other
            union. If any such union payments are due, Crooklyn will deduct such
            payments from the balance of any fees payable to Editor.
          </Text>
          <Text>
            Crooklyn cannot guarantee that the Site will provide regular data
            backups of any Editor data stored or uploaded on it. It is Editor’s
            responsibility to backup onto Editor’s own local system all Editor
            data and files, including but not limited to all data, files and
            records that Editor submits to Crooklyn.
          </Text>
          <Text pt="20px">
            <span>
              Contributor/Editor represents and warrants to Crooklyn that:
            </span>
          </Text>
          <Text>
            Editor shall fully report all original works used in the Remixed
            Master (i.e. the authors of the master recording as we well as the
            underlining composition owners of all original works utilized in the
            Remixed Master).
          </Text>
          <Text>
            Editor will list all original works embodied within each Track
            successfully uploaded to the Site (i.e. any and all owners of
            original master recordings and their underlying compositions as
            embodied in any Track).
          </Text>
          <Text>
            The results and proceeds of all of Editor’s services to be rendered
            or which have been rendered by Editor and in connection with the
            Track, including “outtakes” thereof, shall be deemed a “work made
            for hire” (as defined under the United States Copyright Act and for
            the purpose of all other copyright laws throughout the world)
            created for Crooklyn. If, for any reason, said Track, or any portion
            thereof, shall be adjudged not to be a “work made for hire”, then
            Editor hereby irrevocably assigns all rights of ownership in such
            Track, including without limitation, all copyrights and all renewals
            and extensions thereof throughout the universe, to Crooklyn.
          </Text>
          <Text>
            <span>
              Crooklyn, and its licensees, successors and assigns shall have the
              sole and exclusive right in perpetuity and throughout the
              universe:
            </span>
          </Text>
          <Text>
            <span>(a)</span> to manufacture, advertise, sell, license or
            otherwise dispose of the Track and derivatives derived therefrom in
            any manner or media whatsoever upon such terms, and under such
            trademarks, as Crooklyn may elect, or, in our sole discretion, to
            refrain therefrom; (b) to perform the Track publicly and to permit
            the public performance thereof by any method now or hereafter known;
            and (c) to include Editor’s name, likeness and biographical material
            on packaging and label copy material (if any).
          </Text>
          <Text>
            <span>(b)</span> Editor has the full right, power and authority to
            enter into this Agreement and furnish services hereunder; (c) no
            third party consents are required with respect hereto; (d) Editor is
            not under any contract that might derogate in any way from the
            rights to be acquired by Crooklyn hereunder and/or from the
            enjoyment of such rights by Crooklyn; and (e) Editor waives any
            so-called “moral rights” to the extent permitted by law.
          </Text>
          <Text>
            Editor will at all times indemnify and hold Crooklyn and Crooklyn’s
            licensees, successors and assigns harmless from and against any and
            all claims, damages, liabilities, costs, and expenses (collectively
            “Costs”), including reasonable counsel fees, arising out of any
            breach or alleged breach by Crooklyn of any representation or
            warranty contained in this Agreement. Notwithstanding the foregoing,
            the foregoing indemnity will be applicable to any claim relating to
            copyright infringement whether or not such claim has been reduced to
            final adverse judgment or settled with written consent.
          </Text>
          <Text>
            <span>Crooklyn will provide the following to Editor:</span>
          </Text>
          <Text>
            <span>(i)</span> Basic support through the Site and
          </Text>
          <Text>
            <span>(ii)</span> Crooklyn will use commercially reasonable efforts
            to make the Site and all systems of Crooklyn and Crooklyn’s
            third-party suppliers that are used in the provision of the
            Services, reasonably available with minimal downtime; except for;
          </Text>
          <Text>
            <span>(a)</span> downtime and scheduled upgrades (if applicable);
            and
          </Text>
          <Text>
            <span>(b)</span> unavailability caused by circumstances beyond
            Crooklyn’s reasonable control, including acts of God, acts of
            government, flood, fire, earthquakes, civil unrest, acts of terror,
            strikes or other labor problems, Internet service provider failures
            or delays, or the unavailability of any third-party provided goods
            or services.
          </Text>
          <Text>
            Crooklyn shall provide you with statements for Commission payable to
            Editor hereunder on or about ninety (90) days from end of each
            calendar quarter annual period (i.e. on or about January 1st for the
            quarter annual period ending the preceding September 30th, on or
            about April 1st for the quarter annual period ending the preceding
            December 31st, on or about July 1st for the quarter annual period
            ending the preceding March 31st and on or about October 1st for the
            quarter annual period ending the preceding June 30th), and pay
            Editor the Commission, if any, earned by you during the quarter
            annual period for which the statement is rendered, after deducting
            any amounts that Crooklyn is required to deduct or withhold by law.
            Crooklyn has no obligation to provide Editor with statements for any
            period during which no Commission accrues. Contributors will have
            the ability to watch their sales in real time.
          </Text>
          <Text>
            All accountings rendered hereunder shall be binding upon Editor and
            not subject to any objection by Editor for any reason unless
            specific written objection, stating the basis thereof, is furnished
            to Crooklyn not later than the date that is two and one-half (2.5)
            years after the applicable accounting statement is rendered to
            Editor hereunder. Crooklyn shall be deemed conclusively to have sent
            Editor that statement on the date prescribed unless Editor notifies
            Crooklyn otherwise, with respect to any particular statement, within
            ninety (90) days after such statement is due as provided in the
            foregoing paragraph above. Editor shall be foreclosed from
            maintaining any action, claim or proceeding against Crooklyn with
            respect to any statement or accounting due hereunder unless
            commenced against Crooklyn in a court of competent jurisdiction not
            later than the date that is six (6) months after the end of the
            foregoing two and one-half (2.5) year objection period.
          </Text>
          <Text>
            Editor shall have the right to appoint a certified public
            accountant, who is not then currently engaged in an outstanding
            audit of Crooklyn, to examine and take copies of Crooklyn’s books
            and records solely relating to the Commission, provided that such
            examination shall take place at Crooklyn’s offices during normal
            business hours, on reasonable written notice, not more frequently
            than once per statement or once in any calendar year and at Editor’s
            sole cost and expense.
          </Text>
          <Text>
            Editor shall furnish Crooklyn with a copy of Editor’s accountant's
            audit report within thirty (30) days after the completion of the
            applicable audit. The rights granted herein to Editor constitute
            Editor’s sole right to examine Crooklyn’s books and records.
          </Text>
          <Text>
            <span style={{ fontWeight: '700', fontSize: '12px' }}>
              YOU EXPRESSLY AGREE THAT USE OF THE WEBSITE AND RELATED SERVICES
              IS AT YOUR SOLE RISK. THE WEBSITE, MATERIALS AND RELATED SERVICES
              ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. CROOKYLN
              MAKES NO REPRESENTATIONS OR WARRANTIES WITH REGARD TO THE WEBSITE
              OR ANY MATERIALS THEREIN, WHETHER EXPRESS OR IMPLIED, ARISING BY
              LAW OR OTHERWISE, INCLUDING, WITHOUT LIMITATION, ANY IMPLIED
              WARRANTY OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE OR
              NON-INFRINGEMENT OR ANY IMPLIED WARRANTY ARISING OUT OF COURSE OF
              PERFORMANCE, COURSE OF DEALING OR USAGE OF TRADE. IN ADDITION,
              CROOKLYN MAKES NO REPRESENTATION THAT THE OPERATION OF THE WEBSITE
              WILL BE UNINTERRUPTED OR ERROR-FREE. CROOKLYN WILL NOT BE LIABLE
              FOR THE CONSEQUENCES OF ANY INTERRUPTIONS OR ERRORS ON THE
              WEBSITE. IT IS YOUR RESPONSIBILITY TO EVALUATE THE ACCURACY,
              COMPLETENESS OR USEFULNESS OF ANY OPINION, ADVICE, INFORMATION OR
              OTHER CONTENT OR MATERIALS PROVIDED IN CONNECTION WITH OR
              OTHERWISE AVAILABLE THROUGH THE WEBSITE. PLEASE SEEK THE ADVICE OF
              PROFESSIONALS, AS APPROPRIATE, REGARDING THE EVALUATION OF ANY
              SUCH OPINION, ADVICE, INFORMATION OR OTHER CONTENT. UNDER NO
              CIRCUMSTANCE WILL CROOKLYN BE LIABLE FOR ANY LOSS OR DAMAGE CAUSED
              BY YOUR RELIANCE ON INFORMATION OBTAINED THROUGH THE WEBSITE,
              OTHER THAN AS REQUIRED UNDER APPLICABLE CONSUMER-PROTECTION LAW.
              SOME JURISDICTIONS DO NOT ALLOW THE DISCLAIMER OF CERTAIN
              WARRANTIES OR LIMITATION OF CERTAIN TYPES OF DAMAGES, THEREFORE,
              SOME OF THE ABOVE DISCLAIMERS MAY NOT APPLY TO YOU AND NOTHING
              CONTAINED HEREIN SHOULD BE CONSTRUED AS EXCLUDING OR LIMITING ANY
              LIABILITY BEYOND WHAT IS PERMITTED UNDER APPLICABLE LAW.
              <br />
              EXCEPT FOR A BREACH OF SECTION 3, NEITHER YOU OR US WILL BE LIABLE
              FOR ANY CONSEQUENTIAL, INDIRECT, EXEMPLARY, SPECIAL OR INCIDENTAL
              DAMAGES ARISING FROM OR RELATING TO THIS AGREEMENT.
            </span>
          </Text>
          <Text>
            This Agreement sets forth the entire understanding between the
            parties with respect to the subject matter hereof, and no amendment
            to or modification, waiver, termination or discharge of this
            Agreement or any provision hereof shall be binding upon either party
            unless confirmed by a written instrument signed by both parties
            hereto. This Agreement shall be governed by and construed under the
            laws of the State of New York applicable to agreements to be
            performed wholly therein. If any part of this Agreement shall be
            determined to be invalid or unenforceable by a court of competent
            jurisdiction or by any other legally constituted body having the
            jurisdiction to make such determination, the remainder of this
            Agreement shall remain in full force and effect.
          </Text>
          <Text>
            The 'Terms And Conditions of the Site use can be found online at
            www.crooklynclan.net/terms.
          </Text>
          <Text>
            It is understood that the foregoing shall inure to the benefit of
            Crooklyn and Crooklyn’s successors, designees, assigns and licenses;
            that Crooklyn’s rights with respect to the Remixed Master may be
            freely assigned and licensed; and that Crooklyn is acting in
            reliance upon this Agreement.
          </Text>
          <Text>
            From time to time, we may change this agreement. When such
            modification is made, we will post a revised version of this
            agreement on the Website. Modifications will be effective when they
            are posted. We are not required to provide you with notification
            that any such modification has been made.
          </Text>
        </VStack>
      </Box> */}
      <Box my="20px">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex>
            <FormControl isInvalid={errors.name}>
              <Input
                placeholder="Type your First Name and Last Name"
                id="name"
                {...register('name', {
                  required: 'This is required',
                })}
                color={isLightMode ? '#000' : '#fff'}
                _placeholder={{ color: isLightMode ? '#000' : '#fff' }}
                className={styles.input}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
              <FormErrorMessage>
                {errors.name && errors.name.message}
              </FormErrorMessage>
            </FormControl>
            <Button
              className={styles.button}
              bg="#ff0a13"
              color="white"
              ml="10px"
              fontSize={{ base: '14px', sm: '16px' }}
              fontWeight={500}
              type="submit"
              borderRadius="0px"
              _hover={{ backgroundColor: 'black', opacity: '0.7' }}
            >
              AGREE
            </Button>
          </Flex>
        </form>
      </Box>
    </Box>
  );
}
