import { range } from "rxjs";
import { take } from "rxjs/operators";
import { accumulate } from "./accumulate";

describe("accumulate", () => {
  it("creates a single array", () => {
    let history: number[] = [];
    range(0, 5)
      .pipe(take(5), accumulate())
      .subscribe(value => (history = value));

    expect(history).toEqual([0, 1, 2, 3, 4]);
  });
});
