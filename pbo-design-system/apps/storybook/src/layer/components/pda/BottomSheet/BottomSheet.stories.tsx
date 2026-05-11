import React, { useState } from 'react';

import { BottomSheet, Button, OptionList } from '@musinsa/layer-components-pda';

import type { Meta, StoryObj } from '@storybook/react';
import type { PropsWithChildren } from 'react';

document.documentElement.setAttribute('data-layer-platform', 'pda');
document.documentElement.setAttribute('data-layer-theme', 'light');

const Container = ({ children }: PropsWithChildren) => (
  <div
    style={{
      width: '100%',
      height: '500px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    {children}
  </div>
);

function OptionSelectExample() {
  const [open, setOpen] = useState(false);

  return (
    <Container>
      <Button label="Open" onClick={() => setOpen(true)} />
      <BottomSheet type="optionSelect" title="옵션 선택" open={open} onClose={() => setOpen(false)}>
        <OptionList label="option 1" />
        <OptionList label="option 2" isChecked />
        <OptionList label="option 3" />
        <OptionList label="option 4" />
        <OptionList label="option 5" />
        <OptionList label="option 6" />
        <OptionList label="option 7" />
        <OptionList label="option 8" />
        <OptionList label="option 9" />
        <OptionList label="option 10" />
      </BottomSheet>
    </Container>
  );
}

const meta: Meta<typeof BottomSheet> = {
  title: 'Layer/components-pda/BottomSheet',
  component: BottomSheet,
  argTypes: {
    open: {
      description: 'BottomSheet의 열림 상태를 나타냅니다.',
      control: { type: 'boolean' },
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    onClose: {
      description: 'BottomSheet의 닫힘 이벤트를 나타냅니다.',
      table: {
        type: { summary: '() => void' },
      },
    },
    title: {
      description: 'BottomSheet의 제목을 나타냅니다.',
      control: { type: 'text' },
      table: {
        type: { summary: 'string' },
      },
    },
    type: {
      description: 'BottomSheet의 타입을 나타냅니다.',
      control: { type: 'radio' },
      options: ['optionSelect'],
      table: {
        defaultValue: { summary: 'optionSelect' },
        type: { summary: 'optionSelect' },
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

export const OptionSelect: StoryObj = {
  render: () => <OptionSelectExample />,
};
