import { ChangeEvent } from 'react';

function Checkboxes({
    options,
    name,
    onChange,
    values,
}: {
    values: Option[];
    options: Option[];
    name: string;
    onChange: (options: Option[], values?: Option['value'][]) => void;
}) {
    const handleChange = (option: Option) => (event: ChangeEvent<HTMLInputElement>) => {
        let next = [...values];

        const hasValue = !!values.find(({ value: v }) => option.value === v);

        if (!event.currentTarget.checked) {
            if (hasValue) next = next.filter(({ value: v }) => option.value !== v);
        } else {
            if (!hasValue) next.push(option);
        }

        onChange(
            next,
            next.map(({ value }) => value)
        );
    };

    return (
        <fieldset className="checkboxes">
            {options.map((option, index) => (
                <label key={index}>
                    <input
                        type="checkbox"
                        value={option.value}
                        name={name}
                        checked={!!values.find((v) => v.value === option.value)}
                        onChange={handleChange(option)}
                    />
                    {option.label}
                </label>
            ))}
        </fieldset>
    );
}

export default Checkboxes;
