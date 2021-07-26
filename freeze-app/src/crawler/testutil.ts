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

export const gather = async <Yield, Return>(
  ag: AsyncGenerator<Yield, Return>
): Promise<[Yield[], Return]> => {
  const items: Yield[] = [];
  for (;;) {
    const { value, done } = await ag.next();
    if (done) {
      return [items, value as Return];
    }
    items.push(value as Yield);
  }
};

export const readall = async (
  stream: ReadableStream<Uint8Array>
): Promise<string> => {
  return await new Response(stream).text();
};
