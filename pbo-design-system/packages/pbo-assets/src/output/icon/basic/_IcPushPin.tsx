/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcPushPin = (
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
          d="M11.5288 2.14874C11.8954 1.84964 12.4249 1.84978 12.7915 2.14874L12.8677 2.2171L17.7827 7.13214C18.1731 7.52253 18.1728 8.15566 17.7827 8.5462L13.8179 12.5101L13.8872 13.1341C14.053 14.6151 13.7995 16.1105 13.1587 17.4495C12.8509 18.0917 12.0275 18.177 11.5659 17.7151L7.4214 13.5677L3.5298 17.4593L2.54054 16.47L6.43116 12.5774L2.28663 8.42999C1.82577 7.9688 1.91045 7.14799 2.5503 6.83917L2.9673 6.65362L3.39601 6.49151C4.2289 6.20386 5.10092 6.0609 5.98487 6.06085C6.27622 6.06085 6.57346 6.07578 6.86964 6.10967L7.49073 6.17803L11.4536 2.2171L11.5288 2.14874Z"
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
        d="M7.32132 12.6785L3.0356 16.9642M13.1924 13.2118L13.1022 12.3959C13.0922 12.3054 13.1239 12.2152 13.1883 12.1508L17.2879 8.05126C17.405 7.9341 17.405 7.74415 17.2879 7.627L12.3729 2.71204C12.2558 2.59488 12.0658 2.59488 11.9486 2.71204L7.85187 6.80882C7.78748 6.87321 7.69732 6.90487 7.6068 6.89487L6.79089 6.80474C6.52323 6.77407 6.25279 6.76013 5.98513 6.76013C5.17658 6.76013 4.38197 6.89117 3.62361 7.15325C3.35999 7.24364 3.104 7.34928 2.85478 7.46933C2.6748 7.55602 2.64101 7.79341 2.78223 7.93471L12.0619 17.2197C12.2033 17.3612 12.4411 17.3271 12.5274 17.1467C13.1118 15.9256 13.3436 14.5624 13.1924 13.2118Z"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export const IcPushPin = forwardRef(_IcPushPin);
