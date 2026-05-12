import React from 'react';

import { Divider } from '@musinsa/layer-components-pda';

import { Column } from '../../../shared/components/Flex';

import type { Meta, StoryObj } from '@storybook/react';
import type { PropsWithChildren } from 'react';

document.documentElement.setAttribute('data-layer-platform', 'pda');
document.documentElement.setAttribute('data-layer-theme', 'light');

const meta: Meta<typeof Divider> = {
  title: 'Layer/components-pda/Divider',
  component: Divider,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      description: 'Divider의 타입을 나타냅니다.',
      control: { type: 'radio' },
      options: ['default', 'section'],
      table: {
        defaultValue: { summary: 'default' },
        type: { summary: 'default | section' },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Divider>;

const Wrap = ({ children }: PropsWithChildren) => (
  <div style={{ width: 300, display: 'flex', flexDirection: 'column', gap: 12 }}>{children}</div>
);
Wrap.displayName = 'Wrap';

export const Default: Story = {
  render: (args) => (
    <Wrap>
      <Divider {...args} />
    </Wrap>
  ),
  args: {
    type: 'default',
  },
};

export const TypeProp: Story = {
  render: (args) => (
    <Column width="300px">
      <Divider type="default" {...args} />
      <Divider type="section" {...args} />
    </Column>
  ),
};
