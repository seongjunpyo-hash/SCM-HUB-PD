/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { forwardRef } from 'react';

import type { BasicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcQuestionCircle = (
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
          d="M10 3C13.866 3 17 6.13401 17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3ZM9.5 12.3838V13.6836H10.5V12.3838H9.5ZM10 6.0332C9.37683 6.0332 8.87337 6.29938 8.53027 6.64844C8.20021 6.98425 7.98353 7.43454 7.9834 7.85547H8.9834C8.98358 7.75465 9.05199 7.54421 9.24316 7.34961C9.42179 7.16786 9.67681 7.0332 10 7.0332C10.3357 7.0332 10.6658 7.18816 10.8604 7.4502L10.8623 7.45215C10.9494 7.56845 11.0165 7.78496 11.0166 7.9707C11.0166 8.12585 10.9722 8.25975 10.8672 8.42871C10.7862 8.55655 10.6837 8.6681 10.5576 8.78516C10.4933 8.84491 10.428 8.90255 10.3545 8.9668C10.2835 9.02891 10.2048 9.09698 10.1289 9.16992C9.80449 9.48171 9.5 9.89476 9.5 10.5781V11.5166H10.5V10.5781C10.5 10.2605 10.6143 10.0914 10.8223 9.8916C10.8794 9.83672 10.9412 9.78124 11.0127 9.71875C11.0816 9.65853 11.1604 9.58991 11.2383 9.51758C11.3963 9.37082 11.5686 9.19185 11.7148 8.95996L11.7168 8.95703C11.8908 8.67711 12.0166 8.36152 12.0166 7.9707C12.0165 7.61088 11.9012 7.17284 11.6611 6.85254C11.261 6.31511 10.6221 6.0332 10 6.0332Z"
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
        d="M8.48333 7.85587C8.48333 7.33413 9.0536 6.53333 10 6.53333C10.4793 6.53333 10.9646 6.75173 11.2619 7.15213C11.4257 7.37053 11.5167 7.69813 11.5167 7.97113C11.5167 8.24413 11.4317 8.4686 11.2922 8.69307C10.8372 9.415 10 9.57678 10 10.5778V11.5167M10 12.3833V13.6833M16.5 10C16.5 13.5899 13.5899 16.5 10 16.5C6.41015 16.5 3.5 13.5899 3.5 10C3.5 6.41015 6.41015 3.5 10 3.5C13.5899 3.5 16.5 6.41015 16.5 10Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeMiterlimit="10"
      />
    </svg>
  );
};

export const IcQuestionCircle = forwardRef(_IcQuestionCircle);
