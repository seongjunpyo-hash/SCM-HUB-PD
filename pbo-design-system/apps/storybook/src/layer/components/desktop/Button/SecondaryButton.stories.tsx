/* eslint-disable @typescript-eslint/no-unused-vars */

import React from 'react';

import { SecondaryButton } from '@musinsa/layer-components-desktop';

import { Flex } from '../../../../shared/components/Flex';
import { desktopIconNames } from '../_icon';

import type { Meta, StoryObj } from '@storybook/react';

document.documentElement.setAttribute('data-layer-platform', 'desktop');
document.documentElement.setAttribute('data-layer-theme', 'light');

const meta: Meta<typeof SecondaryButton> = {
  title: 'Layer/components-desktop/Button/SecondaryButton',
  component: SecondaryButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      description: 'SecondaryButton의 자식 요소를 나타냅니다.',
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
      description: 'SecondaryButton의 타입을 나타냅니다.',
      control: { type: 'radio' },
      options: ['filled', 'outlined', 'ghost'],
      table: {
        defaultValue: { summary: 'filled' },
        type: { summary: 'filled | outlined | ghost' },
      },
    },
    size: {
      description: 'SecondaryButton의 크기를 나타냅니다.',
      control: { type: 'radio' },
      options: ['xlarge', 'large', 'medium', 'small', 'xsmall'],
      table: {
        defaultValue: { summary: 'xlarge' },
        type: { summary: 'xlarge | large | medium | small | xsmall' },
      },
    },
    disabled: {
      description: 'SecondaryButton의 비활성화 상태를 나타냅니다.',
      control: { type: 'boolean' },
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    widthMode: {
      description: 'SecondaryButton의 너비 모드를 나타냅니다.',
      control: { type: 'radio' },
      options: ['default', 'compact'],
      table: {
        defaultValue: { summary: 'default' },
        type: { summary: 'default | compact' },
      },
    },
    isLoading: {
      description: 'SecondaryButton의 로딩 상태를 나타냅니다.',
      control: { type: 'boolean' },
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    prefixIcon: {
      description: 'SecondaryButton의 leading 아이콘을 나타냅니다.',
      control: { type: 'select' },
      options: desktopIconNames,
      table: {
        defaultValue: { summary: 'undefined' },
        type: { summary: 'ic-* (icon name)' },
      },
    },
    suffixIcon: {
      description: 'SecondaryButton의 trailing 아이콘을 나타냅니다.',
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

type Story = StoryObj<typeof SecondaryButton>;

export const Default: Story = {
  render: (args) => <SecondaryButton {...args} />,
  args: {
    variant: 'filled',
    size: 'xlarge',
    label: 'SecondaryButton',
    widthMode: 'default',
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
      <SecondaryButton variant="filled" label="Filled" />
      <SecondaryButton variant="outlined" label="Outlined" />
      <SecondaryButton variant="ghost" label="Ghost" />
    </Flex>
  ),
  args: {},
};

export const SizeProp: Story = {
  render: (args) => (
    <Flex>
      <SecondaryButton size="xlarge" label="XLarge" />
      <SecondaryButton size="large" label="Large" />
      <SecondaryButton size="medium" label="Medium" />
      <SecondaryButton size="small" label="Small" />
      <SecondaryButton size="xsmall" label="XSmall" />
    </Flex>
  ),
  args: {},
};

export const DisabledProp: Story = {
  render: (args) => (
    <Flex>
      <SecondaryButton variant="filled" disabled label="Filled" />
      <SecondaryButton variant="outlined" disabled label="Outlined" />
      <SecondaryButton variant="ghost" disabled label="Ghost" />
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
        <SecondaryButton>
          Secondary<b>Click!</b>
        </SecondaryButton>
      </Flex>
    );
  },
  args: {},
};

export const WidthModeProp: Story = {
  render: (args) => (
    <Flex>
      <SecondaryButton widthMode="default" label="Default WidthMode" />
      <SecondaryButton widthMode="compact" label="Compact WidthMode" />
    </Flex>
  ),
  args: {},
};

export const IsLoadingProp: Story = {
  render: (args) => (
    <Flex>
      <SecondaryButton isLoading label="IsLoading" />
    </Flex>
  ),
  args: {},
};

export const WithPrefixIcon: Story = {
  render: (args) => (
    <Flex>
      <SecondaryButton prefixIcon="ic-search" label="Button" />
    </Flex>
  ),
  args: {},
};

export const WithSuffixIcon: Story = {
  render: (args) => (
    <Flex>
      <SecondaryButton suffixIcon="ic-search" label="Button" />
    </Flex>
  ),
  args: {},
};
