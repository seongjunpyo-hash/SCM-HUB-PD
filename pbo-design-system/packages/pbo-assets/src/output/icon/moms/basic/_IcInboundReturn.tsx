/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcInboundReturn = (
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
          d="M18.7051 10C18.7051 14.8047 14.8095 18.6999 10.0049 18.7002C7.57092 18.7002 5.36922 17.6992 3.79102 16.0889C3.31086 15.5989 2.88958 15.0507 2.53516 14.458L2.15039 15.8955L1.47461 15.7139L0.797852 15.5332L1.81641 11.7344L2.49219 11.916L5.61523 12.752L5.25195 14.1045L3.70703 13.6904C4.01026 14.2066 4.37424 14.6841 4.79102 15.1094C6.11673 16.4619 7.96248 17.2998 10.0049 17.2998C14.0363 17.2995 17.3047 14.0315 17.3047 10H18.7051Z"
          fill={color}
        />
        <path d="M9 9.25L10 8.25L11 9.25V6.25H14V13.75H6V6.25H9V9.25Z" fill={color} />
        <path
          d="M10 1.2998C12.434 1.29994 14.6367 2.30065 16.2148 3.91113C16.6946 4.40073 17.1145 4.94893 17.4688 5.54102L17.8545 4.10449L18.5303 4.28613L19.207 4.4668L18.3701 7.58887L18.1895 8.26562L14.3906 7.24805L14.5713 6.57129L14.7529 5.89551L16.2979 6.30859C15.9948 5.79275 15.6313 5.31568 15.2148 4.89062C13.8892 3.53786 12.0425 2.70033 10 2.7002C5.96847 2.70037 2.7002 5.96843 2.7002 10H1.30078C1.30078 5.19523 5.19527 1.29998 10 1.2998Z"
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
      <path vectorEffect="non-scaling-stroke" d="M14 13.75H6V6.25H9V9.25L10 8.25L11 9.25V6.25H14V13.75Z" fill={color} />
      <path
        vectorEffect="non-scaling-stroke"
        d="M1.99983 10C1.99983 5.58172 5.58156 2 9.99983 2C12.2383 2 14.2621 2.91939 15.7141 4.40116C16.4751 5.17773 17.079 6.10876 17.4745 7.14286M14.5713 6.57143L17.6936 7.40806L18.5302 4.28571M18.0045 10C18.0045 14.4183 14.4228 18 10.0045 18C7.76602 18 5.74226 17.0806 4.29024 15.5988C3.52926 14.8223 2.92533 13.8912 2.52981 12.8571M5.4331 13.4286L2.31075 12.5919L1.47412 15.7143"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export const IcInboundReturn = forwardRef(_IcInboundReturn);
