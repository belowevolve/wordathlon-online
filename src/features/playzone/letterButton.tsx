import { memo, useEffect, useRef } from "react";
import { cn } from "@/shared/lib/utils";
import { HTMLMotionProps, motion, stagger } from "framer-motion";

export interface LetterButtonProps extends HTMLMotionProps<"button"> {
  isFocused?: boolean;
}

const buttonVariants = {
  initial: {
    scale: 0,
  },
  animate: {
    scale: 1,
    boxShadow: "inset 1px -1px 5px rgba(0, 0, 0, 0.25)",
  },
};

const hoverFocusVariant = {
  scale: 1.05,
  opacity: 1,

  boxShadow: "inset 0px 0px 5px rgba(0, 0, 0, 0.25)",
};
const LetterButton = memo<LetterButtonProps>(
  ({ className, isFocused, ...props }) => {
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
      if (isFocused && buttonRef.current) {
        buttonRef.current.focus();
      }
    }, [isFocused]);

    return (
      <motion.button
        className={cn(
          "button relative grid size-24 place-items-center rounded-md bg-white bg-opacity-80 text-5xl font-medium",
          className,
        )}
        ref={buttonRef}
        whileTap={{
          scale: 0.95,
          boxShadow: "inset 2px -2px 10px rgba(0, 0, 0, 0.25)",
        }}
        whileHover={hoverFocusVariant}
        whileFocus={hoverFocusVariant}
        variants={buttonVariants}
        {...props}
      />
    );
  },
);

LetterButton.displayName = "LetterButton";

export default LetterButton;
