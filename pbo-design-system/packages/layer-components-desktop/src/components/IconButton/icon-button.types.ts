import type { IconName } from '@/shared/utils/prefix-suffix-icon';
import type { ButtonHTMLAttributes } from 'react';

export type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  IconButtonType & {
    size?: 'xlarge' | 'large' | 'medium' | 'small' | 'xsmall' | '2xsmall';
    icon: IconName;
    iconFilled?: boolean;
  };

type Primary = {
  buttonType?: 'primary';
  variant?: 'filled' | 'accentFilled' | 'outlined' | 'accentOutlined' | 'ghost' | 'accentGhost';
};

type Secondary = {
  buttonType: 'secondary';
  variant?: 'filled' | 'outlined' | 'ghost';
};

type Tertiary = {
  buttonType: 'tertiary';
  variant?: 'ghost';
};

type Negative = {
  buttonType: 'negative';
  variant?: 'filled' | 'outlined' | 'ghost';
};

type IconButtonType = Primary | Secondary | Tertiary | Negative;
