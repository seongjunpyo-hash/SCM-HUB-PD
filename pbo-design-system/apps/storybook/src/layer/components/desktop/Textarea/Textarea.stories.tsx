import React, { useState } from 'react';

import { Textarea } from '@musinsa/layer-components-desktop';

import { Div, Flex } from '../../../../shared/components/Flex';

import type { Meta, StoryObj } from '@storybook/react';

document.documentElement.setAttribute('data-layer-platform', 'desktop');
document.documentElement.setAttribute('data-layer-theme', 'light');

function TextareaComposition() {
  const [value, setValue] = useState('');

  return (
    <Div width="300px">
      <Textarea value={value} onChange={(e) => setValue(e.target.value)} placeholder="텍스트를 입력하세요" />
    </Div>
  );
}

const meta: Meta<typeof TextareaComposition> = {
  title: 'Layer/components-desktop/Textarea',
  component: TextareaComposition,
  argTypes: {
    value: {
      description: 'Textarea의 값을 나타냅니다.',
      control: { type: 'text' },
      table: {
        type: { summary: 'string' },
        subcategory: 'Textarea',
      },
    },
    onChange: {
      description: 'Textarea의 값이 변경될 때 호출되는 함수를 나타냅니다.',
      table: {
        type: { summary: '(e: ChangeEvent<HTMLTextAreaElement>) => void' },
        subcategory: 'Textarea',
      },
    },
    placeholder: {
      description: 'Textarea의 플레이스홀더를 나타냅니다.',
      control: { type: 'text' },
      table: {
        type: { summary: 'string' },
        subcategory: 'Textarea',
      },
    },
    heightMode: {
      description: 'Textarea의 높이 모드를 나타냅니다.',
      control: { type: 'radio' },
      options: ['min', 'max', 'auto'],
      table: {
        defaultValue: { summary: 'min' },
        type: { summary: 'min | max | auto' },
        subcategory: 'Textarea',
      },
    },
    validationState: {
      description: 'Textarea의 유효성 상태를 나타냅니다.',
      control: { type: 'radio' },
      options: ['none', 'error'],
      table: {
        defaultValue: { summary: 'none' },
        type: { summary: 'none | error' },
        subcategory: 'Textarea',
      },
    },
    disabled: {
      description: 'Textarea의 비활성화 상태를 나타냅니다.',
      control: { type: 'boolean' },
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
        subcategory: 'Textarea',
      },
    },
    readonly: {
      description: 'Textarea의 읽기 전용 상태를 나타냅니다.',
      control: { type: 'boolean' },
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
        subcategory: 'Textarea',
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

function TextareaHeightModeCase() {
  const [value1, setValue1] = useState('');
  const [value2, setValue2] = useState('');
  const [value3, setValue3] = useState('');

  return (
    <Flex>
      <Textarea
        value={value1}
        onChange={(e) => setValue1(e.target.value)}
        placeholder="min heightMode"
        heightMode="min"
      />
      <Textarea
        value={value2}
        onChange={(e) => setValue2(e.target.value)}
        placeholder="max heightMode"
        heightMode="max"
      />
      <Textarea
        value={value3}
        onChange={(e) => setValue3(e.target.value)}
        placeholder="auto heightMode"
        heightMode="auto"
      />
    </Flex>
  );
}

export const HeightModeProps: StoryObj = {
  render: TextareaHeightModeCase,
  args: {},
};

function TextareaValidationCase() {
  const [value1, setValue1] = useState('');
  const [value2, setValue2] = useState('');

  return (
    <Flex>
      <Textarea
        value={value1}
        onChange={(e) => setValue1(e.target.value)}
        placeholder="validationState: none"
        validationState="none"
      />
      <Textarea
        value={value2}
        onChange={(e) => setValue2(e.target.value)}
        placeholder="validationState: error"
        validationState="error"
      />
    </Flex>
  );
}

export const ValidationProps: StoryObj = {
  render: TextareaValidationCase,
  args: {},
};

function TextareaDisabledCase() {
  return (
    <Flex>
      <Textarea placeholder="disabled" disabled />
      <Textarea placeholder="readonly" readOnly value="readonly" />
    </Flex>
  );
}

export const DisabledProps: StoryObj = {
  render: TextareaDisabledCase,
  args: {},
};
