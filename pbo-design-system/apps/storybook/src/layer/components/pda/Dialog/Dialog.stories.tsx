import React from 'react';

import { Button, ButtonGroup, Dialog, Loading } from '@musinsa/layer-components-pda';

import type { Meta, StoryObj } from '@storybook/react';

document.documentElement.setAttribute('data-layer-platform', 'pda');
document.documentElement.setAttribute('data-layer-theme', 'light');

const style = document.createElement('style');
style.textContent = `
  body {
    overflow: auto !important;
  }
`;
document.head.appendChild(style);

function DialogComposition() {
  return (
    <div style={{ height: 500 }}>
      <Dialog open={true}>
        <Dialog.Title>Title</Dialog.Title>
        <Dialog.SubTitle>Sub Title</Dialog.SubTitle>
        <Dialog.Content>Content</Dialog.Content>
        <Dialog.Action>
          <ButtonGroup>
            <Button variant="secondary" label="Cancel" />
            <Button variant="primary" label="Confirm" />
          </ButtonGroup>
        </Dialog.Action>
      </Dialog>
    </div>
  );
}

const meta: Meta<typeof DialogComposition> = {
  title: 'Layer/components-pda/Dialog',
  component: DialogComposition,
  argTypes: {
    open: {
      description: 'Dialog의 열림 상태를 나타냅니다.',
      control: { type: 'boolean' },
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
        subcategory: 'Dialog.Root',
      },
    },
    type: {
      description: 'Dialog의 타입을 나타냅니다.',
      control: { type: 'radio' },
      options: ['default', 'failFeedback'],
      table: {
        defaultValue: { summary: 'default' },
        type: { summary: 'default | failFeedback' },
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

export const FailFeedback: StoryObj = {
  render: () => (
    <div style={{ height: 500 }}>
      <Dialog open={true} type="failFeedback">
        <Dialog.Title>Title</Dialog.Title>
        <Dialog.SubTitle>Sub Title</Dialog.SubTitle>
        <Dialog.Content>Content</Dialog.Content>
        <Dialog.Action>
          <ButtonGroup>
            <Button variant="secondary" label="Cancel" />
            <Button variant="negative" label="Confirm" />
          </ButtonGroup>
        </Dialog.Action>
      </Dialog>
    </div>
  ),
};

export const OnlyTitle: StoryObj = {
  render: () => (
    <div style={{ height: 500 }}>
      <Dialog open={true}>
        <Dialog.Title>Title</Dialog.Title>
        <Dialog.Action>
          <ButtonGroup>
            <Button variant="secondary" label="Cancel" />
            <Button variant="primary" label="Confirm" />
          </ButtonGroup>
        </Dialog.Action>
      </Dialog>
    </div>
  ),
};

export const NoContent: StoryObj = {
  render: () => (
    <div style={{ height: 500 }}>
      <Dialog open={true}>
        <Dialog.Title>Title</Dialog.Title>
        <Dialog.SubTitle>Sub Title</Dialog.SubTitle>
        <Dialog.Action>
          <Button variant="primary" label="Confirm" />
        </Dialog.Action>
      </Dialog>
    </div>
  ),
};

export const LoadingDialog: StoryObj = {
  render: () => (
    <div style={{ height: 500 }}>
      <Dialog open={true}>
        <Dialog.Title>Title</Dialog.Title>
        <Dialog.SubTitle>Sub Title</Dialog.SubTitle>
        <Dialog.Content>
          <Loading style={{ margin: 'auto' }} />
        </Dialog.Content>
      </Dialog>
    </div>
  ),
};
