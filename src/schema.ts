import { boolean, coerce, nullable, optional, string } from 'valibot'

export const StringSchema = string()
export const OptionalStringSchema = optional(string())
export const NullableStringSchema = nullable(string())
export const DryRunSchema = coerce(
  boolean('The dry-run option must be either "true" or "false".'),
  input => JSON.parse(`${input}`)
)
