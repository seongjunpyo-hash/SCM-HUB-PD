/* eslint-disable no-console */
import { desktopStyleDictionary } from './style-dictionary/desktop';
import { mobileStyleDictionary } from './style-dictionary/mobile';
import { styleSheetThemeMapper } from './utils/theme-mapper';

mobileStyleDictionary.log.verbosity = 'verbose';
desktopStyleDictionary.log.verbosity = 'verbose';

try {
  // 각 플랫폼을 독립적으로 실행
  await desktopStyleDictionary.buildAllPlatforms();
  await mobileStyleDictionary.buildAllPlatforms();
  console.log('✅ desktop token 생성 완료!');
  console.log('✅ mobile token 생성 완료!');

  // css sheet -> theme 처리 (각 플랫폼별로 실행)
  await styleSheetThemeMapper({ platforms: ['desktop'] });
  await styleSheetThemeMapper({ platforms: ['mobile'] });

  console.log('✅ figma json -> CSS Sheet, token 생성 완료!');
} catch (error) {
  console.error('❌ Error occurred:', error);
}
