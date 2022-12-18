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
    (substr, key) => values[key] ?? `{{${key}}}`
  );
}
