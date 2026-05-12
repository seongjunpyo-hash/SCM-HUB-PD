import { forwardRef } from 'react';

import type { GraphicSvgProps } from '@/types/types';
import type { ForwardedRef } from 'react';

const _IcProblem = ({ size = 24, ...props }: GraphicSvgProps, ref: ForwardedRef<SVGSVGElement>) => (
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
      d="M30.0903 32.1873L11.8951 32.1873L11.8951 15.4172L16.1406 10.9022L30.0903 10.9022L30.0903 32.1873Z"
      fill="#9FA8C0"
    />
    <path
      d="M9.83716 7.81225L28.0324 7.81225L28.0324 24.5823L23.7869 29.0973L9.83716 29.0973L9.83716 7.81225Z"
      fill="#C2C9DD"
    />
    <path d="M23.7863 24.5823L28.0318 24.5823L23.7863 29.0973L23.7863 24.5823Z" fill="white" />
    <path
      d="M18.7083 12.5854C18.8891 12.2876 19.3212 12.2877 19.502 12.5854L24.5132 20.8391C24.701 21.1485 24.4783 21.5444 24.1163 21.5444H14.094C13.732 21.5444 13.5092 21.1485 13.6971 20.8391L18.7083 12.5854Z"
      fill="#245EFF"
    />
    <path d="M18.6027 15.2294L19.4523 15.2294L19.4523 18.4686L18.6027 18.4686L18.6027 15.2294Z" fill="white" />
    <path d="M18.6027 19.2612L19.4523 19.2612L19.4523 20.142L18.6027 20.142L18.6027 19.2612Z" fill="white" />
  </svg>
);

export const IcProblem = forwardRef(_IcProblem);
