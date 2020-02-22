import { interval } from "rxjs";
import { take } from "rxjs/operators";
import { withScheduler } from "./withScheduler";

describe("withScheduler", () => {
  it("captures time as another value", () => {
    const history: { time: number; value: number }[] = [];
    withScheduler(s =>
      interval(1000, s)
        .pipe(take(5))
        .subscribe(value => history.push({ time: s.now(), value }))
    );

    expect(history).toEqual([
      { time: 1000, value: 0 },
      { time: 2000, value: 1 },
      { time: 3000, value: 2 },
      { time: 4000, value: 3 },
      { time: 5000, value: 4 }
    ]);
  });
});
