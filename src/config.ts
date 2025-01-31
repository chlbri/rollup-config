import { defineConfig as _defineConfig } from 'rollup';
import { circularDependencies } from 'rollup-plugin-circular-dependencies';
import { nodeExternals } from 'rollup-plugin-node-externals';
//@ts-expect-error for build
import tscAlias from 'rollup-plugin-tsc-alias';
import tsConfigPaths from 'rollup-plugin-tsconfig-paths';
import typescript from 'rollup-plugin-typescript2';
import {
  DEFAULT_CIRCULAR_DEPS,
  DEFAULT_DIR,
  DEFAULT_EXCLUDE,
} from './constants';
import { buildInput } from './input';
import type { Config_F } from './types';
import { toArray } from './utils';

export const defineConfig: Config_F = additionals => {
  return defineConfig.default(additionals);
};

defineConfig.default = additionals => {
  // #region constants
  const input = buildInput(...toArray(additionals?.ignoresJS));
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
      tsConfigPaths(),

      typescript({
        tsconfigOverride: {
          exclude,
          compilerOptions: { declarationMap },
        },
      }),

      circularDependencies({
        exclude: additionals?.circularDeps,
      }),

      nodeExternals({
        optDeps: false,
        builtinsPrefix: 'strip',
      }),
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
