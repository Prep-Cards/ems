import { ReactNode, Fragment } from 'react';
import clsx from '../utils/clsx';
import { useFormState } from '../utils/hooks';
import Button from './Button';
import Modal, { useModalState } from './Modal';
import SVG from './SVG';

export default function Select<T extends { value: string; label: ReactNode } = { value: string; label: ReactNode }>({
    options,
    selected: selectedInit = [],
    onChange,
    placeholder,
    className,
}: {
    options: T[];
    selected: T[] | undefined;
    onChange: (selected: T[] | undefined) => void;
    placeholder?: string;
    className?: string;
}) {
    const { onClose, onOpen, show } = useModalState();

    const {
        value: { selected: selectedValue },
        ...form
    } = useFormState({ selected: selectedInit }, async ({ selected }) => onChange(selected));

    return (
        <>
            <Button className={clsx('select', className)} onClick={() => onOpen()}>
                <div className={clsx('selected', !selectedValue.length && placeholder && 'placeholder')}>
                    {selectedValue.map((s, key) => <span key={key}>{s.label}</span>) || placeholder}
                </div>
                <div className="arrow" />
            </Button>
            <Modal show={show} onClose={onClose} className="select-popup" size={null}>
                <Modal.Body column justify={null}>
                    <div className="top">
                        <Button
                            className={clsx('option all', selectedValue.length === options.length && 'checked')}
                            onClick={() => {
                                let next = selectedValue.length ? options : [];
                                if (selectedValue.length === options.length) next = [];
                                form.update({ selected: next });
                            }}
                        >
                            {selectedValue.length === options.length ? (
                                <>
                                    <SVG.SquareCheck /> Uncheck All
                                </>
                            ) : (
                                <>{selectedValue.length ? <SVG.SquareMinus /> : <SVG.Square />} Check All</>
                            )}
                        </Button>
                        <div className="selected">{selectedValue.length || 0} Selected</div>
                    </div>
                    <div className="options">
                        {options.map((option, key) => {
                            const checked = !!selectedValue.some((s) => s.value === option.value);
                            return (
                                <Button
                                    key={key}
                                    className={clsx('option', checked && 'checked')}
                                    variant={null}
                                    onClick={() => {
                                        let next = [...selectedValue];
                                        if (checked) next = next.filter(({ value }) => value !== option.value);
                                        else next.push(option);
                                        form.update({ selected: next });
                                    }}
                                >
                                    {checked ? <SVG.SquareCheck /> : <SVG.Square />}
                                    {option.label}
                                </Button>
                            );
                        })}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="text"
                        onClick={() => {
                            form.submit();
                            onClose();
                        }}
                    >
                        Apply
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
