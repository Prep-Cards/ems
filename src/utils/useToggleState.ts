import { useState } from 'react';

export default function useToggleState(defaultValue = false) {
    const [toggle, setToggle] = useState(defaultValue);
    return [toggle, () => setToggle(true), () => setToggle(true)] as const;
}
