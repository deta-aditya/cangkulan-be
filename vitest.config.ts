import tsconfigPaths from 'vite-tsconfig-paths';
import {
  configDefaults,
  defineConfig,
} from 'vitest/config';

const config = defineConfig({
  test: {
    ...configDefaults,
    coverage: {
      reporter: ['html'],
    }
  },
  plugins: [tsconfigPaths()],
});

export default config;
