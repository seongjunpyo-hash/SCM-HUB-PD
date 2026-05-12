import { clearOutputDirectory } from './utils/clear-output-directory';
import { transformSvgIconToComp } from './utils/transform-svg-to-comp';

try {
  await clearOutputDirectory();
  await transformSvgIconToComp();
  // eslint-disable-next-line no-console
  console.log('✅ figma assets -> assets components 생성 완료!');
} catch (error) {
  // eslint-disable-next-line no-console
  console.error(error);
}
