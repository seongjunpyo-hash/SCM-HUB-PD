/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';

import { OptionList } from '@musinsa/layer-components-pda';

import { Column } from '../../../shared/components/Flex';

import type { Meta, StoryObj } from '@storybook/react';
import type { PropsWithChildren } from 'react';

document.documentElement.setAttribute('data-layer-platform', 'pda');
document.documentElement.setAttribute('data-layer-theme', 'light');

const meta: Meta<typeof OptionList> = {
  title: 'Layer/components-pda/OptionList',
  component: OptionList,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      description: 'OptionList의 자식 요소를 나타냅니다.',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    label: {
      description: 'OptionList의 라벨을 나타냅니다. (children과 동시에 사용할 수 없습니다.)',
      control: { type: 'text' },
      table: {
        type: { summary: 'string | never' },
      },
    },
    type: {
      description: 'OptionList의 타입을 나타냅니다.',
      control: { type: 'radio' },
      options: ['default', 'code'],
      table: {
        defaultValue: { summary: 'default' },
        type: { summary: 'default | code' },
      },
    },
    isChecked: {
      description: 'OptionList의 선택 상태를 나타냅니다.',
      control: { type: 'boolean' },
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    disabled: {
      description: 'OptionList의 비활성화 상태를 나타냅니다.',
      control: { type: 'boolean' },
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof OptionList>;

const Wrap = ({ children }: PropsWithChildren) => <div style={{ width: 300 }}>{children}</div>;
Wrap.displayName = 'Wrap';

export const Default: Story = {
  render: (args) => (
    <Wrap>
      <OptionList {...args} />
    </Wrap>
  ),
  args: {
    type: 'default',
    label: 'Option Label',
  },
};

export const TypeProp: Story = {
  render: (args) => (
    <Column width="300px">
      <OptionList type="default" label="Option Label" />
      <OptionList type="code" label="Option Label" />
    </Column>
  ),
  args: {},
};

/**
 *  커스텀 요소가 필요한 경우 label 대신 children을 사용할 수 있습니다. (children 사용시 label은 never 타입)
 */
export const UseChildren: Story = {
  render: (args) => (
    <Column width="300px">
      <OptionList>
        <b>Bold Option Label</b>
      </OptionList>
    </Column>
  ),
  args: {},
};

export const IsCheckedProp: Story = {
  render: (args) => (
    <Column width="300px">
      <OptionList label="Option Label" />
      <OptionList isChecked label="Option Label" />
    </Column>
  ),
  args: {},
};

export const DisabledProp: Story = {
  render: (args) => (
    <Column width="300px">
      <OptionList disabled label="Option Label" />
      <OptionList disabled isChecked label="Option Label" />
    </Column>
  ),
  args: {},
};
