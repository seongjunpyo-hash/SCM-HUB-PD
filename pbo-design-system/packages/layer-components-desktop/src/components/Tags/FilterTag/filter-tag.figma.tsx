import figma from '@figma/code-connect/react';

import { FilterTag } from './filter-tag';

const FIGMA_COMPONENT_URL = 'https://www.figma.com/design/nm6vlOA9stZAf03Q1LvsHa/LayerDesktop?node-id=3885-8952&m=dev';

figma.connect(FilterTag, FIGMA_COMPONENT_URL, {
  props: {
    disabled: figma.enum('state', {
      disabled: true,
    }),
    label: figma.string('label'),
    size: figma.enum('size', {
      medium: 'medium',
      large: 'large',
    }),
    isSelected: figma.boolean('isSelected'),
  },
  example: (props) => (
    <FilterTag disabled={props.disabled} label={props.label} size={props.size} isSelected={props.isSelected} />
  ),
});
