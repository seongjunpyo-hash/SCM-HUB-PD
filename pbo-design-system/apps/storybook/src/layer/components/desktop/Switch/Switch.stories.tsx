import React, { useState } from 'react';

import { Switch } from '@musinsa/layer-components-desktop';

import { Flex } from '../../../../shared/components/Flex';

import type { Meta, StoryObj } from '@storybook/react';

document.documentElement.setAttribute('data-layer-platform', 'desktop');
document.documentElement.setAttribute('data-layer-theme', 'light');

function SwitchComposition() {
  const [checked, setChecked] = useState(false);

  return <Switch checked={checked} onCheckedChange={setChecked} />;
}

const meta: Meta<typeof SwitchComposition> = {
  title: 'Layer/components-desktop/Switch',
  component: SwitchComposition,
  argTypes: {
    checked: {
      description: 'Switch의 체크 상태를 나타냅니다.',
      control: { type: 'boolean' },
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
        subcategory: 'Switch',
      },
    },
    onCheckedChange: {
      description: 'Switch의 체크 상태가 변경될 때 호출되는 함수를 나타냅니다.',
      table: {
        type: { summary: '(checked: boolean) => void' },
        subcategory: 'Switch',
      },
    },
    disabled: {
      description: 'Switch의 비활성화 상태를 나타냅니다.',
      control: { type: 'boolean' },
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
        subcategory: 'Switch',
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

export const DisabledProps: StoryObj = {
  render: () => (
    <Flex>
      <Switch disabled />
      <Switch checked disabled />
    </Flex>
  ),
  args: {},
};
