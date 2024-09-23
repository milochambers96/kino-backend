export default function formatValidationError(error: any) {
  const customError: any = {};

  for (const key in error.errors) {
    customError[key] = error.errors[key].message;
  }
  return customError;
}
