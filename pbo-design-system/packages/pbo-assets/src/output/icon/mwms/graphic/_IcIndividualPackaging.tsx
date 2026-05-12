import { forwardRef } from 'react';

import type { GraphicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcIndividualPackaging = ({ size = 24, ...props }: GraphicSvgProps, ref: ForwardedRef<SVGSVGElement>) => (
  <svg
    ref={ref}
    {...props}
    width={size}
    height={size}
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M8.92102 14.7892H30.921L25.921 10.7892H13.921L8.92102 14.7892Z" fill="#245EFF" />
    <path d="M30.921 14.7894L25.921 10.7894V22.0394L29.921 29.7894L30.921 14.7894Z" fill="#153EAD" />
    <path d="M8.92102 14.7894L13.921 10.7894V22.0394L9.92102 29.7894L8.92102 14.7894Z" fill="#153EAD" />
    <path d="M8.42102 14.2896H31.421L30.041 29.7896H9.80102L8.42102 14.2896Z" fill="#245EFF" />
    <path d="M7.92114 14.2896H31.9211V17.2896H7.92114V14.2896Z" fill="#B8D4FF" />
    <rect x="15.8962" y="19.4102" width="8.04878" height="2.19512" fill="white" />
  </svg>
);

export const IcIndividualPackaging = forwardRef(_IcIndividualPackaging);
