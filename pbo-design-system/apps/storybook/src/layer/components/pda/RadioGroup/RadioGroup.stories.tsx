import React, { useState } from 'react';

import { RadioGroup } from '@musinsa/layer-components-pda';
import { type Meta, type StoryObj } from '@storybook/react';

import { Column, Flex } from '../../../../shared/components/Flex';

document.documentElement.setAttribute('data-layer-platform', 'pda');
document.documentElement.setAttribute('data-layer-theme', 'light');

function RadioGroupComposition() {
  const [value, setValue] = useState('one');

  return (
    <RadioGroup.Root value={value} onValueChange={setValue}>
      <Column>
        <Flex>
          <RadioGroup.Item id="one" value="one" />
          <RadioGroup.Label htmlFor="one">One</RadioGroup.Label>
        </Flex>
        <Flex>
          <RadioGroup.Item id="two" value="two" />
          <RadioGroup.Label htmlFor="two">Two</RadioGroup.Label>
        </Flex>
      </Column>
    </RadioGroup.Root>
  );
}

const meta: Meta<typeof RadioGroupComposition> = {
  title: 'Layer/components-pda/RadioGroup',
  component: RadioGroupComposition,
  argTypes: {
    value: {
      description: 'RadioGroup의 값을 나타냅니다.',
      control: { type: 'text' },
      table: {
        type: { summary: 'T extends string' },
        subcategory: 'RadioGroup.Root | RadioGroup.Item',
      },
    },
    onValueChange: {
      description: 'RadioGroup의 값이 변경될 때 호출되는 함수를 나타냅니다.',
      table: {
        type: { summary: '(value: T) => void' },
        subcategory: 'RadioGroup.Root',
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
      <RadioGroup.Root value="one" onValueChange={() => {}}>
        <Column>
          <Flex>
            {/* disabled */}
            <RadioGroup.Item disabled id="one" value="one" />
            <RadioGroup.Label htmlFor="one">One</RadioGroup.Label>
          </Flex>
        </Column>
      </RadioGroup.Root>
    </Column>
  ),
};
