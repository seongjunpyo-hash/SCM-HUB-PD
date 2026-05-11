/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcArrowCompress = (
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
          d="M12.2002 6.80957L16.5049 2.50488L17.4951 3.49512L13.1904 7.7998H16.2002V9.2002H11.7998C11.2477 9.20009 10.7999 8.75233 10.7998 8.2002L10.7998 3.7998H12.2002L12.2002 6.80957ZM2.50488 16.5049L6.80957 12.2002L3.7998 12.2002V10.7998L8.2002 10.7998C8.75233 10.7999 9.20009 11.2477 9.2002 11.7998V16.2002H7.7998V13.1904L3.49512 17.4951L2.50488 16.5049Z"
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
        d="M4.5 11H4V12H4.5V11.5V11ZM8.2 11.5V11V11V11.5ZM8.5 11.8H9V11.8H8.5ZM8 15.5L8 16H9L9 15.5H8.5H8ZM15.5 9H16V8H15.5V8.5V9ZM11.8 8.5V9V9V8.5ZM11.5 8.2L11 8.2V8.2H11.5ZM12 4.5V4L11 4V4.5L11.5 4.5L12 4.5ZM4.5 11.5V12H8.2V11.5V11H4.5V11.5ZM8.5 11.8H8L8 15.5H8.5H9L9 11.8H8.5ZM8.2 11.5V12C8.08955 12 8 11.9105 8 11.8H8.5H9C9 11.3582 8.64183 11 8.2 11V11.5ZM8.5 11.5L8.14645 11.1464L2.64645 16.6464L3 17L3.35355 17.3536L8.85355 11.8536L8.5 11.5ZM15.5 8.5V8L11.8 8V8.5V9L15.5 9V8.5ZM11.5 8.2L12 8.2L12 4.5L11.5 4.5L11 4.5L11 8.2L11.5 8.2ZM11.8 8.5V8C11.9105 8 12 8.08954 12 8.2H11.5H11C11 8.64183 11.3582 9 11.8 9V8.5ZM11.5 8.5L11.8536 8.85355L17.3536 3.35355L17 3L16.6464 2.64645L11.1464 8.14645L11.5 8.5Z"
        fill={color}
      />
    </svg>
  );
};

export const IcArrowCompress = forwardRef(_IcArrowCompress);
