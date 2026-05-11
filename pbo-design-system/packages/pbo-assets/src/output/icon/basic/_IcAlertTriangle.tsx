/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcAlertTriangle = (
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
          d="M9.38095 3.07062C9.69796 2.67896 10.3032 2.6789 10.6202 3.07062L10.6837 3.16047L18.377 15.7835L18.4298 15.8851C18.6526 16.3992 18.2783 17 17.6934 17.0003H2.3077C1.68343 17.0003 1.2993 16.3166 1.62411 15.7835L9.31747 3.16047L9.38095 3.07062ZM9.50009 12.8831V14.7503H10.5001V12.8831H9.50009ZM9.50009 7.28351V11.9505H10.5001V7.28351H9.50009Z"
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
        d="M10 14.7499V12.8832M10 11.9499V7.28322M2.30694 16.4999H17.6931C17.9272 16.4999 18.0711 16.2437 17.9493 16.0438L10.2562 3.42025C10.1393 3.22841 9.86077 3.22841 9.74386 3.42025L2.05076 16.0438C1.92893 16.2437 2.07283 16.4999 2.30694 16.4999Z"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export const IcAlertTriangle = forwardRef(_IcAlertTriangle);
