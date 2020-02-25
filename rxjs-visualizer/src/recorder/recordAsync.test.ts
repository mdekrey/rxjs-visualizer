import { interval } from "rxjs";
import { take } from "rxjs/operators";
import { recordAsync } from "./recordAsync";

describe("recordAsync", () => {
  it("creates a single array", async () => {
    const history = await recordAsync(interval(1).pipe(take(5)));

    expect(history).toEqual([0, 1, 2, 3, 4]);
  });
});
