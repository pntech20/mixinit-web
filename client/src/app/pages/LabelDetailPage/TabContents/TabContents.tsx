import { AboutInLabel } from '../About';
import { ContributorsInLabel } from '../Contributors';
import ReleasesInLabel from '../Releases';
import { TracksInLabel } from '../Tracks';

export const TabContent = ({ labelDetail, tracksHook, tabIndex, id }: any) => {
  switch (tabIndex) {
    case 0:
      return <AboutInLabel labelDetail={labelDetail} />;

    case 1:
      return (
        <TracksInLabel labelDetail={labelDetail} tracksHook={tracksHook} />
      );

    case 2:
      return <ReleasesInLabel labelDetail={labelDetail} />;

    case 3:
      return <ContributorsInLabel labelDetail={labelDetail} labelId={id} />;

    default:
      return null;
  }
};
