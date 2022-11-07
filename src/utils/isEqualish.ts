import isDeepEqual from 'deep-equal';

export default function isEqualish<T = any | undefined>(a: T, b: T): boolean {
    if (!!a !== !!b) return false;
    if (!a) return true;
    if (!b) return true;

    if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) return false;

        return a.every((aValue) =>
            b.some((bValue) => isDeepEqual(aValue, bValue))
        );
    }

    if (typeof b === 'object' && typeof a === 'object') {
        return Object.entries(a).every(([key, aValue]) => {
            if (key in b) {
                // @ts-ignore
                const bValue = b[key];
                return isEqualish(aValue, bValue);
            }
            return false;
        });
    }

    return isDeepEqual(a, b, { strict: false });
}
