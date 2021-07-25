export const Bug = Error;

export const check = (condition: boolean, ...message: any) => {
  if (!condition) {
    throw new Bug(`check failed: ${message}`);
  }
};

export const notnull = <T>(value: T | null | undefined): T => {
  if (value === null || value === undefined) {
    throw new Bug();
  }
  return value;
};

export const mustParseInt = (s: string) => {
  const value = parseInt(s);
  if (isFinite(value)) {
    return value;
  }
  throw Bug;
};
