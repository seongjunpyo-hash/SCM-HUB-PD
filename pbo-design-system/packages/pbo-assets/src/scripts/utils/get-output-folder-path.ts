export const getOutputFolderPath = (inputFolderPath: string) => {
  return inputFolderPath.replace('figma-asset', 'output');
};
