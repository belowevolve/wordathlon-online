import { cn } from "@/shared/lib/utils";
import { HTMLMotionProps, m } from "framer-motion";
import { memo, useEffect, useRef } from "react";
import {
  buttonVariants,
  hoverFocusVariant,
  tapVariant,
} from "./animation-variants";

interface CountCellProps extends HTMLMotionProps<"button"> {
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
      className={cn(
        "cell button bg-cell/80 relative shadow-3d outline-none focus-visible:border focus-visible:border-black",
        {
          "pointer-events-none bg-transparent": count === 0,
        },
        className,
      )}
      ref={buttonRef}
      whileTap={tapVariant}
      whileHover={hoverFocusVariant}
      whileFocus={
        count === undefined || count > 0 ? hoverFocusVariant : undefined
      }
      variants={buttonVariants}
      onClick={() => handleClick(index !== undefined ? index : letter)}
      {...props}
    >
      {count !== undefined ? (
        <>
          {count > 0 && letter.toUpperCase()}
          <span className="absolute bottom-2 right-2 text-lg leading-none">
            {count > 0 && count}
          </span>
        </>
      ) : (
        <>{letter.toUpperCase()}</>
      )}
    </m.button>
  );
};

export default memo(CellButton);
