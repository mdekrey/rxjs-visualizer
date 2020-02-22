import { SchedulerLike } from "rxjs";
import { FakeScheduler } from "./FakeScheduler";

export function withScheduler(func: (scheduler: SchedulerLike) => void, maxEnqueued = 500) {
    const scheduler = new FakeScheduler(maxEnqueued);
    func(scheduler);
    scheduler.execute();
}
