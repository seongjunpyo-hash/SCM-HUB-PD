import React, { useState } from 'react';

import { Checkbox } from '@musinsa/layer-components-desktop';

import { Flex } from '../../../../shared/components/Flex';

import type { Meta, StoryObj } from '@storybook/react';

document.documentElement.setAttribute('data-layer-platform', 'desktop');
document.documentElement.setAttribute('data-layer-theme', 'light');

function CheckboxComposition() {
  const [checked, setChecked] = useState(false);

  return <Checkbox checked={checked} onCheckedChange={setChecked} />;
}

const meta: Meta<typeof CheckboxComposition> = {
  title: 'Layer/components-desktop/Checkbox',
  component: CheckboxComposition,
  argTypes: {
    size: {
      description: 'Checkbox의 크기를 나타냅니다.',
      control: { type: 'radio' },
      options: ['small', 'medium'],
      table: {
        defaultValue: { summary: 'small' },
        type: { summary: 'small | medium' },
        subcategory: 'Checkbox',
      },
    },
    checked: {
      description: 'Checkbox의 체크 상태를 나타냅니다.',
      control: { type: 'boolean' },
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
        subcategory: 'Checkbox',
      },
    },
    onCheckedChange: {
      description: 'Checkbox의 체크 상태가 변경될 때 호출되는 함수를 나타냅니다.',
      table: {
        type: { summary: '(checked: boolean) => void' },
        subcategory: 'Checkbox',
      },
    },
    disabled: {
      description: 'Checkbox의 비활성화 상태를 나타냅니다.',
      control: { type: 'boolean' },
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
        subcategory: 'Checkbox',
      },
    },
    isIndeterminate: {
      description: 'Checkbox의 indeterminate 상태를 나타냅니다.',
      control: { type: 'boolean' },
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
        subcategory: 'Checkbox',
      },
    },
  },
  parameters: {
    docs: {
      canvas: {
        sourceState: 'none',
      },
    },
  },
};

export default meta;

export const Default: StoryObj = {};

export const CheckedCase: StoryObj = {
  render: () => (
    <Flex>
      <Checkbox size="medium" />
      <Checkbox size="medium" checked />
      <Checkbox size="medium" checked isIndeterminate />
    </Flex>
  ),
  args: {},
};

export const SizeCase: StoryObj = {
  render: () => (
    <Flex>
      <Checkbox size="small" />
      <Checkbox size="small" checked />
      <Checkbox size="small" checked isIndeterminate />
      <Checkbox size="medium" />
      <Checkbox size="medium" checked />
      <Checkbox size="medium" checked isIndeterminate />
    </Flex>
  ),
  args: {},
};

export const DisabledCase: StoryObj = {
  render: () => (
    <Flex>
      <Checkbox size="medium" disabled />
      <Checkbox size="medium" checked disabled />
      <Checkbox size="medium" checked isIndeterminate disabled />
    </Flex>
  ),
  args: {},
};
