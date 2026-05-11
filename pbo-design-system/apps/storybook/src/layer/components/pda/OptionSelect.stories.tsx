import React from 'react';

import { OptionSelect } from '@musinsa/layer-components-pda';
import { GraphicIcon } from '@musinsa/pbo-assets/mwms';

import type { Meta, StoryObj } from '@storybook/react';
import type { PropsWithChildren } from 'react';

document.documentElement.setAttribute('data-layer-platform', 'pda');
document.documentElement.setAttribute('data-layer-theme', 'light');

const meta: Meta<typeof OptionSelect> = {
  title: 'Layer/components-pda/OptionSelect',
  component: OptionSelect,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      description: 'OptionSelect의 크기를 나타냅니다.',
      control: { type: 'radio' },
      options: ['large', 'medium'],
      table: {
        defaultValue: { summary: 'large' },
        type: { summary: 'large | medium' },
      },
    },
    label: {
      description: 'OptionSelect의 라벨을 나타냅니다.',
      control: { type: 'text' },
      table: {
        type: { summary: 'string' },
      },
    },
    description: {
      description: 'OptionSelect의 설명을 나타냅니다.',
      control: { type: 'text' },
      table: {
        type: { summary: 'string' },
      },
    },
    count: {
      description: 'OptionSelect의 설명 값을 나타냅니다.',
      control: { type: 'text' },
      table: {
        type: { summary: 'number' },
      },
    },
    isChecked: {
      description: 'OptionSelect의 선택 상태를 나타냅니다.',
      control: { type: 'boolean' },
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    disabled: {
      description: 'OptionSelect의 비활성화 상태를 나타냅니다.',
      control: { type: 'boolean' },
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    icon: {
      description: 'OptionSelect의 아이콘을 나타냅니다.',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof OptionSelect>;

GraphicIcon.displayName = 'GraphicIcon';

const Wrap = ({ children }: PropsWithChildren) => <div style={{ width: 240 }}>{children}</div>;

Wrap.displayName = 'Wrap';

export const Default: Story = {
  render: (args) => (
    <Wrap>
      <OptionSelect {...args} />
    </Wrap>
  ),
  args: {
    size: 'large',
    label: 'Label',
    description: 'Description',
    count: 0,
    isChecked: false,
    disabled: false,
    icon: <GraphicIcon name="ic-individualPackaging" size={64} />,
  },
};
