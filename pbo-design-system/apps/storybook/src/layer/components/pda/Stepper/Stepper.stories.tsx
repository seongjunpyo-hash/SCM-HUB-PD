import React, { useState } from 'react';

import { Stepper } from '@musinsa/layer-components-pda';

import { Column } from '../../../../shared/components/Flex';

import type { Meta, StoryObj } from '@storybook/react';

document.documentElement.setAttribute('data-layer-platform', 'pda');
document.documentElement.setAttribute('data-layer-theme', 'light');

function StepperComposition() {
  const [value, setValue] = useState(0);

  return (
    <div style={{ width: 300 }}>
      <Stepper.Root>
        <Stepper.Input count={value} totalCount={10} onCountChange={setValue} />
        <Stepper.HelpText>Help text</Stepper.HelpText>
      </Stepper.Root>
    </div>
  );
}

const meta: Meta<typeof StepperComposition> = {
  title: 'Layer/components-pda/Stepper',
  component: StepperComposition,
  argTypes: {
    validationState: {
      description: 'Stepper의 유효성 상태를 나타냅니다.',
      control: { type: 'radio' },
      options: ['none', 'error'],
      table: {
        defaultValue: { summary: 'none' },
        type: { summary: 'none | error' },
        subcategory: 'Stepper.Input',
      },
    },
    count: {
      description: 'Stepper의 값을 나타냅니다.',
      control: { type: 'number' },
      table: {
        type: { summary: 'number | undefined' },
        subcategory: 'Stepper.Input',
      },
    },
    totalCount: {
      description: 'Stepper의 최대 값을 나타냅니다.',
      control: { type: 'number' },
      table: {
        type: { summary: 'number', required: true },
        subcategory: 'Stepper.Input',
      },
    },
    onCountChange: {
      description: 'Stepper의 값이 변경될 때 호출되는 함수를 나타냅니다. (maxCount를 초과할 경우 호출되지 않습니다.)',
      table: {
        type: { summary: '(value: number) => void' },
        subcategory: 'Stepper.Input',
      },
    },
    countTotalSmall: {
      description: 'Stepper의 totalCount 텍스트 크기를 나타냅니다.',
      control: { type: 'boolean' },
      table: {
        type: { summary: 'boolean' },
        subcategory: 'Stepper.Input',
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
      <Stepper validationState="error" count={5} totalCount={10} />
      <Stepper disabled count={5} totalCount={10} />
      <Stepper readOnly count={5} totalCount={10} />
      <Stepper countTotalSmall count={5} totalCount={10} />
    </Column>
  ),
};
