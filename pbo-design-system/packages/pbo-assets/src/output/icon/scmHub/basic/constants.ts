import { IcOrderSetting } from './_IcOrderSetting';
import { IcReturnSetting } from './_IcReturnSetting';
import { IcStockSetting } from './_IcStockSetting';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardRefExoticComponent, RefAttributes } from 'react';
import type { BasicIconName } from './types';

type BasicIconType = ForwardRefExoticComponent<Omit<BasicSvgProps, 'ref'> & RefAttributes<SVGSVGElement>>;

export const BasicIconMap: Record<BasicIconName, BasicIconType> = {
  'ic-orderSetting': IcOrderSetting,
  'ic-returnSetting': IcReturnSetting,
  'ic-stockSetting': IcStockSetting,
} as const;
