import { SchedulerLike, SchedulerAction, Subscription } from "rxjs";
import { QueueAction } from "./QueueAction";
export class FakeScheduler implements SchedulerLike {
    private currentTime = 0;
    private enqueuedCount = 0;
    private readonly queued: QueueAction<any>[] = [];
    constructor(private maxEnqueued = 500) {
    }
    readonly now = () => this.currentTime;
    schedule<T>(work: (this: SchedulerAction<T>, state?: T) => void, delay: number = 0, state?: T) {
        if (delay < 0) {
            throw new Error("Invalid schedule - delay cannot be negative, was: " + delay);
        }
        const subscription = new Subscription();
        const context = subscription as QueueAction<T>["context"];
        context.schedule = (state, delay) => this.schedule(work, delay, state);
        context.work = work;
        const queueAction: QueueAction<T> = { time: this.currentTime + delay, state, context };
        subscription.add(() => this.queued.splice(this.queued.indexOf(queueAction), 1));
        this.queued.push(queueAction);
        this.enqueuedCount++;
        return subscription;
    }
    ;
    execute() {
        while (this.enqueuedCount < this.maxEnqueued && this.queued.length) {
            this.queued.sort((a, b) => a.time - b.time);
            const next = this.queued.shift()!;
            this.currentTime = next.time;
            next.context.work(next.state);
        }
    }
}
