export const capture = async <T>(promise: Promise<T>) => {
  let result: T;
  try {
    result = await promise;
  } catch (exc) {
    return () => {
      throw exc;
    };
  }
  return () => result;
};

export const gather = async <T>(ag: AsyncGenerator<T>): Promise<T[]> => {
  const result: T[] = [];
  for await (const item of ag) {
    result.push(item);
  }
  return result;
};
