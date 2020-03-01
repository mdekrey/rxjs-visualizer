import React, { ElementType } from 'react';
import { DrawObservableElementProps } from './DrawObservable';
import { LifecycleEntry, isLifecycleCompleteEntry, isLifecycleErrorEntry, isLifecycleContinuesEntry, isLifecycleDatumEntry } from 'rxjs-visualizer';

export type LifetimeTheme<TTheme> =
    {
        completeTerminator: ElementType<{ theme: LifetimeTheme<TTheme> }>;
        errorTerminator: ElementType<{ theme: LifetimeTheme<TTheme> }>;
        continuationTerminator: ElementType<{ theme: LifetimeTheme<TTheme> }>;
    } & TTheme;

export function NodeOrTerminator<TDatum, TTheme extends LifetimeTheme<any>>(
    BaseElement: ElementType<DrawObservableElementProps<TDatum, TTheme>>
): ElementType<DrawObservableElementProps<LifecycleEntry<TDatum>, TTheme>> {
    return (props) => {
        return (
            isLifecycleCompleteEntry(props.datum) ? <props.theme.completeTerminator theme={props.theme} />
                : isLifecycleErrorEntry(props.datum) ? <props.theme.errorTerminator theme={props.theme} />
                : isLifecycleContinuesEntry(props.datum) ? <props.theme.continuationTerminator theme={props.theme} />
                : isLifecycleDatumEntry(props.datum) ? <BaseElement {...props} datum={props.datum.datum} />
                : null
        );
    }
}
