/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcLinkBroken = (
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
          d="M6.79787 9.37695L6.02443 10.1514L4.9922 11.1826C3.93596 12.2389 3.93596 13.9516 4.9922 15.0078C6.04845 16.0641 7.76115 16.0641 8.8174 15.0078L9.84865 13.9756L10.6231 13.2021L11.6123 14.1924L9.80666 15.998C8.20365 17.6006 5.60482 17.6009 4.00197 15.998C2.39912 14.3952 2.39937 11.7964 4.00197 10.1934L5.80763 8.3877L6.79787 9.37695ZM15.0547 14.0654L14.5596 14.5596L14.0654 15.0547L5.16505 6.15527L6.15529 5.16504L15.0547 14.0654ZM10.1934 4.00195C11.7964 2.39936 14.3952 2.3991 15.9981 4.00195C17.6009 5.6048 17.6007 8.20363 15.9981 9.80664L14.1924 11.6123L13.2022 10.623L13.9756 9.84863L15.0078 8.81738C16.0641 7.76114 16.0641 6.04843 15.0078 4.99219C13.9516 3.93594 12.2389 3.93594 11.1826 4.99219L10.1514 6.02441L9.37697 6.79785L8.38771 5.80762L10.1934 4.00195Z"
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
        d="M5.66001 5.65999L14.56 14.56M13.6972 11.1178L13.9551 10.8598L14.471 10.3439L15.5028 9.31215C16.8324 7.98254 16.8324 5.82682 15.5028 4.49721C14.1732 3.1676 12.0175 3.1676 10.6878 4.49721L9.65608 5.52898L9.14019 6.04487L8.88225 6.30281M6.30281 8.88225L6.04487 9.14019L5.52898 9.65608L4.49721 10.6878C3.1676 12.0175 3.1676 14.1732 4.49721 15.5028C5.82682 16.8324 7.98254 16.8324 9.31215 15.5028L10.3439 14.471L10.8598 13.9551L11.1178 13.6972"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export const IcLinkBroken = forwardRef(_IcLinkBroken);
