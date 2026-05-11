/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';

import { TextButton } from '@musinsa/layer-components-pda';

import { Flex } from '../../../shared/components/Flex';

import { pdaIconNames } from './_icon';

import type { Meta, StoryObj } from '@storybook/react';

document.documentElement.setAttribute('data-layer-platform', 'pda');
document.documentElement.setAttribute('data-layer-theme', 'light');

const meta: Meta<typeof TextButton> = {
  title: 'Layer/components-pda/TextButton',
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
      options: ['primary', 'secondary', 'accent'],
      table: {
        defaultValue: { summary: 'accent' },
        type: { summary: 'primary | secondary | accent' },
      },
    },
    size: {
      description: 'TextButton의 크기를 나타냅니다.',
      control: { type: 'radio' },
      options: ['medium', 'small'],
      table: {
        defaultValue: { summary: 'medium' },
        type: { summary: 'medium | small' },
      },
    },
    tone: {
      description: 'TextButton의 톤을 나타냅니다. (only accent variant)',
      control: { type: 'radio' },
      options: ['default', 'onContrast'],
      table: {
        defaultValue: { summary: 'default' },
        type: { summary: 'default | onContrast' },
      },
    },
    prefixIcon: {
      description: 'TextButton의 leading 아이콘을 나타냅니다.',
      control: { type: 'select' },
      options: pdaIconNames,
      table: {
        defaultValue: { summary: 'undefined' },
        type: { summary: 'ic-* (icon name)' },
      },
    },
    suffixIcon: {
      description: 'TextButton의 trailing 아이콘을 나타냅니다.',
      control: { type: 'select' },
      options: pdaIconNames,
      table: {
        defaultValue: { summary: 'undefined' },
        type: { summary: 'ic-* (icon name)' },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof TextButton>;

export const DefaultTextButton: Story = {
  args: {
    tone: 'default',
    variant: 'accent',
    size: 'medium',
    label: 'text button',
  },
};

export const VariantProp: Story = {
  render: (args) => (
    <Flex>
      <TextButton variant="primary" label="primary" />
      <TextButton variant="secondary" label="secondary" />
      <TextButton variant="accent" label="accent" />
    </Flex>
  ),
  args: {
    tone: 'default',
    size: 'medium',
  },
};

export const SizeProp: Story = {
  render: (args) => (
    <Flex>
      <TextButton size="medium" label="medium" />
      <TextButton size="small" label="small" />
    </Flex>
  ),
  args: {},
};

/**
 *  tone prop은 variant가 primary, accent일 때만 사용할 수 있습니다.
 */
export const ToneProp: Story = {
  render: (args) => (
    <Flex>
      <TextButton tone="default" variant="primary" label="default" />
      <div style={{ backgroundColor: 'black' }}>
        <TextButton tone="onContrast" variant="primary" label="onContrast" />
      </div>
      <TextButton tone="default" variant="accent" label="default" />
      <TextButton tone="onContrast" variant="accent" label="onContrast" />
    </Flex>
  ),
};

/**
 *  커스텀 요소가 필요한 경우 label 대신 children을 사용할 수 있습니다. (children 사용시 label은 never 타입)
 */
export const UseChildren: Story = {
  render: (args) => (
    <TextButton>
      text<b>click!</b>
    </TextButton>
  ),
};

export const WithPrefixIcon: Story = {
  args: {
    tone: 'default',
    variant: 'primary',
    size: 'medium',
    label: 'search',
    prefixIcon: 'ic-search',
  },
};

export const WithSuffixIcon: Story = {
  args: {
    tone: 'default',
    variant: 'primary',
    size: 'medium',
    label: 'search',
    suffixIcon: 'ic-search',
  },
};
