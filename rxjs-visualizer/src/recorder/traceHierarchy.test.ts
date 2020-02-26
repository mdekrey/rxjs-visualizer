import { range, of, Observable, interval } from "rxjs";
import { map, concatAll, take } from "rxjs/operators";
import { record } from "./record";
import {
  traceHierarchy,
  observableReferenceType,
  observableDatumType
} from "./traceHierarchy";
import { FakeScheduler } from "../scheduler";
import { recordAsync } from "./recordAsync";

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
      const data: { idx: number; idx2: number } = temp.data;
    }

    expect(history).toEqual([
      { observable: 0, type: observableReferenceType, child: 1 },
      { observable: 1, type: observableDatumType, data: { idx: 0, idx2: 0 } },
      { observable: 1, type: observableDatumType, data: { idx: 0, idx2: 1 } },
      { observable: 0, type: observableReferenceType, child: 2 },
      { observable: 2, type: observableDatumType, data: { idx: 1, idx2: 0 } },
      { observable: 2, type: observableDatumType, data: { idx: 1, idx2: 1 } },
      { observable: 0, type: observableReferenceType, child: 3 },
      { observable: 3, type: observableDatumType, data: { idx: 2, idx2: 0 } },
      { observable: 3, type: observableDatumType, data: { idx: 2, idx2: 1 } }
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
      const data: { idx: number; idx2: number } | number = temp.data;
    }

    expect(history).toEqual([
      { observable: 0, type: observableDatumType, data: 0 },
      { observable: 0, type: observableReferenceType, child: 1 },
      { observable: 1, type: observableDatumType, data: { idx: 0, idx2: 0 } },
      { observable: 1, type: observableDatumType, data: { idx: 0, idx2: 1 } },
      { observable: 0, type: observableDatumType, data: 1 },
      { observable: 0, type: observableReferenceType, child: 2 },
      { observable: 2, type: observableDatumType, data: { idx: 1, idx2: 0 } },
      { observable: 2, type: observableDatumType, data: { idx: 1, idx2: 1 } },
      { observable: 0, type: observableDatumType, data: 2 },
      { observable: 0, type: observableReferenceType, child: 3 },
      { observable: 3, type: observableDatumType, data: { idx: 2, idx2: 0 } },
      { observable: 3, type: observableDatumType, data: { idx: 2, idx2: 1 } }
    ]);
  });

  it("interleaves observables", async () => {
    const scheduler = new FakeScheduler();
    const historyPromise = recordAsync(
      interval(5, scheduler).pipe(
        take(3),
        map(idx =>
          interval(5, scheduler).pipe(
            take(2),
            map(idx2 => ({ idx, idx2 }))
          )
        ),
        traceHierarchy()
      )
    );
    scheduler.execute();
    const history = await historyPromise;

    const temp = history[0];
    if (temp.type === observableDatumType) {
      // this is a type-check test: the compiler will error here if it's no good
      const data: { idx: number; idx2: number } = temp.data;
    }

    expect(history).toEqual([
      { observable: 0, type: observableReferenceType, child: 1 },
      { observable: 1, type: observableDatumType, data: { idx: 0, idx2: 0 } },
      { observable: 0, type: observableReferenceType, child: 2 },
      { observable: 1, type: observableDatumType, data: { idx: 0, idx2: 1 } },
      { observable: 2, type: observableDatumType, data: { idx: 1, idx2: 0 } },
      { observable: 0, type: observableReferenceType, child: 3 },
      { observable: 2, type: observableDatumType, data: { idx: 1, idx2: 1 } },
      { observable: 3, type: observableDatumType, data: { idx: 2, idx2: 0 } },
      { observable: 3, type: observableDatumType, data: { idx: 2, idx2: 1 } }
    ]);
  });
});
