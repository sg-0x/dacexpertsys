/**
 * Shared Framer Motion animation variants used across pages.
 * Simple, minimal — nothing distracting.
 */

/** Whole-page fade + slight upward drift on enter, fade + drift down on exit */
export const pageVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] },
    },
    exit: {
        opacity: 0,
        y: -10,
        transition: { duration: 0.22, ease: [0.4, 0, 1, 1] },
    },
};

/** Staggered container — staggers direct children */
export const listVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.07, delayChildren: 0.1 },
    },
};

/** Individual staggered item — fades up */
export const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
    },
};

/** Card hover — subtle lift */
export const cardHover = {
    rest: { y: 0, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' },
    hover: { y: -3, boxShadow: '0 8px 20px rgba(0,0,0,0.10)', transition: { duration: 0.22 } },
};
