import type { PropsWithChildren } from 'react';

type Props = PropsWithChildren & {};

export function TextfieldSlot({ children }: Props) {
  return <>{children}</>;
}
