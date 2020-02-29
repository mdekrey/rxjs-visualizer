import { interval } from "rxjs";
import { take } from "rxjs/operators";
import { FakeScheduler } from "../scheduler";
import { addTime } from "./addTime";

describe("addTime", () => {
  it("adds time from the scheduler", () => {
    const history: { time: number; original: number }[] = [];
    const targetScheduler = new FakeScheduler();
    interval(1000, targetScheduler)
      .pipe(take(5), addTime(targetScheduler))
      .subscribe(value => history.push(value));

    targetScheduler.execute(500);

    expect(history).toEqual([
      { time: 1000, original: 0 },
      { time: 2000, original: 1 },
      { time: 3000, original: 2 },
      { time: 4000, original: 3 },
      { time: 5000, original: 4 }
    ]);
  });
});
