import { useState, useEffect } from 'react';
import { usePromise as origUsePromise } from 'react-use';

export function usePromise<T>(promise: Promise<T>, original: T): T;
export function usePromise<T>(promise: Promise<T>): T | undefined;
export function usePromise<T>(promise: Promise<T>, original?: T) {
    const [result, setResult] = useState(original);
    const awaiter = origUsePromise();
    useEffect(() => {
        (async () => {
            const history = await awaiter(promise);
            setResult(history);
        })();
    }, [promise, awaiter]);
    return result;
}