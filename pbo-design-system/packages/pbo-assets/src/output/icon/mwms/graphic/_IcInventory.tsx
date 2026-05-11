import { forwardRef } from 'react';

import type { GraphicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcInventory = ({ size = 24, ...props }: GraphicSvgProps, ref: ForwardedRef<SVGSVGElement>) => (
  <svg
    ref={ref}
    {...props}
    width={size}
    height={size}
    viewBox="0 0 42 41"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M24.6081 21.1035L21.685 9.86932H12.839V16.6093L17.1111 21.1035H24.6081Z" fill="#B3BCD4" />
    <path opacity="0.2" d="M24.6095 21.1035L21.6864 9.86932H17.113V16.6093L17.1125 21.1035H24.6095Z" fill="white" />
    <path d="M12.839 16.902L17.1362 21.6385H23.0033L20.209 11.4742H12.839V16.902Z" fill="#245EFF" />
    <path opacity="0.2" d="M17.1376 11.4742V21.6385H23.0046L20.2104 11.4742H17.1376Z" fill="white" />
    <path d="M17.1188 21.1035H25.6782V30.7328H17.1188V21.1035Z" fill="#B3BCD4" />
    <path opacity="0.2" d="M17.1182 21.1035H25.6775V30.7328H17.1182V21.1035Z" fill="white" />
    <path d="M17.1188 21.1035V30.7328L8.02441 28.7123V16.8238H12.7697L17.1188 21.1035Z" fill="#B3BCD4" />
    <path d="M25.6781 30.7328L28.3529 30.7328L28.3529 7.72944L25.6781 7.72944L25.6781 30.7328Z" fill="#B3BCD4" />
    <path d="M25.6781 30.7328L33.7025 30.7328L33.7025 28.058L25.6781 28.058L25.6781 30.7328Z" fill="#B3BCD4" />
    <ellipse cx="11.7694" cy="29.6628" rx="3.74473" ry="3.74473" fill="#7B839C" />
    <ellipse cx="21.9336" cy="30.7328" rx="2.67481" ry="2.67481" fill="#7B839C" />
    <ellipse cx="11.7707" cy="29.6626" rx="1.92586" ry="1.92586" fill="#B3BCD4" />
    <ellipse cx="21.9342" cy="30.7329" rx="1.37562" ry="1.37562" fill="#B3BCD4" />
    <path
      opacity="0.2"
      d="M21.9336 33.4076C23.4109 33.4076 24.6084 32.21 24.6084 30.7328H19.2588C19.2588 32.21 20.4563 33.4076 21.9336 33.4076Z"
      fill="white"
    />
    <path
      opacity="0.2"
      d="M11.7694 25.9181C9.70123 25.9181 8.02466 27.5947 8.02466 29.6628H15.5141C15.5141 27.5947 13.8375 25.9181 11.7694 25.9181Z"
      fill="white"
    />
  </svg>
);

export const IcInventory = forwardRef(_IcInventory);
