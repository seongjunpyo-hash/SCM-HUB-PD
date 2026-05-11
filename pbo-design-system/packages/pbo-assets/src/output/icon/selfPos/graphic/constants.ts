import { IcAlertSquare } from './_IcAlertSquare';
import { IcButiqueSymbol } from './_IcButiqueSymbol';
import { IcCheckSquare } from './_IcCheckSquare';
import { IcInfoSquare } from './_IcInfoSquare';
import { IcProductScanBlue } from './_IcProductScanBlue';
import { IcProductScan } from './_IcProductScan';
import { IcScanBlue } from './_IcScanBlue';
import { IcScan } from './_IcScan';
import { IcUsedSymbol } from './_IcUsedSymbol';

import type { GraphicSvgProps } from '@/types/types';
import type { ForwardRefExoticComponent, RefAttributes } from 'react';
import type { GraphicIconName } from './types';

type GraphicIconType = ForwardRefExoticComponent<Omit<GraphicSvgProps, 'ref'> & RefAttributes<SVGSVGElement>>;

export const GraphicIconMap: Record<GraphicIconName, GraphicIconType> = {
  'ic-alertSquare': IcAlertSquare,
  'ic-butiqueSymbol': IcButiqueSymbol,
  'ic-checkSquare': IcCheckSquare,
  'ic-infoSquare': IcInfoSquare,
  'ic-productScan-blue': IcProductScanBlue,
  'ic-productScan': IcProductScan,
  'ic-scan-blue': IcScanBlue,
  'ic-scan': IcScan,
  'ic-usedSymbol': IcUsedSymbol,
} as const;
