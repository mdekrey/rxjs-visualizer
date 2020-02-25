import { interval } from "rxjs";
import { take } from "rxjs/operators";
import { FakeScheduler } from "./FakeScheduler";

describe("FakeScheduler", () => {
  it("runs instantly", () => {
    const history: { time: number; value: number }[] = [];
    const targetScheduler = new FakeScheduler(500);
    interval(1000, targetScheduler)
      .pipe(take(5))
      .subscribe(value => history.push({ time: targetScheduler.now(), value }));

    targetScheduler.execute();

    expect(history).toEqual([
      { time: 1000, value: 0 },
      { time: 2000, value: 1 },
      { time: 3000, value: 2 },
      { time: 4000, value: 3 },
      { time: 5000, value: 4 }
    ]);
  });

  it("tracks the last execution time", () => {
    const history: { time: number; value: number }[] = [];
    const targetScheduler = new FakeScheduler(10);
    interval(1000, targetScheduler)
      .pipe(take(5))
      .subscribe(value => history.push({ time: targetScheduler.now(), value }));

    targetScheduler.execute();

    expect(targetScheduler.now()).toEqual(5 * 1000);
  });

  it("resumes at the same time", () => {
    const history: { time: number; value: number }[] = [];
    const targetScheduler = new FakeScheduler(10);
    interval(1000, targetScheduler)
      .pipe(take(5))
      .subscribe(value => history.push({ time: targetScheduler.now(), value }));

    targetScheduler.execute();

    interval(1000, targetScheduler)
      .pipe(take(5))
      .subscribe(value => history.push({ time: targetScheduler.now(), value }));

    targetScheduler.execute();

    expect(targetScheduler.now()).toEqual(10 * 1000);
  });

  it("does not run until executed", () => {
    const history: { time: number; value: number }[] = [];
    const targetScheduler = new FakeScheduler();
    interval(1000, targetScheduler)
      .pipe(take(5))
      .subscribe(value => history.push({ time: targetScheduler.now(), value }));

    expect(history).toEqual([]);
  });

  it("throws if negative", () => {
    const targetScheduler = new FakeScheduler();
    expect(() => targetScheduler.schedule(() => { throw "never"; }, -1)).toThrowError("Invalid schedule - delay cannot be negative, was: -1");
  });

  it("limits the total number of enqueues per execution", () => {
    const count = 10;
    const history: { time: number; value: number }[] = [];
    const targetScheduler = new FakeScheduler(count);
    interval(1000, targetScheduler).subscribe(value =>
      history.push({ time: targetScheduler.now(), value })
    );

    targetScheduler.execute();

    expect(history).toEqual(
      new Array(count)
        .fill(0)
        .map((_, idx) => ({ time: 1000 * (idx + 1), value: idx }))
    );
  });

  it("can execute multiple times", () => {
    const count = 10;
    const history: { time: number; value: number }[] = [];
    const targetScheduler = new FakeScheduler(count);
    interval(1000, targetScheduler).subscribe(value =>
      history.push({ time: targetScheduler.now(), value })
    );

    targetScheduler.execute();
    targetScheduler.execute();

    expect(history).toEqual(
      new Array(count * 2)
        .fill(0)
        .map((_, idx) => ({ time: 1000 * (idx + 1), value: idx }))
    );
  });
});