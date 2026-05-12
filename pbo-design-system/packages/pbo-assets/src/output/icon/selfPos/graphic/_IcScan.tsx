import { forwardRef } from 'react';

import type { GraphicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcScan = ({ size = 24, ...props }: GraphicSvgProps, ref: ForwardedRef<SVGSVGElement>) => (
  <svg
    ref={ref}
    {...props}
    width={size}
    height={size}
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M33.0004 12.5V13.5H7.00037V12.5H33.0004Z" fill="#8A8A8A" />
    <path d="M11 24.999H8V14.5H11V24.999Z" fill="#E0E0E0" />
    <path d="M32 24.999H30.5V14.5H32V24.999Z" fill="#E0E0E0" />
    <path d="M14 22.999H12.5V14.5H14V22.999Z" fill="#E0E0E0" />
    <path d="M16.25 22.999H14.75V14.5H16.25V22.999Z" fill="#E0E0E0" />
    <path d="M21.5 22.999H17V14.5H21.5V22.999Z" fill="#E0E0E0" />
    <path d="M24.5 22.999H23V14.5H24.5V22.999Z" fill="#E0E0E0" />
    <path d="M29 22.999H26V14.5H29V22.999Z" fill="#E0E0E0" />
    <path d="M11 11.5H8V5.99805H11V11.5Z" fill="#E0E0E0" />
    <path d="M14 11.5H12.5V5.99805H14V11.5Z" fill="#E0E0E0" />
    <path d="M16.25 11.5H14.75V5.99805H16.25V11.5Z" fill="#E0E0E0" />
    <path d="M21.5 11.5H17V5.99805H21.5V11.5Z" fill="#E0E0E0" />
    <path d="M24.5 11.5H23V5.99805H24.5V11.5Z" fill="#E0E0E0" />
    <path d="M29 11.5H26V5.99805H29V11.5Z" fill="#E0E0E0" />
    <path d="M32 11.5H30.5V5.99805H32V11.5Z" fill="#E0E0E0" />
    <path
      d="M12.7263 14.9545C12.7263 14.7035 12.9298 14.5 13.1809 14.5H26.8172C27.0683 14.5 27.2718 14.7035 27.2718 14.9545V17.8292C27.2718 18.9078 26.8882 19.9512 26.1897 20.7731L23.841 23.5362C23.5616 23.865 23.4081 24.2823 23.4081 24.7138V31.3182C23.4081 33.0755 21.9836 34.5 20.2263 34.5C18.218 34.5 16.59 32.8719 16.59 30.8636V24.7138C16.59 24.2823 16.4365 23.865 16.1571 23.5362L13.8084 20.7731C13.1099 19.9512 12.7263 18.9078 12.7263 17.8292V14.9545Z"
      fill="#BBBBBB"
    />
    <path
      d="M16.364 16.3171H23.6367C23.6367 17.0703 23.0262 17.6808 22.2731 17.6808H17.7277C16.9745 17.6808 16.364 17.0703 16.364 16.3171Z"
      fill="white"
    />
  </svg>
);

export const IcScan = forwardRef(_IcScan);
