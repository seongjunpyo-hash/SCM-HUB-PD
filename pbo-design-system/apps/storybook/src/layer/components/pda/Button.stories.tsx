/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';

import { Button } from '@musinsa/layer-components-pda';

import { pdaIconNames } from './_icon';

import type { Meta, StoryObj } from '@storybook/react';
import type { PropsWithChildren } from 'react';

document.documentElement.setAttribute('data-layer-platform', 'pda');
document.documentElement.setAttribute('data-layer-theme', 'light');

const meta: Meta<typeof Button> = {
  title: 'Layer/components-pda/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      description: 'Button의 타입을 나타냅니다.',
      control: { type: 'radio' },
      options: ['primary', 'secondary', 'tertiary', 'negative'],
      table: {
        defaultValue: { summary: 'primary' },
        type: { summary: 'primary | secondary | tertiary | negative' },
      },
    },
    size: {
      description: 'Button의 크기를 나타냅니다.',
      control: { type: 'radio' },
      options: ['xlarge', 'large', 'medium', 'small'],
      table: {
        defaultValue: { summary: 'xlarge' },
        type: { summary: 'xlarge | large | medium | small' },
      },
    },
    children: {
      description: 'Button의 자식 요소를 나타냅니다.',
      table: {
        type: { summary: 'ReactNode | never' },
      },
    },
    label: {
      description: 'Button의 라벨을 나타냅니다. (children과 동시에 사용할 수 없습니다.)',
      control: { type: 'text' },
      table: {
        type: { summary: 'string | never' },
      },
    },
    isLoading: {
      description: 'Button의 로딩 상태를 나타냅니다.',
      control: { type: 'boolean' },
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    disabled: {
      description: 'Button의 비활성화 상태를 나타냅니다.',
      control: { type: 'boolean' },
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
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

type Story = StoryObj<typeof Button>;

const Wrap = ({ children }: PropsWithChildren) => (
  <div style={{ width: 300, display: 'flex', flexDirection: 'column', gap: 12 }}>{children}</div>
);
Wrap.displayName = 'Wrap';

export const Default: Story = {
  render: (args) => (
    <Wrap>
      <Button {...args} />
    </Wrap>
  ),
  args: {
    variant: 'primary',
    size: 'xlarge',
    label: 'Button',
  },
};

export const VariantProp: Story = {
  render: (args) => (
    <Wrap>
      <Button variant="primary" label="Primary" />
      <Button variant="secondary" label="Secondary" />
      <Button variant="tertiary" label="Tertiary" />
      <Button variant="negative" label="Negative" />
    </Wrap>
  ),
  args: {},
};

export const SizeProp: Story = {
  render: (args) => (
    <Wrap>
      <Button size="xlarge" label="XLarge" />
      <Button size="large" label="Large" />
      <Button size="medium" label="Medium" />
      <Button size="small" label="Small" />
    </Wrap>
  ),
  args: {},
};

/**
 *  커스텀 요소가 필요한 경우 label 대신 children을 사용할 수 있습니다. (children 사용시 label은 never 타입)
 */
export const UseChildren: Story = {
  render: (args) => {
    return (
      <Wrap>
        <Button>
          Button<b>Click!</b>
        </Button>
      </Wrap>
    );
  },
  args: {},
};

export const Disabled: Story = {
  render: (args) => (
    <Wrap>
      <Button disabled label="Disabled" />
    </Wrap>
  ),
  args: {},
};

export const IsLoading: Story = {
  render: (args) => (
    <Wrap>
      <Button isLoading label="IsLoading" />
    </Wrap>
  ),
};

export const WithPrefixIcon: Story = {
  render: (args) => (
    <Wrap>
      <Button prefixIcon="ic-search" label="Button" />
    </Wrap>
  ),
  args: {},
};

export const WithSuffixIcon: Story = {
  render: (args) => (
    <Wrap>
      <Button suffixIcon="ic-search" label="Button" />
    </Wrap>
  ),
  args: {},
};
