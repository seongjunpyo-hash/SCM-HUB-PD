/* eslint-disable @typescript-eslint/no-unused-vars */

import React from 'react';

import { RemovableTag } from '@musinsa/layer-components-desktop';

import { Flex } from '../../../../shared/components/Flex';

import type { Meta, StoryObj } from '@storybook/react';

document.documentElement.setAttribute('data-layer-platform', 'desktop');
document.documentElement.setAttribute('data-layer-theme', 'light');

const meta: Meta<typeof RemovableTag> = {
  title: 'Layer/components-desktop/Tags/RemovableTag',
  component: RemovableTag,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      description: 'RemovableTag의 자식 요소를 나타냅니다.',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    label: {
      description: 'RemovableTag의 라벨을 나타냅니다. (children과 동시에 사용할 수 없습니다.)',
      control: { type: 'text' },
      table: {
        type: { summary: 'string | never' },
      },
    },
    variant: {
      description: 'RemovableTag의 variant를 나타냅니다.',
      control: { type: 'radio' },
      options: ['filled', 'outlined'],
      table: {
        defaultValue: { summary: 'outlined' },
        type: { summary: 'filled | outlined' },
      },
    },
    size: {
      description: 'RemovableTag의 크기를 나타냅니다.',
      control: { type: 'radio' },
      options: ['large', 'small'],
      table: {
        defaultValue: { summary: 'small' },
        type: { summary: 'large | small' },
      },
    },
    disabled: {
      description: 'RemovableTag의 비활성화 상태를 나타냅니다.',
      control: { type: 'boolean' },
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    onRemove: {
      description: 'RemovableTag의 제거 버튼 클릭 시 호출되는 함수입니다.',
      table: {
        type: { summary: '() => void' },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof RemovableTag>;

export const Default: Story = {
  render: (args) => <RemovableTag {...args} />,
  args: {
    variant: 'outlined',
    size: 'small',
    disabled: false,
    label: 'RemovableTag',
    children: undefined,
    onRemove: () => {},
  },
};

export const VariantProp: Story = {
  render: (args) => (
    <Flex>
      <RemovableTag label="filled" variant="filled" onRemove={() => {}} />
      <RemovableTag label="outlined" variant="outlined" onRemove={() => {}} />
    </Flex>
  ),
  args: {},
};

export const SizeProp: Story = {
  render: (args) => (
    <Flex>
      <RemovableTag label="small" size="small" onRemove={() => {}} />
      <RemovableTag label="large" size="large" onRemove={() => {}} />
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
      <RemovableTag onRemove={() => {}}>
        RemovableTag<b>Click!</b>
      </RemovableTag>
    );
  },
  args: {},
};

export const DisabledProp: Story = {
  render: (args) => (
    <Flex>
      <RemovableTag label="disabled" disabled onRemove={() => {}} />
      <RemovableTag label="enabled" onRemove={() => {}} />
    </Flex>
  ),
  args: {},
};
