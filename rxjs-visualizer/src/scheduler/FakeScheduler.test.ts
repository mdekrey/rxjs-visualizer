import { interval } from "rxjs";
import { take } from "rxjs/operators";
import { FakeScheduler } from "./FakeScheduler";

describe("FakeScheduler", () => {
  it("runs instantly", () => {
    const history: { time: number; value: number }[] = [];
    const targetScheduler = new FakeScheduler();
    interval(1000, targetScheduler)
      .pipe(take(5))
      .subscribe(value => history.push({ time: targetScheduler.now(), value }));

    targetScheduler.execute(500);

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
    const targetScheduler = new FakeScheduler();
    interval(1000, targetScheduler)
      .pipe(take(5))
      .subscribe(value => history.push({ time: targetScheduler.now(), value }));

    targetScheduler.execute(10);

    expect(targetScheduler.now()).toEqual(5 * 1000);
  });

  it("performs controlled advancements of time", () => {
    const history: { time: number; value: number }[] = [];
    const targetScheduler = new FakeScheduler();
    interval(1000, targetScheduler)
      .pipe(take(5))
      .subscribe(value => history.push({ time: targetScheduler.now(), value }));

    targetScheduler.advanceTime(2200);

    expect(targetScheduler.now()).toEqual(2200);
    expect(history.length).toEqual(2);
  });

  it("performs controlled advancements of time but with max executions", () => {
    const history: { time: number; value: number }[] = [];
    const targetScheduler = new FakeScheduler();
    interval(1000, targetScheduler)
      .pipe(take(5))
      .subscribe(value => history.push({ time: targetScheduler.now(), value }));

    targetScheduler.advanceTime(2200, 1);

    expect(targetScheduler.now()).toEqual(1000);
    expect(history.length).toEqual(1);
  });

  it("resumes at the same time", () => {
    const history: { time: number; value: number }[] = [];
    const targetScheduler = new FakeScheduler();
    interval(1000, targetScheduler)
      .pipe(take(5))
      .subscribe(value => history.push({ time: targetScheduler.now(), value }));

    targetScheduler.execute(10);

    interval(1000, targetScheduler)
      .pipe(take(5))
      .subscribe(value => history.push({ time: targetScheduler.now(), value }));

    targetScheduler.execute(10);

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
    const targetScheduler = new FakeScheduler();
    interval(1000, targetScheduler).subscribe(value =>
      history.push({ time: targetScheduler.now(), value })
    );

    targetScheduler.execute(count);

    expect(history).toEqual(
      new Array(count)
        .fill(0)
        .map((_, idx) => ({ time: 1000 * (idx + 1), value: idx }))
    );
  });

  it("can execute multiple times", () => {
    const count = 10;
    const history: { time: number; value: number }[] = [];
    const targetScheduler = new FakeScheduler();
    interval(1000, targetScheduler).subscribe(value =>
      history.push({ time: targetScheduler.now(), value })
    );

    targetScheduler.execute(count);
    targetScheduler.execute(count);

    expect(history).toEqual(
      new Array(count * 2)
        .fill(0)
        .map((_, idx) => ({ time: 1000 * (idx + 1), value: idx }))
    );
  });

  it("can work with multiple observables", () => {
    const targetScheduler = new FakeScheduler();
    let resultCounts = [0, 0];
    interval(1000, targetScheduler).pipe(take(10)).subscribe(_ => resultCounts[0]++);
    interval(1000, targetScheduler).pipe(take(20)).subscribe(_ => resultCounts[1]++);

    targetScheduler.execute();

    expect(resultCounts).toEqual([10,20]);
  });
});
