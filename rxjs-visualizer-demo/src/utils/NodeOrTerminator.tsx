import React, { ElementType } from 'react';
import { DrawElementProps } from './DrawHistory';
import { LifecycleEntry, isLifecycleCompleteEntry, isLifecycleErrorEntry, isLifecycleContinuesEntry, isLifecycleDatumEntry } from 'rxjs-visualizer';

export const LifetimePlaceholder = Symbol();
export type LifetimePlaceholder = typeof LifetimePlaceholder;

export type LifetimeTheme<TTheme> =
    {
        completeTerminator: ElementType<{ theme: LifetimeTheme<TTheme> }>;
        errorTerminator: ElementType<{ theme: LifetimeTheme<TTheme> }>;
        continuationTerminator: ElementType<{ theme: LifetimeTheme<TTheme> }>;
    } & TTheme;

export function NodeOrTerminator<TDatum, TTheme extends LifetimeTheme<any>>(
    BaseElement: ElementType<DrawElementProps<TDatum, TTheme>>
): ElementType<DrawElementProps<LifecycleEntry<TDatum> | LifetimePlaceholder, TTheme>> {
    return (props) => {
        return (
            props.datum === LifetimePlaceholder ? null
                : isLifecycleCompleteEntry(props.datum) ? <props.theme.completeTerminator theme={props.theme} />
                : isLifecycleErrorEntry(props.datum) ? <props.theme.errorTerminator theme={props.theme} />
                : isLifecycleContinuesEntry(props.datum) ? <props.theme.continuationTerminator theme={props.theme} />
                : isLifecycleDatumEntry(props.datum) ? <BaseElement {...props} datum={props.datum.datum} />
                : null
        );
    }
}
