import React from 'react';
import { LifecycleEntry } from 'rxjs-visualizer';
import { DrawObservableProps, DrawObservable } from './DrawObservable';
import { BasicTheme } from './BasicTheme';
import { BasicThemeConfig } from './BasicThemeConfig';

export type BasicDrawObservableProps<T extends LifecycleEntry<any>> =
    Omit<DrawObservableProps<T, BasicThemeConfig>, keyof typeof BasicTheme>
    & Partial<Pick<DrawObservableProps<T, BasicThemeConfig>, keyof typeof BasicTheme>>;

export function BasicDrawObservable<T extends LifecycleEntry<any>>(props: BasicDrawObservableProps<T>) {
    return (
        <g style={{ transform: "translate(0px, 1.3125rem)" }}>
            <DrawObservable<T, BasicThemeConfig> {...BasicTheme} {...props} />
        </g>
    );
}
