import { IcArrivalReturn } from './_IcArrivalReturn';
import { IcAscending } from './_IcAscending';
import { IcBagging } from './_IcBagging';
import { IcDescending } from './_IcDescending';
import { IcDownloadAll } from './_IcDownloadAll';
import { IcInbound } from './_IcInbound';
import { IcInboundReturn } from './_IcInboundReturn';
import { IcOutbound } from './_IcOutbound';
import { IcPutawayReturn } from './_IcPutawayReturn';
import { IcSearchLocation } from './_IcSearchLocation';
import { IcSearchProduct } from './_IcSearchProduct';
import { IcSortAscending } from './_IcSortAscending';
import { IcSortDescending } from './_IcSortDescending';
import { IcSortingReturn } from './_IcSortingReturn';
import { IcStock } from './_IcStock';
import { IcStrategy } from './_IcStrategy';
import { IcTote } from './_IcTote';
import { IcPicking } from './_IcPicking';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardRefExoticComponent, RefAttributes } from 'react';
import type { BasicIconName } from './types';

type BasicIconType = ForwardRefExoticComponent<Omit<BasicSvgProps, 'ref'> & RefAttributes<SVGSVGElement>>;

export const BasicIconMap: Record<BasicIconName, BasicIconType> = {
  'ic-arrivalReturn': IcArrivalReturn,
  'ic-ascending': IcAscending,
  'ic-bagging': IcBagging,
  'ic-descending': IcDescending,
  'ic-downloadAll': IcDownloadAll,
  'ic-inbound': IcInbound,
  'ic-inboundReturn': IcInboundReturn,
  'ic-outbound': IcOutbound,
  'ic-putawayReturn': IcPutawayReturn,
  'ic-searchLocation': IcSearchLocation,
  'ic-searchProduct': IcSearchProduct,
  'ic-sortAscending': IcSortAscending,
  'ic-sortDescending': IcSortDescending,
  'ic-sortingReturn': IcSortingReturn,
  'ic-stock': IcStock,
  'ic-strategy': IcStrategy,
  'ic-tote': IcTote,
  'ic-picking': IcPicking,
} as const;
