import { IcCombinedPackaging } from './_IcCombinedPackaging';
import { IcInbound } from './_IcInbound';
import { IcIndividualPackaging } from './_IcIndividualPackaging';
import { IcInventory } from './_IcInventory';
import { IcInventoryBlue } from './_IcInventoryBlue';
import { IcLocationInventory } from './_IcLocationInventory';
import { IcMasterBagging } from './_IcMasterBagging';
import { IcMoving } from './_IcMoving';
import { IcPicking } from './_IcPicking';
import { IcProblem } from './_IcProblem';
import { IcProductInventory } from './_IcProductInventory';
import { IcProductTag } from './_IcProductTag';
import { IcReturn } from './_IcReturn';
import { IcSorting } from './_IcSorting';
import { IcStocking } from './_IcStocking';
import { IcToteSearch } from './_IcToteSearch';

import type { GraphicSvgProps } from '@/types/types';
import type { ForwardRefExoticComponent, RefAttributes } from 'react';
import type { GraphicIconName } from './types';

type GraphicIconType = ForwardRefExoticComponent<Omit<GraphicSvgProps, 'ref'> & RefAttributes<SVGSVGElement>>;

export const GraphicIconMap: Record<GraphicIconName, GraphicIconType> = {
  'ic-combinedPackaging': IcCombinedPackaging,
  'ic-inbound': IcInbound,
  'ic-individualPackaging': IcIndividualPackaging,
  'ic-inventory': IcInventory,
  'ic-inventoryBlue': IcInventoryBlue,
  'ic-locationInventory': IcLocationInventory,
  'ic-masterBagging': IcMasterBagging,
  'ic-moving': IcMoving,
  'ic-picking': IcPicking,
  'ic-problem': IcProblem,
  'ic-productInventory': IcProductInventory,
  'ic-productTag': IcProductTag,
  'ic-return': IcReturn,
  'ic-sorting': IcSorting,
  'ic-stocking': IcStocking,
  'ic-toteSearch': IcToteSearch,
} as const;
