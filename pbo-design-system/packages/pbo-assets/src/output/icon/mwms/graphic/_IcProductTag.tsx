import { forwardRef } from 'react';

import type { GraphicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcProductTag = ({ size = 24, ...props }: GraphicSvgProps, ref: ForwardedRef<SVGSVGElement>) => (
  <svg
    ref={ref}
    {...props}
    width={size}
    height={size}
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M21.1577 18.2192L29.2619 20.3203L26.4604 31.1259L18.3562 29.0248L21.1577 18.2192Z" fill="#B8D4FF" />
    <path
      d="M20.6919 8.7452L31.5529 8.06887L30.8766 18.9299L18.1855 31.6211L8.00074 21.4363L20.6919 8.7452Z"
      fill="#245EFF"
    />
    <path d="M27.0548 19.8123L25.8696 20.9975L19.0807 14.2086L20.266 13.0234L27.0548 19.8123Z" fill="white" />
    <path d="M23.6423 23.2244L22.4571 24.4097L15.6683 17.6208L16.8535 16.4356L23.6423 23.2244Z" fill="white" />
    <path d="M17.504 23.4913L16.3188 24.6765L12.4653 20.823L13.6505 19.6377L17.504 23.4913Z" fill="white" />
    <ellipse cx="27.097" cy="12.525" rx="1.32565" ry="1.32565" transform="rotate(45 27.097 12.525)" fill="#153EAD" />
    <path
      opacity="0.2"
      d="M31.5536 8.06879L30.8773 18.9299L18.1861 31.621L13.0938 26.5286L31.5536 8.06879Z"
      fill="white"
    />
  </svg>
);

export const IcProductTag = forwardRef(_IcProductTag);
