import { useLayoutEffect, EffectCallback, useState, useRef, useEffect, DependencyList, useMemo } from 'react';
import isEqualish from './isEqualish';
import setPartial from './setPartial';

export function useMountLayoutEffect(effect: EffectCallback) {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useLayoutEffect(effect, []);
}

export function useMountAsync(effect: () => Promise<void>) {
    useEffect(() => {
        effect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
}

export function useMountEffect(effect: EffectCallback) {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(effect, []);
}

export function useCallbackRef<TRef = unknown>(): [TRef | null, (ref: TRef | null) => void] {
    return useState<TRef | null>(null);
}

export function useMountedRef<TRef = HTMLElement | null>(
    onMount: (node: TRef) => () => void
): {
    setRef: (node: TRef) => void;
} {
    const [ref, setRef] = useState<TRef | null>(null);

    const onMountRan = useRef(false);

    useEffect(() => {
        if (onMountRan.current) return;

        if (ref) {
            onMountRan.current = true;
            return onMount(ref);
        }
    }, [onMount, ref]);

    return {
        setRef,
    };
}

export function useDebounce<T>(initialValue: T, delay: number) {
    const [value, setValue] = useState(initialValue);
    useEffect(() => {
        const handler = setTimeout(() => setValue(initialValue), delay);
        return () => clearTimeout(handler);
    }, [initialValue, delay]);
    return value;
}

export function useDebounceState<T>(initialValue: T, delay: number) {
    const [value, setValue] = useState(initialValue);
    const debouncedValue = useDebounce(value, delay);
    return [debouncedValue, setValue, value] as const;
}

export function useStatePartial<T extends Object>(defaultValue: T) {
    const [state, setState] = useState(defaultValue);
    return [state, setPartial(setState)] as const;
}

export function useFormState<TState extends Record<string, any>>(
    defaultValue: TState,
    onSubmit: (value: TState) => Promise<any>
) {
    const [value, setValue] = useState(defaultValue);
    const [saving, setSaving] = useState(false);

    return useMemo(
        () => ({
            dirty: !isEqualish(value, defaultValue),
            saving,
            reset: () => {
                setValue(defaultValue);
            },
            update: (next: Partial<TState>) => {
                setValue((prev: TState) => ({ ...prev, ...next }));
            },
            value,
            submit: async () => {
                setSaving(true);
                await onSubmit(value);
                setSaving(false);
            },
        }),
        [defaultValue, onSubmit, saving, value]
    );
}

export function useMemoAsync<T>(factory: () => Promise<T> | null, deps: DependencyList | undefined, initialState: T) {
    const [getValue, setValue] = useState<T>(initialState);

    useEffect(() => {
        let cancel = false;

        const promise = factory();

        if (!promise || cancel) return;

        promise.then((val) => {
            if (!cancel) setValue(val);
        });

        return () => {
            cancel = true;
        };
    }, [factory]);

    return getValue;
}
