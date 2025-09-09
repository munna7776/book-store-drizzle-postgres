import * as z from "zod";

export const getTransformedZodErrors = (zodError) => {
  const flatErrors = z.flattenError(zodError);
  const errors = {};
  Object.keys(flatErrors.fieldErrors).map((field) => {
    errors[field] = flatErrors.fieldErrors[field][0];
  });
  return errors;
};
