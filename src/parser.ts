import { nullable, optional, parser, string } from 'valibot'

const StringSchema = string()
const OptionalStringSchema = optional(string())
const NullableStringSchema = nullable(string())

export const stringParser = parser(StringSchema)
export const optionalStringParser = parser(OptionalStringSchema)
export const nullableStringParser = parser(NullableStringSchema)
