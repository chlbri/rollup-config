import { defineConfig as _defineConfig } from 'rollup';
import { circularDependencies } from 'rollup-plugin-circular-dependencies';
import { nodeExternals } from 'rollup-plugin-node-externals';
import type { Config_F } from './types';
//@ts-expect-error for bundling
import tscAlias from 'rollup-plugin-tsc-alias';
import tsConfigPaths from 'rollup-plugin-tsconfig-paths';
import typescript from 'rollup-plugin-typescript2';
import {
  DEFAULT_CIRCULAR_DEPS,
  DEFAULT_DIR,
  DEFAULT_EXCLUDE,
} from './constants';
import { buildInput } from './input';
import { toArray } from './utils';

export const defineConfig: Config_F = additionals => {
  return defineConfig.default(additionals);
};

defineConfig.default = additionals => {
  // #region constants
  const ignoresJS = toArray(additionals?.ignoresJS);
  const input = buildInput();
  const dir = additionals?.dir ?? DEFAULT_DIR;
  const declarationMap = additionals?.declarationMap;
  const exclude = DEFAULT_EXCLUDE.concat(toArray(additionals?.excludesTS));
  const external = additionals?.externals;

  const sourcemap =
    additionals?.sourcemap === undefined
      ? false
      : additionals.sourcemap === true;
  // #endregion

  return _defineConfig({
    input,
    plugins: [
      tscAlias(),
      typescript({
        tsconfigOverride: {
          exclude,
          compilerOptions: { declarationMap },
        },
      }),
      tsConfigPaths(),

      circularDependencies({
        exclude: additionals?.circularDeps,
      }),

      nodeExternals({
        optDeps: false,
        builtinsPrefix: 'strip',
      }),
      {
        name: 'end-bemedev',
        options: {
          order: 'post',
          handler: options => {
            return { ...options, input: buildInput(...ignoresJS) };
          },
        },
      },
    ],
    external,
    output: [
      {
        format: 'es',
        sourcemap,
        preserveModulesRoot: 'src',
        dir,
        preserveModules: true,
        entryFileNames: '[name].js',
      },
      {
        format: 'cjs',
        sourcemap,
        preserveModulesRoot: 'src',
        dir,
        preserveModules: true,
        entryFileNames: '[name].cjs',
      },
    ],
  });
};

defineConfig.bemedev = additionals => {
  // #region constants
  const circularDeps = DEFAULT_CIRCULAR_DEPS.concat(
    toArray(additionals?.circularDeps),
  );
  const ignoresJS = toArray(additionals?.ignoresJS).concat(
    DEFAULT_CIRCULAR_DEPS,
  );

  const excludesTS = DEFAULT_EXCLUDE.concat(
    toArray(additionals?.excludesTS),
  );
  const _sourcemap = additionals?.sourcemap;
  const sourcemap = _sourcemap === undefined || _sourcemap === true;
  // #endregion

  return defineConfig.default({
    ...additionals,
    circularDeps,
    excludesTS,
    ignoresJS,
    sourcemap,
  });
};
