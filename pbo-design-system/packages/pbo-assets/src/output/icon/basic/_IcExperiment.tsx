/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcExperiment = (
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
          d="M10.9998 9.25C11.414 9.25 11.7498 9.58579 11.7498 10C11.7498 10.4142 11.414 10.75 10.9998 10.75C10.5857 10.7499 10.2498 10.4142 10.2498 10C10.2498 9.58584 10.5857 9.25009 10.9998 9.25Z"
          fill={color}
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M14.9998 3.2002H13.7V7.36426L17.4852 16.8281C17.7479 17.485 17.2639 18.2002 16.5565 18.2002H3.44319C2.73599 18.1999 2.2519 17.4848 2.51448 16.8281L6.29964 7.36426V3.2002H4.99983V1.7998H14.9998V3.2002ZM7.70003 7.44238C7.70001 7.56945 7.6759 7.69548 7.62874 7.81348L5.43831 13.2861C5.67955 13.4698 5.98654 13.6468 6.37678 13.7373C7.03665 13.8901 8.07796 13.8271 9.61018 12.8018C11.2132 11.729 12.7774 11.6416 14.033 11.9697L12.3709 7.81348C12.3238 7.69552 12.2997 7.5694 12.2996 7.44238V3.2002H7.70003V7.44238Z"
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
        d="M5 2.5H15M4.5 13.3839C5.05002 13.936 6.70003 15.5923 10 13.3839C12.2118 11.9037 14.3 12.5506 15.4 13.3839M13 7.44223V2.8C13 2.63431 12.8657 2.5 12.7 2.5H7.3C7.13432 2.5 7 2.63431 7 2.8V7.44223C7 7.48039 6.99272 7.51821 6.97854 7.55364L3.16457 17.0886C3.08574 17.2856 3.23087 17.5 3.44311 17.5H16.5569C16.7691 17.5 16.9143 17.2856 16.8354 17.0886L13.0215 7.55364C13.0073 7.51821 13 7.48039 13 7.44223ZM11.75 10C11.75 10.4142 11.4142 10.75 11 10.75C10.5858 10.75 10.25 10.4142 10.25 10C10.25 9.58579 10.5858 9.25 11 9.25C11.4142 9.25 11.75 9.58579 11.75 10Z"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export const IcExperiment = forwardRef(_IcExperiment);
