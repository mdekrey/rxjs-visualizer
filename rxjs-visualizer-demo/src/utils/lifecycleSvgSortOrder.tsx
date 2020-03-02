import { LifecycleEntry, WithTime, isLifecycleDatumEntry } from "rxjs-visualizer";
export function lifecycleSvgSortOrder<T>({ original }: WithTime<LifecycleEntry<T>>, _2: any) {
    return isLifecycleDatumEntry(original) ? 1 : 0;
}
