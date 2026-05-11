import { forwardRef } from 'react';

import type { GraphicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcInbound = ({ size = 24, ...props }: GraphicSvgProps, ref: ForwardedRef<SVGSVGElement>) => (
  <svg
    ref={ref}
    {...props}
    width={size}
    height={size}
    viewBox="0 0 42 41"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M20.7017 8.22741C20.8862 8.1198 21.1148 8.11987 21.2993 8.22741L33.1528 15.1422C33.3349 15.2484 33.4471 15.4439 33.4471 15.6547V32.9465H29.2981V21.1911H12.7029V32.9465H8.55383V15.6547C8.55383 15.4439 8.66604 15.2484 8.84812 15.1422L20.7017 8.22741ZM16.8529 18.1291H25.15V16.6476H16.8529V18.1291Z"
      fill="#B3BCD4"
    />
    <path
      opacity="0.2"
      d="M33.1529 15.1422L21.2993 8.22741C21.2069 8.17356 21.1034 8.14665 21 8.14673L21.0015 16.6476H25.15V18.1291H21.0015L21.0005 21.1911H29.2981V32.9465H33.4471V15.6547C33.4471 15.4439 33.3349 15.2484 33.1529 15.1422Z"
      fill="white"
    />
    <path
      d="M19.3994 24.649V28.1875L20.7518 27.2266L21.9619 28.1875V24.649H25.6686V32.9471H15.8149V24.649H19.3994Z"
      fill="#245EFF"
    />
    <path
      opacity="0.2"
      d="M21.9619 28.1875L20.7517 27.2266H20.7417V32.9471H25.6685V24.649H21.9619V28.1875Z"
      fill="white"
    />
  </svg>
);

export const IcInbound = forwardRef(_IcInbound);
