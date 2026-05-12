import { promises as fs } from 'fs';
import path from 'path';

import { getIconName } from './create-types-file';
import { getComponentName } from './get-component-name';
import { getOutputFolderPath } from './get-output-folder-path';
import { prettierFormat } from './prettier-format';

import { PBO_SERVICE_TO_PLATFORM_MAP, PBO_SERVICES } from '@/types/types';

import type { PboServices } from '@/types/types';

type Params = {
  inputFolderPath: string;
  svgNames: string[];
};

export const createBasicIcon = async ({ inputFolderPath, svgNames }: Params) => {
  const outputFolderPath = getOutputFolderPath(inputFolderPath);

  for (const svgName of svgNames) {
    const componentName = getComponentName(svgName);

    const strokeSvgPath = path.join(inputFolderPath, 'stroke', svgName);
    const filledSvgPath = path.join(inputFolderPath, 'filled', svgName);

    const strokeExists = await fs
      .access(strokeSvgPath)
      .then(() => true)
      .catch(() => false);
    const filledExists = await fs
      .access(filledSvgPath)
      .then(() => true)
      .catch(() => false);

    // 없는게 있을 수 있음 -> 없다면 filled 옵션 무시하도록 처리
    const strokeSvgString = await fs
      .readFile(strokeExists ? strokeSvgPath : filledSvgPath)
      .then((file) => file.toString());
    const filledSvgString = await fs
      .readFile(filledExists ? filledSvgPath : strokeSvgPath)
      .then((file) => file.toString());

    const basicIconTemplate = getBasicIconTemplate({
      componentName,
      strokeSvg: strokeSvgString,
      filledSvg: filledSvgString,
    });

    const formattedContent = await prettierFormat(basicIconTemplate);

    const componentFilePath = path.join(outputFolderPath, `_${componentName}.tsx`);
    await fs.writeFile(componentFilePath, formattedContent);
  }

  await createBasicIconObject(outputFolderPath, svgNames);
  await createIndexBasicIcon(outputFolderPath);
};

const getBasicIconTemplate = ({
  componentName,
  strokeSvg,
  filledSvg,
}: {
  componentName: string;
  strokeSvg: string;
  filledSvg: string;
}) => {
  return `
    /* eslint-disable @typescript-eslint/no-unused-vars */
    /* eslint-disable no-unused-vars */
    import { forwardRef } from 'react';

    import type { BasicSvgProps } from '@/types/types';
    import type { ForwardedRef } from 'react';

    const _${componentName} = ({ size = 24, filled = false, strokeWidth = 1.4, color, ...props }: BasicSvgProps, ref: ForwardedRef<SVGSVGElement>) => {
        if (filled) {
            return ${formatFilledSvg(filledSvg)};
        }   

        return ${formatStrokeSvg(strokeSvg)};
    };

    export const ${componentName} = forwardRef(_${componentName});
  `;
};

const formatStrokeSvg = (strokeSvg: string) => {
  let formatted = strokeSvg
    .replace(
      /(\s+)([a-z]+)-([a-z]+)(=)/g,
      (_, space, prefix, suffix, equals) =>
        `${space}${prefix}${suffix.charAt(0).toUpperCase() + suffix.slice(1)}${equals}`,
    )
    .replace(/width="[^"]*"/, `width={size}`)
    .replace(/height="[^"]*"/, `height={size}`)
    .replace('<svg', `<svg ref={ref} {...props}`)
    .replace(/stroke="[^"]*"/g, `stroke={color}`)
    .replace(/fill="(?!none)[^"]*"/g, `fill={color}`);

  // strokeWidth가 없으면 추가
  if (!formatted.includes('strokeWidth=')) {
    formatted = formatted.replace(/stroke={color}/g, `stroke={color} strokeWidth={strokeWidth}`);
  } else {
    formatted = formatted.replace(/strokeWidth="[^"]*"/g, `strokeWidth={strokeWidth}`);
  }

  // 모든 path 요소에 vectorEffect="non-scaling-stroke" 추가
  formatted = formatted.replace(/<path\s+/g, `<path vectorEffect="non-scaling-stroke" `);

  return formatted;
};

const formatFilledSvg = (filledSvg: string) => {
  return filledSvg
    .replace(
      /(\s+)([a-z]+)-([a-z]+)(=)/g,
      (_, space, prefix, suffix, equals) =>
        `${space}${prefix}${suffix.charAt(0).toUpperCase() + suffix.slice(1)}${equals}`,
    )
    .replace(/width="[^"]*"/, `width={size}`)
    .replace(/height="[^"]*"/, `height={size}`)
    .replace('<svg', `<svg ref={ref} {...props}`)
    .replace(/stroke="[^"]*"/g, `stroke={color}`)
    .replace(/fill="(?!none)[^"]*"/g, `fill={color}`);
};

const createBasicIconObject = async (outputFolderPath: string, svgNames: string[]) => {
  const objectFilePath = path.join(outputFolderPath, 'constants.ts');

  const objectContent = getGraphicIconObjectTemplate(svgNames);
  const formattedContent = await prettierFormat(objectContent);

  await fs.writeFile(objectFilePath, formattedContent);
};

const getGraphicIconObjectTemplate = (svgNames: string[]) => {
  return `
      ${svgNames.map((svgName) => `import { ${getComponentName(svgName)} } from './_${getComponentName(svgName)}';`).join('\n')}
  
      import type { BasicSvgProps } from '@/types/types';
      import type { ForwardRefExoticComponent, RefAttributes } from 'react';
      import type { BasicIconName } from './types';
  
      type BasicIconType = ForwardRefExoticComponent<Omit<BasicSvgProps, 'ref'> & RefAttributes<SVGSVGElement>>;
  
      export const BasicIconMap: Record<BasicIconName, BasicIconType> = {
        ${svgNames.map((svgName) => `'${getIconName(svgName)}': ${getComponentName(svgName)}`).join(',\n')}
      } as const;
    `;
};

const createIndexBasicIcon = async (outputFolderPath: string) => {
  const indexFilePath = path.join(outputFolderPath, 'BasicIcon.tsx');

  const service = PBO_SERVICES.find((p) => outputFolderPath.includes(p));

  // MEMO: web -> desktop 으로 임시처리
  const indexContent = service ? getPlatformIndexBasicIconTemplate(service) : getCommonIndexBasicIconTemplate();
  const formattedContent = await prettierFormat(indexContent);

  await fs.writeFile(indexFilePath, formattedContent);
};

// common basic icon
const getCommonIndexBasicIconTemplate = () => {
  return `
    import { forwardRef, type ForwardedRef, type SVGProps } from 'react';

    import { tokens } from '@musinsa/layer-tokens/desktop';

    import { BasicIconMap } from './constants';

    import { colorTokenMap, type ColorToken } from '@/types/combine-color-token';

    import type { BasicIconName } from './types';

    interface BaseProps extends SVGProps<SVGSVGElement> {
      name: BasicIconName;
      size?: number;
      color?: string;
      colorToken?: ColorToken;
    }

    interface FilledProps extends BaseProps {
      filled: true;
      iconStroke?: never;
    }

    interface StrokeProps extends BaseProps {
      filled?: never;
      iconStroke?: keyof typeof tokens.primitive.iconStroke;
    }

    type Props = FilledProps | StrokeProps;

    const _BasicIcon = (
      { name, size = 24, filled, iconStroke = '150', color: propColor = '#000000', colorToken, ...props }: Props,
      ref: ForwardedRef<SVGSVGElement>,
    ) => {
      const Icon = BasicIconMap[name];
      const strokeWidth = parseFloat(tokens.primitive.iconStroke[iconStroke]);

      const hasColorToken = colorToken && colorToken in colorTokenMap;
      const color = hasColorToken ? colorTokenMap[colorToken] : propColor;

      return <Icon ref={ref} size={size} filled={filled} strokeWidth={strokeWidth} color={color} {...props} />;
    };

    export const BasicIcon = forwardRef<SVGSVGElement, Props>(_BasicIcon);
  `;
};

// platform basic icon
const getPlatformIndexBasicIconTemplate = (service: PboServices) => {
  return `
    import { forwardRef, type ForwardedRef } from 'react';

    import { colorTokenMap, tokens, type ColorToken } from '@musinsa/layer-tokens/${PBO_SERVICE_TO_PLATFORM_MAP[service]}';

    import { BasicIconMap } from './constants';

    import type { SVGProps } from 'react';
    import type { BasicIconName } from './types';

    interface BaseProps extends SVGProps<SVGSVGElement> {
      name: BasicIconName;
      size?: number;
      color?: string;
      colorToken?: ColorToken;
    }

    interface FilledProps extends BaseProps {
      filled: true;
      iconStroke?: never;
    }

    interface StrokeProps extends BaseProps {
      filled?: never;
      iconStroke?: keyof typeof tokens.primitive.iconStroke;
    }

    type Props = FilledProps | StrokeProps;

    const _BasicIcon = ({ name, size = 24, filled, iconStroke = '150', color: propColor = '#000000', colorToken, ...props }: Props, ref: ForwardedRef<SVGSVGElement>) => {
      const Icon = BasicIconMap[name];
      const strokeWidth = parseFloat(tokens.primitive.iconStroke[iconStroke]);

      const hasColorToken = colorToken && colorToken in colorTokenMap;
      const color = hasColorToken ? colorTokenMap[colorToken] : propColor;

      return <Icon ref={ref} size={size} filled={filled} strokeWidth={strokeWidth} color={color} {...props} />;
    };

    export const BasicIcon = forwardRef<SVGSVGElement, Props>(_BasicIcon);
  `;
};
