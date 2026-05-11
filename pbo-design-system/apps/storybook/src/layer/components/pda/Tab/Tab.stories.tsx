import React, { useState } from 'react';

import { Tab } from '@musinsa/layer-components-pda';
import { Icon } from '@musinsa/pbo-assets';

import { Column, Flex } from '../../../../shared/components/Flex';

import type { Meta, StoryObj } from '@storybook/react';

document.documentElement.setAttribute('data-layer-platform', 'pda');
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
  title: 'Layer/components-pda/Tab',
  component: TabComposition,
  argTypes: {
    widthMode: {
      description: 'Tab의 너비 타입을 나타냅니다.',
      control: { type: 'radio' },
      options: ['hug', 'fill'],
      table: {
        defaultValue: { summary: 'hug' },
        type: { summary: 'hug | fill' },
        subcategory: 'Tab.Root',
      },
    },
    value: {
      description: 'Tab의 값을 나타냅니다.',
      control: { type: 'radio' },
      options: ['One', 'Two', 'Three'],
      table: {
        type: { summary: 'T extends string' },
        subcategory: 'Tab.Root | Tab.Item',
      },
    },
    onValueChange: {
      description: 'Tab의 값이 변경될 때 호출되는 함수를 나타냅니다.',
      table: {
        type: { summary: '(value: T) => void' },
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

function TabWidthMode() {
  type Fruit = 'Apple' | 'Banana' | 'Cherry';
  const [tabValue, setTabValue] = useState<Fruit>('Apple');

  return (
    <Column>
      <Tab.Root widthMode="hug" value={tabValue} onValueChange={setTabValue}>
        <Tab.Item value="Apple" label="사과" />
        <Tab.Item value="Banana" label="바나나" />
        <Tab.Item value="Cherry" label="체리" />
      </Tab.Root>

      <Tab.Root widthMode="fill" value={tabValue} onValueChange={setTabValue}>
        <Tab.Item value="Apple" label="사과" />
        <Tab.Item value="Banana" label="바나나" />
        <Tab.Item value="Cherry" label="체리" />
      </Tab.Root>
    </Column>
  );
}

export const WidthMode: StoryObj = {
  render: TabWidthMode,
};

function TabItemChildren() {
  type Fruit = 'Apple' | 'Banana' | 'Cherry';
  const [tabValue, setTabValue] = useState<Fruit>('Apple');

  return (
    <Tab.Root widthMode="fill" value={tabValue} onValueChange={setTabValue}>
      <Tab.Item value="Apple">
        <Flex gap={4}>
          사과
          <Icon name="ic-checkCircle" />
        </Flex>
      </Tab.Item>
      <Tab.Item value="Banana">
        <Flex gap={4}>
          바나나
          <Icon name="ic-checkCircle" />
        </Flex>
      </Tab.Item>
      <Tab.Item value="Cherry">
        <Flex gap={4}>
          체리
          <Icon name="ic-checkCircle" />
        </Flex>
      </Tab.Item>
    </Tab.Root>
  );
}

export const ItemChildren: StoryObj = {
  render: TabItemChildren,
};
