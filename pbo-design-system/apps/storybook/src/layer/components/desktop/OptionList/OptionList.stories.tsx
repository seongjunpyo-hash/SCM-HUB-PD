import React, { useState } from 'react';

import { OptionList } from '@musinsa/layer-components-desktop';

import { Column } from '../../../../shared/components/Flex';
import { desktopIconNames } from '../_icon';

import type { Meta, StoryObj } from '@storybook/react';

document.documentElement.setAttribute('data-layer-platform', 'desktop');
document.documentElement.setAttribute('data-layer-theme', 'light');

function OptionListComposition() {
  return (
    <div style={{ width: 300 }}>
      <OptionList>
        <OptionList.Group>
          <OptionList.GroupTitle title="과일" />
          <OptionList.Item value="apple" label="사과" />
          <OptionList.Item value="banana" label="바나나" />
          <OptionList.Item value="cherry" label="체리" />
        </OptionList.Group>
      </OptionList>
    </div>
  );
}

const meta: Meta<typeof OptionListComposition> = {
  title: 'Layer/components-desktop/OptionList',
  component: OptionListComposition,
  argTypes: {
    // OptionList
    width: {
      description: 'OptionList의 너비를 나타냅니다.',
      control: { type: 'text' },
      table: {
        type: { summary: 'string | number' },
        subcategory: 'OptionList',
      },
    },
    maxHeight: {
      description: 'OptionList의 최대 높이를 나타냅니다.',
      control: { type: 'text' },
      table: {
        type: { summary: 'string | number' },
        subcategory: 'OptionList',
      },
    },
    // OptionList.GroupTitle
    title: {
      description: 'OptionList.GroupTitle의 제목을 나타냅니다. (title 또는 children 중 하나만 사용 가능)',
      control: { type: 'text' },
      table: {
        type: { summary: 'string' },
        subcategory: 'OptionList.GroupTitle',
      },
    },
    // OptionList.Item
    value: {
      description: 'OptionList.Item의 값을 나타냅니다.',
      control: { type: 'text' },
      table: {
        type: { summary: 'string' },
        subcategory: 'OptionList.Item',
      },
    },
    label: {
      description: 'OptionList.Item의 라벨을 나타냅니다.',
      control: { type: 'text' },
      table: {
        type: { summary: 'string' },
        subcategory: 'OptionList.Item',
      },
    },
    isSelected: {
      description: 'OptionList.Item의 선택 상태를 나타냅니다.',
      control: { type: 'boolean' },
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
        subcategory: 'OptionList.Item',
      },
    },
    selectionType: {
      description: 'OptionList.Item의 선택 표시 타입을 나타냅니다.',
      control: { type: 'radio' },
      options: ['default', 'checkMark', 'checkBox'],
      table: {
        defaultValue: { summary: 'default' },
        type: { summary: 'default | checkMark | checkBox' },
        subcategory: 'OptionList.Item',
      },
    },
    subTitle: {
      description: 'OptionList.Item의 서브 타이틀을 나타냅니다. (label 위에 표시)',
      control: { type: 'text' },
      table: {
        type: { summary: 'string' },
        subcategory: 'OptionList.Item',
      },
    },
    description: {
      description: 'OptionList.Item의 설명을 나타냅니다. (label 아래에 표시)',
      control: { type: 'text' },
      table: {
        type: { summary: 'string' },
        subcategory: 'OptionList.Item',
      },
    },
    thumbnail: {
      description: 'OptionList.Item의 썸네일 이미지 URL을 나타냅니다.',
      control: { type: 'text' },
      table: {
        type: { summary: 'string' },
        subcategory: 'OptionList.Item',
      },
    },
    suffixSubtle: {
      description: 'OptionList.Item의 우측 보조 텍스트를 나타냅니다.',
      control: { type: 'text' },
      table: {
        type: { summary: 'string' },
        subcategory: 'OptionList.Item',
      },
    },
    suffixIcon: {
      description: 'OptionList.Item의 우측 아이콘을 나타냅니다.',
      control: { type: 'select' },
      options: desktopIconNames,
      table: {
        type: { summary: 'ic-* (icon name)' },
        subcategory: 'OptionList.Item',
      },
    },
    // OptionList.Input
    onValueChange: {
      description: 'OptionList.Input의 값이 변경될 때 호출되는 함수를 나타냅니다.',
      table: {
        type: { summary: '(value: string) => void' },
        subcategory: 'OptionList.Input',
      },
    },
    onClear: {
      description: 'OptionList.Input의 클리어 버튼 클릭 시 호출되는 함수를 나타냅니다.',
      table: {
        type: { summary: '() => void' },
        subcategory: 'OptionList.Input',
      },
    },
    // OptionList.Creatable
    searchValue: {
      description: 'OptionList.Creatable에 표시될 검색어를 나타냅니다.',
      control: { type: 'text' },
      table: {
        type: { summary: 'string' },
        subcategory: 'OptionList.Creatable',
      },
    },
    creatableLabel: {
      description: 'OptionList.Creatable의 라벨을 나타냅니다.',
      control: { type: 'text' },
      table: {
        defaultValue: { summary: '추가' },
        type: { summary: 'string' },
        subcategory: 'OptionList.Creatable',
      },
    },
    onClick: {
      description: 'OptionList.Creatable 클릭 시 호출되는 함수를 나타냅니다.',
      table: {
        type: { summary: '() => void' },
        subcategory: 'OptionList.Creatable',
      },
    },
    // OptionList.Empty
    emptyLabel: {
      description: 'OptionList.Empty에 표시될 텍스트를 나타냅니다.',
      control: { type: 'text' },
      table: {
        defaultValue: { summary: '결과 없음' },
        type: { summary: 'string' },
        subcategory: 'OptionList.Empty',
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

// 기본 아이템 케이스
function BasicItemCase() {
  return (
    <Column width="300px">
      <OptionList>
        <OptionList.Group>
          <OptionList.Item value="apple" label="사과" />
          <OptionList.Item value="banana" label="바나나" />
          <OptionList.Item value="cherry" label="체리" />
        </OptionList.Group>
      </OptionList>
    </Column>
  );
}

export const BasicItem: StoryObj = {
  render: BasicItemCase,
};

// 선택 타입 케이스
function SelectionTypeCase() {
  const [selected] = useState('apple');

  return (
    <Column width="300px">
      {/* default: 선택 표시 없음 */}
      <OptionList>
        <OptionList.Group>
          <OptionList.GroupTitle title="default (선택 표시 없음)" />
          <OptionList.Item value="apple" label="사과" isSelected={selected === 'apple'} selectionType="default" />
          <OptionList.Item value="banana" label="바나나" isSelected={selected === 'banana'} selectionType="default" />
        </OptionList.Group>
      </OptionList>

      {/* checkMark: 체크 아이콘 */}
      <OptionList>
        <OptionList.Group>
          <OptionList.GroupTitle title="checkMark (체크 아이콘)" />
          <OptionList.Item value="apple" label="사과" isSelected={selected === 'apple'} selectionType="checkMark" />
          <OptionList.Item value="banana" label="바나나" isSelected={selected === 'banana'} selectionType="checkMark" />
        </OptionList.Group>
      </OptionList>

      {/* checkBox: 체크박스 */}
      <OptionList>
        <OptionList.Group>
          <OptionList.GroupTitle title="checkBox (체크박스)" />
          <OptionList.Item value="apple" label="사과" isSelected={selected === 'apple'} selectionType="checkBox" />
          <OptionList.Item value="banana" label="바나나" isSelected={selected === 'banana'} selectionType="checkBox" />
        </OptionList.Group>
      </OptionList>
    </Column>
  );
}

export const SelectionType: StoryObj = {
  render: SelectionTypeCase,
};

// 그룹 및 그룹 타이틀 케이스
function GroupCase() {
  return (
    <Column width="300px">
      <OptionList>
        <OptionList.Group>
          <OptionList.GroupTitle title="과일" />
          <OptionList.Item value="apple" label="사과" />
          <OptionList.Item value="banana" label="바나나" />
        </OptionList.Group>
        <OptionList.Group>
          <OptionList.GroupTitle title="채소" />
          <OptionList.Item value="carrot" label="당근" />
          <OptionList.Item value="potato" label="감자" />
        </OptionList.Group>
        <OptionList.Group>
          <OptionList.GroupTitle>
            <span style={{ color: 'blue' }}>커스텀 타이틀 (children 사용)</span>
          </OptionList.GroupTitle>
          <OptionList.Item value="custom1" label="커스텀 아이템 1" />
          <OptionList.Item value="custom2" label="커스텀 아이템 2" />
        </OptionList.Group>
      </OptionList>
    </Column>
  );
}

export const Group: StoryObj = {
  render: GroupCase,
};

// 서브타이틀, 설명 케이스
function SubTitleDescriptionCase() {
  return (
    <Column width="300px">
      <OptionList>
        <OptionList.Group>
          <OptionList.GroupTitle title="상품 목록" />
          <OptionList.Item value="product1" label="무신사 스탠다드 티셔츠" subTitle="무신사 스탠다드" />
          <OptionList.Item
            value="product2"
            label="와이드 데님 팬츠"
            subTitle="무신사 스탠다드"
            description="편안한 핏의 데님 팬츠"
          />
          <OptionList.Item value="product3" label="오버핏 후드집업" description="가벼운 착용감" />
        </OptionList.Group>
      </OptionList>
    </Column>
  );
}

export const SubTitleDescription: StoryObj = {
  render: SubTitleDescriptionCase,
};

// 썸네일 케이스
function ThumbnailCase() {
  const thumbnailUrl =
    'https://image.msscdn.net/thumbnails/images/goods_img/20240131/3836510/3836510_17152161493815_500.jpg?w=780';

  return (
    <Column width="400px">
      <OptionList>
        <OptionList.Group>
          <OptionList.GroupTitle title="상품 목록" />
          <OptionList.Item
            value="product1"
            label="무신사 스탠다드 에센셜 롱 슬리브 티셔츠"
            subTitle="무신사 스탠다드"
            description="편안한 착용감의 기본 티셔츠"
            thumbnail={thumbnailUrl}
          />
          <OptionList.Item
            value="product2"
            label="와이드 데님 팬츠"
            subTitle="무신사 스탠다드"
            thumbnail={thumbnailUrl}
          />
          <OptionList.Item value="product3" label="오버핏 후드집업" thumbnail={thumbnailUrl} />
        </OptionList.Group>
      </OptionList>
    </Column>
  );
}

export const Thumbnail: StoryObj = {
  render: ThumbnailCase,
};

// Suffix 케이스 (suffixSubtle, suffixIcon)
function SuffixCase() {
  return (
    <Column width="350px">
      <OptionList>
        <OptionList.Group>
          <OptionList.GroupTitle title="Suffix 예시" />
          <OptionList.Item value="item1" label="suffixSubtle 텍스트" suffixSubtle="보조 텍스트" />
          <OptionList.Item value="item2" label="suffixIcon 아이콘" suffixIcon="ic-arrowRight" />
          <OptionList.Item
            value="item3"
            label="suffixSubtle + suffixIcon"
            suffixSubtle="보조"
            suffixIcon="ic-arrowRight"
          />
        </OptionList.Group>
      </OptionList>
    </Column>
  );
}

export const Suffix: StoryObj = {
  render: SuffixCase,
};

// Input 검색 케이스
function InputCase() {
  const [searchValue, setSearchValue] = useState('');

  const options = [
    { value: 'apple', label: '사과' },
    { value: 'banana', label: '바나나' },
    { value: 'cherry', label: '체리' },
    { value: 'grape', label: '포도' },
    { value: 'orange', label: '오렌지' },
  ];

  const filteredOptions = options.filter((option) => option.label.includes(searchValue));

  return (
    <Column width="300px">
      <OptionList>
        <OptionList.Group>
          <OptionList.Input
            value={searchValue}
            onValueChange={setSearchValue}
            onClear={() => setSearchValue('')}
            placeholder="검색어를 입력하세요"
          />
        </OptionList.Group>
        <OptionList.Group>
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <OptionList.Item key={option.value} value={option.value} label={option.label} />
            ))
          ) : (
            <OptionList.Empty label="검색 결과가 없습니다" />
          )}
        </OptionList.Group>
      </OptionList>
    </Column>
  );
}

export const Input: StoryObj = {
  render: InputCase,
};

// Empty 케이스
function EmptyCase() {
  return (
    <Column width="300px">
      <OptionList>
        <OptionList.Group>
          <OptionList.GroupTitle title="기본 Empty" />
          <OptionList.Empty />
        </OptionList.Group>
      </OptionList>

      <OptionList>
        <OptionList.Group>
          <OptionList.GroupTitle title="커스텀 라벨 Empty" />
          <OptionList.Empty label="검색 결과가 없습니다" />
        </OptionList.Group>
      </OptionList>
    </Column>
  );
}

export const Empty: StoryObj = {
  render: EmptyCase,
};

// Creatable 케이스
function CreatableCase() {
  const [searchValue, setSearchValue] = useState('새로운 옵션');
  const [options, setOptions] = useState([
    { value: 'apple', label: '사과' },
    { value: 'banana', label: '바나나' },
  ]);

  const handleCreate = () => {
    const newOption = { value: searchValue.toLowerCase(), label: searchValue };
    setOptions([...options, newOption]);
    setSearchValue('');
  };

  const filteredOptions = options.filter((option) => option.label.includes(searchValue));
  const isExisting = options.some((option) => option.label === searchValue);

  return (
    <Column width="300px">
      <OptionList>
        <OptionList.Group>
          <OptionList.Input
            value={searchValue}
            onValueChange={setSearchValue}
            onClear={() => setSearchValue('')}
            placeholder="검색 또는 새로 추가"
          />
        </OptionList.Group>
        <OptionList.Group>
          {filteredOptions.map((option) => (
            <OptionList.Item key={option.value} value={option.value} label={option.label} />
          ))}
          {searchValue && !isExisting && (
            <OptionList.Creatable searchValue={searchValue} label="추가" onClick={handleCreate} />
          )}
        </OptionList.Group>
      </OptionList>
    </Column>
  );
}

export const Creatable: StoryObj = {
  render: CreatableCase,
};

// width, maxHeight 케이스
function SizeCase() {
  const manyOptions = Array.from({ length: 20 }, (_, i) => ({
    value: `item${i + 1}`,
    label: `아이템 ${i + 1}`,
  }));

  return (
    <Column width="500px">
      <OptionList width={400} maxHeight={200}>
        <OptionList.Group>
          <OptionList.GroupTitle title="width: 400, maxHeight: 200" />
          {manyOptions.map((option) => (
            <OptionList.Item key={option.value} value={option.value} label={option.label} />
          ))}
        </OptionList.Group>
      </OptionList>
    </Column>
  );
}

export const Size: StoryObj = {
  render: SizeCase,
};

// 복합 케이스 (모든 기능 조합)
function ComplexCase() {
  const [searchValue, setSearchValue] = useState('');
  const [selected, setSelected] = useState<string[]>(['product1']);

  const products = [
    {
      value: 'product1',
      label: '무신사 스탠다드 티셔츠',
      subTitle: '무신사 스탠다드',
      description: '편안한 핏',
      thumbnail:
        'https://image.msscdn.net/thumbnails/images/goods_img/20240131/3836510/3836510_17152161493815_500.jpg?w=780',
    },
    {
      value: 'product2',
      label: '와이드 데님 팬츠',
      subTitle: '무신사 스탠다드',
      description: '트렌디한 실루엣',
      thumbnail:
        'https://image.msscdn.net/thumbnails/images/goods_img/20240131/3836510/3836510_17152161493815_500.jpg?w=780',
    },
    {
      value: 'product3',
      label: '오버핏 후드집업',
      subTitle: '무신사 스탠다드',
      thumbnail:
        'https://image.msscdn.net/thumbnails/images/goods_img/20240131/3836510/3836510_17152161493815_500.jpg?w=780',
    },
  ];

  const filteredProducts = products.filter(
    (product) =>
      product.label.includes(searchValue) ||
      product.subTitle?.includes(searchValue) ||
      product.description?.includes(searchValue),
  );

  const handleToggle = (value: string) => {
    setSelected((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
  };

  return (
    <Column width="400px">
      <OptionList maxHeight={400}>
        <OptionList.Group>
          <OptionList.Input
            value={searchValue}
            onValueChange={setSearchValue}
            onClear={() => setSearchValue('')}
            placeholder="상품을 검색하세요"
          />
        </OptionList.Group>
        <OptionList.Group>
          <OptionList.GroupTitle title="상품 목록" />
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <OptionList.Item
                key={product.value}
                value={product.value}
                label={product.label}
                subTitle={product.subTitle}
                description={product.description}
                thumbnail={product.thumbnail}
                isSelected={selected.includes(product.value)}
                selectionType="checkBox"
                onClick={() => handleToggle(product.value)}
              />
            ))
          ) : (
            <OptionList.Empty label="검색 결과가 없습니다" />
          )}
        </OptionList.Group>
      </OptionList>
    </Column>
  );
}

export const Complex: StoryObj = {
  render: ComplexCase,
};
