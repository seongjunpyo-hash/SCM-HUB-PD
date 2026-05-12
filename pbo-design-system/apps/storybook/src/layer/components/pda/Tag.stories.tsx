/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';

import { Tag } from '@musinsa/layer-components-pda';

import { Flex } from '../../../shared/components/Flex';

import { pdaIconNames } from './_icon';

import type { Meta, StoryObj } from '@storybook/react';

document.documentElement.setAttribute('data-layer-platform', 'pda');
document.documentElement.setAttribute('data-layer-theme', 'light');

const meta: Meta<typeof Tag> = {
  title: 'Layer/components-pda/Tag',
  component: Tag,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    stateType: {
      description: 'Tag의 상태 타입을 나타냅니다.',
      control: { type: 'radio' },
      options: ['default', 'accent', 'critical'],
      table: {
        defaultValue: { summary: 'default' },
        type: { summary: 'default | accent | critical' },
      },
    },
    label: {
      description: 'Tag의 라벨을 나타냅니다. (children과 동시에 사용할 수 없습니다.)',
      control: { type: 'text' },
      table: {
        type: { summary: 'string | never' },
      },
    },
    prefixIcon: {
      description: 'Tag의 leading 아이콘을 나타냅니다.',
      control: { type: 'select' },
      options: pdaIconNames,
      table: {
        defaultValue: { summary: 'undefined' },
        type: { summary: 'ic-* (icon name)' },
      },
    },
    suffixIcon: {
      description: 'Tag의 trailing 아이콘을 나타냅니다.',
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

type Story = StoryObj<typeof Tag>;

export const DefaultTag: Story = {
  args: {
    stateType: 'default',
    label: 'Tag',
  },
};

export const StateTypeProp: Story = {
  render: (args) => (
    <Flex>
      <Tag stateType="default" label="default" />
      <Tag stateType="accent" label="accent" />
      <Tag stateType="critical" label="critical" />
    </Flex>
  ),
};

/**
 *  커스텀 요소가 필요한 경우 label 대신 children을 사용할 수 있습니다. (children 사용시 label은 never 타입)
 */
export const UseChildren: Story = {
  render: (args) => (
    <Tag>
      Tag<b>bold</b>
    </Tag>
  ),
};

export const WithPrefixIcon: Story = {
  args: {
    stateType: 'default',
    label: 'Tag',
    prefixIcon: 'ic-alertCircle',
  },
};

export const WithSuffixIcon: Story = {
  args: {
    stateType: 'default',
    label: 'Tag',
    suffixIcon: 'ic-alertCircle',
  },
};
