import React, { useState } from 'react';

import { Checkbox } from '@musinsa/layer-components-pda';
import { type Meta, type StoryObj } from '@storybook/react';

import { Column, Flex } from '../../../../shared/components/Flex';

document.documentElement.setAttribute('data-layer-platform', 'pda');
document.documentElement.setAttribute('data-layer-theme', 'light');

function CheckboxComposition() {
  const [checked, setChecked] = useState(false);

  return (
    <Flex>
      <Checkbox.Input checked={checked} onCheckedChange={setChecked} id="box" />
      <Checkbox.Label htmlFor="box">Checkbox</Checkbox.Label>
    </Flex>
  );
}

const meta: Meta<typeof CheckboxComposition> = {
  title: 'Layer/components-pda/Checkbox',
  component: CheckboxComposition,
  argTypes: {
    checked: {
      description: 'Checkbox의 체크 상태를 나타냅니다.',
      control: { type: 'boolean' },
      table: {
        type: { summary: 'boolean' },
        subcategory: 'Checkbox.Input',
      },
    },
    onCheckedChange: {
      description: 'Checkbox의 체크 상태가 변경될 때 호출되는 함수를 나타냅니다.',
      table: {
        type: { summary: '(checked: boolean) => void' },
        subcategory: 'Checkbox.Input',
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

export const Case: StoryObj = {
  render: () => (
    <Column width="300px">
      <Flex>
        {/* disabled */}
        <Checkbox.Input disabled id="disabled" />
        <Checkbox.Label htmlFor="disabled">Disabled</Checkbox.Label>
      </Flex>
      <Flex>
        {/* checked */}
        <Checkbox.Input checked id="checked" />
        <Checkbox.Label htmlFor="checked">Checked</Checkbox.Label>
      </Flex>
      <Flex>
        {/* checked disabled */}
        <Checkbox.Input checked disabled id="checked-disabled" />
        <Checkbox.Label htmlFor="checked-disabled">Checked Disabled</Checkbox.Label>
      </Flex>
    </Column>
  ),
};
