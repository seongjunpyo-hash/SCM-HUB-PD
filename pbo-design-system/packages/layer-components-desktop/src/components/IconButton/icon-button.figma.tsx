// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import figma from '@figma/code-connect/react';

import { IconButton } from './icon-button';

import type { IconName } from '@/shared/utils/prefix-suffix-icon';

const FIGMA_COMPONENT_URL = 'https://www.figma.com/design/nm6vlOA9stZAf03Q1LvsHa/LayerDesktop?node-id=117-4913&m=dev';

figma.connect(IconButton, FIGMA_COMPONENT_URL, {
  props: {
    buttonType: figma.enum('type', {
      primary: 'primary',
      secondary: 'secondary',
      tertiary: 'tertiary',
      negative: 'negative',
    }),
    variant: figma.enum('variant', {
      filled: 'filled',
      accentFilled: 'accentFilled',
      outlined: 'outlined',
      accentOutlined: 'accentOutlined',
      ghost: 'ghost',
      accentGhost: 'accentGhost',
    }),
    size: figma.enum('size', {
      xlarge: 'xlarge',
      large: 'large',
      medium: 'medium',
      small: 'small',
      xsmall: 'xsmall',
      '2xsmall': '2xsmall',
    }),
    disabled: figma.enum('state', {
      disabled: true,
    }),
    icon: figma.instance<IconName>('icon'),
  },
  example: ({ buttonType, variant, size, disabled, icon }) => {
    return <IconButton buttonType={buttonType} variant={variant} size={size} disabled={disabled} icon={icon} />;
  },
});
