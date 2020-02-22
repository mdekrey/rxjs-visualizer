import { SchedulerAction } from "rxjs";
export interface QueueAction<T> {
    time: number;
    state?: T;
    context: SchedulerAction<T> & {
        work: (this: SchedulerAction<T>, state?: T) => void;
    };
}
