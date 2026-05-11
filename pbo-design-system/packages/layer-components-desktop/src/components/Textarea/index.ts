import { Textarea } from './textarea';
import { TextareaCount } from './textarea-addon';
import { TextareaBox } from './textarea-box';
import { TextareaInput } from './textarea-input';

const TextareaNamespace = Object.assign(Textarea, {
  Box: TextareaBox,
  Input: TextareaInput,
  Count: TextareaCount,
});

export { TextareaNamespace as Textarea };
