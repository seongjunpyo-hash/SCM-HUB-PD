import figma from '@figma/code-connect';

import { Button } from './button';

import type { IconName } from '@/shared/utils/prefix-suffix-icon';

figma.connect(Button, 'https://www.figma.com/design/azBO7iFMFUXArom84hBXIm/LayerPDA?node-id=2170%3A5172', {
  props: {
    disabled: figma.enum('state', {
      disabled: true,
    }),
    label: figma.string('label'),
    size: figma.enum('size', {
      xlarge: 'xlarge',
      large: 'large',
      medium: 'medium',
      small: 'small',
    }),
    isLoading: figma.boolean('isLoading'),
    prefixIcon: figma.boolean('🎨 prefix', {
      true: figma.instance<IconName>('↪ prefixIcon'),
      false: undefined,
    }),
    suffixIcon: figma.boolean('🎨 suffix', {
      true: figma.instance<IconName>('↪ suffixIcon'),
      false: undefined,
    }),
  },
  example: (props) => (
    <Button
      variant="negative"
      disabled={props.disabled}
      label={props.label}
      size={props.size}
      isLoading={props.isLoading}
      prefixIcon={props.prefixIcon}
      suffixIcon={props.suffixIcon}
    />
  ),
});

figma.connect(Button, 'https://www.figma.com/design/azBO7iFMFUXArom84hBXIm/LayerPDA?node-id=2170%3A3975', {
  props: {
    disabled: figma.enum('state', {
      disabled: true,
    }),
    label: figma.string('label'),
    size: figma.enum('size', {
      xlarge: 'xlarge',
      large: 'large',
      medium: 'medium',
      small: 'small',
    }),
    isLoading: figma.boolean('isLoading'),
    prefixIcon: figma.boolean('🎨 prefix', {
      true: figma.instance<IconName>('↪ prefixIcon'),
      false: undefined,
    }),
    suffixIcon: figma.boolean('🎨 suffix', {
      true: figma.instance<IconName>('↪ suffixIcon'),
      false: undefined,
    }),
  },
  example: (props) => (
    <Button
      variant="primary"
      disabled={props.disabled}
      label={props.label}
      size={props.size}
      isLoading={props.isLoading}
      prefixIcon={props.prefixIcon}
      suffixIcon={props.suffixIcon}
    />
  ),
});

figma.connect(Button, 'https://www.figma.com/design/azBO7iFMFUXArom84hBXIm/LayerPDA?node-id=2170%3A4533', {
  props: {
    disabled: figma.enum('state', {
      disabled: true,
    }),
    label: figma.string('label'),
    size: figma.enum('size', {
      xlarge: 'xlarge',
      large: 'large',
      medium: 'medium',
      small: 'small',
    }),
    isLoading: figma.boolean('isLoading'),
    prefixIcon: figma.boolean('🎨 prefix', {
      true: figma.instance<IconName>('↪ prefixIcon'),
      false: undefined,
    }),
    suffixIcon: figma.boolean('🎨 suffix', {
      true: figma.instance<IconName>('↪ suffixIcon'),
      false: undefined,
    }),
  },
  example: (props) => (
    <Button
      variant="secondary"
      disabled={props.disabled}
      label={props.label}
      size={props.size}
      isLoading={props.isLoading}
      prefixIcon={props.prefixIcon}
      suffixIcon={props.suffixIcon}
    />
  ),
});

figma.connect(Button, 'https://www.figma.com/design/azBO7iFMFUXArom84hBXIm/LayerPDA?node-id=2170%3A4919', {
  props: {
    disabled: figma.enum('state', {
      disabled: true,
    }),
    label: figma.string('label'),
    size: figma.enum('size', {
      xlarge: 'xlarge',
      large: 'large',
      medium: 'medium',
      small: 'small',
    }),
    isLoading: figma.boolean('isLoading'),
    prefixIcon: figma.boolean('🎨 prefix', {
      true: figma.instance<IconName>('↪ prefixIcon'),
      false: undefined,
    }),
    suffixIcon: figma.boolean('🎨 suffix', {
      true: figma.instance<IconName>('↪ suffixIcon'),
      false: undefined,
    }),
  },
  example: (props) => (
    <Button
      variant="tertiary"
      disabled={props.disabled}
      label={props.label}
      size={props.size}
      isLoading={props.isLoading}
      prefixIcon={props.prefixIcon}
      suffixIcon={props.suffixIcon}
    />
  ),
});
