/* eslint-disable @typescript-eslint/no-unused-vars */

import React from 'react';

import { PrimaryButton } from '@musinsa/layer-components-desktop';

import { Flex } from '../../../../shared/components/Flex';
import { desktopIconNames } from '../_icon';

import type { Meta, StoryObj } from '@storybook/react';

document.documentElement.setAttribute('data-layer-platform', 'desktop');
document.documentElement.setAttribute('data-layer-theme', 'light');

const meta: Meta<typeof PrimaryButton> = {
  title: 'Layer/components-desktop/Button/PrimaryButton',
  component: PrimaryButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      description: 'PrimaryButton의 자식 요소를 나타냅니다.',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    label: {
      description: 'PrimaryButton의 라벨을 나타냅니다. (children과 동시에 사용할 수 없습니다.)',
      control: { type: 'text' },
      table: {
        type: { summary: 'string | never' },
      },
    },
    variant: {
      description: 'PrimaryButton의 타입을 나타냅니다.',
      control: { type: 'radio' },
      options: ['filled', 'accentFilled', 'outlined', 'accentOutlined', 'ghost', 'accentGhost'],
      table: {
        defaultValue: { summary: 'filled' },
        type: { summary: 'filled | accentFilled | outlined | accentOutlined | ghost | accentGhost' },
      },
    },
    size: {
      description: 'PrimaryButton의 크기를 나타냅니다.',
      control: { type: 'radio' },
      options: ['xlarge', 'large', 'medium', 'small', 'xsmall'],
      table: {
        defaultValue: { summary: 'xlarge' },
        type: { summary: 'xlarge | large | medium | small | xsmall' },
      },
    },
    widthMode: {
      description: 'PrimaryButton의 너비 모드를 나타냅니다.',
      control: { type: 'radio' },
      options: ['default', 'compact'],
      table: {
        defaultValue: { summary: 'default' },
        type: { summary: 'default | compact' },
      },
    },
    disabled: {
      description: 'PrimaryButton의 비활성화 상태를 나타냅니다.',
      control: { type: 'boolean' },
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    isLoading: {
      description: 'PrimaryButton의 로딩 상태를 나타냅니다.',
      control: { type: 'boolean' },
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    prefixIcon: {
      description: 'PrimaryButton의 leading 아이콘을 나타냅니다.',
      control: { type: 'select' },
      options: desktopIconNames,
      table: {
        defaultValue: { summary: 'undefined' },
        type: { summary: 'ic-* (icon name)' },
      },
    },
    suffixIcon: {
      description: 'PrimaryButton의 trailing 아이콘을 나타냅니다.',
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

type Story = StoryObj<typeof PrimaryButton>;

export const Default: Story = {
  render: (args) => <PrimaryButton {...args} />,
  args: {
    variant: 'filled',
    size: 'xlarge',
    widthMode: 'default',
    label: 'PrimaryButton',
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
      <PrimaryButton variant="filled" label="Filled" />
      <PrimaryButton variant="accentFilled" label="AccentFilled" />
      <PrimaryButton variant="outlined" label="Outlined" />
      <PrimaryButton variant="accentOutlined" label="AccentOutlined" />
      <PrimaryButton variant="ghost" label="Ghost" />
      <PrimaryButton variant="accentGhost" label="AccentGhost" />
    </Flex>
  ),
  args: {},
};

export const SizeProp: Story = {
  render: (args) => (
    <Flex>
      <PrimaryButton size="xlarge" label="XLarge" />
      <PrimaryButton size="large" label="Large" />
      <PrimaryButton size="medium" label="Medium" />
      <PrimaryButton size="small" label="Small" />
      <PrimaryButton size="xsmall" label="XSmall" />
    </Flex>
  ),
  args: {},
};

export const DisabledProp: Story = {
  render: (args) => (
    <Flex>
      <PrimaryButton variant="filled" disabled label="Filled" />
      <PrimaryButton variant="accentFilled" disabled label="AccentFilled" />
      <PrimaryButton variant="outlined" disabled label="Outlined" />
      <PrimaryButton variant="accentOutlined" disabled label="AccentOutlined" />
      <PrimaryButton variant="ghost" disabled label="Ghost" />
      <PrimaryButton variant="accentGhost" disabled label="AccentGhost" />
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
        <PrimaryButton>
          Primary<b>Click!</b>
        </PrimaryButton>
      </Flex>
    );
  },
  args: {},
};

export const WidthModeProp: Story = {
  render: (args) => (
    <Flex>
      <PrimaryButton widthMode="default" label="Default WidthMode" />
      <PrimaryButton widthMode="compact" label="Compact WidthMode" />
    </Flex>
  ),
  args: {},
};

export const IsLoadingProp: Story = {
  render: (args) => (
    <Flex>
      <PrimaryButton isLoading label="IsLoading" />
    </Flex>
  ),
  args: {},
};

export const WithPrefixIcon: Story = {
  render: (args) => (
    <Flex>
      <PrimaryButton prefixIcon="ic-search" label="Button" />
    </Flex>
  ),
  args: {},
};

export const WithSuffixIcon: Story = {
  render: (args) => (
    <Flex>
      <PrimaryButton suffixIcon="ic-search" label="Button" />
    </Flex>
  ),
  args: {},
};
