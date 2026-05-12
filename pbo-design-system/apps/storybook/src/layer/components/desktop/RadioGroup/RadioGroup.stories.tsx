import React, { useState } from 'react';

import { RadioGroup } from '@musinsa/layer-components-desktop';

import { Column, Flex } from '../../../../shared/components/Flex';

import type { Meta, StoryObj } from '@storybook/react';

document.documentElement.setAttribute('data-layer-platform', 'desktop');
document.documentElement.setAttribute('data-layer-theme', 'light');

function RadioGroupComposition() {
  const [value, setValue] = useState('one');

  return (
    <RadioGroup.Root value={value} onValueChange={setValue}>
      <Column>
        <Flex>
          <RadioGroup.Item id="one" value="one" />
          <label htmlFor="one">One</label>
        </Flex>
        <Flex>
          <RadioGroup.Item id="two" value="two" />
          <label htmlFor="two">Two</label>
        </Flex>
      </Column>
    </RadioGroup.Root>
  );
}

const meta: Meta<typeof RadioGroupComposition> = {
  title: 'Layer/components-desktop/RadioGroup',
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
    size: {
      description: 'RadioItem의 크기를 나타냅니다.',
      control: { type: 'radio' },
      options: ['small', 'medium'],
      table: {
        defaultValue: { summary: 'small' },
        type: { summary: 'small | medium' },
        subcategory: 'RadioGroup.Item',
      },
    },
    validation: {
      description: 'RadioItem의 유효성 상태를 나타냅니다.',
      control: { type: 'radio' },
      options: ['none', 'error'],
      table: {
        defaultValue: { summary: 'none' },
        type: { summary: 'none | error' },
        subcategory: 'RadioGroup.Item',
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

function RadioSizeCase() {
  const [value, setValue] = useState('small');

  return (
    <RadioGroup.Root value={value} onValueChange={setValue}>
      <Column>
        <Flex>
          <RadioGroup.Item id="small" value="small" size="small" />
          <label htmlFor="small">Small</label>
        </Flex>
        <Flex>
          <RadioGroup.Item id="medium" value="medium" size="medium" />
          <label htmlFor="medium">Medium</label>
        </Flex>
      </Column>
    </RadioGroup.Root>
  );
}

export const SizeProps: StoryObj = {
  render: RadioSizeCase,
  args: {},
};

function RadioValidationCase() {
  return (
    <RadioGroup.Root value="none" onValueChange={() => {}}>
      <Column>
        <Flex>
          <RadioGroup.Item id="none" value="none" validation="none" />
          <label htmlFor="none">None</label>
        </Flex>
        <Flex>
          <RadioGroup.Item id="error" value="error" validation="error" />
          <label htmlFor="error">Error</label>
        </Flex>
      </Column>
    </RadioGroup.Root>
  );
}

export const ValidationProps: StoryObj = {
  render: RadioValidationCase,
  args: {},
};
