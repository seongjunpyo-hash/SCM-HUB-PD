import '@musinsa/layer-tokens/pda-fonts.css';
import '@musinsa/layer-tokens/stylesheet.css';
import { StrictMode } from 'react';

import { createRoot } from 'react-dom/client';

import { App } from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
