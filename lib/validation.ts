export function isAllowedValue(
  value: string,
  allowed: { value: string }[]
) {
  return allowed.some((item) => item.value === value);
}
