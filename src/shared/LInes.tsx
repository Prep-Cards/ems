import { Fragment } from 'react';

export default function Lines({ value }: { value: string }) {
    return (
        <>
            {value.split('\n').map((line, index) => (
                <Fragment key={index}>
                    {line}
                    <br />
                </Fragment>
            ))}
        </>
    );
}
