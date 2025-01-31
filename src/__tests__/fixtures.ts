import { existsSync } from 'node:fs';
import { rm } from 'node:fs/promises';
import { rollup, type RollupBuild, type RollupOptions } from 'rollup';
import { toArray } from '../utils';

export const WAITER = 100_000;

export const useBuild = () => {
  afterAll(() => {
    return rm('./lib', { recursive: true, force: true });
  });

  beforeAll(() => {
    return rm('./lib', { recursive: true, force: true });
  });
};

export const useBundle = (options: RollupOptions) => {
  const bundle = vi.fn<() => RollupBuild>();
  const esm = toArray(options.output)[0];
  const cjs = toArray(options.output)[1];

  test(
    '#0 => Config',
    async () => {
      const out = await rollup(options);
      bundle.mockReturnValue(out);
    },
    WAITER,
  );

  const writeEsm = [() => bundle().write(esm), WAITER] as const;
  const writeCjs = [() => bundle().write(cjs), WAITER] as const;

  return {
    writeEsm,
    writeCjs,
  };
};

type Options = Partial<{
  '.d.ts': Output;
  '.js': Output;
  '.cjs': Output;
  '.d.ts.map': Output;
  '.js.map': Output;
  '.cjs.map': Output;
}>;

type Output = Partial<
  {
    config: boolean;
    constants: boolean;
    index: boolean;
    input: boolean;
    types: boolean;
    utils: boolean;
  } & Record<string, any>
>;

export const useTests = (options: Options) => {
  const entries1 = Object.entries(options);

  const out = () => {
    return entries1.forEach(([key1, each], index) => {
      describe(`#${index + 1} => For "${key1}" files`, () => {
        const entries2 = Object.entries(each);

        entries2.forEach(([key2, bool], index) => {
          const path = `${key2}${key1}`;
          const existBool = bool ? 'exists' : "doesn't exist";
          const invite = `#${index + 1} The file "${path}" ${existBool}`;

          test(invite, () => {
            const file = `${process.cwd()}/lib/${path}`;
            const check = existsSync(file);

            expect(check).toBe(bool);
          });
        });
      });
    });
  };

  return out;
};

export const path = 'fileInt';
