/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcSend = (
  { size = 24, filled = false, strokeWidth = 1.4, color, ...props }: BasicSvgProps,
  ref: ForwardedRef<SVGSVGElement>,
) => {
  if (filled) {
    return (
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
          d="M2.41895 3.71582C2.27154 2.90507 3.11256 2.27405 3.84961 2.64258L16.7764 9.10547C17.5134 9.47399 17.5134 10.526 16.7764 10.8945L3.84961 17.3574C3.11257 17.7259 2.27154 17.0949 2.41895 16.2842L3.27832 11.5557L3.3125 11.4199C3.41404 11.1132 3.65968 10.8709 3.97461 10.7764L6.56348 10L3.97461 9.22363C3.61456 9.11553 3.34557 8.81421 3.27832 8.44434L2.41895 3.71582Z"
          fill={color}
        />
      </svg>
    );
  }

  return (
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
        vectorEffect="non-scaling-stroke"
        d="M3.10733 3.59032C3.06311 3.3471 3.31554 3.15777 3.53666 3.26833L16.4633 9.73167C16.6845 9.84223 16.6845 10.1578 16.4633 10.2683L3.53666 16.7317C3.31554 16.8422 3.06311 16.6529 3.10733 16.4097L3.96712 11.6809C3.9873 11.5699 4.06803 11.4796 4.17607 11.4472L8.04217 10.2873C8.32723 10.2018 8.32723 9.79817 8.04217 9.71265L4.17607 8.55282C4.06803 8.52041 3.9873 8.43012 3.96712 8.31914L3.10733 3.59032Z"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export const IcSend = forwardRef(_IcSend);
