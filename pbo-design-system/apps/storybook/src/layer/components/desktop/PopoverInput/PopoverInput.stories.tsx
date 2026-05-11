import React, { useState } from 'react';

import { PopoverInput, SecondaryButton, Textfield, Typography } from '@musinsa/layer-components-desktop';

import { Column } from '../../../../shared/components/Flex';

import type { Meta, StoryObj } from '@storybook/react';

document.documentElement.setAttribute('data-layer-platform', 'desktop');
document.documentElement.setAttribute('data-layer-theme', 'light');

function PopoverInputComposition() {
  const [open, setOpen] = useState(false);

  const [value, setValue] = useState('');
  const [input, setInput] = useState('');

  return (
    <Column width="300px">
      <PopoverInput.Root open={open} setOpen={setOpen}>
        <PopoverInput.Trigger floatingBlockLabel="label" required placeholder="placeholder" displayValue={value} />

        <PopoverInput.Content style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Textfield placeholder="placeholder" value={input} onValueChange={setInput} />
          <Typography name="base-text-l" colorToken="fg-lower">
            입력 후 적용을 눌러주세요.
          </Typography>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <SecondaryButton
              size="medium"
              label="적용"
              disabled={!input}
              onClick={() => {
                setValue(input);
                setInput('');
                setOpen(false);
              }}
            />
          </div>
        </PopoverInput.Content>
      </PopoverInput.Root>

      <div style={{ height: 300 }} />
    </Column>
  );
}

const meta: Meta<typeof PopoverInputComposition> = {
  title: 'Layer/components-desktop/PopoverInput',
  component: PopoverInputComposition,
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
