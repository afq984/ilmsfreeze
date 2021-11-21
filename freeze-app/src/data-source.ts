import { badsource, error404, RenderableError } from "./errors";

const warnAndThrow = (e: any): never => {
  console.warn(e);
  throw badsource(`"${e}"`);
};

export abstract class DataSource {
  abstract get name(): string;
  abstract get(typename: string, id: number, filename: string): Promise<Blob>;
  abstract getAllMeta(typename: string): Promise<Array<any>>;

  async getText(typename: string, id: number, filename: string) {
    const file = await this.get(typename, id, filename);
    return await file.text();
  }

  async getJson(typename: string, id: number, filename: string) {
    const txt = await this.getText(typename, id, filename);
    try {
      return JSON.parse(txt);
    } catch (e) {
      warnAndThrow(e);
    }
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
}

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

export class FileSystemDataSource extends DataSource {
  rootHandle: FileSystemDirectoryHandle;

  constructor(rootHandle: FileSystemDirectoryHandle) {
    super();
    this.rootHandle = rootHandle;
  }

  get name() {
    return this.rootHandle.name;
  }

  async get(typename: string, id: number, filename: string) {
    const typeDir = await find(
      this.rootHandle.getDirectoryHandle(typename),
      () => badsource(`missing directory "${typename}"`)
    );
    const objDir = await find(typeDir.getDirectoryHandle(id.toString()), () =>
      error404(`${typename} not found`)
    );
    const fileHandle = await find(objDir.getFileHandle(filename), () =>
      badsource(`missing file ${typename}/${objDir}/${filename}`)
    );
    return await fileHandle.getFile();
  }

  async getAllMeta(typename: string) {
    const result = [];
    const typeDir = await find(
      this.rootHandle.getDirectoryHandle(typename),
      () => badsource(`missing directory "${typename}"`)
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

export class RemoteDataSource extends DataSource {
  baseURL: string;

  constructor(baseURL: string) {
    super();
    this.baseURL = baseURL;
  }

  get name() {
    return this.baseURL;
  }

  private async fetch(path: string) {
    const url = new URL(path, this.baseURL).toString();
    let resp: Response;
    try {
      resp = await fetch(url);
    } catch (e) {
      warnAndThrow(e);
    }
    resp = resp!;
    if (resp.status !== 200) {
      throw new RenderableError(
        resp.status.toString(),
        `${url} ${resp.statusText}`
      );
    }
    return resp;
  }

  async get(typename: string, id: number, filename: string) {
    const resp = await this.fetch(`${typename}/${id}/${filename}`);
    return await resp.blob();
  }

  async getAllMeta(typename: string) {
    const resp = await this.fetch(`${typename}/all.json`);
    try {
      return await resp.json();
    } catch (e) {
      warnAndThrow(e);
    }
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

export const serializeDataSource = (dataSource: DataSource) => {
  if (dataSource instanceof FileSystemDataSource) {
    return {
      ty: "FileSystemDataSource",
      data: dataSource.rootHandle,
    };
  } else if (dataSource instanceof RemoteDataSource) {
    return {
      ty: "RemoteDataSource",
      data: dataSource.baseURL,
    };
  }
  return null;
};

export const deserializeDataSource = (obj: any) => {
  if (obj.ty === "FileSystemDataSource") {
    return new FileSystemDataSource(obj.data);
  }
  if (obj.ty == "RemoteDataSource") {
    return new RemoteDataSource(obj.data);
  }
  return null;
};
