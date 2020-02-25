import { SchedulerLike, SchedulerAction, Subscription } from "rxjs";
import { QueueAction } from "./QueueAction";
export class FakeScheduler implements SchedulerLike {
    private currentTime = 0;
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
        context.schedule = (state, delay) => {
            if (!subscription.closed) {
                return this.reschedule(context, delay, state);
            }
            return subscription;
        }
        context.work = work;
        context.add(() => {
            let index: number;
            do {
                index = this.queued.findIndex(e => e.context === context);
                this.queued.splice(index, 1);
            } while (index !== -1);
        });
        return context.schedule(state, delay);
    }

    private reschedule<T>(context: QueueAction<T>["context"], delay: number = 0, state?: T) {
        const queueAction: QueueAction<T> = { time: this.currentTime + delay, state, context };
        this.queued.push(queueAction);
        return context;
    }

    execute() {
        let executionCount = 0;
        while (executionCount < this.maxEnqueued && this.queued.length) {
            this.queued.sort((a, b) => a.time - b.time);
            const next = this.queued.shift()!;
            this.currentTime = next.time;
            next.context.work(next.state);
            executionCount++;
        }
    }
}
