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
  const input = buildInput(...ignoresJS);
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
      typescript({
        tsconfigOverride: {
          exclude,
          include: ignoresJS,
          compilerOptions: { declarationMap },
        },
      }),
      tscAlias(),
      tsConfigPaths(),

      circularDependencies({
        exclude: additionals?.circularDeps,
      }),

      nodeExternals({
        optDeps: false,
        builtinsPrefix: 'strip',
      }),
      {
        // name: 'end-bemedev',
        // buildEnd: {
        //   order: 'post',
        //   handler: () => {
        //     try {
        //       // Read tsconfig.json from CWD to determine declaration and declarationMap
        //       // If there are ignores, remove their emitted artifacts from the output directory
        //       if (ignoresJS.length > 0) {
        //         // Normalize ignore patterns to target src/* files
        //         // const patterns = ignoresJS.map(p =>
        //         //   p.startsWith('src/')
        //         //     ? p
        //         //     : p.startsWith('**')
        //         //       ? `src/${p}`
        //         //       : `src/**/${p}`,
        //         // );
        //         const files = new Set<string>();
        //         for (const pat of ignoresJS) {
        //           for (const file of globSync(pat, { nodir: true })) {
        //             files.add(file);
        //           }
        //         }
        //         for (const file of files) {
        //           const withoutExt = file.slice(
        //             0,
        //             file.length - extname(file).length,
        //           );
        //           const rel = pathRelative('src', withoutExt);
        //           const baseOut = pathResolve(process.cwd(), dir, rel);
        //           console.log(`Cleaning up ${baseOut}`);
        //           // JS outputs
        //           rmSync(`${baseOut}.js`, { force: true });
        //           rmSync(`${baseOut}.cjs`, { force: true });
        //           if (sourcemap) {
        //             rmSync(`${baseOut}.js.map`, { force: true });
        //             rmSync(`${baseOut}.cjs.map`, { force: true });
        //           }
        //           // Typings
        //           // if (emitDeclarations) {
        //           //   rmSync(`${baseOut}.d.ts`, { force: true });
        //           //   if (emitDeclarationMap)
        //           //     rmSync(`${baseOut}.d.ts.map`, { force: true });
        //           // }
        //         }
        //       }
        //       console.log('Build finished');
        //     } catch (err) {
        //       console.warn('[end-bemedev] cleanup failed:', err);
        //     }
        //   },
        // },
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
