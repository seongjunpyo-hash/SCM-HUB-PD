import React from 'react';

import { Loading } from '@musinsa/layer-components-pda';

import type { Meta, StoryObj } from '@storybook/react';

document.documentElement.setAttribute('data-layer-platform', 'pda');
document.documentElement.setAttribute('data-layer-theme', 'light');

const meta: Meta<typeof Loading> = {
  title: 'Layer/components-pda/Loading',
  component: Loading,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      description: 'Loading의 크기를 나타냅니다.',
      control: { type: 'radio' },
      options: ['medium', 'small'],
      table: {
        defaultValue: { summary: 'medium' },
        type: { summary: 'medium | small' },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Loading>;

export const Default: Story = {
  render: (args) => <Loading {...args} />,
  args: {
    size: 'medium',
  },
};
