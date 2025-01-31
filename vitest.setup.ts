import { writeFileSync } from 'fs';
import { rm } from 'fs/promises';
import { path } from './src/__tests__/fixtures';
import { env } from './vitest.env';
const cFile = `${process.cwd()}/src/${path}.ts`;

export const setup = () => {
  if (env.onlySetup) {
    const content = `export const A = 'A';`;

    writeFileSync(cFile, content);
  }
};

export const teardown = async () => {
  if (env.onlyTeardown) {
    await rm(cFile);
  }
};
