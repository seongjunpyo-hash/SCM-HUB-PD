/* eslint-disable no-console */
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { createBasicIcon } from './create-basic-icon';
import { createGraphicIcon } from './create-graphic-icon';
import { createTypesFile } from './create-types-file';
import { getOutputFolderPath } from './get-output-folder-path';

const CURRENT_FILE_PATH = fileURLToPath(import.meta.url);
const CURRENT_DIR_PATH = path.dirname(CURRENT_FILE_PATH);

const ICON_DIR_PATH = path.join(CURRENT_DIR_PATH, '..', '..', 'figma-asset', 'icon');

/**
 *  icon svg -> react component
 */
export const transformSvgIconToComp = async () => {
  try {
    const iconFolders = await fs.readdir(ICON_DIR_PATH);

    for (const iconFolder of iconFolders) {
      const iconFolderPath = path.join(ICON_DIR_PATH, iconFolder);

      switch (iconFolder) {
        case 'graphic':
          await transformGraphic(iconFolderPath);
          break;
        case 'basic':
          await transformBasic(iconFolderPath);
          break;
        default:
          await transformPlatformFolder(iconFolderPath);
          break;
      }
    }
  } catch (error) {
    console.error('SVG Icon -> Component 중 오류 발생:', error);
  }
};

const transformGraphic = async (inputFolderPath: string) => {
  const outputFolderPath = getOutputFolderPath(inputFolderPath);
  await fs.mkdir(outputFolderPath, { recursive: true });

  const svgNames = (await fs.readdir(inputFolderPath)).filter((file) => file.endsWith('.svg'));
  await createTypesFile({
    outputUrl: outputFolderPath,
    svgNames,
    typeName: 'GraphicIconName',
  });

  await createGraphicIcon({
    inputFolderPath,
    svgNames,
  });
};

const transformBasic = async (inputFolderPath: string) => {
  const outputFolderPath = getOutputFolderPath(inputFolderPath);
  await fs.mkdir(outputFolderPath, { recursive: true });

  const strokePath = path.join(inputFolderPath, 'stroke');
  const filledPath = path.join(inputFolderPath, 'filled');

  const strokeSvgNames = (await fs.readdir(strokePath)).filter((file) => file.endsWith('.svg'));
  const filledSvgNames = (await fs.readdir(filledPath)).filter((file) => file.endsWith('.svg'));

  const svgNames = [...new Set([...strokeSvgNames, ...filledSvgNames])];

  await createTypesFile({
    outputUrl: outputFolderPath,
    svgNames,
    typeName: 'BasicIconName',
  });

  await createBasicIcon({
    inputFolderPath,
    svgNames,
  });
};

/** moms, mwms, scmHub, selfPos ... etc */
const transformPlatformFolder = async (inputFolderPath: string) => {
  const basicPath = path.join(inputFolderPath, 'basic');
  const graphicPath = path.join(inputFolderPath, 'graphic');

  // basic 폴더가 존재하면 처리
  try {
    await fs.access(basicPath);
    await transformBasic(basicPath);
  } catch {
    console.log(`basic 폴더가 없습니다: ${basicPath}`);
  }

  // graphic 폴더가 존재하면 처리
  try {
    await fs.access(graphicPath);
    await transformGraphic(graphicPath);
  } catch {
    console.log(`graphic 폴더가 없습니다: ${graphicPath}`);
  }
};
