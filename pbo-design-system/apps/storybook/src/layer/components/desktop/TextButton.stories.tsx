/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';

import { TextButton } from '@musinsa/layer-components-desktop';

import { Flex } from '../../../shared/components/Flex';

import { desktopIconNames } from './_icon';

import type { Meta, StoryObj } from '@storybook/react';

document.documentElement.setAttribute('data-layer-platform', 'desktop');
document.documentElement.setAttribute('data-layer-theme', 'light');

const meta: Meta<typeof TextButton> = {
  title: 'Layer/components-desktop/TextButton',
  component: TextButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      description: 'TextButton의 자식 요소를 나타냅니다.',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    label: {
      description: 'TextButton의 라벨을 나타냅니다. (children과 동시에 사용할 수 없습니다.)',
      control: { type: 'text' },
      table: {
        type: { summary: 'string | never' },
      },
    },
    variant: {
      description: 'TextButton의 타입을 나타냅니다.',
      control: { type: 'radio' },
      options: ['primary', 'secondary', 'negative', 'accent'],
      table: {
        defaultValue: { summary: 'primary' },
        type: { summary: 'primary | secondary | negative | accent' },
      },
    },
    tone: {
      description: 'TextButton의 톤을 나타냅니다.',
      control: { type: 'radio' },
      options: ['default', 'onContrast'],
      table: {
        defaultValue: { summary: 'default' },
        type: { summary: 'default | onContrast' },
      },
    },
    size: {
      description: 'TextButton의 크기를 나타냅니다.',
      control: { type: 'radio' },
      options: ['xlarge', 'large', 'medium', 'small'],
      table: {
        defaultValue: { summary: 'xlarge' },
        type: { summary: 'xlarge | large | medium | small' },
      },
    },
    isUnderline: {
      description: 'TextButton의 밑줄 여부를 나타냅니다.',
      control: { type: 'boolean' },
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    prefixIcon: {
      description: 'TextButton의 leading 아이콘을 나타냅니다.',
      control: { type: 'select' },
      options: desktopIconNames,
      table: {
        defaultValue: { summary: 'undefined' },
        type: { summary: 'ic-* (icon name)' },
      },
    },
    suffixIcon: {
      description: 'TextButton의 trailing 아이콘을 나타냅니다.',
      control: { type: 'select' },
      options: desktopIconNames,
      table: {
        defaultValue: { summary: 'undefined' },
        type: { summary: 'ic-* (icon name)' },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof TextButton>;

export const Default: Story = {
  render: (args) => <TextButton {...args} />,
  args: {
    variant: 'primary',
    tone: 'default',
    size: 'xlarge',
    isUnderline: false,
    label: 'TextButton',
    children: undefined,
    prefixIcon: undefined,
    suffixIcon: undefined,
  },
};

export const VariantProp: Story = {
  render: (args) => (
    <Flex>
      <TextButton label="primary" variant="primary" />
      <TextButton label="secondary" variant="secondary" />
      <TextButton label="negative" variant="negative" />
      <TextButton label="accent" variant="accent" />
    </Flex>
  ),
  args: {},
};

export const SizeProp: Story = {
  render: (args) => (
    <Flex>
      <TextButton label="xlarge" size="xlarge" />
      <TextButton label="large" size="large" />
      <TextButton label="medium" size="medium" />
      <TextButton label="small" size="small" />
    </Flex>
  ),
  args: {},
};

/**
 *  커스텀 요소가 필요한 경우 label 대신 children을 사용할 수 있습니다. (children 사용시 label은 never 타입)
 */
export const UseChildren: Story = {
  render: (args) => {
    return (
      <TextButton>
        TextButton<b>Click!</b>
      </TextButton>
    );
  },
  args: {},
};

/** `accent` variant에서만 사용가능합니다. */
export const ToneProp: Story = {
  render: (args) => (
    <Flex>
      <TextButton label="default" variant="accent" tone="default" />
      <TextButton label="onContrast" variant="accent" tone="onContrast" />
    </Flex>
  ),
  args: {},
};

export const IsunderlineProp: Story = {
  render: (args) => (
    <Flex>
      <TextButton label="underLine" isUnderline />
      <TextButton label="noUnderLine" />
    </Flex>
  ),
  args: {},
};

export const disabledProp: Story = {
  render: (args) => (
    <Flex>
      <TextButton disabled label="primary" variant="primary" />
      <TextButton disabled label="secondary" variant="secondary" />
      <TextButton disabled label="negative" variant="negative" />
      <TextButton disabled label="accent" variant="accent" />
    </Flex>
  ),
  args: {
    disabled: true,
  },
};
