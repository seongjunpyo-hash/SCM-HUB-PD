import { forwardRef } from 'react';

import type { GraphicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcToteSearch = ({ size = 24, ...props }: GraphicSvgProps, ref: ForwardedRef<SVGSVGElement>) => (
  <svg
    ref={ref}
    {...props}
    width={size}
    height={size}
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M10.1888 15.5771H30.54L29.3189 28.3558H11.4099L10.7994 21.9665L10.1888 15.5771Z" fill="#B3BCD4" />
    <rect x="12.9686" y="18.2361" width="14.786" height="6.90012" fill="white" />
    <rect x="13.9624" y="19.2217" width="1.08603" height="4.92865" fill="#5F6A70" />
    <rect x="16.123" y="19.2217" width="0.543015" height="4.92865" fill="#5F6A70" />
    <rect x="26.2341" y="19.2217" width="0.543015" height="4.92865" fill="#5F6A70" />
    <rect x="21.8872" y="19.2217" width="0.543015" height="4.92865" fill="#5F6A70" />
    <rect x="19.7172" y="19.2217" width="0.217206" height="4.92865" fill="#5F6A70" />
    <rect x="24.0571" y="19.2217" width="0.217206" height="4.92865" fill="#5F6A70" />
    <rect x="17.2186" y="19.2217" width="2.17206" height="4.92865" fill="#5F6A70" />
    <rect x="20.4724" y="19.2217" width="1.08603" height="4.92865" fill="#5F6A70" />
    <rect x="22.6447" y="19.2217" width="1.08603" height="4.92865" fill="#5F6A70" />
    <rect x="24.8193" y="19.2217" width="1.08603" height="4.92865" fill="#5F6A70" />
    <path d="M9.00708 13.2106H31.7246V15.577H9.00708V13.2106Z" fill="#8F97B0" />
    <path opacity="0.2" d="M20.3674 13.2108H31.7262V15.5772H20.3674L20.3674 13.2108Z" fill="white" />
    <path opacity="0.2" d="M20.3674 15.5771H30.5435L29.3225 28.3558H20.3684L20.3674 15.5771Z" fill="white" />
    <path d="M34.2899 6.49274V13.4547H32.0917V8.69196H27.328V6.49274H34.2899Z" fill="#618BFD" />
    <path
      d="M34.2896 34.3405L27.3276 34.3405L27.3276 32.1423L32.0903 32.1423L32.0903 27.3786L34.2896 27.3786L34.2896 34.3405Z"
      fill="#618BFD"
    />
    <path
      d="M5.71045 6.49298L12.6724 6.49298L12.6724 8.69122L7.90967 8.69122L7.90967 13.4549L5.71045 13.4549L5.71045 6.49298Z"
      fill="#245EFF"
    />
    <path
      d="M5.71008 34.3408L5.71008 27.3788L7.90832 27.3788L7.90833 32.1415L12.672 32.1415L12.672 34.3408L5.71008 34.3408Z"
      fill="#245EFF"
    />
    <path d="M31.5391 20.4937V21.9937H8.46484V20.4937H31.5391Z" fill="#245EFF" />
    <path d="M31.5371 20.4937L31.5371 21.9937L20 21.9937L20 20.4937L31.5371 20.4937Z" fill="#618BFD" />
  </svg>
);

export const IcToteSearch = forwardRef(_IcToteSearch);
