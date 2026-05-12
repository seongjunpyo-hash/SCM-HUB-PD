import React from 'react';

import { FloatingActionButton } from '@musinsa/layer-components-pda';

import { pdaIconNames } from './_icon';

import type { Meta, StoryObj } from '@storybook/react';

document.documentElement.setAttribute('data-layer-platform', 'pda');
document.documentElement.setAttribute('data-layer-theme', 'light');

const meta: Meta<typeof FloatingActionButton> = {
  title: 'Layer/components-pda/FloatingActionButton',
  component: FloatingActionButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      description: 'FloatingActionButton의 자식 요소를 나타냅니다.',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    label: {
      description: 'FloatingActionButton의 라벨을 나타냅니다. (children과 동시에 사용할 수 없습니다.)',
      control: { type: 'text' },
      table: {
        type: { summary: 'string | never' },
      },
    },
    prefixIcon: {
      description: 'FloatingActionButton의 앞에 표시할 아이콘을 나타냅니다.',
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

type Story = StoryObj<typeof FloatingActionButton>;

export const Default: Story = {
  args: {
    label: 'Label',
    prefixIcon: 'ic-mapPin',
  },
};

/**
 *  커스텀 요소가 필요한 경우 label 대신 children을 사용할 수 있습니다. (children 사용시 label은 never 타입)
 */
export const UseChildren: Story = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render: (args) => (
    <FloatingActionButton prefixIcon="ic-mapPin">
      button <b>click!</b>
    </FloatingActionButton>
  ),
  args: {},
};
