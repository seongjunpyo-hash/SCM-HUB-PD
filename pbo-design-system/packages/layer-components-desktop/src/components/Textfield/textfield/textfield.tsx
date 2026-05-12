import { forwardRef } from 'react';

import { TextfieldCount } from '../textfield-addon';
import { TextfieldBox } from '../textfield-box';
import { TextfieldInput } from '../textfield-input';

import type { TextfieldProps } from './textfield.types';

const Textfield = forwardRef<HTMLInputElement, TextfieldProps>(
  (
    {
      // textfield box props
      validationState,

      // textfield input props
      onValueChange,
      ...textfieldInputProps
    },
    ref,
  ) => {
    return (
      <TextfieldBox validationState={validationState}>
        <TextfieldInput ref={ref} onValueChange={onValueChange} {...textfieldInputProps} />
        {textfieldInputProps.maxLength && <TextfieldCount />}
      </TextfieldBox>
    );
  },
);

Textfield.displayName = 'Textfield';

export { Textfield };
