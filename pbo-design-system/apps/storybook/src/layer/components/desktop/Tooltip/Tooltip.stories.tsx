/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';

import { PrimaryButton, Tooltip } from '@musinsa/layer-components-desktop';
import { Icon } from '@musinsa/pbo-assets';

import type { Meta, StoryObj } from '@storybook/react';

document.documentElement.setAttribute('data-layer-platform', 'desktop');
document.documentElement.setAttribute('data-layer-theme', 'light');

function TooltipComposition() {
  return (
    <Wrap>
      <Tooltip.Root>
        <Tooltip.Trigger>
          <Icon name="ic-alertCircle" />
        </Tooltip.Trigger>
        <Tooltip.Content>Hello~ MUSINSA</Tooltip.Content>
      </Tooltip.Root>
    </Wrap>
  );
}

const meta: Meta<typeof TooltipComposition> = {
  title: 'Layer/components-desktop/Tooltip',
  component: TooltipComposition,
  argTypes: {
    action: {
      description: 'Tooltip.Trigger의 액션을 나타냅니다.',
      control: { type: 'radio' },
      options: ['hover', 'click'],
      table: {
        defaultValue: { summary: 'hover' },
        type: { summary: 'hover | click' },
        subcategory: 'Tooltip.Trigger',
      },
    },
    variant: {
      description: 'Tooltip.Content의 배경색을 나타냅니다.',
      control: { type: 'radio' },
      options: ['black', 'white'],
      table: {
        defaultValue: { summary: 'black' },
        type: { summary: 'black | white' },
        subcategory: 'Tooltip.Content',
      },
    },
    placement: {
      description: 'Tooltip.Content의 위치를 나타냅니다.',
      control: { type: 'radio' },
      options: ['top', 'topStart', 'topEnd', 'left', 'right', 'bottom', 'bottomStart', 'bottomEnd'],
      table: {
        defaultValue: { summary: 'top' },
        type: { summary: 'top | topStart | topEnd | left | right | bottom | bottomStart | bottomEnd' },
        subcategory: 'Tooltip.Content',
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

const Wrap = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => {
  return (
    <div
      style={{
        padding: 64,
        display: 'flex',
        gap: 24,
        justifyContent: 'center',
        alignItems: 'center',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Default: StoryObj = {};

export const UseActionProp: StoryObj = {
  render: () => (
    <Wrap>
      <Tooltip.Root>
        <Tooltip.Trigger action="hover">
          <PrimaryButton>hover</PrimaryButton>
        </Tooltip.Trigger>
        <Tooltip.Content>Hello~ MUSINSA</Tooltip.Content>
      </Tooltip.Root>
      <Tooltip.Root>
        <Tooltip.Trigger action="click">
          <PrimaryButton>click</PrimaryButton>
        </Tooltip.Trigger>
        <Tooltip.Content>Hello~ MUSINSA</Tooltip.Content>
      </Tooltip.Root>
    </Wrap>
  ),
  args: {},
};

export const VariantProps: StoryObj = {
  render: (args) => (
    <Wrap style={{ backgroundColor: '#f0f0f0' }}>
      <Tooltip.Root>
        <Tooltip.Trigger>
          <Icon name="ic-alertCircle" />
        </Tooltip.Trigger>
        <Tooltip.Content variant="black">Hello~ MUSINSA</Tooltip.Content>
      </Tooltip.Root>
      <Tooltip.Root>
        <Tooltip.Trigger>
          <Icon name="ic-alertCircle" />
        </Tooltip.Trigger>
        <Tooltip.Content variant="white">Hello~ MUSINSA</Tooltip.Content>
      </Tooltip.Root>
    </Wrap>
  ),
  args: {},
};

const Grid = ({ children }: { children: React.ReactNode }) => {
  return <div style={{ padding: 48, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>{children}</div>;
};

export const PlacementProps: StoryObj = {
  render: (args) => (
    <Grid>
      <Tooltip.Root>
        <Tooltip.Trigger>
          <PrimaryButton>topStart</PrimaryButton>
        </Tooltip.Trigger>
        <Tooltip.Content placement="topStart">Hello~ MUSINSA</Tooltip.Content>
      </Tooltip.Root>
      <Tooltip.Root>
        <Tooltip.Trigger>
          <PrimaryButton>top</PrimaryButton>
        </Tooltip.Trigger>
        <Tooltip.Content placement="top">Hello~ MUSINSA</Tooltip.Content>
      </Tooltip.Root>
      <Tooltip.Root>
        <Tooltip.Trigger>
          <PrimaryButton>topEnd</PrimaryButton>
        </Tooltip.Trigger>
        <Tooltip.Content placement="topEnd">Hello~ MUSINSA</Tooltip.Content>
      </Tooltip.Root>
      <Tooltip.Root>
        <Tooltip.Trigger>
          <PrimaryButton>left</PrimaryButton>
        </Tooltip.Trigger>
        <Tooltip.Content placement="left">Hello~ MUSINSA</Tooltip.Content>
      </Tooltip.Root>
      <div />
      <Tooltip.Root>
        <Tooltip.Trigger>
          <PrimaryButton>right</PrimaryButton>
        </Tooltip.Trigger>
        <Tooltip.Content placement="right">Hello~ MUSINSA</Tooltip.Content>
      </Tooltip.Root>
      <Tooltip.Root>
        <Tooltip.Trigger>
          <PrimaryButton>bottomStart</PrimaryButton>
        </Tooltip.Trigger>
        <Tooltip.Content placement="bottomStart">Hello~ MUSINSA</Tooltip.Content>
      </Tooltip.Root>
      <Tooltip.Root>
        <Tooltip.Trigger>
          <PrimaryButton>bottom</PrimaryButton>
        </Tooltip.Trigger>
        <Tooltip.Content placement="bottom">Hello~ MUSINSA</Tooltip.Content>
      </Tooltip.Root>
      <Tooltip.Root>
        <Tooltip.Trigger>
          <PrimaryButton>bottomEnd</PrimaryButton>
        </Tooltip.Trigger>
        <Tooltip.Content placement="bottomEnd">Hello~ MUSINSA</Tooltip.Content>
      </Tooltip.Root>
    </Grid>
  ),
  args: {},
};
