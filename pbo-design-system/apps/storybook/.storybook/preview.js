import '@musinsa/layer-tokens/desktop-fonts.css';
import '@musinsa/layer-tokens/pda-fonts.css';
import '@musinsa/layer-tokens/pos-fonts.css';
import '@musinsa/layer-tokens/stylesheet.css';

import '@musinsa/phase-tokens/stylesheet.css';

import './reset.css';

const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
    docs: {
      canvas: {
        sourceState: 'shown',
      },
    },
  },
};

export default preview;
