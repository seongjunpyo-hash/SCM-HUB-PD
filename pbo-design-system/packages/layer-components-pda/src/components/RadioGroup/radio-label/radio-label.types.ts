import type { LabelOrChildren } from '@/shared/types/label-or-children';
import type { LabelHTMLAttributes } from 'react';

export type RadioLabelProps = LabelHTMLAttributes<HTMLLabelElement> & LabelOrChildren;
