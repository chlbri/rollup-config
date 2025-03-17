import { defineConfig } from '../../config';
import { useBuild, useBundle, useTests } from '../fixtures';

useBuild();

describe('bemedev options - with declarationMap', () => {
  const { writeCjs, writeEsm } = useBundle(
    defineConfig.bemedev({ declarationMap: true }),
  );

  test(...writeEsm(1));

  describe(
    '#2 => Check files',
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
        types: false,
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
        config: true,
        constants: true,
        index: true,
        input: true,
        types: true,
        utils: true,
      },
      '.js.map': {
        config: true,
        constants: true,
        index: true,
        input: true,
        types: false,
        utils: true,
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
    '#4 => Checks files',
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
        types: false,
        utils: true,
      },
      '.cjs': {
        config: true,
        constants: true,
        index: true,
        input: true,
        types: false,
        utils: true,
      },
      '.d.ts.map': {
        config: true,
        constants: true,
        index: true,
        input: true,
        types: true,
        utils: true,
      },
      '.js.map': {
        config: true,
        constants: true,
        index: true,
        input: true,
        types: false,
        utils: true,
      },
      '.cjs.map': {
        config: true,
        constants: true,
        index: true,
        input: true,
        types: false,
        utils: true,
      },
    }),
  );
});
