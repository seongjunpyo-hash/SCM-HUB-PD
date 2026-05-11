/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcReturnSetting = (
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
          d="M17.1338 13.3127C17.1338 12.146 16.1872 11.1995 15.0205 11.1995H11.167V9.80005H15.0205C16.9604 9.80005 18.5332 11.3728 18.5332 13.3127C18.533 15.2525 16.9603 16.8245 15.0205 16.8245H12.7939L13.4521 17.5188L12.4365 18.4817L10.6592 16.6067C10.4031 16.3367 10.4032 15.9138 10.6592 15.6438L12.4365 13.7688L13.4521 14.7317L12.7949 15.425H15.0205C16.1871 15.425 17.1336 14.4793 17.1338 13.3127ZM10.2002 4.6145H15.0059L13.4795 2.78345H10.2002V4.6145ZM3.99414 4.6145H8.7998V2.78345H5.52051L3.99414 4.6145ZM17.2002 8.75024H15.7998V6.01392H3.2002V15.3831H9.16699V16.7834H2.76953C2.23424 16.7834 1.7998 16.349 1.7998 15.8137V5.31372C1.79987 5.15007 1.85714 4.9912 1.96191 4.86548L4.57422 1.73169L4.64648 1.65356C4.82601 1.48096 5.06659 1.38307 5.31836 1.38306H13.6816C13.9334 1.38307 14.174 1.48096 14.3535 1.65356L14.4258 1.73169L17.0381 4.86548C17.1429 4.9912 17.2001 5.15007 17.2002 5.31372V8.75024Z"
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
        d="M16.5 5.31402L13.8884 2.18013C13.8373 2.11874 13.7615 2.08325 13.6816 2.08325H9.5M16.5 5.31402H9.5M16.5 5.31402V8.74992M2.5 5.31402V15.814C2.5 15.9627 2.62054 16.0833 2.76923 16.0833H9.16667M2.5 5.31402L5.11158 2.18013C5.16273 2.11874 5.23851 2.08325 5.31841 2.08325H9.5M2.5 5.31402H9.5M9.5 2.08325V5.31402M11.1667 10.4999H15.0209C16.5742 10.4999 17.8334 11.7591 17.8334 13.3124C17.8334 14.8658 16.5742 16.1249 15.0209 16.1249H11.1667M11.1667 16.1249L12.9445 14.2499M11.1667 16.1249L12.9445 17.9999"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const IcReturnSetting = forwardRef(_IcReturnSetting);
