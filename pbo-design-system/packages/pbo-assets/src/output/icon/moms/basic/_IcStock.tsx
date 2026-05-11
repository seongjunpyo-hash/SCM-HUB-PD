/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcStock = (
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
          d="M8.2002 10.2998C8.75233 10.2999 9.20009 10.7477 9.2002 11.2998V16.7002C9.20009 17.2523 8.75233 17.7001 8.2002 17.7002H2.7998C2.24767 17.7001 1.79991 17.2523 1.7998 16.7002V11.2998C1.79991 10.7477 2.24767 10.2999 2.7998 10.2998H8.2002Z"
          fill={color}
        />
        <path
          d="M17.2002 10.2998C17.7523 10.2999 18.2001 10.7477 18.2002 11.2998V16.7002C18.2001 17.2523 17.7523 17.7001 17.2002 17.7002H11.7998C11.2477 17.7001 10.7999 17.2523 10.7998 16.7002V11.2998C10.7999 10.7477 11.2477 10.2999 11.7998 10.2998H17.2002Z"
          fill={color}
        />
        <path
          d="M13.2002 1.2998C13.7523 1.29991 14.2001 1.74767 14.2002 2.2998V7.7002C14.2001 8.25233 13.7523 8.70009 13.2002 8.7002H6.7998C6.24768 8.70009 5.79991 8.25233 5.7998 7.7002V2.2998C5.79991 1.74768 6.24767 1.29991 6.7998 1.2998H9V4.51758C9.00034 4.69548 9.2159 4.7841 9.3418 4.6582L9.8584 4.1416C9.9365 4.0635 10.0635 4.0635 10.1416 4.1416L10.6582 4.6582C10.7841 4.7841 10.9997 4.69548 11 4.51758V1.2998H13.2002Z"
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
        d="M2.5 11.3C2.5 11.1343 2.63431 11 2.8 11H8.2C8.36569 11 8.5 11.1343 8.5 11.3V16.7C8.5 16.8657 8.36569 17 8.2 17H2.8C2.63431 17 2.5 16.8657 2.5 16.7V11.3Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeMiterlimit="10"
      />
      <path
        vectorEffect="non-scaling-stroke"
        d="M11.5 11.3C11.5 11.1343 11.6343 11 11.8 11H17.2C17.3657 11 17.5 11.1343 17.5 11.3V16.7C17.5 16.8657 17.3657 17 17.2 17H11.8C11.6343 17 11.5 16.8657 11.5 16.7V11.3Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeMiterlimit="10"
      />
      <path
        vectorEffect="non-scaling-stroke"
        d="M6.5 2.3C6.5 2.13431 6.63431 2 6.8 2H13.2C13.3657 2 13.5 2.13431 13.5 2.3V7.7C13.5 7.86569 13.3657 8 13.2 8H6.8C6.63431 8 6.5 7.86569 6.5 7.7V2.3Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeMiterlimit="10"
      />
      <path
        vectorEffect="non-scaling-stroke"
        d="M9 2.2C9 2.08954 9.08954 2 9.2 2H10.8C10.9105 2 11 2.08954 11 2.2V4.51716C11 4.69534 10.7846 4.78457 10.6586 4.65858L10.1414 4.14142C10.0633 4.06332 9.93668 4.06332 9.85858 4.14142L9.34142 4.65858C9.21543 4.78457 9 4.69534 9 4.51716V2.2Z"
        fill={color}
      />
    </svg>
  );
};

export const IcStock = forwardRef(_IcStock);
