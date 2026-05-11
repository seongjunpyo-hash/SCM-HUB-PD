import { IcAddTote } from './_IcAddTote';
import { IcExit } from './_IcExit';
import { IcGuide } from './_IcGuide';
import { IcMapPin } from './_IcMapPin';
import { IcMenu } from './_IcMenu';
import { IcProblem } from './_IcProblem';
import { IcUserscan } from './_IcUserscan';
import { IcViewSorting } from './_IcViewSorting';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardRefExoticComponent, RefAttributes } from 'react';
import type { BasicIconName } from './types';

type BasicIconType = ForwardRefExoticComponent<Omit<BasicSvgProps, 'ref'> & RefAttributes<SVGSVGElement>>;

export const BasicIconMap: Record<BasicIconName, BasicIconType> = {
  'ic-addTote': IcAddTote,
  'ic-exit': IcExit,
  'ic-guide': IcGuide,
  'ic-mapPin': IcMapPin,
  'ic-menu': IcMenu,
  'ic-problem': IcProblem,
  'ic-userscan': IcUserscan,
  'ic-viewSorting': IcViewSorting,
} as const;
