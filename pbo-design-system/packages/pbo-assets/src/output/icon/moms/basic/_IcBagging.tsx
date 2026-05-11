/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcBagging = (
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
          fillRule="evenodd"
          clipRule="evenodd"
          d="M16.2842 1.7998C16.6605 1.79996 16.9997 2.01094 17.1699 2.33691L17.2324 2.4834L18.2002 5.38672V17.2002C18.2001 17.7523 17.7523 18.2001 17.2002 18.2002H2.7998C2.24768 18.2001 1.79991 17.7523 1.7998 17.2002V5.38672L2.76758 2.4834L2.83008 2.33691C3.00029 2.01094 3.33948 1.79996 3.71582 1.7998H16.2842ZM4.83008 12V16H9.49707V12H4.83008ZM10.5 12V16H15.167V12H10.5ZM4.83008 7V11H9.49707V7H7.83008V9L7.16309 8.33301L6.49707 9V7H4.83008ZM10.5 7V11H15.167V7H13.5V9L12.833 8.33301L12.167 9V7H10.5ZM3.47168 4.7998H16.5283L15.9951 3.2002H4.00488L3.47168 4.7998Z"
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
        d="M2.5 5.5H17.5M2.5 5.5V17.2C2.5 17.3657 2.63432 17.5 2.8 17.5H17.2C17.3657 17.5 17.5 17.3657 17.5 17.2V5.5M2.5 5.5L3.43162 2.70513C3.47246 2.58263 3.5871 2.5 3.71623 2.5H16.2838C16.4129 2.5 16.5275 2.58263 16.5684 2.70513L17.5 5.5"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeMiterlimit="10"
      />
      <path
        vectorEffect="non-scaling-stroke"
        d="M9.49709 11H4.8301V7H6.49709V9L7.16311 8.33301L7.8301 9V7H9.49709V11Z"
        fill={color}
      />
      <path
        vectorEffect="non-scaling-stroke"
        d="M15.167 11H10.5V7H12.167V9L12.833 8.33301L13.5 9V7H15.167V11Z"
        fill={color}
      />
      <path vectorEffect="non-scaling-stroke" d="M4.83 12H9.49667V16H4.83V12Z" fill={color} />
      <path vectorEffect="non-scaling-stroke" d="M10.5 12H15.1667V16H10.5V12Z" fill={color} />
    </svg>
  );
};

export const IcBagging = forwardRef(_IcBagging);
