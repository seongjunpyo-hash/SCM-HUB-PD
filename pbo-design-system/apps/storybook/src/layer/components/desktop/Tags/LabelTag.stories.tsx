/* eslint-disable @typescript-eslint/no-unused-vars */

import React from 'react';

import { LabelTag } from '@musinsa/layer-components-desktop';

import { Column, Flex } from '../../../../shared/components/Flex';

import type { Meta, StoryObj } from '@storybook/react';

document.documentElement.setAttribute('data-layer-platform', 'desktop');
document.documentElement.setAttribute('data-layer-theme', 'light');

const meta: Meta<typeof LabelTag> = {
  title: 'Layer/components-desktop/Tags/LabelTag',
  component: LabelTag,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    colorVariant: {
      description: '분류 또는 속성을 구분하기 위한 색상입니다. 진행, 완료, 경고 등 상태의 의미를 표현하지 않습니다.',
      control: { type: 'select' },
      options: ['gray', 'blue', 'green', 'yellow', 'red'],
      table: {
        defaultValue: { summary: 'gray' },
        type: { summary: "'gray' | 'blue' | 'green' | 'yellow' | 'red'" },
      },
    },
    size: {
      description: '태그의 크기를 설정합니다.',
      control: { type: 'radio' },
      options: ['xsmall', 'small', 'medium'],
      table: {
        defaultValue: { summary: 'medium' },
        type: { summary: "'xsmall' | 'small' | 'medium'" },
      },
    },
    count: {
      description: 'Label 옆 숫자 정보를 함께 표시합니다. 표시할 숫자 값을 설정합니다.',
      control: { type: 'number' },
      table: {
        defaultValue: { summary: 'undefined' },
        type: { summary: 'number' },
      },
    },
    infoIcon: {
      description: '우측에 정보 아이콘을 표시할지 여부를 설정합니다.',
      control: { type: 'boolean' },
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    label: {
      description: '태그에 표시할 텍스트입니다.',
      control: { type: 'text' },
      table: {
        type: { summary: 'string' },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof LabelTag>;

// ---------------------------------------------------------------------------
// Playground
// ---------------------------------------------------------------------------

/**
 * Controls 패널에서 모든 props를 자유롭게 변경해보세요.
 */
export const Playground: Story = {
  render: (args) => <LabelTag {...args} />,
  args: {
    colorVariant: 'gray',
    size: 'medium',
    label: '라벨',
    count: undefined,
    infoIcon: false,
  },
};

// ---------------------------------------------------------------------------
// colorVariant
// ---------------------------------------------------------------------------

/**
 * ### colorVariant — 분류 또는 속성을 구분하기 위한 색상
 *
 * 진행, 완료, 경고 등 상태의 의미를 표현하지 않습니다.
 */
export const ColorVariant: Story = {
  render: (args) => (
    <Flex>
      <LabelTag label="gray" colorVariant="gray" />
      <LabelTag label="blue" colorVariant="blue" />
      <LabelTag label="green" colorVariant="green" />
      <LabelTag label="yellow" colorVariant="yellow" />
      <LabelTag label="red" colorVariant="red" />
    </Flex>
  ),
  args: {},
};

// ---------------------------------------------------------------------------
// size
// ---------------------------------------------------------------------------

/**
 * ### size
 *
 * `xsmall` / `small` / `medium` (기본값)
 */
export const Size: Story = {
  render: (args) => (
    <Flex>
      <LabelTag label="xsmall" size="xsmall" />
      <LabelTag label="small" size="small" />
      <LabelTag label="medium" size="medium" />
    </Flex>
  ),
  args: {},
};

// ---------------------------------------------------------------------------
// count
// ---------------------------------------------------------------------------

/**
 * ### count — Label 옆 숫자 정보를 함께 표시
 *
 * 표시할 숫자 값을 설정합니다.
 */
export const Count: Story = {
  render: (args) => (
    <Column>
      <Flex>
        <LabelTag label="전체" colorVariant="gray" count={128} />
        <LabelTag label="신규" colorVariant="blue" count={5} />
        <LabelTag label="승인" colorVariant="green" count={42} />
        <LabelTag label="보류" colorVariant="yellow" count={3} />
        <LabelTag label="반려" colorVariant="red" count={1} />
      </Flex>
    </Column>
  ),
  args: {},
};

// ---------------------------------------------------------------------------
// infoIcon
// ---------------------------------------------------------------------------

/**
 * ### 🎨 infoIcon — 우측에 정보 아이콘을 표시할지 여부
 */
export const InfoIcon: Story = {
  render: (args) => (
    <Column>
      <Flex>
        <LabelTag label="infoIcon=false" />
        <LabelTag label="infoIcon=true" infoIcon />
      </Flex>
    </Column>
  ),
  args: {},
};

// ---------------------------------------------------------------------------
// count + infoIcon 동시 사용
// ---------------------------------------------------------------------------

/**
 * ### count + infoIcon 동시 사용
 *
 * count와 infoIcon을 함께 사용하는 케이스입니다.
 */
export const CountWithInfoIcon: Story = {
  render: (args) => (
    <Flex>
      <LabelTag label="전체" colorVariant="gray" count={128} infoIcon />
      <LabelTag label="신규" colorVariant="blue" count={5} infoIcon />
      <LabelTag label="승인" colorVariant="green" count={42} infoIcon />
    </Flex>
  ),
  args: {},
};

// ---------------------------------------------------------------------------
// Size x ColorVariant 매트릭스
// ---------------------------------------------------------------------------

/**
 * ### Size x ColorVariant 매트릭스
 *
 * 모든 사이즈와 색상 조합을 한 눈에 확인할 수 있습니다.
 */
export const SizeColorVariantMatrix: Story = {
  render: (args) => (
    <Column gap={16}>
      <Flex>
        <LabelTag label="xs/gray" size="xsmall" colorVariant="gray" />
        <LabelTag label="xs/blue" size="xsmall" colorVariant="blue" />
        <LabelTag label="xs/green" size="xsmall" colorVariant="green" />
        <LabelTag label="xs/yellow" size="xsmall" colorVariant="yellow" />
        <LabelTag label="xs/red" size="xsmall" colorVariant="red" />
      </Flex>
      <Flex>
        <LabelTag label="sm/gray" size="small" colorVariant="gray" />
        <LabelTag label="sm/blue" size="small" colorVariant="blue" />
        <LabelTag label="sm/green" size="small" colorVariant="green" />
        <LabelTag label="sm/yellow" size="small" colorVariant="yellow" />
        <LabelTag label="sm/red" size="small" colorVariant="red" />
      </Flex>
      <Flex>
        <LabelTag label="md/gray" size="medium" colorVariant="gray" />
        <LabelTag label="md/blue" size="medium" colorVariant="blue" />
        <LabelTag label="md/green" size="medium" colorVariant="green" />
        <LabelTag label="md/yellow" size="medium" colorVariant="yellow" />
        <LabelTag label="md/red" size="medium" colorVariant="red" />
      </Flex>
    </Column>
  ),
  args: {},
};

// ---------------------------------------------------------------------------
// infoIcon Size별 padding 차이
// ---------------------------------------------------------------------------

/**
 * ### infoIcon에 따른 padding 차이
 *
 * `infoIcon` 활성화 여부에 따라 size별 padding이 달라집니다.
 */
export const InfoIconPaddingBySize: Story = {
  render: (args) => (
    <Column gap={16}>
      <Flex>
        <LabelTag label="xs" size="xsmall" />
        <LabelTag label="xs + icon" size="xsmall" infoIcon />
      </Flex>
      <Flex>
        <LabelTag label="sm" size="small" />
        <LabelTag label="sm + icon" size="small" infoIcon />
      </Flex>
      <Flex>
        <LabelTag label="md" size="medium" />
        <LabelTag label="md + icon" size="medium" infoIcon />
      </Flex>
    </Column>
  ),
  args: {},
};

// ---------------------------------------------------------------------------
// 실사용 예시
// ---------------------------------------------------------------------------

/**
 * ### 실사용 예시
 *
 * 실제 업무 도메인에서 활용할 수 있는 조합 예시입니다.
 */
export const RealWorldExample: Story = {
  render: (args) => (
    <Column gap={16}>
      <Flex>
        <LabelTag label="카테고리" colorVariant="gray" />
        <LabelTag label="신상품" colorVariant="blue" />
        <LabelTag label="입고완료" colorVariant="green" count={15} />
      </Flex>
      <Flex>
        <LabelTag label="할인" colorVariant="red" count={3} />
        <LabelTag label="주의" colorVariant="yellow" infoIcon />
        <LabelTag label="전체" colorVariant="gray" count={256} infoIcon />
      </Flex>
    </Column>
  ),
  args: {},
};
