import React, { useState } from 'react';

import { CountTextfield, SearchTextfield, Textfield } from '@musinsa/layer-components-pda';

import { Column, Div } from '../../../../shared/components/Flex';

import type { Meta, StoryObj } from '@storybook/react';

document.documentElement.setAttribute('data-layer-platform', 'pda');
document.documentElement.setAttribute('data-layer-theme', 'light');

function TextfieldComposition() {
  const [value, setValue] = useState('');

  return (
    <Div width="300px">
      <Textfield.Root>
        <Textfield.Input placeholder="Placeholder" value={value} onValueChange={setValue} />
        <Textfield.HelpText>Help text</Textfield.HelpText>
      </Textfield.Root>
    </Div>
  );
}

function SearchTextfieldComposition() {
  const [value, setValue] = useState('');

  return (
    <Div width="300px">
      <Textfield.Root>
        <Textfield.SearchInput placeholder="Placeholder" value={value} onValueChange={setValue} />
        <Textfield.HelpText>Help text</Textfield.HelpText>
      </Textfield.Root>
    </Div>
  );
}

function CountTextfieldComposition() {
  const [value, setValue] = useState(0);

  return (
    <Column gap={24} width="300px">
      <Textfield.Root>
        <Textfield.CountInput count={value} totalCount={10} onCountChange={setValue} />
        <Textfield.HelpText>Help text</Textfield.HelpText>
      </Textfield.Root>

      <Textfield.Root>
        <Textfield.CountInput countTotalSmall count={value} totalCount={10} onCountChange={setValue} />
        <Textfield.HelpText>Help text</Textfield.HelpText>
      </Textfield.Root>
    </Column>
  );
}

const meta: Meta<typeof TextfieldComposition> = {
  title: 'Layer/components-pda/Textfield',
  component: TextfieldComposition,
  argTypes: {
    validationState: {
      description: '유효성 상태를 나타냅니다.',
      control: { type: 'radio' },
      options: ['none', 'error'],
      table: {
        defaultValue: { summary: 'none' },
        type: { summary: 'none | error' },
        subcategory: 'Textfield.Input | Textfield.SearchInput | Textfield.CountInput',
      },
    },
    value: {
      description: '값을 나타냅니다.',
      control: { type: 'text' },
      table: {
        type: { summary: 'string' },
        subcategory: 'Textfield.Input | Textfield.SearchInput',
      },
    },
    onValueChange: {
      description: 'Input, SearchInput의 값이 변경될 때 호출되는 함수를 나타냅니다.',
      table: {
        type: { summary: '(value: string) => void' },
        subcategory: 'Textfield.Input | Textfield.SearchInput',
      },
    },
    onCountChange: {
      description: 'CountInput의 값이 변경될 때 호출되는 함수를 나타냅니다.',
      table: {
        type: { summary: '(value: number) => void' },
        subcategory: 'Textfield.CountInput',
      },
    },
    count: {
      description: 'CountInput의 값을 나타냅니다.',
      control: { type: 'number' },
      table: {
        type: { summary: 'number' },
        subcategory: 'Textfield.CountInput',
      },
    },
    totalCount: {
      description: 'CountInput의 최대 값을 나타냅니다.',
      control: { type: 'number' },
      table: {
        type: { summary: 'number' },
        subcategory: 'Textfield.CountInput',
      },
    },
    countTotalSmall: {
      description: 'CountInput의 totalCount 텍스트 크기를 나타냅니다.',
      control: { type: 'boolean' },
      table: {
        type: { summary: 'boolean' },
        subcategory: 'Textfield.CountInput',
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

export const SearchInput: StoryObj = {
  render: () => <SearchTextfieldComposition />,
};

export const CountInput: StoryObj = {
  render: () => <CountTextfieldComposition />,
};

export const Case: StoryObj = {
  render: () => (
    <Column width="300px" gap={48}>
      <Column>
        {/* error */}
        <Textfield placeholder="Placeholder" validationState="error" />
        <Textfield.SearchInput placeholder="Placeholder" validationState="error" />
        <CountTextfield validationState="error" count={0} totalCount={10} />
      </Column>
      {/* disabled */}
      <Column>
        <Textfield value="disabled" disabled />
        <SearchTextfield value="disabled" disabled />
        <CountTextfield disabled count={0} totalCount={10} />
      </Column>
      {/* readOnly */}
      <Column>
        <Textfield value="readOnly" readOnly />
        <SearchTextfield value="readOnly" readOnly />
        <CountTextfield readOnly count={0} totalCount={10} />
      </Column>
    </Column>
  ),
};
