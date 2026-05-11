/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';

import { IconButton } from '@musinsa/layer-components-desktop';

import { Column, Flex } from '../../../shared/components/Flex';

import { desktopIconNames } from './_icon';

import type { Meta, StoryObj } from '@storybook/react';

document.documentElement.setAttribute('data-layer-platform', 'desktop');
document.documentElement.setAttribute('data-layer-theme', 'light');

const meta: Meta<typeof IconButton> = {
  title: 'Layer/components-desktop/IconButton',
  component: IconButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    icon: {
      description: 'IconButton의 아이콘을 나타냅니다.',
      control: { type: 'select' },
      options: desktopIconNames,
      table: {
        type: { summary: 'ic-* (icon name)' },
      },
    },
    buttonType: {
      description: 'IconButton의 버튼 타입을 나타냅니다.',
      control: { type: 'radio' },
      options: ['primary', 'secondary', 'tertiary', 'negative'],
      table: {
        defaultValue: { summary: 'secondary' },
        type: { summary: 'primary | secondary | tertiary | negative' },
      },
    },
    variant: {
      description: 'IconButton의 variant를 나타냅니다.',
      control: { type: 'radio' },
      options: ['filled', 'accentFilled', 'outlined', 'accentOutlined', 'ghost', 'accentGhost'],
      table: {
        defaultValue: { summary: 'outlined' },
        type: { summary: 'filled | accentFilled | outlined | accentOutlined | ghost | accentGhost' },
      },
    },
    size: {
      description: 'IconButton의 크기를 나타냅니다.',
      control: { type: 'radio' },
      options: ['xlarge', 'large', 'medium', 'small', 'xsmall', '2xsmall'],
      table: {
        defaultValue: { summary: 'xlarge' },
        type: { summary: 'xlarge | large | medium | small | xsmall | 2xsmall' },
      },
    },
    disabled: {
      description: 'IconButton의 비활성화 상태를 나타냅니다.',
      control: { type: 'boolean' },
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof IconButton>;

export const Default: Story = {
  render: (args) => <IconButton {...args} />,
  args: {
    icon: 'ic-plus',
    buttonType: 'secondary',
    variant: 'outlined',
    size: 'xlarge',
    disabled: false,
  },
};

/**
 *  buttonType 사용가능 variant
 *  - primary: filled, accentFilled, outlined, accentOutlined, ghost, accentGhost
 *  - secondary: filled, outlined, ghost
 *  - tertiary: ghost
 *  - negative: filled, outlined, ghost
 */
export const TypeAndVariantProp: Story = {
  render: (args) => (
    <Column>
      <Flex>
        <IconButton buttonType="primary" variant="filled" size="xlarge" icon="ic-plus" />
        <IconButton buttonType="primary" variant="accentFilled" size="xlarge" icon="ic-plus" />
        <IconButton buttonType="primary" variant="outlined" size="xlarge" icon="ic-plus" />
        <IconButton buttonType="primary" variant="accentOutlined" size="xlarge" icon="ic-plus" />
        <IconButton buttonType="primary" variant="ghost" size="xlarge" icon="ic-plus" />
        <IconButton buttonType="primary" variant="accentGhost" size="xlarge" icon="ic-plus" />
      </Flex>
      <Flex>
        <IconButton buttonType="secondary" variant="filled" size="xlarge" icon="ic-plus" />
        <IconButton buttonType="secondary" variant="outlined" size="xlarge" icon="ic-plus" />
        <IconButton buttonType="secondary" variant="ghost" size="xlarge" icon="ic-plus" />
      </Flex>
      <Flex>
        <IconButton buttonType="tertiary" variant="ghost" size="xlarge" icon="ic-plus" />
      </Flex>
      <Flex>
        <IconButton buttonType="negative" variant="filled" size="xlarge" icon="ic-plus" />
        <IconButton buttonType="negative" variant="outlined" size="xlarge" icon="ic-plus" />
        <IconButton buttonType="negative" variant="ghost" size="xlarge" icon="ic-plus" />
      </Flex>
    </Column>
  ),
};

export const SizeProp: Story = {
  render: (args) => (
    <Column>
      <Flex>
        <IconButton size="xlarge" icon="ic-plus" />
        <IconButton size="large" icon="ic-plus" />
        <IconButton size="medium" icon="ic-plus" />
        <IconButton size="small" icon="ic-plus" />
        <IconButton size="xsmall" icon="ic-plus" />
        <IconButton size="2xsmall" icon="ic-plus" />
      </Flex>
    </Column>
  ),
};

export const DisabledProp: Story = {
  render: (args) => (
    <Column>
      <Flex>
        <IconButton buttonType="primary" variant="filled" size="xlarge" icon="ic-plus" disabled />
        <IconButton buttonType="primary" variant="accentFilled" size="xlarge" icon="ic-plus" disabled />
        <IconButton buttonType="primary" variant="outlined" size="xlarge" icon="ic-plus" disabled />
        <IconButton buttonType="primary" variant="accentOutlined" size="xlarge" icon="ic-plus" disabled />
        <IconButton buttonType="primary" variant="ghost" size="xlarge" icon="ic-plus" disabled />
        <IconButton buttonType="primary" variant="accentGhost" size="xlarge" icon="ic-plus" disabled />
      </Flex>
      <Flex>
        <IconButton buttonType="secondary" variant="filled" size="xlarge" icon="ic-plus" disabled />
        <IconButton buttonType="secondary" variant="outlined" size="xlarge" icon="ic-plus" disabled />
        <IconButton buttonType="secondary" variant="ghost" size="xlarge" icon="ic-plus" disabled />
      </Flex>
      <Flex>
        <IconButton buttonType="tertiary" variant="ghost" size="xlarge" icon="ic-plus" disabled />
      </Flex>
      <Flex>
        <IconButton buttonType="negative" variant="filled" size="xlarge" icon="ic-plus" disabled />
        <IconButton buttonType="negative" variant="outlined" size="xlarge" icon="ic-plus" disabled />
        <IconButton buttonType="negative" variant="ghost" size="xlarge" icon="ic-plus" disabled />
      </Flex>
    </Column>
  ),
};
