import React, { useState } from 'react';

import { MultiSelect } from '@musinsa/layer-components-desktop';

import { Column } from '../../../../../shared/components/Flex';

import type { Meta, StoryObj } from '@storybook/react';

document.documentElement.setAttribute('data-layer-platform', 'desktop');
document.documentElement.setAttribute('data-layer-theme', 'light');

function MultiSelectComposition() {
  const [input, setInput] = useState('');
  const [fruits, setFruits] = useState<string[]>([]);

  const [options, setOptions] = useState([
    { value: '사과', label: '사과' },
    { value: '바나나', label: '바나나' },
    { value: '딸기', label: '딸기' },
  ]);

  const filteredOptions = options.filter((option) => option.label.includes(input));
  const showOptions = filteredOptions.length > 0;

  const handleAddOption = (value: string) => {
    setOptions([...options, { value, label: value }]);
  };

  return (
    <Column width="300px">
      {/* 기본 형태 */}
      <MultiSelect value={fruits} onValueChange={setFruits} options={options} placeholder="과일을 선택해주세요." />

      {/* 커스텀이 필요한 경우 */}
      <MultiSelect.Root value={fruits} onValueChange={setFruits} options={options}>
        <MultiSelect.Trigger placeholder="과일을 선택해주세요." onClear={() => setFruits([])} />
        <MultiSelect.OptionList placement="bottom">
          <MultiSelect.OptionGroup>
            <MultiSelect.OptionInput
              value={input}
              onValueChange={setInput}
              placeholder="과일을 검색해주세요."
              onClear={() => setInput('')}
            />
          </MultiSelect.OptionGroup>
          {input && (
            <MultiSelect.OptionGroup>
              <MultiSelect.OptionCreatable searchValue={input} onClick={() => handleAddOption(input)} />
            </MultiSelect.OptionGroup>
          )}
          {showOptions && (
            <MultiSelect.OptionGroup>
              <MultiSelect.OptionAll label="전체" />
            </MultiSelect.OptionGroup>
          )}
          <MultiSelect.OptionGroup>
            <MultiSelect.OptionGroupTitle title="과일" />
            {showOptions ? (
              filteredOptions.map((option) => (
                <MultiSelect.Option key={option.value} value={option.value} label={option.label} />
              ))
            ) : (
              <MultiSelect.OptionEmpty />
            )}
          </MultiSelect.OptionGroup>
        </MultiSelect.OptionList>
      </MultiSelect.Root>
    </Column>
  );
}

const meta: Meta<typeof MultiSelectComposition> = {
  title: 'Layer/components-desktop/Select/MultiSelect',
  component: MultiSelectComposition,
  argTypes: {
    value: {
      description: 'MultiSelect의 선택된 값 배열 또는 Option의 값을 나타냅니다.',
      control: { type: 'object' },
      table: {
        type: { summary: 'T[] | string' },
        subcategory: 'MultiSelect.Root | MultiSelect.Option',
      },
    },
    onValueChange: {
      description: 'MultiSelect의 값이 변경될 때 호출되는 함수를 나타냅니다.',
      table: {
        type: { summary: '(value: T[]) => void' },
        subcategory: 'MultiSelect.Root',
      },
    },
    options: {
      description: 'MultiSelect.Root의 옵션 목록을 나타냅니다.',
      control: { type: 'object' },
      table: {
        type: { summary: '{ value: T; label: string }[]' },
        subcategory: 'MultiSelect.Root',
      },
    },
    summaryWithCount: {
      description: 'MultiSelect.Trigger의 선택된 항목을 개수로 표시할지 여부를 나타냅니다.',
      control: { type: 'boolean' },
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
        subcategory: 'MultiSelect.Trigger',
      },
    },
    placeholder: {
      description: 'MultiSelect.Trigger의 placeholder 텍스트를 나타냅니다.',
      control: { type: 'text' },
      table: {
        type: { summary: 'string' },
        subcategory: 'MultiSelect.Trigger',
      },
    },
    floatingBlockLabel: {
      description: 'MultiSelect.Trigger의 플로팅 블록 형태 라벨을 나타냅니다.',
      control: { type: 'text' },
      table: {
        type: { summary: 'string' },
        subcategory: 'MultiSelect.Trigger',
      },
    },
    required: {
      description: 'MultiSelect.Trigger의 필수 여부를 나타냅니다.(floatingBlockLabel과 같이 사용되야합니다.)',
      control: { type: 'boolean' },
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
        subcategory: 'MultiSelect.Trigger',
      },
    },
    validation: {
      description: 'MultiSelect.Trigger의 유효성 상태를 나타냅니다.',
      control: { type: 'radio' },
      options: ['none', 'error'],
      table: {
        defaultValue: { summary: 'none' },
        type: { summary: 'none | error' },
        subcategory: 'MultiSelect.Trigger',
      },
    },
    onClear: {
      description: 'MultiSelect.Trigger의 클리어 버튼 클릭 시 호출되는 함수를 나타냅니다.',
      table: {
        type: { summary: '(value: string) => void' },
        subcategory: 'MultiSelect.Trigger',
      },
    },
    disabled: {
      description: 'MultiSelect.Trigger의 비활성화 여부를 나타냅니다.',
      control: { type: 'boolean' },
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
        subcategory: 'MultiSelect.Trigger',
      },
    },
    readOnly: {
      description: 'MultiSelect.Trigger의 읽기 전용 여부를 나타냅니다.',
      control: { type: 'boolean' },
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
        subcategory: 'MultiSelect.Trigger',
      },
    },
    placement: {
      description: 'MultiSelect.OptionList의 위치를 나타냅니다.',
      control: { type: 'radio' },
      options: ['top', 'bottom'],
      table: {
        defaultValue: { summary: 'bottom' },
        type: { summary: 'top | bottom' },
        subcategory: 'MultiSelect.OptionList',
      },
    },
    width: {
      description: 'MultiSelect.OptionList의 너비를 나타냅니다.',
      control: { type: 'text' },
      table: {
        type: { summary: 'string | number' },
        subcategory: 'MultiSelect.OptionList',
      },
    },
    maxHeight: {
      description: 'MultiSelect.OptionList의 최대 높이를 나타냅니다.',
      control: { type: 'text' },
      table: {
        type: { summary: 'string | number' },
        subcategory: 'MultiSelect.OptionList',
      },
    },
    title: {
      description: 'MultiSelect.OptionGroupTitle의 제목을 나타냅니다.',
      control: { type: 'text' },
      table: {
        type: { summary: 'string' },
        subcategory: 'MultiSelect.OptionGroupTitle',
      },
    },
    label: {
      description: 'MultiSelect.Option의 라벨을 나타냅니다.',
      control: { type: 'text' },
      table: {
        type: { summary: 'string' },
        subcategory: 'MultiSelect.Option | MultiSelect.OptionAll',
      },
    },
    size: {
      description: 'MultiSelect.Trigger의 크기를 나타냅니다.',
      control: { type: 'radio' },
      options: ['small', 'medium'],
      table: {
        defaultValue: { summary: 'medium' },
        type: { summary: 'small | medium' },
        subcategory: 'MultiSelect.Trigger',
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
  const [fruits, setFruits] = useState<string[]>([]);

  const options = [
    { value: 'apple', label: '사과' },
    { value: 'banana', label: '바나나' },
    { value: 'cherry', label: '체리' },
  ];

  return (
    <Column width="300px">
      <MultiSelect.Root value={fruits} onValueChange={setFruits} options={options}>
        <MultiSelect.Trigger size="medium" placeholder="과일을 선택해주세요." />
        <MultiSelect.OptionList>
          <MultiSelect.OptionGroup>
            {options.map((option) => (
              <MultiSelect.Option key={option.value} value={option.value} label={option.label} />
            ))}
          </MultiSelect.OptionGroup>
        </MultiSelect.OptionList>
      </MultiSelect.Root>

      <MultiSelect.Root value={fruits} onValueChange={setFruits} options={options}>
        <MultiSelect.Trigger size="small" placeholder="과일을 선택해주세요." />
        <MultiSelect.OptionList>
          <MultiSelect.OptionGroup>
            {options.map((option) => (
              <MultiSelect.Option key={option.value} value={option.value} label={option.label} />
            ))}
          </MultiSelect.OptionGroup>
        </MultiSelect.OptionList>
      </MultiSelect.Root>
    </Column>
  );
}

export const Size: StoryObj = {
  render: SizeCase,
};

function WithLabelCase() {
  const [fruits, setFruits] = useState<string[]>([]);

  const options = [
    { value: 'apple', label: '사과' },
    { value: 'banana', label: '바나나' },
    { value: 'cherry', label: '체리' },
  ];

  return (
    <Column width="300px">
      <MultiSelect.Root value={fruits} onValueChange={setFruits} options={options}>
        <MultiSelect.Trigger required floatingBlockLabel="과일" placeholder="과일을 선택해주세요." />
        <MultiSelect.OptionList>
          <MultiSelect.OptionGroup>
            {options.map((option) => (
              <MultiSelect.Option key={option.value} value={option.value} label={option.label} />
            ))}
          </MultiSelect.OptionGroup>
        </MultiSelect.OptionList>
      </MultiSelect.Root>
    </Column>
  );
}

export const WithLabel: StoryObj = {
  render: WithLabelCase,
};

function PlacementCase() {
  const [fruits, setFruits] = useState<string[]>([]);

  const options = [
    { value: 'apple', label: '사과' },
    { value: 'banana', label: '바나나' },
    { value: 'cherry', label: '체리' },
  ];

  return (
    <Column width="300px">
      <MultiSelect.Root value={fruits} onValueChange={setFruits} options={options}>
        <MultiSelect.Trigger placeholder="아래로 열림" />
        <MultiSelect.OptionList placement="bottom">
          <MultiSelect.OptionGroup>
            {options.map((option) => (
              <MultiSelect.Option key={option.value} value={option.value} label={option.label} />
            ))}
          </MultiSelect.OptionGroup>
        </MultiSelect.OptionList>
      </MultiSelect.Root>

      <MultiSelect.Root value={fruits} onValueChange={setFruits} options={options}>
        <MultiSelect.Trigger placeholder="위로 열림" />
        <MultiSelect.OptionList placement="top">
          <MultiSelect.OptionGroup>
            {options.map((option) => (
              <MultiSelect.Option key={option.value} value={option.value} label={option.label} />
            ))}
          </MultiSelect.OptionGroup>
        </MultiSelect.OptionList>
      </MultiSelect.Root>
    </Column>
  );
}

export const Placement: StoryObj = {
  render: PlacementCase,
};

function DisabledReadOnlyCase() {
  const [fruits, setFruits] = useState<string[]>(['apple']);

  const options = [
    { value: 'apple', label: '사과' },
    { value: 'banana', label: '바나나' },
    { value: 'cherry', label: '체리' },
  ];

  return (
    <Column width="300px">
      <MultiSelect.Root value={fruits} onValueChange={setFruits} options={options}>
        <MultiSelect.Trigger disabled placeholder="과일을 선택해주세요." />
        <MultiSelect.OptionList placement="bottom">
          <MultiSelect.OptionGroup>
            {options.map((option) => (
              <MultiSelect.Option key={option.value} value={option.value} label={option.label} />
            ))}
          </MultiSelect.OptionGroup>
        </MultiSelect.OptionList>
      </MultiSelect.Root>

      <MultiSelect.Root value={fruits} onValueChange={setFruits} options={options}>
        <MultiSelect.Trigger readOnly placeholder="과일을 선택해주세요." />
        <MultiSelect.OptionList placement="top">
          <MultiSelect.OptionGroup>
            {options.map((option) => (
              <MultiSelect.Option key={option.value} value={option.value} label={option.label} />
            ))}
          </MultiSelect.OptionGroup>
        </MultiSelect.OptionList>
      </MultiSelect.Root>
    </Column>
  );
}

export const DisabledReadOnly: StoryObj = {
  render: DisabledReadOnlyCase,
};

function OnClearCase() {
  const [fruits, setFruits] = useState<string[]>(['apple']);

  const options = [
    { value: 'apple', label: '사과' },
    { value: 'banana', label: '바나나' },
    { value: 'cherry', label: '체리' },
  ];

  return (
    <Column width="300px">
      <MultiSelect.Root value={fruits} onValueChange={setFruits} options={options}>
        <MultiSelect.Trigger placeholder="과일을 선택해주세요." onClear={() => setFruits([])} />
        <MultiSelect.OptionList>
          <MultiSelect.OptionGroup>
            {options.map((option) => (
              <MultiSelect.Option key={option.value} value={option.value} label={option.label} />
            ))}
          </MultiSelect.OptionGroup>
        </MultiSelect.OptionList>
      </MultiSelect.Root>
    </Column>
  );
}

export const OnClear: StoryObj = {
  render: OnClearCase,
};

function ValidationCase() {
  const [fruits, setFruits] = useState<string[]>(['apple']);

  const options = [
    { value: 'apple', label: '사과' },
    { value: 'banana', label: '바나나' },
    { value: 'cherry', label: '체리' },
  ];

  return (
    <Column width="300px">
      <MultiSelect.Root value={fruits} onValueChange={setFruits} options={options}>
        <MultiSelect.Trigger validation="error" placeholder="과일을 선택해주세요." />
        <MultiSelect.OptionList>
          <MultiSelect.OptionGroup>
            {options.map((option) => (
              <MultiSelect.Option key={option.value} value={option.value} label={option.label} />
            ))}
          </MultiSelect.OptionGroup>
        </MultiSelect.OptionList>
      </MultiSelect.Root>
    </Column>
  );
}

export const Validation: StoryObj = {
  render: ValidationCase,
};

function OptionListPropCase() {
  const [fruits, setFruits] = useState<string[]>(['apple']);

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
      <MultiSelect.Root value={fruits} onValueChange={setFruits} options={options}>
        <MultiSelect.Trigger placeholder="과일을 선택해주세요." />
        <MultiSelect.OptionList width="420px" maxHeight="200px">
          <MultiSelect.OptionGroup>
            {options.map((option) => (
              <MultiSelect.Option key={option.value} value={option.value} label={option.label} />
            ))}
          </MultiSelect.OptionGroup>
        </MultiSelect.OptionList>
      </MultiSelect.Root>
    </Column>
  );
}

export const OptionList: StoryObj = {
  render: OptionListPropCase,
};

function SummaryWithCountCase() {
  const [fruits, setFruits] = useState<string[]>(['apple', 'banana']);

  const options = [
    { value: 'apple', label: '사과' },
    { value: 'banana', label: '바나나' },
    { value: 'cherry', label: '체리' },
  ];

  return (
    <Column width="300px">
      <MultiSelect.Root value={fruits} onValueChange={setFruits} options={options}>
        <MultiSelect.Trigger placeholder="과일을 선택해주세요." summaryWithCount />
        <MultiSelect.OptionList>
          <MultiSelect.OptionGroup>
            {options.map((option) => (
              <MultiSelect.Option key={option.value} value={option.value} label={option.label} />
            ))}
          </MultiSelect.OptionGroup>
        </MultiSelect.OptionList>
      </MultiSelect.Root>
    </Column>
  );
}

export const SummaryWithCount: StoryObj = {
  render: SummaryWithCountCase,
};

function CustomOptionListCase() {
  const [fruits, setFruits] = useState<string[]>(['apple']);

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
      <MultiSelect.Root value={fruits} onValueChange={setFruits} options={options}>
        <MultiSelect.Trigger placeholder="과일을 선택해주세요." />
        <MultiSelect.OptionList maxHeight={300}>
          <MultiSelect.OptionGroup>
            <MultiSelect.OptionGroupTitle title="과일1" />
            <MultiSelect.Option value="apple" label="사과" />
            <MultiSelect.Option value="banana" label="바나나" />
            <MultiSelect.Option value="cherry" label="체리" />
          </MultiSelect.OptionGroup>
          <MultiSelect.OptionGroup>
            <MultiSelect.OptionGroupTitle title="과일2" />
            <MultiSelect.Option value="strawberry" label="딸기" />
            <MultiSelect.Option value="pineapple" label="파인애플" />
            <MultiSelect.Option value="orange" label="오렌지" />
          </MultiSelect.OptionGroup>
          <MultiSelect.OptionGroup>
            <MultiSelect.OptionGroupTitle title="과일3" />
            <MultiSelect.Option value="grape" label="포도" />
            <MultiSelect.Option value="melon" label="메론" />
          </MultiSelect.OptionGroup>
        </MultiSelect.OptionList>
      </MultiSelect.Root>
    </Column>
  );
}

export const CustomOptionList: StoryObj = {
  render: CustomOptionListCase,
};

function SearchCase() {
  const [fruits, setFruits] = useState<string[]>(['apple']);
  const [input, setInput] = useState('');

  const options = [
    { value: 'apple', label: '사과' },
    { value: 'banana', label: '바나나' },
    { value: 'cherry', label: '체리' },
  ];

  return (
    <Column width="300px">
      <MultiSelect.Root value={fruits} onValueChange={setFruits} options={options}>
        <MultiSelect.Trigger placeholder="과일을 선택해주세요." />
        <MultiSelect.OptionList>
          <MultiSelect.OptionGroup>
            <MultiSelect.OptionInput value={input} onValueChange={setInput} placeholder="과일을 검색해주세요." />
          </MultiSelect.OptionGroup>
          <MultiSelect.OptionGroup>
            {options
              .filter((option) => option.label.includes(input))
              .map((option) => (
                <MultiSelect.Option key={option.value} value={option.value} label={option.label} />
              ))}
          </MultiSelect.OptionGroup>
        </MultiSelect.OptionList>
      </MultiSelect.Root>
    </Column>
  );
}

export const Search: StoryObj = {
  render: SearchCase,
};
