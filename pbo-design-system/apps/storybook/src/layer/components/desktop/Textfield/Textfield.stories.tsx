import React, { useState } from 'react';

import { Textfield } from '@musinsa/layer-components-desktop';
import { Icon } from '@musinsa/pbo-assets';

import { Column, Flex } from '../../../../shared/components/Flex';

import type { Meta, StoryObj } from '@storybook/react';

document.documentElement.setAttribute('data-layer-platform', 'desktop');
document.documentElement.setAttribute('data-layer-theme', 'light');

function TextfieldComposition() {
  const [value, setValue] = useState('');
  const [value2, setValue2] = useState('');

  return (
    <Column width="300px">
      <Textfield value={value} onValueChange={setValue} placeholder="Placeholder" />

      <Textfield.Box>
        <Icon name="ic-search" />
        <Textfield.Input value={value2} onValueChange={setValue2} placeholder="Placeholder" maxLength={10} />
        <Textfield.Count />
      </Textfield.Box>
    </Column>
  );
}

const meta: Meta<typeof TextfieldComposition> = {
  title: 'Layer/components-desktop/Textfield',
  component: TextfieldComposition,
  argTypes: {
    validationState: {
      description: 'Textfield의 유효성 상태를 나타냅니다.',
      control: { type: 'radio' },
      options: ['none', 'error'],
      table: {
        defaultValue: { summary: 'none' },
        type: { summary: 'none | error' },
        subcategory: 'Textfield.Box',
      },
    },
    value: {
      description: 'Textfield의 값을 나타냅니다.',
      control: { type: 'text' },
      table: {
        type: { summary: 'string' },
        subcategory: 'Textfield.Input',
      },
    },
    onValueChange: {
      description: 'Textfield의 값이 변경될 때 호출되는 함수를 나타냅니다.',
      table: {
        type: { summary: '(value: string) => void' },
        subcategory: 'Textfield.Input',
      },
    },
    onClear: {
      description: 'Textfield의 클리어 버튼 클릭 시 호출되는 함수를 나타냅니다.',
      table: {
        type: { summary: '() => void' },
        subcategory: 'Textfield.Input',
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

function TypeCase() {
  const [value, setValue] = useState('');
  const [value2, setValue2] = useState('');
  const [value3, setValue3] = useState('');

  return (
    <Column width="300px">
      <Textfield type="text" value={value} onValueChange={setValue} placeholder="text type" />
      <Textfield type="password" value={value2} onValueChange={setValue2} placeholder="password type" />
      <Textfield type="number" value={value3} onValueChange={setValue3} placeholder="number type" />
    </Column>
  );
}

export const TypeProp: StoryObj = {
  render: TypeCase,
};

function ValidationStateCase() {
  return (
    <Column>
      <Flex>
        <Textfield placeholder="text none" />
        <Textfield placeholder="text error" validationState="error" />
      </Flex>
      <Flex>
        <Textfield type="password" placeholder="password none" />
        <Textfield type="password" placeholder="password error" validationState="error" />
      </Flex>
      <Flex>
        <Textfield type="number" placeholder="number none" />
        <Textfield type="number" placeholder="number error" validationState="error" />
      </Flex>
    </Column>
  );
}

export const ValidationStateProp: StoryObj = {
  render: ValidationStateCase,
};

function DisabledReadOnlyCase() {
  return (
    <Column>
      <Flex>
        <Textfield placeholder="disabled" disabled />
        <Textfield placeholder="readOnly" readOnly value="readOnly" />
      </Flex>
      <Flex>
        <Textfield type="password" placeholder="disabled" disabled />
        <Textfield type="password" placeholder="readOnly" readOnly value="readOnly" />
      </Flex>
      <Flex>
        <Textfield type="number" placeholder="disabled" disabled />
        <Textfield type="number" placeholder="readOnly" readOnly value="readOnly" />
      </Flex>
    </Column>
  );
}

export const DisabledReadOnlyProp: StoryObj = {
  render: DisabledReadOnlyCase,
};

function SlotCase() {
  return (
    <Column width="300px">
      <Textfield.Box>
        <Icon name="ic-search" />
        <Textfield.Input placeholder="Placeholder" />
      </Textfield.Box>

      <Textfield.Box>
        <Textfield.Slot>검색어 : </Textfield.Slot>
        <Textfield.Input placeholder="Placeholder" />
      </Textfield.Box>

      <Textfield.Box>
        <Textfield.Input placeholder="Placeholder" />
        <Textfield.Slot>개</Textfield.Slot>
      </Textfield.Box>
    </Column>
  );
}

export const SlotProp: StoryObj = {
  render: SlotCase,
};

function CountCase() {
  const [value, setValue] = useState('');

  return (
    <Column width="300px">
      <Textfield.Box>
        <Textfield.Input placeholder="Placeholder" value={value} onValueChange={setValue} maxLength={10} />
        <Textfield.Count />
      </Textfield.Box>
    </Column>
  );
}

export const CountProp: StoryObj = {
  render: CountCase,
};

function ClearCase() {
  const [value, setValue] = useState('value');

  return (
    <Column width="300px">
      <Textfield value={value} onValueChange={setValue} placeholder="Placeholder" onClear={() => setValue('')} />
    </Column>
  );
}

export const ClearProp: StoryObj = {
  render: ClearCase,
};
