/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';

import { Button, ButtonGroup } from '@musinsa/layer-components-pda';

import { Column } from '../../../shared/components/Flex';

import type { Meta, StoryObj } from '@storybook/react';
import type { PropsWithChildren } from 'react';

document.documentElement.setAttribute('data-layer-platform', 'pda');
document.documentElement.setAttribute('data-layer-theme', 'light');

const meta: Meta<typeof ButtonGroup> = {
  title: 'Layer/components-pda/ButtonGroup',
  component: ButtonGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      description: 'ButtonGroup의 자식 요소를 나타냅니다.',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    stretchMode: {
      description: 'ButtonGroup의 너비 타입을 나타냅니다.',
      control: { type: 'radio' },
      options: ['both', 'last'],
      table: {
        defaultValue: { summary: 'both' },
        type: { summary: 'both | last' },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof ButtonGroup>;

const Wrap = ({ children }: PropsWithChildren) => <div style={{ width: 400 }}>{children}</div>;
Wrap.displayName = 'Wrap';

export const Default: Story = {
  render: (args) => (
    <Wrap>
      <ButtonGroup {...args}>
        <Button variant="secondary" label="cancel" />
        <Button variant="primary" label="submit" />
      </ButtonGroup>
    </Wrap>
  ),
  args: {
    stretchMode: 'both',
  },
};

export const stretchModeProp: Story = {
  render: (args) => (
    <Column width="400px">
      <ButtonGroup stretchMode="both">
        <Button variant="secondary" label="cancel" />
        <Button variant="primary" label="submit" />
      </ButtonGroup>
      <ButtonGroup stretchMode="last">
        <Button variant="secondary" label="cancel" />
        <Button variant="primary" label="submit" />
      </ButtonGroup>
    </Column>
  ),
  args: {},
};
