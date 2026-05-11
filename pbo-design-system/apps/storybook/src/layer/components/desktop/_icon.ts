import { type BasicIconName, IconMap } from '@musinsa/pbo-assets';
import { type BasicIconName as MomsBasicIconName, IconMap as MomsIconMap } from '@musinsa/pbo-assets/moms';
import { type BasicIconName as MwmsBasicIconName, IconMap as MwmsIconMap } from '@musinsa/pbo-assets/mwms';
import { type BasicIconName as ScmHubBasicIconName, IconMap as ScmHubIconMap } from '@musinsa/pbo-assets/scmHub';
// import { type BasicIconName as SelfPosBasicIconName, IconMap as SelfPosIconMap } from '@musinsa/pbo-assets/selfPos';
// selfPos는 basic icon 아직 없음

// 중복이 있을 수 있어 구분하기 위함
export type IconName =
  | BasicIconName
  | `mwms-${MwmsBasicIconName}`
  | `moms-${MomsBasicIconName}`
  | `scmHub-${ScmHubBasicIconName}`;

export const desktopIconNames = [
  ...Object.keys(IconMap),
  ...Object.keys(MwmsIconMap).map((iconName) => `mwms-${iconName}`),
  ...Object.keys(MomsIconMap).map((iconName) => `moms-${iconName}`),
  ...Object.keys(ScmHubIconMap).map((iconName) => `scmHub-${iconName}`),
] as IconName[];
