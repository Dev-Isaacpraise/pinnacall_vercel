export type ThemeMode = 'light' | 'dark';

const LIGHT_BACKGROUND = '#ffffff';
const DARK_BACKGROUND = '#0a0a0a';

export const applyTheme = (mode: ThemeMode) => {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  const body = document.body;

  root.setAttribute('data-theme', mode);
  root.classList.toggle('dark', mode === 'dark');

  if (body) {
    body.style.backgroundColor = mode === 'dark' ? DARK_BACKGROUND : LIGHT_BACKGROUND;
  }
};

