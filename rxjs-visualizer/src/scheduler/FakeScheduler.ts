import { SchedulerLike, SchedulerAction, Subscription } from "rxjs";
import { QueueAction } from "./QueueAction";
export class FakeScheduler implements SchedulerLike {
    private currentTime = 0;
    private readonly queued: QueueAction<any>[] = [];
    constructor() {
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
            // unsubscribing functionality
            let index: number;
            do {
                index = this.queued.findIndex(e => e.context === context);
                if (index !== -1) {
                    this.queued.splice(index, 1);
                }
            } while (index !== -1);
        });
        return context.schedule(state, delay);
    }

    private reschedule<T>(context: QueueAction<T>["context"], delay: number = 0, state?: T) {
        const queueAction: QueueAction<T> = { time: this.currentTime + delay, state, context };
        this.queued.push(queueAction);
        return context;
    }

    execute(maxEnqueued = 500) {
        let executionCount = 0;
        while (executionCount < maxEnqueued && this.queued.length) {
            this.queued.sort((a, b) => a.time - b.time);
            const next = this.queued.shift()!;
            this.currentTime = next.time;
            next.context.work(next.state);
            executionCount++;
        }
        return executionCount;
    }

    advanceTime(maxAmountOfTime: number, maxEnqueued?: number) {
        const finalTime = maxAmountOfTime + this.currentTime;
        let executionCount = 0;
        while (this.currentTime <= finalTime && this.queued.length) {
            this.queued.sort((a, b) => a.time - b.time);
            const next = this.queued.shift()!;
            if (next.time > finalTime) {
                this.queued.unshift(next);
                break;
            }
            this.currentTime = next.time;
            next.context.work(next.state);
            executionCount++;
            if (maxEnqueued !== undefined && executionCount >= maxEnqueued) {
                return executionCount;
            }
        }
        this.currentTime = finalTime;
        return executionCount;
    }

    scheduledCount() {
        return this.queued.length;
    }
}
