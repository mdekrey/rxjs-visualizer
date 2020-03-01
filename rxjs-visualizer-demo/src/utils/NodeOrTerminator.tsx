import React, { ElementType, ReactElement } from 'react';
import { DrawObservableElementProps } from './DrawObservable';
import { LifecycleEntry, isLifecycleCompleteEntry, isLifecycleErrorEntry, isLifecycleContinuesEntry, isLifecycleDatumEntry } from 'rxjs-visualizer';

export type LifetimeTheme<TTheme> =
    {
        completeTerminator: ElementType<{ theme: LifetimeTheme<TTheme> }>;
        errorTerminator: ElementType<{ theme: LifetimeTheme<TTheme> }>;
        continuationTerminator: ElementType<{ theme: LifetimeTheme<TTheme> }>;
    } & TTheme;

export function NodeOrTerminator<TDatum, TTheme extends LifetimeTheme<any>>(
    BaseElement: ElementType<DrawObservableElementProps<any, TTheme, TDatum>>
): (props: DrawObservableElementProps<LifecycleEntry<TDatum>, TTheme, TDatum>) => ReactElement | null {
    return (props) => {
        return (
            isLifecycleCompleteEntry(props.entry) ? <props.theme.completeTerminator theme={props.theme} />
                : isLifecycleErrorEntry(props.entry) ? <props.theme.errorTerminator theme={props.theme} />
                : isLifecycleContinuesEntry(props.entry) ? <props.theme.continuationTerminator theme={props.theme} />
                : isLifecycleDatumEntry(props.entry) ? <BaseElement {...props} datum={props.datum} />
                : null
        );
    }
}