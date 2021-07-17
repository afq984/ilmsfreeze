import { error400, error404, RenderableError } from "./errors";

const isNotFoundError = (e: any) => {
  return e instanceof Error && e.name === "NotFoundError";
};

const find = async <T>(
  promise: Promise<T>,
  notFound: () => RenderableError
) => {
  try {
    return await promise;
  } catch (e) {
    if (isNotFoundError(e)) {
      throw notFound();
    }
    throw e;
  }
};

export class FileSystemDataSource {
  rootHandle: FileSystemDirectoryHandle;

  constructor(rootHandle: FileSystemDirectoryHandle) {
    this.rootHandle = rootHandle;
  }

  async get(typename: string, id: number, filename: string) {
    const typeDir = await find(
      this.rootHandle.getDirectoryHandle(typename),
      () => error400(`Bad data source: missing directory "${typename}"`)
    );
    const objDir = await find(typeDir.getDirectoryHandle(id.toString()), () =>
      error404(`${typename} not found`)
    );
    const fileHandle = await find(objDir.getFileHandle(filename), () =>
      error400(
        `Bad data source: missing file ${typename}/${objDir}/${filename}`
      )
    );
    return await fileHandle.getFile();
  }

  async getText(typename: string, id: number, filename: string) {
    const file = await this.get(typename, id, filename);
    return await file.text();
  }

  async getJson(typename: string, id: number, filename: string) {
    return JSON.parse(await this.getText(typename, id, filename));
  }

  async getMeta(typename: string, id: number) {
    return await this.getJson(typename, id, "meta.json");
  }

  async getMetas(typename: string, ids: Array<number> | undefined) {
    if (ids === undefined) {
      return [];
    }
    const result = [];
    for (const id of ids) {
      result.push(await this.getMeta(typename, id));
    }
    return result;
  }

  async getAllMeta(typename: string) {
    const result = [];
    const typeDir = await find(
      this.rootHandle.getDirectoryHandle(typename),
      () => error400(`Bad data source: missing directory "${typename}"`)
    );
    for await (const entry of typeDir.values()) {
      if (entry.kind !== "directory") {
        continue;
      }
      const metaHandlePromise = entry.getFileHandle("meta.json");
      try {
        await metaHandlePromise;
      } catch (e) {
        if (isNotFoundError(e)) {
          console.warn(`missing meta.json for ${typename}/${entry.name}`);
          continue;
        } else {
          throw e;
        }
      }
      const metaFile = await (await metaHandlePromise).getFile();
      const meta = JSON.parse(await metaFile.text());
      result.push(meta);
    }
    return result;
  }
}

export const getSavedFilename = (meta: any) => {
  // https://github.com/afq984/ilmsdump/blob/main/ilmsserve/__init__.py#L342
  if (meta.saved_filename !== undefined) {
    return meta.saved_filename;
  }
  if (meta.title === "meta.json") {
    return "meta_.json";
  }
  return meta.title;
};
