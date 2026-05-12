import { forwardRef } from 'react';

import type { GraphicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _Example = ({ size = 24, ...props }: GraphicSvgProps, ref: ForwardedRef<SVGSVGElement>) => (
  <svg
    ref={ref}
    {...props}
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10 2.5C14.1421 2.5 17.5 5.85786 17.5 10C17.5 14.1421 14.1421 17.5 10 17.5C5.85786 17.5 2.5 14.1421 2.5 10C2.5 5.85786 5.85786 2.5 10 2.5ZM9.5 13.7334H10.5V11.8672H9.5V13.7334ZM9.5 10.9336H10.5V6.2666H9.5V10.9336Z"
      fill="black"
    />
  </svg>
);

export const Example = forwardRef(_Example);
