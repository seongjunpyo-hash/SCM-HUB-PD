/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcSound = (
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
          d="M16.7998 9.99999C16.7998 8.01837 15.9623 6.23515 14.623 4.99879L15.0889 4.45836L15.5557 3.91895C17.1772 5.41609 18.2002 7.58543 18.2002 9.99999C18.2002 12.4145 17.1771 14.5839 15.5557 16.081L14.623 15.0012C15.9622 13.7648 16.7998 11.9816 16.7998 9.99999ZM12.5752 17.1639C12.5752 17.9993 11.6669 18.4904 11.0039 18.0134L5.49414 14.0486H2.7998C2.24761 14.0485 1.7998 13.5855 1.7998 13.0143V6.98573C1.7998 6.41453 2.24761 5.95146 2.7998 5.95135H5.49414L11.0039 1.98655L11.1309 1.90876C11.777 1.57257 12.5752 2.05281 12.5752 2.83607V17.1639Z"
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
        d="M15.0893 4.64286C16.5698 5.96421 17.5 7.87494 17.5 10.0001C17.5 12.1251 16.5699 14.0358 15.0895 15.3571M11.875 16.9259V3.07415C11.875 2.83184 11.6026 2.6895 11.4037 2.82787L5.79152 6.73199C5.74124 6.76696 5.68145 6.78571 5.6202 6.78571H2.8C2.63431 6.78571 2.5 6.92003 2.5 7.08571V12.9143C2.5 13.08 2.63431 13.2143 2.8 13.2143H5.6202C5.68145 13.2143 5.74124 13.233 5.79152 13.268L11.4037 17.1721C11.6026 17.3105 11.875 17.1682 11.875 16.9259Z"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export const IcSound = forwardRef(_IcSound);
