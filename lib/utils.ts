// Copyright (c) 2022 Stuart Thomson.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

/**
 * Create an array of the given length
 * @param length Length of array to generate
 * @param start Start value
 * @param step Value to increment by
 * @returns Array of numbers of the given length
 * @example
 * ```ts
 * range(4);        // [0, 1, 2, 3]
 * range(4, 5, 2);  // [5, 7, 9, 11]
 * range(4, 0, -1); // [0, -1, -2, -3]
 * ```
 */
export function range(length: number, start = 0, step = 1): number[] {
  return Array.from([...Array(length)]).map((_, i) => i * step + start);
}

export function template(input: string, values: Record<string, any>): string {
  return input.replace(
    /\{\{(\w+)\}\}/g,
    (substr, key) => values[key] ?? `{{${key}}}`,
  );
}

export function pmap<T, U>(
  arr: T[],
  fn: (value: T, index: number, array: T[]) => Promise<U>,
): Promise<U[]> {
  return Promise.all(arr.map(fn));
}

export function delay(ms: number) {
  return new Promise((res) => {
    setTimeout(res, ms);
  });
}

export function pickRandomOutOfArray<T>(array: T[]): { array: T[]; item: T } {
  if (array.length === 0) {
    throw new Error("Array must have items");
  }

  const index = Math.floor(Math.random() * array.length);
  const arrayClone = array.slice();
  const [item] = arrayClone.splice(index, 1);

  return { array: arrayClone, item: item! };
}
