import React from 'react';

import { Accordion } from '@musinsa/layer-components-pda';

import type { Meta, StoryObj } from '@storybook/react';
import type { PropsWithChildren } from 'react';

document.documentElement.setAttribute('data-layer-platform', 'pda');
document.documentElement.setAttribute('data-layer-theme', 'light');

const meta: Meta<typeof Accordion> = {
  title: 'Layer/components-pda/Accordion',
  component: Accordion,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    open: {
      description: 'Accordion의 열림 상태를 나타냅니다.',
      control: { type: 'boolean' },
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    label: {
      description: 'Accordion의 라벨을 나타냅니다.',
      control: { type: 'text' },
    },
    count: {
      description: 'Accordion의 카운트를 나타냅니다.',
      control: { type: 'number' },
    },
    disabled: {
      description: 'Accordion의 비활성화 상태를 나타냅니다.',
      control: { type: 'boolean' },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Accordion>;

const Wrap = ({ children }: PropsWithChildren) => (
  <div style={{ width: '300px', display: 'flex', flexDirection: 'column' }}>{children}</div>
);

Wrap.displayName = 'Wrap';

export const Default: Story = {
  render: (args) => (
    <Wrap>
      <Accordion {...args} />
    </Wrap>
  ),
  args: {
    open: false,
    label: 'Accordion',
    count: 1,
    disabled: false,
  },
};
