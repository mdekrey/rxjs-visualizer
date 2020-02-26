import { range, throwError, concat, never } from "rxjs";
import { recordLifecycle, LifecycleEntry } from "./recordLifecycle";

describe("recordLifecycle", () => {
  it("gets lifecycle events", () => {
    const history: LifecycleEntry<number>[] = [];
    range(5)
      .pipe(recordLifecycle())
      .subscribe(value => history.push(value));

    expect(history).toEqual([
      { datum: 0 },
      { datum: 1 },
      { datum: 2 },
      { datum: 3 },
      { datum: 4 },
      { complete: true }
    ]);
  });

  it("gets error events", () => {
    const history: LifecycleEntry<number>[] = [];
    const error = "some error";
    concat(range(5), throwError(error))
      .pipe(recordLifecycle())
      .subscribe(value => history.push(value));

    expect(history).toEqual([
      { datum: 0 },
      { datum: 1 },
      { datum: 2 },
      { datum: 3 },
      { datum: 4 },
      { error }
    ]);
  });

  it("doesn't always add completion", () => {
    const history: LifecycleEntry<number>[] = [];
    concat(range(5), never())
      .pipe(recordLifecycle())
      .subscribe(value => history.push(value));

    expect(history).toEqual([
      { datum: 0 },
      { datum: 1 },
      { datum: 2 },
      { datum: 3 },
      { datum: 4 }
    ]);
  });
});
