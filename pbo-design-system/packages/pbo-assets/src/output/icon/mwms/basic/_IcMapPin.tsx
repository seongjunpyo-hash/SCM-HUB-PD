/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcMapPin = (
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
        <g clipPath="url(#clip0_3016_3539)">
          <path
            d="M15.6989 9.70533C16.0103 9.70543 16.2869 9.90384 16.3874 10.1986L18.7148 17.0254C18.8753 17.4973 18.524 17.9873 18.0255 17.9873H1.97266C1.4739 17.9872 1.12325 17.4965 1.28423 17.0244L3.6117 10.1976L3.65791 10.092C3.78249 9.85696 4.028 9.7055 4.30014 9.70533H6.87187C6.90405 9.74975 6.93408 9.79516 6.96617 9.8383C7.80348 10.9636 8.72826 11.8237 9.11258 12.163C9.62066 12.6114 10.3794 12.6114 10.8874 12.163C11.2718 11.8236 12.1966 10.9636 13.0338 9.8383C13.0659 9.79515 13.0959 9.74977 13.1281 9.70533H15.6989Z"
            fill={color}
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10 1.9873C12 1.98731 13.6214 3.60864 13.6214 5.60866C13.6214 8.13569 10.8814 10.7183 10.1679 11.3481C10.0706 11.434 9.92946 11.434 9.83214 11.3481C9.11864 10.7183 6.37864 8.13569 6.37864 5.60866C6.37864 3.60864 7.99998 1.9873 10 1.9873ZM10.0028 3.97905C9.10282 3.97905 8.37321 4.70866 8.37321 5.60866C8.37321 6.50867 9.10282 7.23828 10.0028 7.23828C10.9028 7.23828 11.6324 6.50867 11.6324 5.60866C11.6324 4.70866 10.9028 3.97905 10.0028 3.97905Z"
            fill={color}
          />
        </g>
        <defs>
          <clipPath id="clip0_3016_3539">
            <rect width="20" height="20" fill={color} />
          </clipPath>
        </defs>
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
      <g clipPath="url(#clip0_3016_3520)">
        <path
          vectorEffect="non-scaling-stroke"
          d="M13.2829 9.98203H15.5017C15.5879 9.98203 15.6646 10.0369 15.6924 10.1185L17.9471 16.7335C17.9916 16.8642 17.8945 17 17.7564 17H2.20163C2.06353 17 1.96637 16.8642 2.01094 16.7335L4.26653 10.1185C4.29435 10.0369 4.37101 9.98203 4.45722 9.98203H6.67665M9.97977 2C8.04181 2 6.47079 3.57103 6.47079 5.50898C6.47079 7.95762 9.12545 10.4605 9.81678 11.0708C9.91109 11.154 10.0485 11.154 10.1428 11.0708C10.8341 10.4605 13.4888 7.95762 13.4888 5.50898C13.4888 3.57103 11.9177 2 9.97977 2ZM9.98251 4.19896C9.25901 4.19896 8.67249 4.78548 8.67249 5.50899C8.67249 6.23249 9.25901 6.81901 9.98251 6.81901C10.706 6.81901 11.2925 6.23249 11.2925 5.50899C11.2925 4.78548 10.706 4.19896 9.98251 4.19896Z"
          stroke={color}
          strokeWidth={strokeWidth}
        />
      </g>
      <defs>
        <clipPath id="clip0_3016_3520">
          <rect width="20" height="20" fill={color} />
        </clipPath>
      </defs>
    </svg>
  );
};

export const IcMapPin = forwardRef(_IcMapPin);
