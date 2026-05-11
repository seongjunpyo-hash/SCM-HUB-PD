import figma from '@figma/code-connect/react';

import { RemovableTag } from './removable-tag';

const FIGMA_COMPONENT_URL = 'https://www.figma.com/design/nm6vlOA9stZAf03Q1LvsHa/LayerDesktop?node-id=3885-9895&m=dev';

figma.connect(RemovableTag, FIGMA_COMPONENT_URL, {
  props: {
    label: figma.string('label'),
    variant: figma.enum('variant', {
      filled: 'filled',
      outlined: 'outlined',
    }),
    size: figma.enum('size', {
      large: 'large',
      small: 'small',
    }),
    disabled: figma.enum('state', {
      disabled: true,
    }),
  },
  example: (props) => (
    <RemovableTag label={props.label} variant={props.variant} size={props.size} disabled={props.disabled} />
  ),
});
