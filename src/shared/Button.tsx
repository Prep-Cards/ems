import { ComponentProps } from 'react';
import clsx from '../utils/clsx';

type Props = ComponentProps<'button'> & {
    variant?: 'standard' | 'text' | 'outline' | 'text-dark' | null;
};

export default function Button({ children, className, variant = null, type = 'button', ...props }: Props) {
    return (
        <button {...props} type={type} className={clsx(className, variant)}>
            {children}
        </button>
    );
}
