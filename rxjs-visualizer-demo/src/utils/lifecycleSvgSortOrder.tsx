import { LifecycleEntry, WithTime, isLifecycleDatumEntry } from "rxjs-visualizer";
import { LifetimePlaceholder } from "./NodeOrTerminator";
export function lifecycleSvgSortOrder<T>({ original }: WithTime<LifecycleEntry<T> | LifetimePlaceholder>, _2: any) {
    return original !== LifetimePlaceholder && isLifecycleDatumEntry(original) ? 1 : 0;
}
