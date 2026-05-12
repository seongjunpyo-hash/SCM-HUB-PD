import React, { useState } from 'react';

import { Tab } from '@musinsa/layer-components-desktop';

import { Column } from '../../../../shared/components/Flex';

import type { Meta, StoryObj } from '@storybook/react';

document.documentElement.setAttribute('data-layer-platform', 'desktop');
document.documentElement.setAttribute('data-layer-theme', 'light');

function TabComposition() {
  type Fruit = 'Apple' | 'Banana' | 'Cherry';
  const [tabValue, setTabValue] = useState<Fruit>('Apple');

  return (
    <Tab.Root value={tabValue} onValueChange={setTabValue}>
      <Tab.Item value="Apple" label="사과" />
      <Tab.Item value="Banana" label="바나나" />
      <Tab.Item value="Cherry" label="체리" />
    </Tab.Root>
  );
}

const meta: Meta<typeof TabComposition> = {
  title: 'Layer/components-desktop/Tab',
  component: TabComposition,
  argTypes: {
    size: {
      description: 'Tab의 크기를 나타냅니다.',
      control: { type: 'radio' },
      options: ['large', 'medium'],
      table: {
        defaultValue: { summary: 'large' },
        type: { summary: 'large | medium' },
        subcategory: 'Tab.Root',
      },
    },
    type: {
      description: 'Tab의 타입을 나타냅니다.',
      control: { type: 'radio' },
      options: ['tabLine', 'tabBox', 'tabText'],
      table: {
        defaultValue: { summary: 'tabLine' },
        type: { summary: 'tabLine | tabBox | tabText' },
        subcategory: 'Tab.Root',
      },
    },
    value: {
      description: 'Tab의 값을 나타냅니다.',
      control: { type: 'radio' },
      options: ['Apple', 'Banana', 'Cherry'],
      table: {
        type: { summary: 'T extends string' },
        subcategory: 'Tab.Root | Tab.Item',
      },
    },
    onValueChange: {
      description: 'Tab의 값이 변경될 때 호출되는 함수를 나타냅니다.',
      table: {
        type: { summary: '(value: T extends string) => void' },
        subcategory: 'Tab.Root',
      },
    },
    label: {
      description: 'TabItem의 라벨을 나타냅니다.',
      control: { type: 'text' },
      table: {
        type: { summary: 'string | ReactNode' },
        subcategory: 'Tab.Item',
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
  type Fruit = 'Apple' | 'Banana' | 'Cherry';
  const [tabValue, setTabValue] = useState<Fruit>('Apple');

  return (
    <Column>
      {/* tabLine */}
      <Tab.Root type="tabLine" size="large" value={tabValue} onValueChange={setTabValue}>
        <Tab.Item value="Apple" label="사과" />
        <Tab.Item value="Banana" label="바나나" />
        <Tab.Item value="Cherry" label="체리" />
      </Tab.Root>
      <Tab.Root type="tabLine" size="medium" value={tabValue} onValueChange={setTabValue}>
        <Tab.Item value="Apple" label="사과" />
        <Tab.Item value="Banana" label="바나나" />
        <Tab.Item value="Cherry" label="체리" />
      </Tab.Root>

      {/* tabBox */}
      <Tab.Root type="tabBox" size="large" value={tabValue} onValueChange={setTabValue}>
        <Tab.Item value="Apple" label="사과" />
        <Tab.Item value="Banana" label="바나나" />
        <Tab.Item value="Cherry" label="체리" />
      </Tab.Root>
      <Tab.Root type="tabBox" size="medium" value={tabValue} onValueChange={setTabValue}>
        <Tab.Item value="Apple" label="사과" />
        <Tab.Item value="Banana" label="바나나" />
        <Tab.Item value="Cherry" label="체리" />
      </Tab.Root>

      {/* tabText */}
      <Tab.Root type="tabText" size="large" value={tabValue} onValueChange={setTabValue}>
        <Tab.Item value="Apple" label="사과" />
        <Tab.Item value="Banana" label="바나나" />
        <Tab.Item value="Cherry" label="체리" />
      </Tab.Root>
      <Tab.Root type="tabText" size="medium" value={tabValue} onValueChange={setTabValue}>
        <Tab.Item value="Apple" label="사과" />
        <Tab.Item value="Banana" label="바나나" />
        <Tab.Item value="Cherry" label="체리" />
      </Tab.Root>
    </Column>
  );
}

export const TypeProp: StoryObj = {
  render: TypeCase,
};
