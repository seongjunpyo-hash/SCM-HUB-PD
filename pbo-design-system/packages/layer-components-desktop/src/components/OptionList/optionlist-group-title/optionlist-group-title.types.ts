import type { HTMLAttributes, ReactNode } from 'react';

export type OptionListGroupTitleProps = HTMLAttributes<HTMLSpanElement> & TitleOrChildren;

type WithTitle = {
  title: string;
  children?: never;
};

type WithChildren = {
  title?: never;
  children: ReactNode;
};

type TitleOrChildren = WithTitle | WithChildren;
