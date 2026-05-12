/* eslint-disable @typescript-eslint/no-unused-vars */

import React from 'react';

import { NegativeButton } from '@musinsa/layer-components-desktop';

import { Flex } from '../../../../shared/components/Flex';
import { desktopIconNames } from '../_icon';

import type { Meta, StoryObj } from '@storybook/react';

document.documentElement.setAttribute('data-layer-platform', 'desktop');
document.documentElement.setAttribute('data-layer-theme', 'light');

const meta: Meta<typeof NegativeButton> = {
  title: 'Layer/components-desktop/Button/NegativeButton',
  component: NegativeButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      description: 'NegativeButton의 자식 요소를 나타냅니다.',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    label: {
      description: 'NegativeButton의 라벨을 나타냅니다. (children과 동시에 사용할 수 없습니다.)',
      control: { type: 'text' },
      table: {
        type: { summary: 'string | never' },
      },
    },
    variant: {
      description: 'NegativeButton의 타입을 나타냅니다.',
      control: { type: 'radio' },
      options: ['filled', 'outlined', 'ghost'],
      table: {
        defaultValue: { summary: 'filled' },
        type: { summary: 'filled | outlined | ghost' },
      },
    },
    size: {
      description: 'NegativeButton의 크기를 나타냅니다.',
      control: { type: 'radio' },
      options: ['xlarge', 'large', 'medium', 'small', 'xsmall'],
      table: {
        defaultValue: { summary: 'xlarge' },
        type: { summary: 'xlarge | large | medium | small | xsmall' },
      },
    },
    disabled: {
      description: 'NegativeButton의 비활성화 상태를 나타냅니다.',
      control: { type: 'boolean' },
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    widthMode: {
      description: 'NegativeButton의 너비 모드를 나타냅니다.',
      control: { type: 'radio' },
      options: ['default', 'compact'],
      table: {
        defaultValue: { summary: 'default' },
        type: { summary: 'default | compact' },
      },
    },
    isLoading: {
      description: 'NegativeButton의 로딩 상태를 나타냅니다.',
      control: { type: 'boolean' },
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    prefixIcon: {
      description: 'NegativeButton의 prefix 아이콘을 나타냅니다.',
      control: { type: 'select' },
      options: desktopIconNames,
      table: {
        defaultValue: { summary: 'undefined' },
        type: { summary: 'ic-* (icon name)' },
      },
    },
    suffixIcon: {
      description: 'NegativeButton의 suffix 아이콘을 나타냅니다.',
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

type Story = StoryObj<typeof NegativeButton>;

export const Default: Story = {
  render: (args) => <NegativeButton {...args} />,
  args: {
    variant: 'filled',
    size: 'xlarge',
    widthMode: 'default',
    label: 'NegativeButton',
    isLoading: false,
    prefixIcon: undefined,
    suffixIcon: undefined,
    children: undefined,
    disabled: false,
  },
};

export const VariantProp: Story = {
  render: (args) => (
    <Flex>
      <NegativeButton variant="filled" label="Filled" />
      <NegativeButton variant="outlined" label="Outlined" />
      <NegativeButton variant="ghost" label="Ghost" />
    </Flex>
  ),
};

export const SizeProp: Story = {
  render: (args) => (
    <Flex>
      <NegativeButton size="xlarge" label="XLarge" />
      <NegativeButton size="large" label="Large" />
      <NegativeButton size="medium" label="Medium" />
      <NegativeButton size="small" label="Small" />
      <NegativeButton size="xsmall" label="XSmall" />
    </Flex>
  ),
  args: {},
};

export const DisabledProp: Story = {
  render: (args) => (
    <Flex>
      <NegativeButton variant="filled" disabled label="Filled" />
      <NegativeButton variant="outlined" disabled label="Outlined" />
      <NegativeButton variant="ghost" disabled label="Ghost" />
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
      <Flex>
        <NegativeButton>
          Negative<b>Click!</b>
        </NegativeButton>
      </Flex>
    );
  },
  args: {},
};

export const WidthModeProp: Story = {
  render: (args) => (
    <Flex>
      <NegativeButton widthMode="default" label="Default WidthMode" />
      <NegativeButton widthMode="compact" label="Compact WidthMode" />
    </Flex>
  ),
  args: {},
};

export const IsLoadingProp: Story = {
  render: (args) => (
    <Flex>
      <NegativeButton isLoading label="IsLoading" />
    </Flex>
  ),
  args: {},
};

export const WithPrefixIcon: Story = {
  render: (args) => (
    <Flex>
      <NegativeButton prefixIcon="ic-search" label="Button" />
    </Flex>
  ),
  args: {},
};

export const WithSuffixIcon: Story = {
  render: (args) => (
    <Flex>
      <NegativeButton suffixIcon="ic-search" label="Button" />
    </Flex>
  ),
  args: {},
};
