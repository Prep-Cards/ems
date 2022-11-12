import { ChangeEvent, ReactNode, useMemo } from 'react';

function Checkboxes<TOption extends Option>({
    options,
    name,
    onChange,
    values,
}: {
    values: TOption[];
    options: TOption[];
    name: string;
    onChange: (options: TOption[], values?: TOption['value'][]) => void;
}) {
    const handleChange = (TOption: TOption) => (event: ChangeEvent<HTMLInputElement>) => {
        let next = [...values];

        const hasValue = !!values.find(({ value: v }) => TOption.value === v);

        if (!event.currentTarget.checked) {
            if (hasValue) next = next.filter(({ value: v }) => TOption.value !== v);
        } else {
            if (!hasValue) next.push(TOption);
        }

        onChange(
            next,
            next.map(({ value }) => value)
        );
    };

    return (
        <fieldset className="checkboxes">
            {options.map((TOption, index) => (
                <label key={index}>
                    <input
                        type="checkbox"
                        value={TOption.value}
                        name={name}
                        checked={!!values.find((v) => v.value === TOption.value)}
                        onChange={handleChange(TOption)}
                    />
                    {TOption.label}
                </label>
            ))}
        </fieldset>
    );
}

export default Checkboxes;

export function Checkbox<TOption extends Option>({
    label,
    name,
    onChange,
    isChecked,
}: {
    label: ReactNode;
    name: string;
    onChange: (isChecked: boolean) => void;
    isChecked: boolean;
}) {
    const { option, values } = useMemo((): { option: TOption; values: TOption[] } => {
        const option = { value: name, label } as TOption;
        return {
            option,
            values: isChecked ? [option] : [],
        };
    }, [name, label, isChecked]);

    const onChangeMultiple = (options: TOption[], values?: TOption['value'][] | undefined) => {
        onChange(values?.[0] === option.value);
    };

    return <Checkboxes options={[option]} name={name} values={values} onChange={onChangeMultiple} />;
}
