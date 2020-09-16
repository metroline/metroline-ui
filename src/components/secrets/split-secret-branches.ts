export function splitSecretBranches(originalString: string): string[] {
  return (originalString || '')
    .split(',')
    .map(str => str.trim())
    .filter(str => !!str);
}
