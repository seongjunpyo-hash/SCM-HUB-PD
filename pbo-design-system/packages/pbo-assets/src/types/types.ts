import type { SVGProps } from 'react';

export type BasicSvgProps = {
  size?: number;
  filled?: boolean;
  color?: string;
  strokeWidth?: string | number;
} & SVGProps<SVGSVGElement>;

export type GraphicSvgProps = {
  size?: number;
} & SVGProps<SVGSVGElement>;

export const PBO_SERVICES = ['mwms', 'moms', 'scmHub', 'selfPos'] as const;
export type PboServices = (typeof PBO_SERVICES)[number];

export const PBO_SERVICE_TO_PLATFORM_MAP: Record<PboServices, string> = {
  mwms: 'pda',
  moms: 'desktop',
  scmHub: 'desktop',
  selfPos: 'pos',
};
