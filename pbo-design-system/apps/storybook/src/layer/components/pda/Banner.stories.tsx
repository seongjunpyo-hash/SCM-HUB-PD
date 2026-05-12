import React from 'react';

import { AlertBanner } from '@musinsa/layer-components-pda';

import { Column } from '../../../shared/components/Flex';

import type { Meta, StoryObj } from '@storybook/react';
import type { PropsWithChildren } from 'react';

document.documentElement.setAttribute('data-layer-platform', 'pda');
document.documentElement.setAttribute('data-layer-theme', 'light');

const meta: Meta<typeof AlertBanner> = {
  title: 'Layer/components-pda/Banner',
  component: AlertBanner,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    text: {
      description: 'Banner의 텍스트를 나타냅니다.',
      table: {
        type: { summary: 'string' },
      },
    },
    children: {
      description: 'Banner의 자식 요소를 나타냅니다.',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    size: {
      description: 'Banner의 크기를 나타냅니다.',
      control: { type: 'radio' },
      options: ['small', 'medium'],
      table: {
        defaultValue: { summary: 'medium' },
        type: { summary: 'small | medium' },
      },
    },
    validationState: {
      description: 'Banner의 유효성 상태를 나타냅니다.',
      control: { type: 'radio' },
      options: ['warning', 'critical', 'success', 'accent'],
      table: {
        defaultValue: { summary: 'warning' },
        type: { summary: 'warning | critical | success | accent' },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof AlertBanner>;

const Wrap = ({ children }: PropsWithChildren) => <div style={{ width: 400 }}>{children}</div>;
Wrap.displayName = 'Wrap';

export const Default: Story = {
  render: (args) => (
    <Wrap>
      <AlertBanner {...args} />
    </Wrap>
  ),
  args: {
    text: 'Banner text',
    size: 'medium',
    validationState: 'warning',
  },
};

export const ValidationStateProp: Story = {
  render: (args) => (
    <Column width="400px">
      <AlertBanner {...args} validationState="warning" />
      <AlertBanner {...args} validationState="critical" />
      <AlertBanner {...args} validationState="success" />
      <AlertBanner {...args} validationState="accent" />
    </Column>
  ),
  args: {
    text: 'Banner text',
    size: 'medium',
  },
};

export const SizeProp: Story = {
  render: (args) => (
    <Column width="400px">
      <AlertBanner {...args} size="small" />
      <AlertBanner {...args} size="medium" />
    </Column>
  ),
  args: {
    text: 'Banner text',
    validationState: 'warning',
  },
};
