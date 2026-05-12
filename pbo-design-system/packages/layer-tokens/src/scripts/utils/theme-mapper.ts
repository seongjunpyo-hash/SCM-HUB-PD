/* eslint-disable no-console */
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 *  각 theme별 css sheet에 선택자 추가
 */
export const styleSheetThemeMapper = async ({ platforms }: { platforms: string[] }) => {
  const stylesheetDir = join(__dirname, '../../output/stylesheet');

  await Promise.all(
    platforms.map(async (platform) => {
      const lightColorsPath = join(stylesheetDir, `layer-${platform}-light-colors.css`);
      const darkColorsPath = join(stylesheetDir, `layer-${platform}-dark-colors.css`);

      try {
        // 파일이 존재하는지 확인
        if (!existsSync(lightColorsPath) || !existsSync(darkColorsPath)) {
          console.log(`⚠️ CSS 파일이 존재하지 않습니다: ${platform}`);
          return;
        }

        const lightCssContent = readFileSync(lightColorsPath, 'utf-8');
        const darkCssContent = readFileSync(darkColorsPath, 'utf-8');

        const transformedLightCss = lightCssContent.replace(
          /:root\s*{/g,
          `:root[data-layer-theme='light'][data-layer-platform='${platform}'], [data-layer-theme='light'][data-layer-platform='${platform}'] {`,
        );
        const transformedDarkCss = darkCssContent.replace(
          /:root\s*{/g,
          `:root[data-layer-theme='dark'][data-layer-platform='${platform}'], [data-layer-theme='dark'][data-layer-platform='${platform}'] {`,
        );

        writeFileSync(lightColorsPath, transformedLightCss, 'utf-8');
        writeFileSync(darkColorsPath, transformedDarkCss, 'utf-8');
      } catch (error) {
        console.log(`⚠️ CSS 파일 처리 중 오류 발생: ${platform} - ${error}`);
      }
    }),
  );
};
