import { globSync } from 'glob';
import { relative } from 'node:path';
import type { Plugin } from 'rollup';
import { circularDependencies } from 'rollup-plugin-circular-dependencies';
import { WARNING_CODES } from '../constants';
import { withoutExtension } from '../helpers';
import { toArray } from '../utils';

export type CircularDependenciesOptions = Parameters<
  typeof circularDependencies
>[0] & {
  exclude?: string | string[];
};

/**
 * Creates a configured circular dependencies plugin instance
 * @param options - Configuration options for circular dependencies detection
 * @returns Rollup plugin
 */
export function circulars(
  options: CircularDependenciesOptions = {},
): Plugin {
  const {
    options: _options,
    moduleParsed,
    generateBundle,
  } = circularDependencies(options);

  const exclude = toArray(options.exclude);

  const CIRCULAR_CHUNKS = exclude
    .map(f => globSync(f, { nodir: true }))
    .flat()
    .map(withoutExtension)
    .map(file => relative('src', file));

  return {
    name: 'better circular-dependencies',
    options: _options,
    moduleParsed,
    generateBundle,
    onLog: {
      handler: (_, { code, names }) => {
        if (
          code === WARNING_CODES.CIRCULAR_DEPENDENCY &&
          names?.every(name => CIRCULAR_CHUNKS.includes(name))
        ) {
          const STARS = '*'.repeat(20);
          console.log(STARS);
          console.log(
            '[bemedev] Skipping circular dependency warnings for:',
          );
          names?.forEach(name => console.log(`  -> 📄 ${name}`));
          console.log(STARS);
          console.log();
          return false;
        }

        return;
      },
    },
  };
}
