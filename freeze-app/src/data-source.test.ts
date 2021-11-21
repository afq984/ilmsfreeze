import { assert } from "@open-wc/testing";
import {
  deserializeDataSource,
  RemoteDataSource,
  serializeDataSource,
} from "./data-source";

suite("dataSource", () => {
  test("deserialize", async () => {
    const source = new RemoteDataSource("http://localhost:9999");
    assert.deepEqual(
      source,
      deserializeDataSource(serializeDataSource(source))
    );
  });
  test("deserialize null", async () => {
    assert.isNull(deserializeDataSource({}));
  });
});
