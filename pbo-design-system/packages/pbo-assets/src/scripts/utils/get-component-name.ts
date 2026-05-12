/**
 *  svg 파일 -> 컴포넌트 이름으로 변환
 *  - ic_icon.svg -> IcIcon
 */
export const getComponentName = (str: string) => {
  return str
    .replace('.svg', '')
    .replace('_', '-')
    .split('-')
    .map((word, index) => {
      if (index === 0) {
        return word;
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
};
