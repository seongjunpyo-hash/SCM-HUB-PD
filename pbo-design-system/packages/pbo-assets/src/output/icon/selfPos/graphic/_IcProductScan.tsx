import { forwardRef } from 'react';

import type { GraphicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcProductScan = ({ size = 24, ...props }: GraphicSvgProps, ref: ForwardedRef<SVGSVGElement>) => (
  <svg
    ref={ref}
    {...props}
    width={size}
    height={size}
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M30.4166 33.3334H9.58329L8.54163 19.1667H31.4583L30.4166 33.3334ZM16.0416 20.8334C16.0416 21.7539 16.7878 22.5001 17.7083 22.5001H22.2916C23.2121 22.5001 23.9583 21.7539 23.9583 20.8334H16.0416Z"
      fill="#E0E0E0"
    />
    <path d="M7.5 16.6667H32.5V19.1667H7.5V16.6667Z" fill="#BBBBBB" />
    <path
      d="M20.0008 15.0001L16.25 11.2001L16.8218 10.6224L17.3921 10.0446L19.1941 11.8702L19.1941 5.41675L20.8075 5.41675L20.8075 11.8702L22.6095 10.0446L23.75 11.2001L20.0008 15.0001Z"
      fill="#8A8A8A"
    />
  </svg>
);

export const IcProductScan = forwardRef(_IcProductScan);
