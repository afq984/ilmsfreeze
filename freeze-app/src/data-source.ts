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

  async getMeta(typename: string, id: number) {
    const file = await this.get(typename, id, "meta.json");
    return await JSON.parse(await file.text());
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
