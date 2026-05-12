import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const CURRENT_FILE_PATH = fileURLToPath(import.meta.url);
const CURRENT_DIR_PATH = path.dirname(CURRENT_FILE_PATH);

const OUTPUT_DIR_PATH = path.join(CURRENT_DIR_PATH, '..', '..', 'output');

/**
 *  output directory를 초기화
 *  - 기존 파일을 삭제하고 최신화하기 위함
 */
export const clearOutputDirectory = async () => {
  try {
    await fs.rm(OUTPUT_DIR_PATH, { recursive: true, force: true });
    await fs.mkdir(OUTPUT_DIR_PATH);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('output 폴더 초기화 중 오류 발생:', error);
    throw error;
  }
};
