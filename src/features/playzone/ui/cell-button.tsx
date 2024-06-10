import { cn } from '@/shared/lib/utils';
import { HTMLMotionProps, m } from 'framer-motion';
import { memo, useEffect, useRef } from 'react';
import { buttonVariants, hoverFocusVariant, tapVariant } from './animation-variants';

interface CountCellProps extends HTMLMotionProps<'button'> {
  // Don't know why don`t word with number | string
  // handleClick: (...args: (number | string)[]) => void;
  handleClick: (arg: any) => void;
  letter: string;
  index?: number;
  count?: number;
  isFocused?: boolean;
}

const CellButton = ({
  className,
  handleClick,
  count,
  letter,
  index,
  isFocused,
  ...props
}: CountCellProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (isFocused && buttonRef.current) {
      buttonRef.current.focus();
    }
  }, [isFocused]);
  return (
    <m.button
      className={cn('cell button relative bg-opacity-80 shadow-3d', className)}
      ref={buttonRef}
      disabled={count === 0}
      whileTap={tapVariant}
      whileHover={hoverFocusVariant}
      whileFocus={hoverFocusVariant}
      variants={buttonVariants}
      onClick={() => handleClick(index !== undefined ? index : letter)}
      {...props}
    >
      {count !== undefined ? (
        <>
          {count > 0 && letter.toUpperCase()}
          <p className="absolute bottom-2 right-2 text-lg leading-none">{count > 0 && count}</p>
        </>
      ) : (
        <>{letter.toUpperCase()}</>
      )}
    </m.button>
  );
};

export default memo(CellButton);
