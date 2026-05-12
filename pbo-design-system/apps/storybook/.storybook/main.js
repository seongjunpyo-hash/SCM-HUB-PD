const config = {
  'stories': ['../src/*.mdx', '../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  'staticDirs': ['../assets'],
  'addons': [
    '@chromatic-com/storybook',
    '@storybook/addon-docs',
    '@storybook/addon-onboarding',
    '@storybook/addon-a11y',
    '@storybook/addon-vitest',
  ],
  'framework': {
    'name': '@storybook/react-vite',
    'options': {},
  },
  'viteFinal': async (config) => {
    const tsconfigPaths = (await import('vite-tsconfig-paths')).default;
    const { vanillaExtractPlugin } = await import('@vanilla-extract/vite-plugin');

    // CSS 파일 처리 설정
    config.css = {
      ...config.css,
      postcss: {
        plugins: [],
      },
    };

    // 각 패키지의 tsconfig paths alias(@/ 등)를 자동으로 resolve
    // vanilla-extract .css.ts 파일 처리
    config.plugins = [...(config.plugins || []), tsconfigPaths(), vanillaExtractPlugin()];

    return config;
  },
};
export default config;
