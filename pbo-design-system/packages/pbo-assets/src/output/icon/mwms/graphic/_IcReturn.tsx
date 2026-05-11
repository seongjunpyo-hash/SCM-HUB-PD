import { forwardRef } from 'react';

import type { GraphicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcReturn = ({ size = 24, ...props }: GraphicSvgProps, ref: ForwardedRef<SVGSVGElement>) => (
  <svg
    ref={ref}
    {...props}
    width={size}
    height={size}
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M18.3259 28.2019V15.7757L8.18213 11.9718V24.6516L18.3259 28.2019Z" fill="#9FA8C0" />
    <path d="M18.3276 28.2019V15.7757L28.4714 11.9718V24.6516L18.3276 28.2019Z" fill="#B3BCD4" />
    <path d="M24.412 13.4925V15.5213L22.6368 16.282V14.1582L24.412 13.4925Z" fill="white" />
    <path d="M18.3259 15.7754L28.4698 11.9715L18.3259 8.16754L8.18213 11.9715L18.3259 15.7754Z" fill="#C2C9DD" />
    <path d="M22.637 14.1575L24.4122 13.4918L14.5219 9.59277L13.0004 10.1634L22.637 14.1575Z" fill="white" />
    <circle cx="26.4645" cy="26.3293" r="5.35497" fill="#245EFF" stroke="#245EFF" strokeWidth="1.47255" />
    <path
      d="M29.9482 26.3286L27.5781 28.6987L27.2178 28.3373L26.8574 27.977L27.9961 26.8383H23.4512V25.8188H27.9961L26.8574 24.6801L27.5781 23.9594L29.9482 26.3286Z"
      fill="white"
    />
    <path
      opacity="0.2"
      d="M26.4652 32.4205C29.8293 32.4205 32.5565 29.6934 32.5565 26.3293C32.5565 22.9652 29.8293 20.238 26.4652 20.238V32.4205Z"
      fill="white"
    />
  </svg>
);

export const IcReturn = forwardRef(_IcReturn);
