import { forwardRef } from 'react';

import type { GraphicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcProductInventory = ({ size = 24, ...props }: GraphicSvgProps, ref: ForwardedRef<SVGSVGElement>) => (
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
      d="M19.0444 11.8615C19.3922 11.5137 19.8555 11.3057 20.3464 11.2768L28.5146 10.7963C29.1147 10.761 29.6112 11.2574 29.5759 11.8576L29.0954 20.0258C29.0665 20.5167 28.8585 20.98 28.5107 21.3278L18.046 31.7925C17.6539 32.1846 17.0181 32.1846 16.626 31.7925L8.57967 23.7462C8.18757 23.3541 8.18756 22.7183 8.57967 22.3262L19.0444 11.8615Z"
      fill="#B3BCD4"
    />
    <circle cx="25.8556" cy="14.5165" r="1.33874" transform="rotate(45 25.8556 14.5165)" fill="#818AA2" />
    <rect x="26.3298" y="19.723" width="13.0049" height="8.03243" transform="rotate(135 26.3298 19.723)" fill="white" />
    <rect
      x="24.8997"
      y="19.5279"
      width="0.95521"
      height="5.73745"
      transform="rotate(135 24.8997 19.5279)"
      fill="#5F6A70"
    />
    <rect
      x="23.5557"
      y="20.8726"
      width="0.477605"
      height="5.73745"
      transform="rotate(135 23.5557 20.8726)"
      fill="#5F6A70"
    />
    <rect
      x="17.2672"
      y="27.1603"
      width="0.477605"
      height="5.73745"
      transform="rotate(135 17.2672 27.1603)"
      fill="#5F6A70"
    />
    <rect
      x="19.9709"
      y="24.4574"
      width="0.477605"
      height="5.73745"
      transform="rotate(135 19.9709 24.4574)"
      fill="#5F6A70"
    />
    <rect
      x="21.3228"
      y="23.1066"
      width="0.191042"
      height="5.73745"
      transform="rotate(135 21.3228 23.1066)"
      fill="#5F6A70"
    />
    <rect
      x="18.6216"
      y="25.8059"
      width="0.191043"
      height="5.73745"
      transform="rotate(135 18.6216 25.8059)"
      fill="#5F6A70"
    />
    <rect
      x="22.8757"
      y="21.5536"
      width="1.91042"
      height="5.73745"
      transform="rotate(135 22.8757 21.5536)"
      fill="#5F6A70"
    />
    <rect
      x="20.8521"
      y="23.5767"
      width="0.955209"
      height="5.73745"
      transform="rotate(135 20.8521 23.5767)"
      fill="#5F6A70"
    />
    <rect
      x="19.5002"
      y="24.9274"
      width="0.955211"
      height="5.73745"
      transform="rotate(135 19.5002 24.9274)"
      fill="#5F6A70"
    />
    <rect
      x="18.1484"
      y="26.281"
      width="0.955211"
      height="5.73745"
      transform="rotate(135 18.1484 26.281)"
      fill="#5F6A70"
    />
    <path
      opacity="0.2"
      d="M29.6417 10.73L29.0501 20.7879L17.3355 32.5025L12.6024 27.7693L29.6417 10.73Z"
      fill="white"
    />
    <path d="M34.2899 6.49268V13.4546H32.0917V8.69189H27.328V6.49268H34.2899Z" fill="#618BFD" />
    <path d="M31.824 19.25V20.75H8.74976V19.25H31.824Z" fill="#245EFF" />
    <path d="M31.8225 19.25L31.8225 20.75L20.2854 20.75L20.2854 19.25L31.8225 19.25Z" fill="#618BFD" />
    <path
      d="M34.2896 34.3404L27.3276 34.3404L27.3276 32.1421L32.0903 32.1421L32.0903 27.3785L34.2896 27.3785L34.2896 34.3404Z"
      fill="#618BFD"
    />
    <path
      d="M5.71045 6.49292L12.6724 6.49292L12.6724 8.69116L7.90967 8.69116L7.90967 13.4548L5.71045 13.4548L5.71045 6.49292Z"
      fill="#245EFF"
    />
    <path
      d="M5.71008 34.3408L5.71008 27.3788L7.90832 27.3788L7.90832 32.1415L12.672 32.1415L12.672 34.3408L5.71008 34.3408Z"
      fill="#245EFF"
    />
  </svg>
);

export const IcProductInventory = forwardRef(_IcProductInventory);
