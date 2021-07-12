export class FileSystemDataSource {
  rootHandle: FileSystemDirectoryHandle;

  constructor(rootHandle: FileSystemDirectoryHandle) {
    this.rootHandle = rootHandle;
  }

  async get(typename: string, id: number, filename: string) {
    const typeDir = await this.rootHandle.getDirectoryHandle(typename);
    const objDir = await typeDir.getDirectoryHandle(id.toString());
    const fileHandle = await objDir.getFileHandle(filename);
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
    const typeDir = await this.rootHandle.getDirectoryHandle(typename);
    for await (const entry of typeDir.values()) {
      if (entry.kind !== "directory") {
        continue;
      }
      const metaHandle = await entry.getFileHandle("meta.json");
      const metaFile = await metaHandle.getFile();
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
