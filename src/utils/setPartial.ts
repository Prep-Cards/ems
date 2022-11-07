import { Dispatch, SetStateAction } from 'react';

export default function setPartial<TState = {}>(
    setCallback: Dispatch<SetStateAction<TState>>
): (nextState: Partial<TState>) => void {
    return (nextState: Partial<TState>) =>
        setCallback(
            (prevState: TState) => ({ ...prevState, ...nextState } as TState)
        );
}
