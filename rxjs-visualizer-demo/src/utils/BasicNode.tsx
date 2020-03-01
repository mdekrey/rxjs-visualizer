import React from 'react';
export function BasicNode({ datum: d }: {
    datum: number;
}) {
    return (<>
        <circle className="DrawObservable" />
        <text className="DrawObservable" textAnchor="middle" y="0.32rem">{d}</text>
    </>);
}
