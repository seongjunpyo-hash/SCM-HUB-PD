/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcLink = (
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
          d="M7.05568 9.11914L4.9922 11.1826C3.93596 12.2389 3.93596 13.9516 4.9922 15.0078C6.04845 16.0641 7.76116 16.0641 8.8174 15.0078L10.8809 12.9443L11.8711 13.9346L9.80666 15.998C8.20365 17.6006 5.60482 17.6009 4.00197 15.998C2.39912 14.3952 2.39937 11.7964 4.00197 10.1934L6.06544 8.12891L7.05568 9.11914ZM12.751 7.24902L13.2461 7.74316L7.74318 13.2461L7.24904 12.751L6.75392 12.2568L12.2569 6.75391L12.751 7.24902ZM10.1934 4.00195C11.7964 2.39936 14.3952 2.3991 15.9981 4.00195C17.6009 5.6048 17.6007 8.20363 15.9981 9.80664L13.9346 11.8711L12.9444 10.8809L15.0078 8.81738C16.0641 7.76114 16.0641 6.04843 15.0078 4.99219C13.9516 3.93594 12.2389 3.93594 11.1826 4.99219L9.11916 7.05566L8.12892 6.06543L10.1934 4.00195Z"
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
        d="M6.56075 8.6243L4.49721 10.6878C3.1676 12.0175 3.1676 14.1732 4.49721 15.5028C5.82682 16.8324 7.98254 16.8324 9.31215 15.5028L11.3757 13.4392M7.2486 12.7514L12.7514 7.2486M8.6243 6.56075L10.6878 4.49721C12.0175 3.1676 14.1732 3.1676 15.5028 4.49721C16.8324 5.82682 16.8324 7.98254 15.5028 9.31215L13.4392 11.3757"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export const IcLink = forwardRef(_IcLink);
