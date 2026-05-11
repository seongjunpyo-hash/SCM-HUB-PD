import { StepperHelpText } from './stepper-helpText/stepper-helpText';
import { StepperInput } from './stepper-input/stepper-input';
import { StepperRoot } from './stepper-root/stepper-root';

const StepperNamespace = Object.assign(StepperInput, {
  Root: StepperRoot,
  Input: StepperInput,
  HelpText: StepperHelpText,
});

export { StepperNamespace as Stepper };
