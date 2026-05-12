import { promises as fs } from 'fs';
import path from 'path';

import { prettierFormat } from './prettier-format';

type Params = {
  outputUrl: string;
  svgNames: string[];
  typeName: string;
};

/** create types.ts */
export const createTypesFile = async ({ outputUrl, svgNames, typeName }: Params) => {
  const typesFilePath = path.join(outputUrl, 'types.ts');
  const typesFileContent = `export type ${typeName} = ${svgNames
    .map((svgName) => `'${getIconName(svgName)}'`)
    .join(' | ')};
    `;

  const formattedContent = await prettierFormat(typesFileContent);

  await fs.writeFile(typesFilePath, formattedContent);
};

export const getIconName = (svgName: string) => {
  return svgName.replace('.svg', '').replace('_', '-');
};
