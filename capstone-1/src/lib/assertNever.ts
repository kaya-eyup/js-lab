export function assertNever(x: never): never {
  throw new Error(`Beklenmeyen durum: ${JSON.stringify(x)}`);
}