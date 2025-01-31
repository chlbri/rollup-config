import type { RollupOptions } from 'rollup';

export type ToArray_F = <T>(value?: T | T[]) => T[];

export type Params = {
  circularDeps?: string | string[];
  excludesTS?: string | string[];
  ignoresJS?: string | string[];
  externals?: string | string[];
  dir?: string;
  sourcemap?: boolean;
  declarationMap?: boolean;
};

export type BuildInput_F = (
  ...ignores: string[]
) => Record<string, string>;

export interface Config_F {
  (additionals?: Params): RollupOptions;
  bemedev: (additionals?: Params) => RollupOptions;
  default: (additionals?: Params) => RollupOptions;
}
