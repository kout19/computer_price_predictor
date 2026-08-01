/**
 * Converts a raw string array from the backend options vocabulary
 * into `{label, value}` pairs consumed by `SelectField`. This is the
 * only place backend option arrays are shaped for UI consumption.
 */

export interface SelectOption {
  label: string;
  value: string;
}

/**
 * Convert a list of raw string values into select options.
 *
 * @param values - Raw values from the options vocabulary, or undefined
 *   if not yet loaded / field not present in the response.
 * @returns An array of `{label, value}` pairs, safe to render even
 *   when `values` is undefined.
 */
export function toSelectOptions(values: string[] | undefined): SelectOption[] {
  if (!values) {
    return [];
  }
  return values.map((value) => ({ label: value, value }));
}
