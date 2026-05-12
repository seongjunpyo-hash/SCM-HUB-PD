export const mergeClassNames = (...classNames: (string | undefined | null | false)[]): string => {
  return classNames.filter(Boolean).join(' ');
};
