import { interval } from "rxjs";
import { take } from "rxjs/operators";
import { recordAsync } from "./recordAsync";
import { FakeScheduler } from "../scheduler";

describe("recordAsync", () => {
  it("creates a single array", async () => {
    const history = await recordAsync(interval(1).pipe(take(5)), 500);

    expect(history).toEqual([0, 1, 2, 3, 4]);
  });

  it("respects the timeout", async () => {
    // using the FakeScheduler is more deterministic as it doesn't rely on milliseconds of time
    const scheduler = new FakeScheduler(500);
    const historyPromise = recordAsync(interval(10, scheduler), 500, scheduler);
    scheduler.execute();
    const history = await historyPromise;

    expect(history.length).toBe(49);
  });
});
