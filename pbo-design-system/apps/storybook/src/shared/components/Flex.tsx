import React from 'react';

import type { PropsWithChildren } from 'react';

export function Div({
  children,
  width = '100%',
  height = 'auto',
}: PropsWithChildren & { width?: string; height?: string }) {
  return <div style={{ width, height }}>{children}</div>;
}

export function Flex({ children, gap = 12 }: PropsWithChildren & { gap?: number }) {
  return <div style={{ display: 'flex', alignItems: 'center', gap }}>{children}</div>;
}

export function Column({ children, width = '100%', gap = 12 }: PropsWithChildren & { width?: string; gap?: number }) {
  return <div style={{ display: 'flex', flexDirection: 'column', gap, width }}>{children}</div>;
}
