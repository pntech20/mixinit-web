import IconClean from 'app/assets/svgs/IconClean';
import IconDirty from 'app/assets/svgs/IconDirty';

interface Props {
  isClean?: boolean;
}

export default function CleanButton({ isClean = true }: Props) {
  return isClean ? <IconClean /> : <IconDirty />;
}
