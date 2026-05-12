import { useTextfieldContext } from '../_context/textfield-context';

import { currentLengthStyle, wrapStyle } from './textfield-count.css';

export function TextfieldCount() {
  const {
    inputState: { value, maxLength },
  } = useTextfieldContext();

  const currentLength = value?.toString().length ?? 0;

  return (
    <span className={wrapStyle}>
      <span className={currentLengthStyle}>{currentLength.toLocaleString()}</span>/{maxLength?.toLocaleString()}
    </span>
  );
}
