import { forwardRef } from 'react';

import { useTabContext } from '../_context/tab-context';

import { TabBoxItem } from './tab-box-item/tab-box-item';
import { TabLineItem } from './tab-line-item/tab-line-item';
import { TabTextItem } from './tab-text-item/tab-text-item';

import type { TabItemProps } from './tab-item.types';

const TabItem = forwardRef<HTMLButtonElement, TabItemProps>((props, ref) => {
  const { type } = useTabContext();

  switch (type) {
    case 'tabLine':
      return <TabLineItem {...props} ref={ref} />;
    case 'tabBox':
      return <TabBoxItem {...props} ref={ref} />;
    case 'tabText':
      return <TabTextItem {...props} ref={ref} />;
  }
});

TabItem.displayName = 'TabItem';

export { TabItem };
