import { EffectCallback, useEffect, useMemo, useState } from 'react';
import isEqualish from './isEqualish';

export function useMountEffect(effect: EffectCallback) {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(effect, []);
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
