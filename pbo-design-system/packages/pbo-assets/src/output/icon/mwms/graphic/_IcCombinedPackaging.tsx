import { forwardRef } from 'react';

import type { GraphicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcCombinedPackaging = ({ size = 24, ...props }: GraphicSvgProps, ref: ForwardedRef<SVGSVGElement>) => (
  <svg
    ref={ref}
    {...props}
    width={size}
    height={size}
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M29.9165 32.0126L12.0011 32.0126L12.0011 15.5005L16.1814 11.055L29.9165 11.055L29.9165 32.0126Z"
      fill="#B8D4FF"
    />
    <path
      d="M9.97241 8.01262L27.8878 8.01262L27.8878 24.5247L23.7075 28.9702L9.97241 28.9702L9.97241 8.01262Z"
      fill="#245EFF"
    />
    <path d="M23.7063 24.5247L27.8865 24.5247L23.7063 28.9702L23.7063 24.5247Z" fill="white" />
    <path d="M24.4103 11.8958L24.4103 13.7727L13.6593 13.7727L13.6593 11.8958L24.4103 11.8958Z" fill="white" />
    <path d="M24.4103 17.2991L24.4103 19.176L13.6593 19.176L13.6593 17.2991L24.4103 17.2991Z" fill="white" />
    <path d="M19.7623 22.3702L19.7623 24.2472L13.6598 24.2472L13.6598 22.3702L19.7623 22.3702Z" fill="white" />
  </svg>
);

export const IcCombinedPackaging = forwardRef(_IcCombinedPackaging);
