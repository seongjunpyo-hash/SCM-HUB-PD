/* eslint-disable @typescript-eslint/no-unused-vars */

import React from 'react';

import { StatusTag } from '@musinsa/layer-components-desktop';

import { Column, Flex } from '../../../../shared/components/Flex';

import type { Meta, StoryObj } from '@storybook/react';

document.documentElement.setAttribute('data-layer-platform', 'desktop');
document.documentElement.setAttribute('data-layer-theme', 'light');

const meta: Meta<typeof StatusTag> = {
  title: 'Layer/components-desktop/Tags/StatusTag',
  component: StatusTag,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      description:
        '상태의 의미와 강조 수준을 설정합니다. `default`: 중립 상태 (강조가 필요 없는 상태) / `progress`: 진행 또는 대기 상태 / `success`: 긍정적인 결과를 강조하고 싶을 때 / `warning`: 주의 또는 확인이 필요한 상태 / `critical`: 중단되었거나 즉시 조치가 필요한 상태',
      control: { type: 'select' },
      options: ['default', 'progress', 'success', 'warning', 'critical'],
      table: {
        defaultValue: { summary: 'default' },
        type: { summary: "'default' | 'progress' | 'success' | 'warning' | 'critical'" },
      },
    },
    progressType: {
      description:
        'progress 상태를 시각적으로 구분합니다. `variant="progress"`일 때만 사용합니다. 우선순위를 의미하지 않으며, 기본 사용 순서는 primary → secondary → tertiary를 권장합니다.',
      control: { type: 'select' },
      options: ['primary', 'secondary', 'tertiary'],
      table: {
        defaultValue: { summary: 'primary' },
        type: { summary: "'primary' | 'secondary' | 'tertiary'" },
      },
      if: { arg: 'variant', eq: 'progress' },
    },
    emphasis: {
      description:
        '시각적 강조 방식을 설정합니다. `solid`: 기본 표현 (배경 포함) / `subtle`: 보조 표현 (배경 없이 텍스트 중심)',
      control: { type: 'radio' },
      options: ['solid', 'subtle'],
      table: {
        defaultValue: { summary: 'solid' },
        type: { summary: "'solid' | 'subtle'" },
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
    badge: {
      description: '점(dot) 형태의 배지를 함께 표시할지 여부를 설정합니다.',
      control: { type: 'boolean' },
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
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

type Story = StoryObj<typeof StatusTag>;

// ---------------------------------------------------------------------------
// Playground
// ---------------------------------------------------------------------------

/**
 * Controls 패널에서 모든 props를 자유롭게 변경해보세요.
 */
export const Playground: Story = {
  render: (args) => <StatusTag {...args} />,
  args: {
    variant: 'default',
    emphasis: 'solid',
    size: 'medium',
    label: '상태',
    badge: true,
    infoIcon: false,
    count: undefined,
  },
};

// ---------------------------------------------------------------------------
// variant
// ---------------------------------------------------------------------------

/**
 * ### variant — 상태의 의미와 강조 수준 설정
 *
 * - `default` : 중립 상태 (강조가 필요 없는 상태)
 * - `progress` : 진행 또는 대기 상태
 * - `success` : 긍정적인 결과를 강조하고 싶을 때
 * - `warning` : 주의 또는 확인이 필요한 상태
 * - `critical` : 중단되었거나 즉시 조치가 필요한 상태
 */
export const Variant: Story = {
  render: (args) => (
    <Flex>
      <StatusTag label="default" variant="default" badge />
      <StatusTag label="progress" variant="progress" badge />
      <StatusTag label="success" variant="success" badge />
      <StatusTag label="warning" variant="warning" badge />
      <StatusTag label="critical" variant="critical" badge />
    </Flex>
  ),
  args: {},
};

// ---------------------------------------------------------------------------
// progressType
// ---------------------------------------------------------------------------

/**
 * ### ↪ progressType — progress 상태를 시각적으로 구분
 *
 * - `variant="progress"`일 때만 사용합니다.
 * - progressType은 우선순위를 의미하지 않습니다.
 * - 기본 사용 순서는 primary → secondary → tertiary를 권장하지만,
 *   도메인 맥락에 따라 일부 타입만 선택하거나 순서를 변경하여 사용할 수 있습니다.
 * - 단, primary 없이 secondary/tertiary를 사용하는 경우에는
 *   의도가 명확한 맥락에서만 사용해야 합니다.
 */
export const ProgressType: Story = {
  render: (args) => (
    <Flex>
      <StatusTag label="primary" variant="progress" progressType="primary" badge />
      <StatusTag label="secondary" variant="progress" progressType="secondary" badge />
      <StatusTag label="tertiary" variant="progress" progressType="tertiary" badge />
    </Flex>
  ),
  args: {},
};

// ---------------------------------------------------------------------------
// emphasis
// ---------------------------------------------------------------------------

/**
 * ### emphasis — 시각적 강조 방식
 *
 * - `solid` : 기본 표현 (배경 포함)
 * - `subtle` : 보조 표현 (배경 없이 텍스트 중심)
 */
export const Emphasis: Story = {
  render: (args) => (
    <Column>
      <Flex>
        <StatusTag label="solid" variant="default" emphasis="solid" badge />
        <StatusTag label="solid" variant="progress" emphasis="solid" badge />
        <StatusTag label="solid" variant="success" emphasis="solid" badge />
        <StatusTag label="solid" variant="warning" emphasis="solid" badge />
        <StatusTag label="solid" variant="critical" emphasis="solid" badge />
      </Flex>
      <Flex>
        <StatusTag label="subtle" variant="default" emphasis="subtle" badge />
        <StatusTag label="subtle" variant="progress" emphasis="subtle" badge />
        <StatusTag label="subtle" variant="success" emphasis="subtle" badge />
        <StatusTag label="subtle" variant="warning" emphasis="subtle" badge />
        <StatusTag label="subtle" variant="critical" emphasis="subtle" badge />
      </Flex>
    </Column>
  ),
  args: {},
};

// ---------------------------------------------------------------------------
// size
// ---------------------------------------------------------------------------

/**
 * ### size
 *
 * `xsmall` (h20) / `small` (h24) / `medium` (h28, 기본값)
 */
export const Size: Story = {
  render: (args) => (
    <Flex>
      <StatusTag label="xsmall" size="xsmall" badge />
      <StatusTag label="small" size="small" badge />
      <StatusTag label="medium" size="medium" badge />
    </Flex>
  ),
  args: {},
};

// ---------------------------------------------------------------------------
// badge
// ---------------------------------------------------------------------------

/**
 * ### 🎨 badge — 점(dot) 형태의 배지를 함께 표시할지 여부
 */
export const Badge: Story = {
  render: (args) => (
    <Column>
      <Flex>
        <StatusTag label="badge=false" variant="default" />
        <StatusTag label="badge=true" variant="default" badge />
      </Flex>
      <Flex>
        <StatusTag label="progress primary" variant="progress" progressType="primary" badge />
        <StatusTag label="progress secondary" variant="progress" progressType="secondary" badge />
        <StatusTag label="progress tertiary" variant="progress" progressType="tertiary" badge />
      </Flex>
    </Column>
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
        <StatusTag label="주문" count={3} badge />
        <StatusTag label="검수" variant="progress" count={12} badge />
        <StatusTag label="완료" variant="success" count={99} badge />
      </Flex>
      <Flex>
        <StatusTag label="주문" count={3} emphasis="subtle" badge />
        <StatusTag label="검수" variant="progress" count={12} emphasis="subtle" badge />
        <StatusTag label="완료" variant="success" count={99} emphasis="subtle" badge />
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
    <Flex>
      <StatusTag label="안내" infoIcon badge />
      <StatusTag label="진행중" variant="progress" infoIcon badge />
      <StatusTag label="주의" variant="warning" infoIcon badge />
    </Flex>
  ),
  args: {},
};

// ---------------------------------------------------------------------------
// Emphasis + ProgressType 조합
// ---------------------------------------------------------------------------

/**
 * ### emphasis + progressType 조합
 *
 * progress variant에서 emphasis와 progressType의 모든 조합입니다.
 */
export const EmphasisWithProgressType: Story = {
  render: (args) => (
    <Column>
      <Flex>
        <StatusTag label="solid / primary" variant="progress" progressType="primary" emphasis="solid" badge />
        <StatusTag label="solid / secondary" variant="progress" progressType="secondary" emphasis="solid" badge />
        <StatusTag label="solid / tertiary" variant="progress" progressType="tertiary" emphasis="solid" badge />
      </Flex>
      <Flex>
        <StatusTag label="subtle / primary" variant="progress" progressType="primary" emphasis="subtle" badge />
        <StatusTag label="subtle / secondary" variant="progress" progressType="secondary" emphasis="subtle" badge />
        <StatusTag label="subtle / tertiary" variant="progress" progressType="tertiary" emphasis="subtle" badge />
      </Flex>
    </Column>
  ),
  args: {},
};

// ---------------------------------------------------------------------------
// 모든 옵션 조합 (Size x Emphasis)
// ---------------------------------------------------------------------------

/**
 * ### Size x Emphasis 매트릭스
 *
 * 모든 사이즈와 emphasis 조합을 한 눈에 확인할 수 있습니다.
 */
export const SizeEmphasisMatrix: Story = {
  render: (args) => (
    <Column>
      <Flex>
        <StatusTag label="xs/solid" size="xsmall" emphasis="solid" badge />
        <StatusTag label="sm/solid" size="small" emphasis="solid" badge />
        <StatusTag label="md/solid" size="medium" emphasis="solid" badge />
      </Flex>
      <Flex>
        <StatusTag label="xs/subtle" size="xsmall" emphasis="subtle" badge />
        <StatusTag label="sm/subtle" size="small" emphasis="subtle" badge />
        <StatusTag label="md/subtle" size="medium" emphasis="subtle" badge />
      </Flex>
    </Column>
  ),
  args: {},
};

// ---------------------------------------------------------------------------
// count + infoIcon 복합 사용
// ---------------------------------------------------------------------------

/**
 * ### count + infoIcon 동시 사용
 *
 * count와 infoIcon을 함께 사용하는 케이스입니다.
 */
export const CountWithInfoIcon: Story = {
  render: (args) => (
    <Flex>
      <StatusTag label="주문" count={5} infoIcon badge />
      <StatusTag label="처리중" variant="progress" count={2} infoIcon badge />
      <StatusTag label="완료" variant="success" count={10} infoIcon badge />
    </Flex>
  ),
  args: {},
};
