/**
 *
 * Genres
 *
 */
import * as React from 'react';
import { useTranslation } from 'react-i18next';

interface Props {}

export function Genres(props: Props) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t, i18n } = useTranslation();

  return (
    <div>
      {t('')}
      {/*  {t(...messages.someThing())}  */}
    </div>
  );
}
