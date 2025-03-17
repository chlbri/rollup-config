import { defineConfig } from '../config';
import { useBuild, useBundle, useTests } from './fixtures';

useBuild();

describe('Without options', () => {
  const { writeCjs, writeEsm } = useBundle(defineConfig());

  test(...writeEsm(1));

  describe(
    '#2 => Check files - no map - no cjs',
    useTests({
      '.d.ts': {
        config: true,
        constants: true,
        index: true,
        input: true,
        types: true,
        utils: true,
      },
      '.js': {
        config: true,
        constants: true,
        index: true,
        input: true,
        types: true,
        utils: true,
      },
      '.cjs': {
        config: false,
        constants: false,
        index: false,
        input: false,
        types: false,
        utils: false,
      },
      '.d.ts.map': {
        config: false,
        constants: false,
        index: false,
        input: false,
        types: false,
        utils: false,
      },
      '.js.map': {
        config: false,
        constants: false,
        index: false,
        input: false,
        types: false,
        utils: false,
      },
      '.cjs.map': {
        config: false,
        constants: false,
        index: false,
        input: false,
        types: false,
        utils: false,
      },
    }),
  );

  test(...writeCjs(3));

  describe(
    '#4 => Checks files - no map - with cjs',
    useTests({
      '.d.ts': {
        config: true,
        constants: true,
        index: true,
        input: true,
        types: true,
        utils: true,
      },
      '.js': {
        config: true,
        constants: true,
        index: true,
        input: true,
        types: true,
        utils: true,
      },
      '.cjs': {
        config: true,
        constants: true,
        index: true,
        input: true,
        types: true,
        utils: true,
      },
      '.d.ts.map': {
        config: false,
        constants: false,
        index: false,
        input: false,
        types: false,
        utils: false,
      },
      '.js.map': {
        config: false,
        constants: false,
        index: false,
        input: false,
        types: false,
        utils: false,
      },
      '.cjs.map': {
        config: false,
        constants: false,
        index: false,
        input: false,
        types: false,
        utils: false,
      },
    }),
  );
});
