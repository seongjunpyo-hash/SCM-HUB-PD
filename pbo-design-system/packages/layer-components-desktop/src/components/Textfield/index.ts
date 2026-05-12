import { Textfield } from './textfield';
import { TextfieldCount, TextfieldSlot } from './textfield-addon';
import { TextfieldBox } from './textfield-box';
import { TextfieldInput } from './textfield-input';

/**
 *  Textfield는 anatomy들을 조립하여 최소한의 기능을 제공하는 컴포넌트
 */
const TextfieldNamespace = Object.assign(Textfield, {
  Box: TextfieldBox,
  Input: TextfieldInput,
  Slot: TextfieldSlot,
  Count: TextfieldCount,
});

export { TextfieldNamespace as Textfield };
