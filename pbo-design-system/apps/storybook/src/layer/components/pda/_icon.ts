import { type BasicIconName, IconMap } from '@musinsa/pbo-assets';
import { type BasicIconName as MwmsBasicIconName, IconMap as MwmsIconMap } from '@musinsa/pbo-assets/mwms';

// 중복이 있을 수 있어 구분하기 위함
export type IconName = BasicIconName | `mwms-${MwmsBasicIconName}`;

export const pdaIconNames = [
  ...Object.keys(IconMap),
  ...Object.keys(MwmsIconMap).map((iconName) => `mwms-${iconName}`),
] as IconName[];
