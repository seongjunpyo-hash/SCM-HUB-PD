/* eslint-disable @typescript-eslint/no-unused-vars */

import React from 'react';

import { FilterTag } from '@musinsa/layer-components-desktop';

import { Flex } from '../../../../shared/components/Flex';

import type { Meta, StoryObj } from '@storybook/react';

document.documentElement.setAttribute('data-layer-platform', 'desktop');
document.documentElement.setAttribute('data-layer-theme', 'light');

const meta: Meta<typeof FilterTag> = {
  title: 'Layer/components-desktop/Tags/FilterTag',
  component: FilterTag,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      description: 'FilterTag의 자식 요소를 나타냅니다.',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    label: {
      description: 'FilterTag의 라벨을 나타냅니다. (children과 동시에 사용할 수 없습니다.)',
      control: { type: 'text' },
      table: {
        type: { summary: 'string | never' },
      },
    },
    size: {
      description: 'FilterTag의 크기를 나타냅니다.',
      control: { type: 'radio' },
      options: ['medium', 'large'],
      table: {
        defaultValue: { summary: 'medium' },
        type: { summary: 'medium | large' },
      },
    },
    isSelected: {
      description: 'FilterTag의 선택 상태를 나타냅니다.',
      control: { type: 'boolean' },
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof FilterTag>;

export const Default: Story = {
  render: (args) => <FilterTag {...args} />,
  args: {
    size: 'medium',
    isSelected: false,
    label: 'FilterTag',
    children: undefined,
  },
};

export const SizeProp: Story = {
  render: (args) => (
    <Flex>
      <FilterTag label="medium" size="medium" />
      <FilterTag label="large" size="large" />
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
      <FilterTag>
        FilterTag<b>Click!</b>
      </FilterTag>
    );
  },
  args: {},
};

export const IsSelectedProp: Story = {
  render: (args) => (
    <Flex>
      <FilterTag label="unselected" isSelected={false} />
      <FilterTag label="selected" isSelected={true} />
    </Flex>
  ),
  args: {},
};

export const DisabledProp: Story = {
  render: (args) => (
    <Flex>
      <FilterTag label="disabled" disabled />
      <FilterTag label="enabled" />
    </Flex>
  ),
  args: {},
};
