import { range } from "rxjs";
import { delay } from "rxjs/operators";
import { record } from "./record";

describe("record", () => {
  it("creates a single array when synchronous",  () => {
    const history = record(range(0, 5));

    expect(history).toEqual([0, 1, 2, 3, 4]);
  });

  it("returns undefined when asynchronous",  () => {
    const history = record(range(0, 5).pipe(delay(1000)));

    expect(history).toBeUndefined();
  });
});
