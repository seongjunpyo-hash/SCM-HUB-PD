/* eslint-disable no-console */
import { desktopDarkStyleDictionary, desktopStyleDictionary } from './style-dictionary/desktop';
import { pdaStyleDictionary } from './style-dictionary/pda';
import { posStyleDictionary } from './style-dictionary/pos';
import { styleSheetThemeMapper } from './utils/theme-mapper';

desktopStyleDictionary.log.verbosity = 'verbose';
desktopDarkStyleDictionary.log.verbosity = 'verbose';
pdaStyleDictionary.log.verbosity = 'verbose';
posStyleDictionary.log.verbosity = 'verbose';

try {
  // 각 플랫폼을 독립적으로 실행
  await desktopStyleDictionary.buildAllPlatforms();
  await desktopDarkStyleDictionary.buildAllPlatforms();
  console.log('✅ desktop token 생성 완료!');

  await pdaStyleDictionary.buildAllPlatforms();
  console.log('✅ pda token 생성 완료!');

  await posStyleDictionary.buildAllPlatforms();
  console.log('✅ pos token 생성 완료!');

  // css sheet -> theme 처리 (각 플랫폼별로 실행)
  await styleSheetThemeMapper({ platforms: ['desktop'] });
  await styleSheetThemeMapper({ platforms: ['pda'] });
  await styleSheetThemeMapper({ platforms: ['pos'] });

  console.log('✅ figma json -> CSS Sheet, token 생성 완료!');
} catch (error) {
  console.error('❌ Error occurred:', error);
}
