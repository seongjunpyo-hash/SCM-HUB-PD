import { forwardRef } from 'react';

import type { GraphicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcMoving = ({ size = 24, ...props }: GraphicSvgProps, ref: ForwardedRef<SVGSVGElement>) => (
  <svg
    ref={ref}
    {...props}
    width={size}
    height={size}
    viewBox="0 0 42 41"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M11.3907 18.5606H29.3282V22.4044H11.3907V18.5606Z" fill="#B3BCD4" />
    <path d="M4.9845 20.4825L11.3907 15.9981V24.9669L4.9845 20.4825Z" fill="#B3BCD4" />
    <path d="M35.7345 20.4825L29.3282 24.9668V15.9981L35.7345 20.4825Z" fill="#B3BCD4" />
    <path d="M21.0001 5.10754L25.4845 11.5138H16.5158L21.0001 5.10754Z" fill="#B3BCD4" />
    <path d="M21.0001 35.8575L16.5157 29.4513H25.4845L21.0001 35.8575Z" fill="#B3BCD4" />
    <path d="M19.0782 11.5138H22.922V29.4513H19.0782V11.5138Z" fill="#B3BCD4" />
    <g opacity="0.2">
      <path d="M21.0001 18.5606H29.3282V22.4043L20.9669 22.443L21.0001 18.5606Z" fill="white" />
      <path d="M35.7345 20.4824L29.3282 24.9668V15.998L35.7345 20.4824Z" fill="white" />
      <path d="M21.0002 5.10748L25.4845 11.5137H20.9669L21.0002 5.10748Z" fill="white" />
      <path d="M21.0001 35.8575L21.0001 29.4512H25.4845L21.0001 35.8575Z" fill="white" />
      <path d="M20.9669 11.5137L22.922 11.5137V29.4512L21.0001 29.4512L20.9669 11.5137Z" fill="white" />
    </g>
    <path d="M27.7141 14.588H14.2661V26.3768H27.7141V14.588Z" fill="#245EFF" />
    <path d="M22.6594 14.588H19.3161V19.079L20.9878 17.9562L22.6594 19.079V14.588Z" fill="white" />
    <path opacity="0.2" d="M27.7141 14.588H20.9803V26.3768H27.7141V14.588Z" fill="white" />
  </svg>
);

export const IcMoving = forwardRef(_IcMoving);
