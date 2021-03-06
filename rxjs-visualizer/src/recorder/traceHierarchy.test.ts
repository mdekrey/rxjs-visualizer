import { range, of, Observable, interval } from "rxjs";
import { map, concatAll, take } from "rxjs/operators";
import { record } from "./record";
import {
  traceHierarchy,
  observableReferenceType,
  observableDatumType
} from "./traceHierarchy";
import { FakeScheduler } from "../scheduler";
import { collapseTime } from "./collapseTime";
import { addTime } from "./addTime";
import { LifecycleEntry } from "./recordLifecycle";

describe("traceHierarchy", () => {
  it("creates a single array from nested observables", () => {
    const history = record(
      range(0, 3).pipe(
        map(idx => range(0, 2).pipe(map(idx2 => ({ idx, idx2 })))),
        traceHierarchy()
      )
    );

    const temp = history[0];
    if (temp.type === observableDatumType) {
      // this is a type-check test: the compiler will error here if it's no good
      const datum: LifecycleEntry<{ idx: number; idx2: number }> = temp.datum;
    }

    expect(history).toEqual([
      { observable: 0, type: observableDatumType, datum: { start: true } },
      { observable: 0, type: observableReferenceType, child: 1 },
      { observable: 1, type: observableDatumType, datum: { start: true } },
      { observable: 1, type: observableDatumType, datum: { datum: { idx: 0, idx2: 0 } } },
      { observable: 1, type: observableDatumType, datum: { datum: { idx: 0, idx2: 1 } } },
      { observable: 1, type: observableDatumType, datum: { complete: true } },
      { observable: 0, type: observableReferenceType, child: 2 },
      { observable: 2, type: observableDatumType, datum: { start: true } },
      { observable: 2, type: observableDatumType, datum: { datum: { idx: 1, idx2: 0 } } },
      { observable: 2, type: observableDatumType, datum: { datum: { idx: 1, idx2: 1 } } },
      { observable: 2, type: observableDatumType, datum: { complete: true } },
      { observable: 0, type: observableReferenceType, child: 3 },
      { observable: 3, type: observableDatumType, datum: { start: true } },
      { observable: 3, type: observableDatumType, datum: { datum: { idx: 2, idx2: 0 } } },
      { observable: 3, type: observableDatumType, datum: { datum: { idx: 2, idx2: 1 } } },
      { observable: 3, type: observableDatumType, datum: { complete: true } },
      { observable: 0, type: observableDatumType, datum: { complete: true } },
    ]);
  });

  it("creates a single array from mixed observables and values", () => {
    const history = record(
      range(0, 3).pipe(
        map(idx => of(idx, range(0, 2).pipe(map(idx2 => ({ idx, idx2 }))))),
        concatAll(),
        traceHierarchy()
      )
    );

    const temp = history[0];
    if (temp.type === observableDatumType) {
      // this is a type-check test: the compiler will error here if it's no good
      const datum: LifecycleEntry<{ idx: number; idx2: number } | number> =
        temp.datum;
    }

    expect(history).toEqual([
      { observable: 0, type: observableDatumType, datum: { start: true } },
      { observable: 0, type: observableDatumType, datum: { datum: 0 } },
      { observable: 0, type: observableReferenceType, child: 1 },
      { observable: 1, type: observableDatumType, datum: { start: true } },
      { observable: 1, type: observableDatumType, datum: { datum: { idx: 0, idx2: 0 } } },
      { observable: 1, type: observableDatumType, datum: { datum: { idx: 0, idx2: 1 } } },
      { observable: 1, type: observableDatumType, datum: { complete: true } },
      { observable: 0, type: observableDatumType, datum: { datum: 1 } },
      { observable: 0, type: observableReferenceType, child: 2 },
      { observable: 2, type: observableDatumType, datum: { start: true } },
      { observable: 2, type: observableDatumType, datum: { datum: { idx: 1, idx2: 0 } } },
      { observable: 2, type: observableDatumType, datum: { datum: { idx: 1, idx2: 1 } } },
      { observable: 2, type: observableDatumType, datum: { complete: true } },
      { observable: 0, type: observableDatumType, datum: { datum: 2 } },
      { observable: 0, type: observableReferenceType, child: 3 },
      { observable: 3, type: observableDatumType, datum: { start: true } },
      { observable: 3, type: observableDatumType, datum: { datum: { idx: 2, idx2: 0 } } },
      { observable: 3, type: observableDatumType, datum: { datum: { idx: 2, idx2: 1 } } },
      { observable: 3, type: observableDatumType, datum: { complete: true } },
      { observable: 0, type: observableDatumType, datum: { complete: true } },
    ]);
  });

  it("interleaves observables", () => {
    const scheduler = new FakeScheduler();
    const history = record(
      interval(5, scheduler).pipe(
        take(3),
        map(idx =>
          interval(4, scheduler).pipe(
            take(2),
            map(idx2 => ({ idx, idx2 }))
          )
        ),
        traceHierarchy()
      ),
      () => scheduler.execute()
    );

    const temp = history[0];
    if (temp.type === observableDatumType) {
      // this is a type-check test: the compiler will error here if it's no good
      const datum: LifecycleEntry<{ idx: number; idx2: number }> = temp.datum;
    }

    expect(history).toEqual([
      { observable: 0, type: observableDatumType, datum: { start: true } },
      { observable: 0, type: observableReferenceType, child: 1 },
      { observable: 1, type: observableDatumType, datum: { start: true } },
      { observable: 1, type: observableDatumType, datum: { datum: { idx: 0, idx2: 0 } } },
      { observable: 0, type: observableReferenceType, child: 2 },
      { observable: 2, type: observableDatumType, datum: { start: true } },
      { observable: 1, type: observableDatumType, datum: { datum: { idx: 0, idx2: 1 } } },
      { observable: 1, type: observableDatumType, datum: { complete: true } },
      { observable: 2, type: observableDatumType, datum: { datum: { idx: 1, idx2: 0 } } },
      { observable: 0, type: observableReferenceType, child: 3 },
      { observable: 3, type: observableDatumType, datum: { start: true } },
      { observable: 0, type: observableDatumType, datum: { complete: true } },
      { observable: 2, type: observableDatumType, datum: { datum: { idx: 1, idx2: 1 } } },
      { observable: 2, type: observableDatumType, datum: { complete: true } },
      { observable: 3, type: observableDatumType, datum: { datum: { idx: 2, idx2: 0 } } },
      { observable: 3, type: observableDatumType, datum: { datum: { idx: 2, idx2: 1 } } },
      { observable: 3, type: observableDatumType, datum: { complete: true } },
    ]);
  });

  it("doesn't change emit times", () => {
    const scheduler = new FakeScheduler();
    const history = record(
      interval(5, scheduler).pipe(
        take(3),
        map(idx =>
          interval(4, scheduler).pipe(
            take(2),
            map(idx2 => ({ idx, idx2 }))
          )
        ),
        traceHierarchy(),
        addTime(scheduler),
        map(collapseTime)
      ),
      () => scheduler.execute()
    );

    expect(history).toEqual([
      { type: observableDatumType, observable: 0, datum: { start: true }, time: 0 },
      { type: observableReferenceType, observable: 0, child: 1, time: 5 },
      { type: observableDatumType, observable: 1, datum: { start: true }, time: 5 },
      { type: observableDatumType, observable: 1, datum: { datum: { idx: 0, idx2: 0 } }, time: 9 },
      { type: observableReferenceType, observable: 0, child: 2, time: 10 },
      { type: observableDatumType, observable: 2, datum: { start: true }, time: 10 },
      { type: observableDatumType, observable: 1, datum: { datum: { idx: 0, idx2: 1 } }, time: 13 },
      { type: observableDatumType, observable: 1, datum: { complete: true }, time: 13 },
      { type: observableDatumType, observable: 2, datum: { datum: { idx: 1, idx2: 0 } }, time: 14 },
      { type: observableReferenceType, observable: 0, child: 3, time: 15 },
      { type: observableDatumType, observable: 3, datum: { start: true }, time: 15 },
      { type: observableDatumType, observable: 0, datum: { complete: true }, time: 15 },
      { type: observableDatumType, observable: 2, datum: { datum: { idx: 1, idx2: 1 } }, time: 18 },
      { type: observableDatumType, observable: 2, datum: { complete: true }, time: 18 },
      { type: observableDatumType, observable: 3, datum: { datum: { idx: 2, idx2: 0 } }, time: 19 },
      { type: observableDatumType, observable: 3, datum: { datum: { idx: 2, idx2: 1 } }, time: 23 },
      { type: observableDatumType, observable: 3, datum: { complete: true }, time: 23 }
    ]);
  });

  it("respects timeouts", () => {
    const scheduler = new FakeScheduler();
    const history = record(
      interval(5, scheduler).pipe(
        take(5),
        map(idx =>
          interval(4, scheduler).pipe(
            take(2),
            map(idx2 => ({ idx, idx2 }))
          )
        ),
        traceHierarchy(19.5, scheduler),
        addTime(scheduler),
        map(collapseTime)
      ),
      () => scheduler.execute()
    );

    expect(history).toEqual([
      { type: observableDatumType, observable: 0, datum: { start: true }, time: 0 },
      { type: observableReferenceType, observable: 0, child: 1, time: 5 },
      { type: observableDatumType, observable: 1, datum: { start: true }, time: 5 },
      { type: observableDatumType, observable: 1, datum: { datum: { idx: 0, idx2: 0 } }, time: 9 },
      { type: observableReferenceType, observable: 0, child: 2, time: 10 },
      { type: observableDatumType, observable: 2, datum: { start: true }, time: 10 },
      { type: observableDatumType, observable: 1, datum: { datum: { idx: 0, idx2: 1 } }, time: 13 },
      { type: observableDatumType, observable: 1, datum: { complete: true }, time: 13 },
      { type: observableDatumType, observable: 2, datum: { datum: { idx: 1, idx2: 0 } }, time: 14 },
      { type: observableReferenceType, observable: 0, child: 3, time: 15 },
      { type: observableDatumType, observable: 3, datum: { start: true }, time: 15 },
      { type: observableDatumType, observable: 2, datum: { datum: { idx: 1, idx2: 1 } }, time: 18 },
      { type: observableDatumType, observable: 2, datum: { complete: true }, time: 18 },
      { type: observableDatumType, observable: 3, datum: { datum: { idx: 2, idx2: 0 } }, time: 19 },
      { type: observableDatumType, observable: 0, datum: { continues: true }, time: 19.5 },
      { type: observableDatumType, observable: 3, datum: { continues: true }, time: 19.5 }
    ]);
  });
});
