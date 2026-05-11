import { IconMap } from '@musinsa/pbo-assets';
import { IconMap as MomsIconMap } from '@musinsa/pbo-assets/moms';
import { IconMap as MwmsIconMap } from '@musinsa/pbo-assets/mwms';
import { IconMap as ScmHubIconMap } from '@musinsa/pbo-assets/scmHub';

import type { BasicIconName } from '@musinsa/pbo-assets';
import type { BasicIconName as MomsBasicIconName } from '@musinsa/pbo-assets/moms';
import type { BasicIconName as MwmsBasicIconName } from '@musinsa/pbo-assets/mwms';
import type { BasicIconName as ScmHubBasicIconName } from '@musinsa/pbo-assets/scmHub';

export type IconName =
  | BasicIconName
  | `mwms-${MwmsBasicIconName}`
  | `moms-${MomsBasicIconName}`
  | `scmHub-${ScmHubBasicIconName}`;

const basicIconNameGuard = (iconName: IconName): iconName is BasicIconName => {
  return iconName in IconMap;
};

const mwmsBasicIconNameGuard = (iconName: IconName): iconName is `mwms-${MwmsBasicIconName}` => {
  const mwmsIconName = iconName.replace(/^mwms-/, '') as MwmsBasicIconName;
  return mwmsIconName in MwmsIconMap;
};

const momsBasicIconNameGuard = (iconName: IconName): iconName is `moms-${MomsBasicIconName}` => {
  const momsIconName = iconName.replace(/^moms-/, '') as MomsBasicIconName;
  return momsIconName in MomsIconMap;
};

const scmHubBasicIconNameGuard = (iconName: IconName): iconName is `scmHub-${ScmHubBasicIconName}` => {
  const scmHubIconName = iconName.replace(/^scmHub-/, '') as ScmHubBasicIconName;
  return scmHubIconName in ScmHubIconMap;
};

/** 아이콘 반환 */
export const getIcon = (iconName?: IconName) => {
  if (!iconName) return null;

  if (basicIconNameGuard(iconName)) {
    return IconMap[iconName];
  }
  if (mwmsBasicIconNameGuard(iconName)) {
    return MwmsIconMap[iconName.replace(/^mwms-/, '') as MwmsBasicIconName];
  }
  if (momsBasicIconNameGuard(iconName)) {
    return MomsIconMap[iconName.replace(/^moms-/, '') as MomsBasicIconName];
  }
  if (scmHubBasicIconNameGuard(iconName)) {
    return ScmHubIconMap[iconName.replace(/^scmHub-/, '') as ScmHubBasicIconName];
  }
  return null;
};
