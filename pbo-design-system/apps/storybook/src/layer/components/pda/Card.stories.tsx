import React from 'react';

import { Card } from '@musinsa/layer-components-pda';

import { Column } from '../../../shared/components/Flex';

import type { Meta, StoryObj } from '@storybook/react';
import type { PropsWithChildren } from 'react';

document.documentElement.setAttribute('data-layer-platform', 'pda');
document.documentElement.setAttribute('data-layer-theme', 'light');

const meta: Meta<typeof Card> = {
  title: 'Layer/components-pda/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      description: 'Card의 label를 나타냅니다.',
      table: {
        type: { summary: 'string' },
      },
    },
    value: {
      description: 'Card의 value를 나타냅니다.',
      table: {
        type: { summary: 'string | number' },
      },
    },
    validationState: {
      description: 'Card의 유효성 상태를 나타냅니다.',
      control: { type: 'radio' },
      options: ['default', 'error', 'accent'],
      table: {
        defaultValue: { summary: 'default' },
        type: { summary: 'default | error | accent' },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Card>;

const Wrap = ({ children }: PropsWithChildren) => <div style={{ width: 200 }}>{children}</div>;
Wrap.displayName = 'Wrap';

export const Default: Story = {
  render: (args) => (
    <Wrap>
      <Card {...args} />
    </Wrap>
  ),
  args: {
    label: 'Label',
    value: '0',
    validationState: 'default',
  },
};

export const ValidationStateProp: Story = {
  render: (args) => (
    <Column width="200px">
      <Card {...args} validationState="default" />
      <Card {...args} validationState="error" />
      <Card {...args} validationState="accent" />
    </Column>
  ),
  args: {
    label: 'Label',
    value: '0',
  },
};
