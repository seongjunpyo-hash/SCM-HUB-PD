import React, { useState } from 'react';

import { Select } from '@musinsa/layer-components-desktop';

import { Column } from '../../../../../shared/components/Flex';

import type { Meta, StoryObj } from '@storybook/react';

document.documentElement.setAttribute('data-layer-platform', 'desktop');
document.documentElement.setAttribute('data-layer-theme', 'light');

function SelectComposition() {
  const [fruit, setFruit] = useState('');

  const options = [
    { value: 'apple', label: '사과' },
    { value: 'banana', label: '바나나' },
    { value: 'cherry', label: '체리' },
  ];

  return (
    <Column width="300px">
      {/* 기본 형태 */}
      <Select value={fruit} onValueChange={setFruit} options={options} />

      {/* 커스텀이 필요한 경우 */}
      <Select.Root value={fruit} onValueChange={setFruit} options={options}>
        <Select.Trigger placeholder="과일을 선택해주세요." />
        <Select.OptionList placement="bottom">
          <Select.OptionGroup>
            <Select.OptionGroupTitle title="과일1" />
            <Select.Option value="apple" label="사과" />
          </Select.OptionGroup>
          <Select.OptionGroup>
            <Select.OptionGroupTitle title="과일2" />
            <Select.Option value="banana" label="바나나" />
            <Select.Option value="cherry" label="체리" />
          </Select.OptionGroup>
        </Select.OptionList>
      </Select.Root>
    </Column>
  );
}

const meta: Meta<typeof SelectComposition> = {
  title: 'Layer/components-desktop/Select/Select',
  component: SelectComposition,
  argTypes: {
    value: {
      description: 'Select의 선택된 값 또는 Option의 값을 나타냅니다.',
      control: { type: 'text' },
      table: {
        type: { summary: 'T extends string' },
        subcategory: 'Select.Root | Select.Option',
      },
    },
    onValueChange: {
      description: 'Select의 값이 변경될 때 호출되는 함수를 나타냅니다.',
      table: {
        type: { summary: '(value: T extends string) => void' },
        subcategory: 'Select.Root',
      },
    },
    placeholder: {
      description: 'Select.Trigger의 placeholder 텍스트를 나타냅니다.',
      control: { type: 'text' },
      table: {
        type: { summary: 'string' },
        subcategory: 'Select.Trigger',
      },
    },
    floatingBlockLabel: {
      description: 'Select.Trigger의 플로팅 블록 형태 라벨을 나타냅니다.',
      control: { type: 'text' },
      table: {
        type: { summary: 'string' },
        subcategory: 'Select.Trigger',
      },
    },
    required: {
      description: 'Select.Trigger의 필수 여부를 나타냅니다.(floatingBlockLabel과 같이 사용되야합니다.)',
      control: { type: 'boolean' },
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
        subcategory: 'Select.Trigger',
      },
    },
    validation: {
      description: 'Select.Trigger의 유효성 상태를 나타냅니다.',
      control: { type: 'radio' },
      options: ['none', 'error'],
      table: {
        defaultValue: { summary: 'none' },
        type: { summary: 'none | error' },
        subcategory: 'Select.Trigger',
      },
    },
    onClear: {
      description: 'Select.Trigger의 클리어 버튼 클릭 시 호출되는 함수를 나타냅니다.',
      table: {
        type: { summary: '(value: string) => void' },
        subcategory: 'Select.Trigger',
      },
    },
    disabled: {
      description: 'Select.Trigger의 비활성화 여부를 나타냅니다.',
      control: { type: 'boolean' },
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
        subcategory: 'Select.Trigger',
      },
    },
    readOnly: {
      description: 'Select.Trigger의 읽기 전용 여부를 나타냅니다.',
      control: { type: 'boolean' },
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
        subcategory: 'Select.Trigger',
      },
    },
    placement: {
      description: 'Select.OptionList의 위치를 나타냅니다.',
      control: { type: 'radio' },
      options: ['top', 'bottom'],
      table: {
        defaultValue: { summary: 'bottom' },
        type: { summary: 'top | bottom' },
        subcategory: 'Select.OptionList',
      },
    },
    width: {
      description: 'Select.OptionList의 너비를 나타냅니다.',
      control: { type: 'text' },
      table: {
        type: { summary: 'string | number' },
        subcategory: 'Select.OptionList',
      },
    },
    maxHeight: {
      description: 'Select.OptionList의 최대 높이를 나타냅니다.',
      control: { type: 'text' },
      table: {
        type: { summary: 'string | number' },
        subcategory: 'Select.OptionList',
      },
    },
    title: {
      description: 'Select.OptionGroupTitle의 제목을 나타냅니다.',
      control: { type: 'text' },
      table: {
        type: { summary: 'string' },
        subcategory: 'Select.OptionGroupTitle',
      },
    },
    label: {
      description: 'Select.Option의 라벨을 나타냅니다.',
      control: { type: 'text' },
      table: {
        type: { summary: 'string' },
        subcategory: 'Select.Option',
      },
    },
    selectionType: {
      description: 'Select.Option의 선택 타입을 나타냅니다.',
      table: {
        type: { summary: 'default | checkMark' },
        subcategory: 'Select.Option',
      },
    },
    size: {
      description: 'Select.Trigger의 크기를 나타냅니다.',
      control: { type: 'radio' },
      options: ['small', 'medium'],
      table: {
        defaultValue: { summary: 'medium' },
        type: { summary: 'small | medium' },
        subcategory: 'Select.Trigger',
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

function SizeCase() {
  const [fruit, setFruit] = useState('');

  const options = [
    { value: 'apple', label: '사과' },
    { value: 'banana', label: '바나나' },
    { value: 'cherry', label: '체리' },
  ];

  return (
    <Column width="300px">
      <Select.Root value={fruit} onValueChange={setFruit} options={options}>
        <Select.Trigger size="medium" placeholder="과일을 선택해주세요." />
        <Select.OptionList>
          <Select.OptionGroup>
            {options.map((option) => (
              <Select.Option key={option.value} value={option.value} label={option.label} />
            ))}
          </Select.OptionGroup>
        </Select.OptionList>
      </Select.Root>

      <Select.Root value={fruit} onValueChange={setFruit} options={options}>
        <Select.Trigger size="small" placeholder="과일을 선택해주세요." />
        <Select.OptionList>
          <Select.OptionGroup>
            {options.map((option) => (
              <Select.Option key={option.value} value={option.value} label={option.label} />
            ))}
          </Select.OptionGroup>
        </Select.OptionList>
      </Select.Root>
    </Column>
  );
}

export const Size: StoryObj = {
  render: SizeCase,
};

function WithLabelCase() {
  const [fruit, setFruit] = useState('');

  const options = [
    { value: 'apple', label: '사과' },
    { value: 'banana', label: '바나나' },
    { value: 'cherry', label: '체리' },
  ];

  return (
    <Column width="300px">
      <Select.Root value={fruit} onValueChange={setFruit} options={options}>
        <Select.Trigger required floatingBlockLabel="과일" placeholder="과일을 선택해주세요." />
        <Select.OptionList>
          <Select.OptionGroup>
            {options.map((option) => (
              <Select.Option key={option.value} value={option.value} label={option.label} />
            ))}
          </Select.OptionGroup>
        </Select.OptionList>
      </Select.Root>
    </Column>
  );
}

export const WithLabel: StoryObj = {
  render: WithLabelCase,
};

function PlacementCase() {
  const [fruit, setFruit] = useState('');

  const options = [
    { value: 'apple', label: '사과' },
    { value: 'banana', label: '바나나' },
    { value: 'cherry', label: '체리' },
  ];

  return (
    <Column width="300px">
      <Select.Root value={fruit} onValueChange={setFruit} options={options}>
        <Select.Trigger placeholder="아래로 열림" />
        <Select.OptionList placement="bottom">
          <Select.OptionGroup>
            {options.map((option) => (
              <Select.Option key={option.value} value={option.value} label={option.label} />
            ))}
          </Select.OptionGroup>
        </Select.OptionList>
      </Select.Root>

      <Select.Root value={fruit} onValueChange={setFruit} options={options}>
        <Select.Trigger placeholder="위로 열림" />
        <Select.OptionList placement="top">
          <Select.OptionGroup>
            {options.map((option) => (
              <Select.Option key={option.value} value={option.value} label={option.label} />
            ))}
          </Select.OptionGroup>
        </Select.OptionList>
      </Select.Root>
    </Column>
  );
}

export const Placement: StoryObj = {
  render: PlacementCase,
};

function DisabledReadOnlyCase() {
  const [fruit, setFruit] = useState('apple');

  const options = [
    { value: 'apple', label: '사과' },
    { value: 'banana', label: '바나나' },
    { value: 'cherry', label: '체리' },
  ];

  return (
    <Column width="300px">
      <Select.Root value={fruit} onValueChange={setFruit} options={options}>
        <Select.Trigger disabled placeholder="과일을 선택해주세요." />
        <Select.OptionList placement="bottom">
          <Select.OptionGroup>
            {options.map((option) => (
              <Select.Option key={option.value} value={option.value} label={option.label} />
            ))}
          </Select.OptionGroup>
        </Select.OptionList>
      </Select.Root>

      <Select.Root value={fruit} onValueChange={setFruit} options={options}>
        <Select.Trigger readOnly placeholder="과일을 선택해주세요." />
        <Select.OptionList placement="top">
          <Select.OptionGroup>
            {options.map((option) => (
              <Select.Option key={option.value} value={option.value} label={option.label} />
            ))}
          </Select.OptionGroup>
        </Select.OptionList>
      </Select.Root>
    </Column>
  );
}

export const DisabledReadOnly: StoryObj = {
  render: DisabledReadOnlyCase,
};

function OnClearCase() {
  const [fruit, setFruit] = useState('apple');

  const options = [
    { value: 'apple', label: '사과' },
    { value: 'banana', label: '바나나' },
    { value: 'cherry', label: '체리' },
  ];

  return (
    <Column width="300px">
      <Select.Root value={fruit} onValueChange={setFruit} options={options}>
        <Select.Trigger placeholder="과일을 선택해주세요." onClear={() => setFruit('')} />
        <Select.OptionList>
          <Select.OptionGroup>
            {options.map((option) => (
              <Select.Option key={option.value} value={option.value} label={option.label} />
            ))}
          </Select.OptionGroup>
        </Select.OptionList>
      </Select.Root>
    </Column>
  );
}

export const OnClear: StoryObj = {
  render: OnClearCase,
};

function ValidationCase() {
  const [fruit, setFruit] = useState('apple');

  const options = [
    { value: 'apple', label: '사과' },
    { value: 'banana', label: '바나나' },
    { value: 'cherry', label: '체리' },
  ];

  return (
    <Column width="300px">
      <Select.Root value={fruit} onValueChange={setFruit} options={options}>
        <Select.Trigger validation="error" placeholder="과일을 선택해주세요." />
        <Select.OptionList>
          <Select.OptionGroup>
            {options.map((option) => (
              <Select.Option key={option.value} value={option.value} label={option.label} />
            ))}
          </Select.OptionGroup>
        </Select.OptionList>
      </Select.Root>
    </Column>
  );
}

export const Validation: StoryObj = {
  render: ValidationCase,
};

function OptionListPropCase() {
  const [fruit, setFruit] = useState('apple');

  const options = [
    { value: 'apple', label: '사과' },
    { value: 'banana', label: '바나나' },
    { value: 'cherry', label: '체리' },
    { value: 'strawberry', label: '딸기' },
    { value: 'pineapple', label: '파인애플' },
    { value: 'orange', label: '오렌지' },
    { value: 'grape', label: '포도' },
    { value: 'melon', label: '메론' },
  ];

  return (
    <Column width="300px">
      <Select.Root value={fruit} onValueChange={setFruit} options={options}>
        <Select.Trigger placeholder="과일을 선택해주세요." />
        <Select.OptionList width="420px" maxHeight="200px">
          <Select.OptionGroup>
            {options.map((option) => (
              <Select.Option key={option.value} value={option.value} label={option.label} />
            ))}
          </Select.OptionGroup>
        </Select.OptionList>
      </Select.Root>
    </Column>
  );
}

export const OptionList: StoryObj = {
  render: OptionListPropCase,
};

function CheckMarkCase() {
  const [fruit, setFruit] = useState('apple');

  const options = [
    { value: 'apple', label: '사과' },
    { value: 'banana', label: '바나나' },
    { value: 'cherry', label: '체리' },
  ];

  return (
    <Column width="300px">
      <Select.Root value={fruit} onValueChange={setFruit} options={options}>
        <Select.Trigger placeholder="과일을 선택해주세요." />
        <Select.OptionList>
          <Select.OptionGroup>
            {options.map((option) => (
              <Select.Option key={option.value} value={option.value} label={option.label} selectionType="checkMark" />
            ))}
          </Select.OptionGroup>
        </Select.OptionList>
      </Select.Root>
    </Column>
  );
}

export const CheckMark: StoryObj = {
  render: CheckMarkCase,
};

function CustomOptionListCase() {
  const [fruit, setFruit] = useState('apple');

  return (
    <Column width="300px">
      <Select.Root
        value={fruit}
        onValueChange={setFruit}
        options={[
          { value: 'apple', label: '사과' },
          { value: 'banana', label: '바나나' },
          { value: 'cherry', label: '체리' },
        ]}
      >
        <Select.Trigger placeholder="과일을 선택해주세요." />
        <Select.OptionList maxHeight={300}>
          <Select.OptionGroup>
            <Select.OptionGroupTitle title="과일1" />
            <Select.Option value="apple" label="사과" />
            <Select.Option value="banana" label="바나나" />
            <Select.Option value="cherry" label="체리" />
          </Select.OptionGroup>
          <Select.OptionGroup>
            <Select.OptionGroupTitle title="과일2" />
            <Select.Option value="strawberry" label="딸기" />
            <Select.Option value="pineapple" label="파인애플" />
            <Select.Option value="orange" label="오렌지" />
          </Select.OptionGroup>
          <Select.OptionGroup>
            <Select.OptionGroupTitle title="과일3" />
            <Select.Option value="grape" label="포도" />
            <Select.Option value="melon" label="메론" />
          </Select.OptionGroup>
        </Select.OptionList>
      </Select.Root>
    </Column>
  );
}

export const CustomOptionList: StoryObj = {
  render: CustomOptionListCase,
};

function SearchCase() {
  const [fruit, setFruit] = useState('apple');
  const [input, setInput] = useState('');

  const options = [
    { value: 'apple', label: '사과' },
    { value: 'banana', label: '바나나' },
    { value: 'cherry', label: '체리' },
  ];

  return (
    <Column width="300px">
      <Select.Root value={fruit} onValueChange={setFruit} options={options}>
        <Select.Trigger placeholder="과일을 선택해주세요." />
        <Select.OptionList>
          <Select.OptionGroup>
            <Select.OptionInput value={input} onValueChange={setInput} placeholder="과일을 검색해주세요." />
          </Select.OptionGroup>
          <Select.OptionGroup>
            {options
              .filter((option) => option.label.includes(input))
              .map((option) => (
                <Select.Option key={option.value} value={option.value} label={option.label} />
              ))}
          </Select.OptionGroup>
        </Select.OptionList>
      </Select.Root>
    </Column>
  );
}

export const Search: StoryObj = {
  render: SearchCase,
};
