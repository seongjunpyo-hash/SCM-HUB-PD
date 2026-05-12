import { promises as fs } from 'fs';
import path from 'path';

import { getIconName } from './create-types-file';
import { getComponentName } from './get-component-name';
import { getOutputFolderPath } from './get-output-folder-path';
import { prettierFormat } from './prettier-format';

type Params = {
  inputFolderPath: string;
  svgNames: string[];
};

export const createGraphicIcon = async ({ inputFolderPath, svgNames }: Params) => {
  const outputFolderPath = getOutputFolderPath(inputFolderPath);

  for (const svgName of svgNames) {
    const componentName = getComponentName(svgName);

    const svgFilePath = path.join(inputFolderPath, svgName);
    const svgString = (await fs.readFile(svgFilePath)).toString();

    const componentContent = getGraphicIconTemplate({ componentName, svg: svgString });
    const formattedContent = await prettierFormat(componentContent);

    const componentFilePath = path.join(outputFolderPath, `_${componentName}.tsx`);
    await fs.writeFile(componentFilePath, formattedContent);
  }

  await createGraphicIconObject(outputFolderPath, svgNames);
  await createIndexGraphicIcon(outputFolderPath);
};

const getGraphicIconTemplate = ({ componentName, svg }: { componentName: string; svg: string }) => {
  return `
    import { forwardRef } from 'react';

    import type { GraphicSvgProps } from '@/types/types';
    import type { ForwardedRef } from 'react';

    const _${componentName} = ({ size = 24, ...props }: GraphicSvgProps, ref: ForwardedRef<SVGSVGElement>) => (
      ${formatGraphicSvg(svg)}
    );

    export const ${componentName} = forwardRef(_${componentName});
  `;
};

const formatGraphicSvg = (svg: string) => {
  return svg
    .replace(
      /(\s+)([a-z]+)-([a-z]+)(=)/g,
      (_, space, prefix, suffix, equals) =>
        `${space}${prefix}${suffix.charAt(0).toUpperCase() + suffix.slice(1)}${equals}`,
    )
    .replace(/width="[^"]*"/, `width={size}`)
    .replace(/height="[^"]*"/, `height={size}`)
    .replace('<svg', `<svg ref={ref} {...props}`);
};

const createGraphicIconObject = async (outputFolderPath: string, svgNames: string[]) => {
  const objectFilePath = path.join(outputFolderPath, 'constants.ts');

  const objectContent = getGraphicIconObjectTemplate(svgNames);
  const formattedContent = await prettierFormat(objectContent);

  await fs.writeFile(objectFilePath, formattedContent);
};

const getGraphicIconObjectTemplate = (svgNames: string[]) => {
  return `
    ${svgNames.map((svgName) => `import { ${getComponentName(svgName)} } from './_${getComponentName(svgName)}';`).join('\n')}

    import type { GraphicSvgProps } from '@/types/types';
    import type { ForwardRefExoticComponent, RefAttributes } from 'react';
    import type { GraphicIconName } from './types';

    type GraphicIconType = ForwardRefExoticComponent<Omit<GraphicSvgProps, 'ref'> & RefAttributes<SVGSVGElement>>;

    export const GraphicIconMap: Record<GraphicIconName, GraphicIconType> = {
      ${svgNames.map((svgName) => `'${getIconName(svgName)}': ${getComponentName(svgName)}`).join(',\n')}
    } as const;
  `;
};

const createIndexGraphicIcon = async (outputFolderPath: string) => {
  const indexFilePath = path.join(outputFolderPath, 'GraphicIcon.tsx');

  const indexContent = getIndexGraphicIconTemplate();
  const formattedContent = await prettierFormat(indexContent);

  await fs.writeFile(indexFilePath, formattedContent);
};

const getIndexGraphicIconTemplate = () => {
  return `
    import { forwardRef, type ForwardedRef, type SVGProps } from 'react';

    import { GraphicIconMap } from './constants';

    import type { GraphicIconName } from './types';

    interface Props extends SVGProps<SVGSVGElement> {
      name: GraphicIconName;
      size?: number;
    }

    const _GraphicIcon = ({ name, ...props }: Props, ref: ForwardedRef<SVGSVGElement>) => {
      const Icon = GraphicIconMap[name];
      
      return <Icon ref={ref} {...props} />;
    };

    export const GraphicIcon = forwardRef<SVGSVGElement, Props>(_GraphicIcon);
  `;
};
