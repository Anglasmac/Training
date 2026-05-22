import type { ReactNode } from 'react';

const Panel = ({
  children,
  title,
}: {
  children: ReactNode;
  title?: string;
}) => (
  <article className='panel-card'>
    {title && (
      <div className='panel-heading'>
        <span>{title}</span>
      </div>
    )}
    <div>{children}</div>
  </article>
);

export default Panel;
