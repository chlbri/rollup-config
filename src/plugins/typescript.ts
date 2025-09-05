import { PartialCompilerOptions } from '@rollup/plugin-typescript';
import type { Plugin } from 'rollup';
import _typescript from 'rollup-plugin-typescript2';
export type TypescriptOptions = Parameters<typeof _typescript>[0] & {
  tsconfigOverride?: {
    compilerOptions?: PartialCompilerOptions;
    include?: string | Record<string, string> | string[];
    exclude?: string[];
  };
};

/**
 * Creates a configured TypeScript plugin instance
 * @param options - Configuration options for TypeScript
 * @returns Rollup plugin
 */
export function typescript(options: TypescriptOptions = {}): Plugin {
  return _typescript(options);
}
