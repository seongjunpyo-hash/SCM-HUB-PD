import type { Dispatch, PropsWithChildren, SetStateAction } from 'react';

type Open =
  | {
      open: boolean;
      setOpen: Dispatch<SetStateAction<boolean>>;
    }
  | {
      open?: never;
      setOpen?: never;
    };

export type PopoverRootProps = PropsWithChildren & Open;
