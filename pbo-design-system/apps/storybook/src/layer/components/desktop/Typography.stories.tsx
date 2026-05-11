import React from 'react';

import { Typography } from '@musinsa/layer-components-desktop';
import { colorTokenMap, typography } from '@musinsa/layer-tokens/desktop';

import type { Meta, StoryObj } from '@storybook/react';

document.documentElement.setAttribute('data-layer-platform', 'desktop');
document.documentElement.setAttribute('data-layer-theme', 'light');

const baseNames = Object.keys(typography.base).map((key) => `base-${key}`);
const helperTextNames = Object.keys(typography.helperText).map((key) => `helper-text-${key}`);

const meta: Meta<typeof Typography> = {
  title: 'Layer/components-desktop/Typography',
  component: Typography,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      description: 'Typography의 자식 요소를 나타냅니다.',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    name: {
      description: 'Typography에 적용할 수 있는 name을 나타냅니다',
      control: { type: 'select' },
      options: [...baseNames, ...helperTextNames],
      table: {
        defaultValue: { summary: 'base-text-m' },
      },
    },
    colorToken: {
      description: 'Typography에 적용할 수 있는 colorToken을 나타냅니다.',
      control: { type: 'select' },
      options: Object.keys(colorTokenMap),
      table: {
        defaultValue: { summary: 'fg' },
      },
    },
  },
  args: {
    children: 'TEAM MUSINSA01',
    name: 'base-text-m',
    colorToken: 'fg',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/** Pretendard 서체를 사용하는 Typography입니다. */
export const Base: Story = {
  args: {
    name: 'base-title-xl-semibold',
  },
};

/** HelperText에 사용되는 Typography입니다. (Pretendard 서체) */
export const HelperText: Story = {
  args: {
    name: 'helper-text-m',
  },
};

/**
 *  Polymorphic Component를 제공하여 as prop을 통해 다른 html tag로 변경할 수 있습니다.
 */
export const UsePolymorphic: Story = {
  render: (args) => <Typography as="h1" {...args} />,
  args: {
    name: 'base-title-xl-semibold',
  },
};
