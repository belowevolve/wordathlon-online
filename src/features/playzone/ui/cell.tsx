import React, { memo } from 'react';
import { cellVariants } from './animation-variants';
import { HTMLMotionProps, m } from 'framer-motion';
import { cn } from '@/shared/lib/utils';

interface Props extends HTMLMotionProps<'div'> {
  revealed?: boolean;
  letter?: string;
}

const Cell = ({ className, revealed, letter }: Props) => {
  return (
    <m.div className={cn('cell', className)} variants={cellVariants}>
      {(revealed || revealed === undefined) && (
        <m.span variants={cellVariants}>{letter?.toUpperCase()}</m.span>
      )}
    </m.div>
  );
};

export default memo(Cell);
