import { Example } from './_Example';
import { IcChineseRound } from './_IcChineseRound';
import { IcChinese } from './_IcChinese';
import { IcEnglishRound } from './_IcEnglishRound';
import { IcEnglish } from './_IcEnglish';
import { IcJapaneseRound } from './_IcJapaneseRound';
import { IcJapanese } from './_IcJapanese';
import { IcKoreanRound } from './_IcKoreanRound';
import { IcKorean } from './_IcKorean';

import type { GraphicSvgProps } from '@/types/types';
import type { ForwardRefExoticComponent, RefAttributes } from 'react';
import type { GraphicIconName } from './types';

type GraphicIconType = ForwardRefExoticComponent<Omit<GraphicSvgProps, 'ref'> & RefAttributes<SVGSVGElement>>;

export const GraphicIconMap: Record<GraphicIconName, GraphicIconType> = {
  'example': Example,
  'ic-chinese-round': IcChineseRound,
  'ic-chinese': IcChinese,
  'ic-english-round': IcEnglishRound,
  'ic-english': IcEnglish,
  'ic-japanese-round': IcJapaneseRound,
  'ic-japanese': IcJapanese,
  'ic-korean-round': IcKoreanRound,
  'ic-korean': IcKorean,
} as const;
