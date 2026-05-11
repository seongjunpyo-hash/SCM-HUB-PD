import { useTextareaContext } from '../_context/textarea-context';

import { currentLengthStyle, wrapStyle } from './textarea-count.css';

export function TextareaCount() {
  const { inputState } = useTextareaContext() ?? {};
  const { value, maxLength } = inputState ?? {};

  const currentLength = value?.toString().length ?? 0;

  return (
    <span className={wrapStyle}>
      <span className={currentLengthStyle}>{currentLength.toLocaleString()}</span>/{maxLength?.toLocaleString()}
    </span>
  );
}
