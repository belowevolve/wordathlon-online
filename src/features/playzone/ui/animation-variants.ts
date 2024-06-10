export const containerVariants = {
  initial: { opacity: 0 },
  animate: (i: number) => ({
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: i,
    },
  }),
};

export const cellVariants = {
  initial: {
    scale: 0,
  },
  animate: {
    scale: 1,
  },
};

export const buttonVariants = {
  initial: {
    scale: 0,
  },
  animate: {
    scale: 1,
    boxShadow: "inset 1px -1px 5px rgba(0, 0, 0, 0.25)",
  },
};

export const hoverFocusVariant = {
  scale: 1.05,
  opacity: 1,
  boxShadow: "inset 0px 0px 5px rgba(0, 0, 0, 0.25)",
};

export const tapVariant = {
  scale: 0.95,
  boxShadow: "inset 2px -2px 10px rgba(0, 0, 0, 0.25)",
};
