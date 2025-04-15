import { memo } from 'react';
import { Helmet } from 'react-helmet-async';

interface Props {
  title?: string;
  name?: string;
  content?: string;
}

export const HelmetPage = memo(({ title, name, content }: Props) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name={name} content={content} />
    </Helmet>
  );
});
