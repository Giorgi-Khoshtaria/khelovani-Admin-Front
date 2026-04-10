import { z } from "zod";

/**
 * Utility to execute a Zod schema and return errors in a Record<string, string> format.
 * This maintain compatibility with existing UI components that expect a key-value error map.
 */
export const validateWithZod = <T>(
  schema: z.ZodSchema<T>,
  data: unknown,
): Record<string, string> => {
  const result = schema.safeParse(data);

  if (result.success) {
    return {};
  }

  const errors: Record<string, string> = {};
  result.error.issues.forEach((issue) => {
    const field = issue.path.join(".");
    if (!errors[field]) {
      errors[field] = issue.message;
    }
  });

  return errors;
};
