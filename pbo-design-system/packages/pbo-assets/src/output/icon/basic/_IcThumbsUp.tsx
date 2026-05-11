/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcThumbsUp = (
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
          d="M10.1201 2.09766C10.5025 1.70567 11.1366 1.70031 11.5264 2.08496L11.6064 2.17286L12.2881 3.02539C13.089 4.02657 13.3037 5.37568 12.8535 6.57618L12.3262 7.98438H15.5947C17.3531 7.98445 18.6269 9.66121 18.1562 11.3555L17.1943 14.8184C16.639 16.8169 14.8194 18.2002 12.7451 18.2002H1.7998V7.98438H5.58301L10.043 2.1875L10.1201 2.09766ZM3.2002 16.7998H5.22852V9.38477H3.2002V16.7998Z"
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
        d="M5.92824 8.68453H2.5V17.5H5.92824M5.92824 8.68453V17.5M5.92824 8.68453L10.5973 2.61469C10.7136 2.4636 10.9406 2.46144 11.0597 2.61028L11.7416 3.46262C12.3884 4.27118 12.562 5.36051 12.1984 6.33005L11.4644 8.2875C11.3923 8.4796 11.5343 8.68453 11.7395 8.68453H15.5946C16.8901 8.68453 17.8289 9.91957 17.4821 11.1678L16.5203 14.6306C16.0492 16.3264 14.5052 17.5 12.7452 17.5H5.92824"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export const IcThumbsUp = forwardRef(_IcThumbsUp);
