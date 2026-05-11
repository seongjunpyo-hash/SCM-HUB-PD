import { forwardRef } from 'react';

import { Icon } from '@musinsa/pbo-assets';

import { DialogContextProvider } from './_context/dialog-context';
import { DialogAction } from './dialog-action';
import { DialogContent } from './dialog-content';
import { DialogSubTitle } from './dialog-subTitle';
import { DialogTitle } from './dialog-title';
import { dialogStyle, iconStyle, typeStyles } from './dialog.css';

import { dimStyle } from '@/shared/css/common.css';
import { useScrollLock } from '@/shared/hooks/useScrollLock';
import { mergeClassNames } from '@/shared/utils/merge-class-names';

import type { ForwardedRef } from 'react';
import type { DialogProps } from './dialog.types';

const DEFAULT_TYPE = 'default';

const Comp = (
  { open, children, type = DEFAULT_TYPE, ...htmlDivProps }: DialogProps,
  ref: ForwardedRef<HTMLDivElement>,
) => {
  const { className, ...restHtmlDivProps } = htmlDivProps;

  useScrollLock({ enabled: open });

  if (!open) return null;

  return (
    <DialogContextProvider type={type}>
      <div className={dimStyle}>
        <div className={mergeClassNames(dialogStyle, typeStyles[type], className)} ref={ref} {...restHtmlDivProps}>
          {type === 'failFeedback' && (
            <Icon className={iconStyle} name="ic-alertTriangle" size={80} colorToken="fg-critical" filled />
          )}
          {children}
        </div>
      </div>
    </DialogContextProvider>
  );
};

const Dialog = forwardRef(Comp);
Dialog.displayName = 'Dialog';

const DialogNamespace = Object.assign(Dialog, {
  Title: DialogTitle,
  SubTitle: DialogSubTitle,
  Content: DialogContent,
  Action: DialogAction,
});

export { DialogNamespace as Dialog };
